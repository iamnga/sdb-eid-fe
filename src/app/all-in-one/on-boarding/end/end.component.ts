import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.css', '../../all-in-one.component.css'],
})
export class EndComponent implements OnInit {
  note = '';
  type: number;
  effectiveDate: string;
  qrValue: string;

  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    aioSvc.currentStep = ServiceStep.End;
    this.effectiveDate = this.getFormattedDate();
    this.qrValue = aioSvc.openAccountResponseData.dataStreamQR;
  }

  ngOnInit(): void {
  }

  getFormattedDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  }

  goHome() {
    this.aioSvc.release();
  }
}
