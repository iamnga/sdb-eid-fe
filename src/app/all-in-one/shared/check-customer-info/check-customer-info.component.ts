import { Component, OnInit } from '@angular/core';
import { AuthType, Service, ServiceStep } from 'src/app/models/enum';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { Alert, Template } from 'src/app/models/alert';
import { AlertComponent } from '../dialog/alert/alert.component';
import { AuthenInfo, GetAuthMethodRequestData } from 'src/app/models/aio';

@Component({
  selector: 'app-check-customer-info',
  templateUrl: './check-customer-info.component.html',
  styleUrls: ['./check-customer-info.component.css'],
})
export class CheckCustomerInfoComponent implements OnInit {
  authenInfo: AuthenInfo[] = [];

  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    this.aioSvc.isProcessing = true;
    aioSvc.currentStep = ServiceStep.CheckCustomerInfo;
  }

  ngOnInit(): void {
    console.log('verify: ', this.aioSvc.customerInfo);
    //TODO: remove hard data
    this.aioSvc.currentAuthType = AuthType.SMSOTP;
    this.aioSvc.isProcessing = false;
    this.aioSvc.next();
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

  //New API
  checkCustomerByIdNo(customerId: string) {
    console.log(this.aioSvc.customerInfo);
    this.aioSvc.checkCustomerByIdNo(customerId).subscribe(
      (res: any) => {
        this.aioSvc.isProcessing = false;

        // if (res.respCode == '14') {
        //   this.face = this.aioSvc.faceCaptured;
        // } else if (res.respCode == '00') {
        //   this.aioSvc.alert(
        //     `Quý khách đã có tài khoản tại Sacombank <br> Xin cảm ơn Quý khách đã quan tâm dịch vụ`
        //   );
        // } else {
        //   this.aioSvc.alert(`Có lỗi xảy ra checkCustomerByIdNo`);
        // }
        // console.log(res);

        if (res.resultCode === 'C3' || res.resultCode === 'C4') {
          // C3: KH mới
          // C4: KH vãng lai
          // Không có PTXT => AuthType = SMSOTP - theo luồng STM
          this.aioSvc.next();
        }
        if (res.resultCode === 'C0') {
          // C0: KH hiện hữu chuẩn
          // => check issue date CCCD
          // => check get list account
          // => check authMethod => 3 case: Không có PTXT - không có SĐT thì end; có PTXT thì lưu lại AuthType = PTXT hiện hữu; không có PTXT nhưng có số ĐT từ T24 (AuthType = SMSOTP)
        }
        if (res.resultCode === 'C1') {
          // C1: KH không trùng CCCD nhưng trùng họ tên + NTNS
          // => check khớp thông tin CMND có trùng ko
          // Nếu trùng thì cho qua cập nhật CCCD, ngược lại out

          // Xử lý luồng cập nhật CCCD

          this.alert();
        }
        //TH khách hàng đã có TKTT
        if (res.resultCode == 'HasAccount') {
          this.aioSvc.alert(
            `Quý khách đã có tài khoản tại Sacombank <br> Xin cảm ơn Quý khách đã quan tâm dịch vụ`
          );
        }
      },
      (err) => {
        this.aioSvc.alert(`Có lỗi xảy ra checkCustomerByIdNo`);
        this.aioSvc.isProcessing = false;

        console.log(err);
      }
    );
  }


  getAuthMethod() {
    let data = new GetAuthMethodRequestData();
    data.cifNo = this.aioSvc.checkCustomerByIdNoResponseData.cifNo;
    data.customerID = this.aioSvc.checkCustomerByIdNoResponseData.legalId;
    data.customerType = '1';
    data.mobileNo = this.aioSvc.checkCustomerByIdNoResponseData.mobileNumber;
    this.aioSvc.getAuthMethod(data).subscribe(
      (res: any) => {
        console.log(res);
        this.aioSvc.isProcessing = false;

        if (res.respCode) {
          if (res.respCode != '00') {
            this.aioSvc.alert(`Lỗi hệ thống`);
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
              this.aioSvc.alert(`Không tồn tại phương thức xác thực`);
              // Check nếu không có SĐT từ api check-customer trả về => reject
              // Nếu có SĐT => hiện alert lên "Sẽ gửi mã xác thực về sđt xxx"
              this.aioSvc.next();
            }
          }
        } else {
          this.aioSvc.alert(`Lỗi hệ thống`);
        }
      },
      (err: any) => {
        this.aioSvc.alert(`Lỗi hệ thống`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  alert() {
    let data = new Alert();

    data.template = Template.UpdateCardId;
    data.title = 'Thông báo';

    const dialogRef = this.dialog.open(AlertComponent, {
      data: data,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: Alert) => {
      if (result) {
        if (result.action == 'back') {
          this.aioSvc.release();
        } else {
          this.aioSvc.currentSerice = Service.UpdateCardId;
          this.aioSvc.getSessionId().subscribe(
            (result: any) => {
              if (result) {
                console.log(result);
                if (result.respCode != '00') {
                  this.aioSvc.isProcessing = false;
                  this.aioSvc.alert(`Có lỗi xảy ra: ${result.respDescription}`);
                } else {
                  this.aioSvc.isProcessing = false;
                  this.aioSvc.sessionID = result.data.sessionId;
                  if (!environment.production) {
                    this.aioSvc.next();
                  } else {
                    this.aioSvc.next();
                  }
                }
              } else {
                this.aioSvc.alert(`Có lỗi xảy ra: ${result.respDescription}`);
                this.aioSvc.isProcessing = false;
              }
            },
            (err: any) => {
              this.aioSvc.isProcessing = false;
              this.aioSvc.alert(`Có lỗi xảy ra`);
            }
          );
        }
      } else {
        this.aioSvc.release();
      }
      console.log(result);
    });
  }




  confirm() {
    this.aioSvc.next();
  }
}
