import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceStep } from 'src/app/models/enum';
import { FingerResponse } from 'src/app/models/mk';
import { AioService } from 'src/app/services/aio.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-input-finger',
  templateUrl: './input-finger.component.html',
  styleUrls: ['./input-finger.component.css'],
})
export class InputFingerComponent implements OnInit {
  fpResponse: FingerResponse = new FingerResponse();
  showFingerGif = true;
  showCheckGif = false;
  constructor(private aioSvc: AioService) {
    aioSvc.currentStep = ServiceStep.InputFinger;
  }

  ngOnInit(): void {
    // this.callMkFingerPrint();
    // setTimeout(() => {
    //   this.showFingerGif = false;
    //   this.showCheckGif = true;
    //   setTimeout(() => {
    //     this.aioSvc.next();
    //   }, 3000);
    // }, 5000);
  }

  checkCustomerByIdNo(customerId: string) {
    this.aioSvc.checkCustomerByIdNo(customerId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  callMkFingerPrint() {
    let websocketService = new WebsocketService();
    websocketService.messages.subscribe((msg) => {
      this.fpResponse = msg;

      console.log(this.fpResponse);
      this.fpResponse.image = 'data:image/png;base64,' + this.fpResponse.image;
      console.log('Response from websocket: ' + this.fpResponse.verifyResponse);
    });
  }

  recallMkFingerPrint() {
    this.fpResponse = new FingerResponse();
    this.callMkFingerPrint();
  }

  next() {
    this.checkCustomerByIdNo('352229667');
    // this.aioSvc.next();
  }
}
