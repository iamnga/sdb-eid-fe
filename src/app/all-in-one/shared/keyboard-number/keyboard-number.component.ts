import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-keyboard-number',
  templateUrl: './keyboard-number.component.html',
  styleUrls: ['./keyboard-number.component.css'],
})
export class KeyboardNumberComponent implements OnInit {
  @Output() inputNumberEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  inputNumber(key: string) {
    this.inputNumberEvent.emit(key);
  }
}
