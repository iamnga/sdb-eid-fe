import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matching-card',
  templateUrl: './matching-card.component.html',
  styleUrls: ['./matching-card.component.css'],
})
export class MatchingCardComponent implements OnInit {
  constructor( private router: Router) {}

  ngOnInit(): void {
  }
}
