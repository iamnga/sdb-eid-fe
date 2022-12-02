import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements OnInit {
  title = 'Nghề nghiệp';
  currentJob = '';

  constructor(
    public dialogRef: MatDialogRef<JobComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit(): void {}

  setJob(job: string) {
    this.currentJob = job;
    this.dialogRef.close(this.currentJob);
  }

  jobs = [
    { code: 1, name: 'Kỹ sư phần mềm' },
    { code: 2, name: 'Giáo viên' },
    { code: 3, name: 'Doanh nhân' },
  ];
}
