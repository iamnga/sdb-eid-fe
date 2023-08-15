import { Component, OnInit } from '@angular/core';
import { AccountType, AlertType, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../shared/dialog/alert/alert.component';
import { Alert, Template } from 'src/app/models/alert';

@Component({
  selector: 'app-account-and-alert',
  templateUrl: './account-and-alert.component.html',
  styleUrls: [
    './account-and-alert.component.css',
    '../../all-in-one.component.css',
  ],
})
export class AccountAndAlertComponent {
  public accountType = AccountType;
  public alertType = AlertType;
  currentAccountType = this.accountType.None;
  currentAlertType = this.alertType.None;
  isCustomAccount = false;
  customAccountTemp = '';
  customAccount = '';
  isValidCustomAccount = false;
  currentAccountNumber = '';
  tc = false;
  errMsg = '';
  err = false;
  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    aioSvc.currentStep = ServiceStep.AccountAndAlert;
  }

  selectAccountType(type: any) {
    this.currentAccountType = type;
    if (type == this.accountType.Phone) {
      this.currentAccountNumber = this.aioSvc.customerInfo.mobileNo.substr(-9);
    }
    if (type == this.accountType.DOB) {
      this.currentAccountNumber = this.aioSvc.customerInfo.dob.replace('/', '');
    }
    if (type == this.accountType.CardId) {
      this.currentAccountNumber =
        this.aioSvc.customerInfo.customerID.substr(-10);
    }
    if (type == this.accountType.Random) {
      this.currentAccountNumber = '';
    }
    if (type == this.accountType.Custom) {
      this.isCustomAccount = type == this.accountType.Custom;
      this.customAccountTemp = this.customAccount;
    }

    console.log(this.currentAccountType);
  }

  selectAlertType(type: any) {
    this.currentAlertType = type;
    console.log(this.currentAlertType);
  }

  openTermsAndConditionsDialog() {
    let data = new Alert();

    data.template = Template.TermsAndConditions;
    data.title = 'Điều khoản điều kiện mở và sử dụng tài khoản';

    const dialogRef = this.dialog.open(AlertComponent, {
      data: data,
      autoFocus: false,
      panelClass: 'aio-alert',
    });

    dialogRef.afterClosed().subscribe((result: Alert) => {
      console.log(
        '🚀 ~ file: account-and-alert.component.ts:75 ~ AccountAndAlertComponent ~ dialogRef.afterClosed ~ result:',
        result
      );
    });
  }

  confirm() {
    if (
      this.currentAccountType != this.accountType.Custom &&
      this.currentAccountType != this.accountType.Random
    ) {
      this.checkAccount(this.currentAccountNumber);
    } else {
      this.next();
    }
  }

  back() {
    this.isCustomAccount = false;
    if (!this.customAccount) this.currentAccountType = this.accountType.None;
  }

  handleInputNumber(key: string) {
    if (key == 'clear') {
      this.customAccountTemp = this.customAccountTemp.substring(
        0,
        this.customAccountTemp.length - 1
      );
      this.validateCustomAccount();
    } else if (key == 'reset') {
      this.customAccountTemp = '';
      this.validateCustomAccount();
    } else {
      if (this.customAccountTemp.length >= 12) {
        return;
      } else {
        this.customAccountTemp = this.customAccountTemp + key;
        this.validateCustomAccount();
      }
    }
  }

  setErrMsg(msg: string) {
    this.errMsg = msg;
    this.err = msg == '' ? false : true;
    this.isValidCustomAccount = !this.err;
  }

  validateCustomAccount() {
    const numberLength = this.customAccountTemp.length;

    // Độ dài từ 6 đến 12 chữ số
    if (numberLength < 6 || numberLength > 12) {
      this.setErrMsg('Độ dài phải từ 6 đến 12 chữ số');
    }
    // Không bắt đầu bằng số 7
    else if (this.customAccountTemp.startsWith('7')) {
      this.setErrMsg('Không bắt đầu bằng số 7');
    }
    // Không bắt đầu bằng số 1 đến 6 nếu chuỗi số là 10 số
    else if (numberLength === 10 && /^[1-6]/.test(this.customAccountTemp)) {
      this.setErrMsg('Không bắt đầu bằng số 1 đến 6 nếu số tài khoản là 10 số');
    }
    // Không bắt đầu bằng số 0 nếu chuỗi số là 12 số
    else if (numberLength === 12 && this.customAccountTemp.startsWith('0')) {
      this.setErrMsg('Không bắt đầu bằng số 0 nếu số tài khoản là 12 số');
    } else {
      // Các điều kiện khác thỏa mãn, trả về true
      this.setErrMsg('');
    }
  }

  verifyCustomAccount() {
    this.checkAccount(this.customAccountTemp);
  }

  next() {
    this.aioSvc.registerAlert.methodAlert = this.currentAlertType;
    this.aioSvc.customerEnrollInfo.accountType =
      this.currentAccountType == AccountType.Random ? 'R' : 'O';
    this.aioSvc.customerEnrollInfo.accountCurrency = '704';
    this.aioSvc.customerEnrollInfo.prefixNumberAccount =
      this.currentAccountNumber;
    this.aioSvc.customerEnrollInfo.branchCode = 'VN0010001';
    this.aioSvc.next();
  }

  checkAccount(accountNo: string) {
    this.aioSvc.checkAccount(accountNo).subscribe(
      (res: any) => {
        this.aioSvc.isProcessing = false;
        if (res.respCode == '00') {
          console.log(res.data);
          if (res.data.accountExist) {
            this.alert();
          } else if (res.data.price > 0) {
            this.alert(res.data.price);
          } else {
            if (this.currentAccountType == this.accountType.Custom) {
              this.customAccount = this.customAccountTemp;
              this.currentAccountNumber = this.customAccount;
              this.isCustomAccount = false;
            } else {
              this.next();
            }
          }
        } else {
          this.aioSvc.alertWithGoHome();
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.alertWithGoHome();
        console.log(err);
      }
    );
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  alert(price: number = 0) {
    let data = new Alert();

    data.template = Template.Simple;
    data.title = 'Thông báo';
    if (price > 0) {
      data.content = `Tài khoản Quý khách chọn có giá <b>${this.numberWithCommas(
        price
      )}</b> <u>đ</u>.<br> Vui lòng liên hệ quầy giao dịch để thanh toán phí <br>trước khi mở Tài khoản hoặc lựa chọn Tài khoản khác`;
    } else {
      data.content = `Tài khoản Quý khách chọn hiện đã có người sử dụng. <br />
      Vui lòng chọn số Tài khoản khác`;
    }

    const dialogRef = this.dialog.open(AlertComponent, {
      data: data,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: Alert) => {
      if (result) {
        if (result.action == 'back') {
          this.back();
        }
      }
      console.log(result);
    });
  }
}
