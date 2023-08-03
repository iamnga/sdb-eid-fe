import { Component, } from '@angular/core';
import { ServiceStep } from 'src/app/models/enum';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-update-success',
  templateUrl: './update-success.component.html',
  styleUrls: ['./update-success.component.css', '../../all-in-one.component.css']
})
export class UpdateSuccessComponent {

  constructor(public aioSvc: AioService) { 
    aioSvc.currentStep = ServiceStep.UpdateCustomerSuccess
  }

  goHome() {
    this.aioSvc.release();
  }

}
