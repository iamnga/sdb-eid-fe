import { Component, OnInit } from '@angular/core';
import { CheckCustomerSDBRequestData } from 'src/app/models/aio';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-aio-test-API',
  templateUrl: './testAPI.html',
  styleUrls: ['./testAPI.css'],
})
export class TestAPIComponent {
  constructor(private aioSvc: AioService) {
    // aioSvc.createAccountVerify('17856216').subscribe((res) => {
    //   console.log(res)
    // })

    aioSvc.getListAccount('17858875').subscribe((res) => {
      console.log(res)
    })


    // let req = new CheckCustomerSDBRequestData()
    // req.customerID = '089095020514';
    // req.serviceType = 'OA';
    // req.fullName = 'NGUYỄN NGỌC NGÀ';
    // req.dob = '19950125';
    // req.customerType = '1';
    // req.residentAddress = "hihi"

    // aioSvc.checkCustomerByIdNo(req).subscribe((res) => {
    //   console.log(res)
    // })
  }
}
