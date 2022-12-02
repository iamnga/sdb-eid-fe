import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alert, Template } from 'src/app/models/alert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  template = Template;

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Alert
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  action(event: string) {
    this.data.action = event;
    this.dialogRef.close(this.data);
  }
}
