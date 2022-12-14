import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddressData, Occupations } from 'src/app/models/aio';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements OnInit {
  title = 'Nghề nghiệp';

  constructor(
    public dialogRef: MatDialogRef<JobComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Occupations[],
    private aioSvc: AioService
  ) {}

  ngOnInit(): void {}

  setOccupations(occ: Occupations) {
    this.dialogRef.close(occ);
  }
}