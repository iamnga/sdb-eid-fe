import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-input-email',
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.css'],
})
export class InputEmailComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InputEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private aioSvc: AioService
  ) {}

  email = this.data;
  expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  err = '';

  ngOnInit(): void {}

  onChangeEvent(event: any) {
    this.email = event;
    console.log(event);
  }

  onKeyPressEvent(event: any) {
    console.log(event);
    if (event === '{downkeyboard}') {
      this.dialogRef.close(this.data);
    }
    if (event === '{enter}') {
      this.validateEmail();
    }
  }

  validateEmail() {
    if (this.email) {
      if (!this.expression.test(this.email)) {
        this.err = 'Email không hợp lệ, vui lòng thử lại';
      } else {
        this.err = '';
        //call Zero bounce
        this.aioSvc.isProcessing = true;
        this.aioSvc.verifyEmail(this.email).subscribe(
          (res: any) => {
            this.aioSvc.isProcessing = false;
            console.log(res);
            if (res.respCode != '00') {
              this.err = 'Email không hợp lệ, vui lòng thử lại';
            } else {
              this.dialogRef.close(this.email);
            }
          },
          (err) => {
            this.aioSvc.isProcessing = false;
            this.aioSvc.alert(`Có lỗi hệ thống`);
          }
        );
      }
    } else {
      this.err = 'Email không được bỏ trống';
    }
  }
}
