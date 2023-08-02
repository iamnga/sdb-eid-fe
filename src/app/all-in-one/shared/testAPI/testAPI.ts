import { Component, OnInit } from '@angular/core';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-aio-test-API',
  templateUrl: './testAPI.html',
  styleUrls: ['./testAPI.css'],
})
export class TestAPIComponent {
  constructor(private aioSvc: AioService) {
    // aioSvc.getListAccount('17856216').subscribe((res) => {
    //   console.log(res)
    // })

    aioSvc.checkCustomerByIdNo('352229667').subscribe((res) => {
      console.log(res)
    })
  }

}
