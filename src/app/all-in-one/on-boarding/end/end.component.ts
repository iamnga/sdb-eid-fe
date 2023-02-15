import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { InputSurveyComponent } from '../../shared/dialog/input-survey/input-survey.component';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.css'],
})
export class EndComponent implements OnInit {
  note = '';
  type: number;
  constructor(public aioSvc: AioService, public dialog: MatDialog) {
    aioSvc.currentStep = ServiceStep.End;
  }

  ngOnInit(): void {
  }

  confirm() {
    this.aioSvc.release();
  }
}
