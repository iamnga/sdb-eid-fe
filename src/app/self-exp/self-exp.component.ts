import { Component, OnInit } from '@angular/core';
import { AioService } from '../services/all-in-one/aio.service';

@Component({
  selector: 'app-self-exp',
  templateUrl: './self-exp.component.html',
  styleUrls: ['./self-exp.component.css'],
})
export class SelfExpComponent implements OnInit {
  constructor(public aioSvc: AioService) {}

  ngOnInit(): void {}
}
