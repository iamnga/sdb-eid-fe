import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Occupations } from 'src/app/models/aio';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements OnInit {
  title = 'Nghề nghiệp';

  constructor(
    public dialogRef: MatDialogRef<JobComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Occupations[]
  ) {}

  ngOnInit(): void {}

  setOccupations(occ: Occupations) {
    this.dialogRef.close(occ);
  }
}
