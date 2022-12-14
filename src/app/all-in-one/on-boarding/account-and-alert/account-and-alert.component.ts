import { Component, OnInit } from '@angular/core';
import { AccountType, AlertType, ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';
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
    public aioSvc: AioService,
    public dialog: MatDialog,
    private router: Router
  ) {
    aioSvc.currentStep = ServiceStep.AccountAndAlert;
  }

  ngOnInit() {}

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
    this.rules[0].valid = length > 5 && length < 10 ? true : false;
    this.rules[1].valid = length > 0 && first != '7' ? true : false;

    // if (length > 5 && length < 13) {
    //   this.rules[0].valid = true;
    //   this.rules[1].valid = true;
    //   this.rules[3].valid = true;
    //   this.rules[4].valid = true;
    //   if (first != '7') {
    //     this.rules[2].valid = true;
    //   } else {
    //     this.rules[2].valid = false;
    //   }

    //   if (length == 10) {
    //     if (/[7890]{1}/.test(first)) {
    //       this.rules[3].valid = true;
    //     } else {
    //       this.rules[3].valid = false;
    //     }
    //   } else {
    //     this.rules[3].valid = true;
    //   }
    //   if (length == 12) {
    //     if (first != '0') {
    //       this.rules[4].valid = true;
    //     } else {
    //       this.rules[4].valid = false;
    //     }
    //   }
    // } else {
    //   this.rules[0].valid = false;
    //   this.rules[2].valid = false;
    //   this.rules[3].valid = false;
    //   this.rules[4].valid = false;
    // }

    this.isValidCustomAccount =
      this.rules[0].valid && this.rules[1].valid ? true : false;
    console.log(this.isValidCustomAccount);
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
          this.aioSvc.updateLogStep(
            '',
            res.respCode,
            res.respDescription,
            'checkAccount'
          );
          this.aioSvc.alert(`C?? l???i x???y ra checkAccount`);
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.updateLogStep('', '01', 'HttpError', 'checkAccount');
        this.aioSvc.alert(`C?? l???i x???y ra checkAccount`);
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
    data.title = 'Th??ng b??o';
    if (price > 0) {
      data.content = `T??i kho???n Qu?? kh??ch ch???n c?? gi?? <b>${this.numberWithCommas(
        price
      )}</b> <u>??</u>.<br> Vui l??ng li??n h??? qu???y giao d???ch ????? thanh to??n ph?? <br>tr?????c khi m??? T??i kho???n ho???c l???a ch???n T??i kho???n kh??c`;
    } else {
      data.content = `T??i kho???n Qu?? kh??ch ch???n hi???n ???? c?? ng?????i s??? d???ng. <br />
      Vui l??ng ch???n s??? T??i kho???n kh??c`;
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
    { text: '????? d??i t???i thi???u 6 ch??? s??? t???i ??a 9 ch??? s???;', valid: false },
    { text: 'Kh??ng b???t ?????u b???ng s??? 7;', valid: false },
    {
      text: 'D??y s??? mi???n ph?? kh??ng c?? t???i thi???u 1/2 d??y s??? li??n t???c c?? ch???a c???p th???n t??i(39,79), ph??t l???c (68,86), s??? th??? t???, s??? ti???n, s??? tr??ng, s??? l???p, s??? g??nh, s??? soi g????ng.',
      valid: true,
    },
  ];

  // rules = [
  //   { text: '????? d??i t???i thi???u 6 ch??? s??? t???i ??a 12 ch??? s???;', valid: false },
  //   { text: 'Kh??ng ch???a ch??? v?? k?? t??? ?????c bi???t;', valid: false },
  //   { text: 'Kh??ng b???t ?????u b???ng s??? 7;', valid: false },
  //   {
  //     text: 'Kh??ng b???t ?????u b???ng s??? 1 ?????n 6 n???u chu???i s??? TKTT l?? 10 s???;',
  //     valid: false,
  //   },
  //   {
  //     text: 'Kh??ng b???t ?????u b???ng s??? 0 n???u chu???i s??? TKTT l?? 12 s???;',
  //     valid: false,
  //   },
  //   {
  //     text: 'D??y s??? mi???n ph?? kh??ng c?? t???i thi???u 1/2 d??y s??? li??n t???c c?? ch???a c???p th???n t??i(39,79), ph??t l???c (68,86), s??? th??? t???, s??? ti???n, s??? tr??ng, s??? l???p, s??? g??nh, s??? soi g????ng.',
  //     valid: true,
  //   },
  // ];
}
