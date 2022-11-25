import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FingerResponse } from 'src/app/models/mk';
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
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.callMkFingerPrint();
    setTimeout(() => {
      this.showFingerGif = false;
      this.showCheckGif = true;
      setTimeout(() => {
        this.router.navigate(['/aio/shared/collect-card-id']);
      }, 3000);
    }, 5000);
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
}
