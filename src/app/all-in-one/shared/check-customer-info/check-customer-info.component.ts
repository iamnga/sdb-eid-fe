import { Component, OnInit } from '@angular/core';
import { AuthType, Service, ServiceStep } from 'src/app/models/enum';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { Alert, Template } from 'src/app/models/alert';
import { AlertComponent } from '../dialog/alert/alert.component';
import { AuthenInfo, CheckCustomerSDBRequestData, CheckCustomerSDBResponsetData, GetAuthMethodRequestData } from 'src/app/models/aio';
import Utils from '../utils/utils';

@Component({
  selector: 'app-check-customer-info',
  templateUrl: './check-customer-info.component.html',
  styleUrls: ['./check-customer-info.component.css'],
})
export class CheckCustomerInfoComponent implements OnInit {
  authenInfo: AuthenInfo[] = [];
  isInputPhoneNumber = false;
  phoneNumberFromT24 = '';
  currentC = '';

  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    this.aioSvc.isProcessing = true;
    aioSvc.currentStep = ServiceStep.CheckCustomerInfo;
  }

  ngOnInit(): void {
    this.checkCustomer();
  }

  setPhoneNumber(phoneNumber: string) {
    this.isInputPhoneNumber = false;

    if (this.currentC == 'C3' || this.currentC == 'C4') {
      this.aioSvc.customerInfo.mobileNo = phoneNumber;
      this.aioSvc.currentAuthType = AuthType.SMSOTP;
      this.aioSvc.next();
    }
    // C1 check customerIdOld
    else if (this.currentC == 'C1') {
      if (this.phoneNumberFromT24 != phoneNumber) {
        this.aioSvc.customerInfo.mobileNo = phoneNumber;
        this.aioSvc.currentAuthType = AuthType.SMSOTP;
        this.aioSvc.next();
      }
      // Trùng SĐT, họ tên, NTNS. Không trùng CMND
      else {
        this.aioSvc.alertWithGoHome("Số CCCD ko trùng khớp với thông tin lưu trữ ở Sacombank")
      }
    }
  }

  randomId(length: number) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  checkCustomer() {

    console.log(this.aioSvc.customerInfo);

    let req = new CheckCustomerSDBRequestData();
    req.customerID = this.aioSvc.customerInfo.customerID;
    req.fullName = this.aioSvc.customerInfo.fullName;
    req.dob = Utils.formatDate(
      this.aioSvc.customerInfo.dob
    );
    req.residentAddress = this.aioSvc.customerInfo.address;
    req.serviceType = this.aioSvc.currentSerice == Service.OnBoarding ? 'OA' : 'CI';

    this.aioSvc.checkCustomerSDB(req).subscribe(
      (res: any) => {
        if (res.data && res.respCode == "00") {
          let resData = new CheckCustomerSDBResponsetData();
          resData = res.data;
          this.currentC = resData.resultCode;
          console.log(res);

          if (resData.resultCode === 'C3' || resData.resultCode === 'C4') {
            // Hiển thị màn hình nhập SĐT
            this.isInputPhoneNumber = true;
          }
          // C0: KH hiện hữu chuẩn
          if (resData.resultCode === 'C0') {

            // check issueDate CCCD
            if (resData.customerInfo.issueDate === Utils.formatDate(this.aioSvc.customerInfo.issueDate)) {
              // check KH có thỏa điều kiện mở TKTT hay không
              this.aioSvc.createAccountVerify(resData.customerInfo.cifNo).subscribe((res) => {
                if (res) {
                  //Thỏa điều kiện mở tài khoản thanh toán
                  if (res.respCode == "00") {
                    // Lấy PTXT của khách hàng
                    let getAuthData = new GetAuthMethodRequestData();
                    getAuthData.cifNo = resData.customerInfo.cifNo;
                    getAuthData.mobileNo = resData.customerInfo.mobileNo;
                    this.getAuthMethod(getAuthData);
                  }
                  else {
                    this.aioSvc.alertWithGoHome(`Không thỏa điều kiện mở tài khoản thanh toán`);
                  }
                }
                else {
                  this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
                }
                console.log(res);
              }, (err) => { })
            }
            else {
              this.aioSvc.isProcessing = false;
              this.aioSvc.alertWithGoHome('Ngày cấp trên CCCD ko trùng khớp với thông tin lưu trữ ở Sacombank')
            }

          }
          // C1: KH không trùng CCCD nhưng trùng họ tên + NTNS
          if (res.resultCode === 'C1') {

            // KH không có CMND thì reject
            if (!this.aioSvc.customerInfo.customerIDOld) {
              this.aioSvc.alertWithGoHome('Số CCCD ko trùng khớp với thông tin lưu trữ ở Sacombank')
            }
            // Có CMND thì kiểm tra tiếp
            else {
              req.customerID = this.aioSvc.customerInfo.customerIDOld;
              this.checkCustomerWithCustomerIdOld(req);
            }
          }
        }
        else {
          this.aioSvc.isProcessing = false;
          this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        console.log(err);
      }
    );
  }

  checkCustomerWithCustomerIdOld(req: CheckCustomerSDBRequestData) {
    this.aioSvc.checkCustomerSDB(req).subscribe(
      (res: any) => {

        if (res.data && res.respCode == "00") {

          let resData = new CheckCustomerSDBResponsetData();
          resData = res.data;
          this.currentC = resData.resultCode;
          console.log(res);

          // C0: KH hiện hữu chuẩn thì báo cập nhật CCCD
          if (resData.resultCode === 'C0') {

            this.aioSvc.alertWithGoHome('Quý khách vui lòng cập nhật thông tin từ CMND sang CCCD');
          }
          // C1: KH không trùng CMND nhưng trùng họ tên + NTNS
          if (res.resultCode === 'C1') {
            this.isInputPhoneNumber = true;
          }
        }
        else {
          this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra checkCustomerByIdNo`);
        this.aioSvc.isProcessing = false;

        console.log(err);
      }
    );
  }


  getAuthMethod(data: GetAuthMethodRequestData) {
    this.aioSvc.getAuthMethod(data).subscribe(
      (res: any) => {
        console.log(res);

        if (res.respCode) {
          if (res.respCode != '00') {
            this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
          } else {
            if (res.data.authInfo) {
              this.authenInfo = res.data.authInfo;
              // Có một PTXT
              if (this.authenInfo.length == 1) {
                this.aioSvc.currentAuthType = this.authenInfo[0].authType;
              }
              // mSign - SmartOTP
              else {
                this.aioSvc.authenInfo = this.authenInfo;
              }
              this.aioSvc.next();
            } else {
              if (!data.mobileNo) {
                this.aioSvc.alertWithGoHome(`Quý khách không có PTXT và không có số điện thoại T24`);
              }
              else {
                this.aioSvc.alertWithAction(
                  `Để hoàn tất mở tài khoản, Sacombank sẽ gửi mã xác thực đến số điện thoại của Quý khách 
                  đã đăng ký tại Sacombank là ${this.maskingPhoneNumber(data.mobileNo)}`
                  , ''
                  , 'Hủy'
                  , 'Tiếp tục'
                  , 15).subscribe((res: Alert) => {
                    if (res) {
                      if (res.action === "pri") {
                        this.aioSvc.customerInfo.mobileNo = data.mobileNo;
                        this.aioSvc.currentAuthType = AuthType.SMSOTP;
                        this.aioSvc.next();
                      }
                      else {
                        this.aioSvc.release();
                      }
                    }
                    else {
                      this.aioSvc.release();
                    }
                  });
              }
            }
          }
        } else {
          this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        }
      },
      (err: any) => {
        this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  maskingPhoneNumber(phoneNumber: string) {
    const prefix = phoneNumber.slice(0, 4);
    const suffix = phoneNumber.slice(-2);
    const maskedMiddle = 'x'.repeat(phoneNumber.length - 6);

    return `${prefix}${maskedMiddle}${suffix}`;
  }
}
