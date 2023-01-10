import { Component, OnInit } from '@angular/core';
import { AioService } from '../services/all-in-one/aio.service';

@Component({
  selector: 'app-all-in-one',
  templateUrl: './all-in-one.component.html',
  styleUrls: ['./all-in-one.component.css'],
})
export class AllInOneComponent implements OnInit {
  constructor(public aioSvc: AioService) {}

  ngOnInit(): void {}
}
