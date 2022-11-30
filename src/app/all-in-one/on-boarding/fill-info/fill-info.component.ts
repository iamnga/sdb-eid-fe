import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/aio.service';
import { MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'app-fill-info',
  templateUrl: './fill-info.component.html',
  styleUrls: ['./fill-info.component.css'],
})
export class FillInfoComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.FillInfo;
  }

  ngOnInit(): void {}

  confirm() {
    this.aioSvc.next();
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Vui lòng không bỏ trống';
    }

    return this.email.hasError('email') ? 'Email không hợp lệ' : '';
  }
}
