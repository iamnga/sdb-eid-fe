import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-input-survey',
  templateUrl: './input-survey.component.html',
  styleUrls: ['./input-survey.component.css'],
})
export class InputSurveyComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InputSurveyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.type = data;
  }

  comment = '';
  type: number;
  expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  err = '';
  reasonList: Reason[] = [
    { id: 1, isSelected: false, text: 'Phục vụ chưa nhanh chóng' },
    { id: 2, isSelected: false, text: 'Giao diện chưa thân thiện' },
    { id: 3, isSelected: false, text: 'Không gian giao dịch' },
    { id: 4, isSelected: false, text: 'Quy trình phức tạp' },
  ];

  ngOnInit(): void {}

  selectReason(reason: Reason) {
    console.log(reason);
    let index = this.reasonList.findIndex((x) => x.id == reason.id);
    if (index > -1) {
      this.reasonList[index].isSelected = !this.reasonList[index].isSelected;
    }
  }

  onChangeEvent(event: any) {
    this.comment = event;
    console.log(event);
  }

  onKeyPressEvent(event: any) {
    console.log(event);
    if (event === '{downkeyboard}') {
      this.dialogRef.close();
    }
    if (event === '{enter}') {
      let reasons = '';
      let reasonSelected = this.reasonList.filter((x) => x.isSelected == true);

      if (reasonSelected.length > 0) {
        reasonSelected.forEach((element) => {
          reasons = reasons + element.text + ';';
        });
      }

      this.dialogRef.close({
        comment: this.comment.substring(0, 500),
        reasons: reasons.substring(0, reasons.length - 1),
      });
    }
  }
}

export class Reason {
  id: number;
  isSelected: boolean;
  text: string;
}
