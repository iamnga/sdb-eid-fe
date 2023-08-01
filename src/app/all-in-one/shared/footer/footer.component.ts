import { Component, OnInit } from '@angular/core';
import { AioService } from 'src/app/services/all-in-one/aio.service';

@Component({
  selector: 'app-aio-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor(private aioSvc: AioService) { }

  goHome() {
    this.aioSvc.release();
  }
}
