import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alert, Template } from 'src/app/models/alert';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css', '../../../all-in-one.component.css'],
})
export class AlertComponent implements OnInit {
  template = Template;
  countDownInterval: any;
  countDownTime = 30;

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Alert,
    public aioSvc: AioService
  ) {

    if (data.countDownTime && data.countDownTime > 0) {
      this.countDownInterval = setInterval(() => {
        this.data.countDownTime -= 1;
        if (this.data.countDownTime === 0) {
          this.stopCountdown();
          this.dialogRef.close(this.data);
        }
      }, 1000);
    }
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  action(action: string) {
    this.data.action = action;
    this.dialogRef.close(this.data);
  }

  goHome() {
    this.dialogRef.close();
  }

  stopCountdown() {
    clearInterval(this.countDownInterval);
  }
}
