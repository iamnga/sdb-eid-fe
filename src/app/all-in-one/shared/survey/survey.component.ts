import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';
import { InputSurveyComponent } from '../dialog/input-survey/input-survey.component';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
})
export class SurveyComponent implements OnInit {
  comment = '';
  reasons = '';
  type: number;

  constructor(private aioSvc: AioService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  openInputSurveyDialog(type: number) {
    this.type = type;
    const dialogRef = this.dialog.open(InputSurveyComponent, {
      data: this.type,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.comment = result.comment;
        this.reasons = result.reasons;
      }
      console.log('Survey type: ', type);
      console.log('Survey comment: ', this.comment);
      console.log('Survey reasons: ', this.reasons);
      console.log('The InputSurveyDialog was closed', result);
      //Call API Survey
      this.aioSvc.release();
    });
  }
}
