import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css'],
})
export class ProcessingComponent implements OnInit {
  processing: AnimationOptions = {
    path: 'assets/all-in-one/shared/img/processing.json',
  };
  constructor() {}

  ngOnInit(): void {}
}
