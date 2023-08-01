import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Card {
  id: number;
  imagePath: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() card: Card;
}
