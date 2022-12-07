import { Component, OnInit } from '@angular/core';
import { AccountType, AlertType, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../shared/dialog/alert/alert.component';
import { Alert, Template } from 'src/app/models/alert';
import { Router } from '@angular/router';
import { ifft } from '@tensorflow/tfjs-core';

@Component({
  selector: 'app-account-and-alert',
  templateUrl: './account-and-alert.component.html',
  styleUrls: ['./account-and-alert.component.css'],
})
export class AccountAndAlertComponent implements OnInit {
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

  constructor(
    private aioSvc: AioService,
    public dialog: MatDialog,
    private router: Router
  ) {
    aioSvc.currentStep = ServiceStep.AccountAndAlert;
  }

  ngOnInit() {}

  selectAccountType(type: any) {
    this.currentAccountType = type;
    if (type == this.accountType.Phone) {
      this.currentAccountNumber = '938483697';
    }
    if (type == this.accountType.DOB) {
      this.currentAccountNumber = '9031995';
    }
    if (type == this.accountType.CardId) {
      this.currentAccountNumber = '15071000030 ';
    }
    if (type == this.accountType.Random) {
      this.currentAccountNumber = 'random';
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

  confirm() {
    if (
      this.currentAccountType != this.accountType.Custom &&
      this.currentAccountType != this.accountType.Random
    ) {
      this.checkAccount(this.currentAccountNumber);
    } else {
      this.aioSvc.next();
    }
  }

  back() {
    this.isCustomAccount = false;
    if (!this.customAccount) this.currentAccountType = this.accountType.None;
  }

  handleInputNumber(key: string) {
    if (key == 'c') {
      this.customAccountTemp = this.customAccountTemp.substring(
        0,
        this.customAccountTemp.length - 1
      );
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

  validateCustomAccount() {
    let first = this.customAccountTemp.substring(0, 1);
    let length = this.customAccountTemp.length;
    console.log('first: ' + first + ' - ' + 'length: ' + length);
    this.rules[1].valid = length > 0 ? true : false;

    if (length > 5 && length < 13) {
      this.rules[0].valid = true;
      this.rules[2].valid = true;
      this.rules[3].valid = true;
      this.rules[4].valid = true;
      if (first != '7') {
        this.rules[2].valid = true;
      } else {
        this.rules[2].valid = false;
      }

      if (length == 10) {
        if (/[7890]{1}/.test(first)) {
          this.rules[3].valid = true;
        } else {
          this.rules[3].valid = false;
        }
      } else {
        this.rules[3].valid = true;
      }
      if (length == 12) {
        if (first != '0') {
          this.rules[4].valid = true;
        } else {
          this.rules[4].valid = false;
        }
      }
    } else {
      this.rules[0].valid = false;
      this.rules[2].valid = false;
      this.rules[3].valid = false;
      this.rules[4].valid = false;
    }

    this.isValidCustomAccount =
      this.rules[0].valid &&
      this.rules[1].valid &&
      this.rules[2].valid &&
      this.rules[3].valid &&
      this.rules[4].valid
        ? true
        : false;
    console.log(this.isValidCustomAccount);
  }

  verifyCustomAccount() {
    this.checkAccount(this.customAccountTemp);
  }

  checkAccount(accountNo: string) {
    this.aioSvc.isProcessing = true;
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
              //Store info alert - accountNo - accountType
              this.aioSvc.next();
            }
          }
        } else {
          this.aioSvc.updateLogStep(
            '',
            res.respCode,
            res.respDescription,
            'checkAccount'
          );
          this.aioSvc.alert(`Có lỗi xảy ra checkAccount`);
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.updateLogStep('', '01', 'HttpError', 'checkAccount');
        this.aioSvc.alert(`Có lỗi xảy ra checkAccount`);
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

  rules = [
    { text: 'Độ dài tối thiểu 6 chữ số tối đa 12 chữ số;', valid: false },
    { text: 'Không chứa chữ và ký tự đặc biệt;', valid: false },
    { text: 'Không bắt đầu bằng số 7;', valid: false },
    {
      text: 'Không bắt đầu bằng số 1 đến 6 nếu chuỗi số TKTT là 10 số;',
      valid: false,
    },
    {
      text: 'Không bắt đầu bằng số 0 nếu chuỗi số TKTT là 12 số;',
      valid: false,
    },
    {
      text: 'Dãy số miễn phí không có tối thiểu 1/2 dãy số liên tục có chứa cặp thần tài(39,79), phát lộc (68,86), số thứ tự, số tiến, số trùng, số lặp, số gánh, số soi gương.',
      valid: true,
    },
  ];
}
