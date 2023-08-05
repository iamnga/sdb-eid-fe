import { Component, OnInit } from '@angular/core';
import { AuthType, CustomerType, Service, ServiceStep } from 'src/app/models/enum';
import { MatDialog } from '@angular/material/dialog';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { Alert } from 'src/app/models/alert';
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
  currentCustomerType = '';

  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    this.aioSvc.isProcessing = true;
    aioSvc.currentStep = ServiceStep.CheckCustomerInfo;
  }

  ngOnInit(): void {
    this.checkCustomer();
  }

  setPhoneNumber(phoneNumber: string) {

    this.isInputPhoneNumber = false;

    if (this.currentCustomerType == 'C3' || this.currentCustomerType == 'C4') {
      this.aioSvc.customerInfo.mobileNo = phoneNumber;
      this.aioSvc.currentAuthType = AuthType.SMSOTP;
      this.aioSvc.next();
    }
    // C1 checkCustomerWithCustomerIdOld
    else if (this.currentCustomerType == 'C1') {
      if (this.aioSvc.customerInfo.mobileNo != phoneNumber) {
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
        console.log(res);
        if (res.data && res.respCode == "00") {

          let resData = new CheckCustomerSDBResponsetData();
          resData = res.data;
          this.currentCustomerType = resData.resultCode;

          switch (this.currentCustomerType) {
            case CustomerType.KHMoi:
            case CustomerType.KHVangLai:
              {
                // Hiển thị màn hình nhập SĐT
                this.isInputPhoneNumber = true;
                this.aioSvc.isProcessing = false;
                break;
              }
            case CustomerType.KHHienHuu:
              {
                // check issueDate CCCD
                if (resData.customerInfo.issueDate === Utils.formatDate(this.aioSvc.customerInfo.issueDate)) {
                  this.aioSvc.customerInfo.mobileNo = resData.customerInfo.mobileNo;
                  // check KH có thỏa điều kiện mở TKTT hay không
                  this.aioSvc.createAccountVerify(resData.customerInfo.cifNo).subscribe((res) => {
                    if (res) {

                      //Thỏa điều kiện mở tài khoản thanh toán
                      if (res.respCode == "00") {

                        // Lấy PTXT của khách hàng
                        let getAuthData = new GetAuthMethodRequestData();
                        getAuthData.cifNo = resData.customerInfo.cifNo;
                        getAuthData.mobileNo = resData.customerInfo.mobileNo;
                        getAuthData.customerID = this.aioSvc.customerInfo.customerID;
                        getAuthData.customerType = this.aioSvc.customerInfo.customerType;

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
                  this.aioSvc.alertWithGoHome('Ngày cấp trên CCCD ko trùng khớp với thông tin lưu trữ ở Sacombank')
                }
                break;
              }
            case CustomerType.KHChuaXacDinhDoTrungHoTenNTNS:
              {

                // KH không có CMND thì reject
                if (!this.aioSvc.customerInfo.customerIDOld) {
                  this.aioSvc.alertWithGoHome('Số CCCD ko trùng khớp với thông tin lưu trữ ở Sacombank')
                }
                // Có CMND thì kiểm tra tiếp
                else {
                  req.customerID = this.aioSvc.customerInfo.customerIDOld;
                  console.log(req);
                  this.checkCustomerWithCustomerIdOld(req);
                }

                break;
              }
            case CustomerType.KHHienHuuAMLKhongHopLe:
              {
                this.aioSvc.alertWithGoHome('Quý khách thuộc AML')
                break;
              }
            default: // Các trường hợp khác
              {
                this.aioSvc.alertWithGoHome(`Không thỏa điều kiện mở tài khoản thanh toán, vui lòng đến quầy giao dịch`);
                break;
              }
          }
        }
        else {
          this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        }
      },
      (err) => {
        this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        console.log(err);
      }
    );
  }


  checkCustomerWithCustomerIdOld(req: CheckCustomerSDBRequestData) {
    this.aioSvc.checkCustomerSDB(req).subscribe(
      (res: any) => {

        this.aioSvc.isProcessing = false;
        if (res.data && res.respCode == "00") {

          let resData = new CheckCustomerSDBResponsetData();
          resData = res.data;
          this.currentCustomerType = resData.resultCode;
          console.log(res);

          switch (this.currentCustomerType) {
            case CustomerType.KHHienHuu:
              {
                // KH hiện hữu chuẩn thì báo cập nhật CCCD
                this.aioSvc.alertWithGoHome('Quý khách vui lòng cập nhật thông tin từ CMND sang CCCD');
                break;
              }
            case CustomerType.KHChuaXacDinhDoTrungHoTenNTNS:
              {
                // KH không trùng CMND nhưng trùng họ tên + NTNS, nhập SĐT để kiểm tra tiếp
                this.aioSvc.customerInfo.mobileNo = resData.customerInfo.mobileNo;
                this.isInputPhoneNumber = true;
                break;
              }
            case CustomerType.KHHienHuuAMLKhongHopLe:
              {
                this.aioSvc.alertWithGoHome('Quý khách thuộc AML')
                break;
              }
            default: // Các trường hợp khác
              {
                this.aioSvc.alertWithGoHome(`Không thỏa điều kiện mở tài khoản thanh toán, vui lòng đến quầy giao dịch`);
                break;
              }
          }

        }
        else {
          this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        }
      },
      (err) => {
        this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
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
              this.aioSvc.isProcessing = false;

              this.authenInfo = res.data.authInfo;


              if (this.authenInfo.length == 1) {
                // KH không có PTXT
                if (this.authenInfo[0].authType == AuthType.Unknow) {
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
                // Có một PTXT: SMSOTP, SMSTTT, ....
                else {
                  this.aioSvc.currentAuthType = this.authenInfo[0].authType;
                }
              }
              // mSign - SmartOTP
              else {
                this.aioSvc.authenInfo = this.authenInfo;
              }
              this.aioSvc.next();
            } else {
              this.aioSvc.alertWithGoHome(`Không lấy được danh sách PTXT`);
            }
          }
        } else {
          this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
        }
      },
      (err: any) => {
        this.aioSvc.alertWithGoHome(`Dịch vụ không thể thực hiện lúc này`);
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
