import { Component, OnInit } from '@angular/core';

interface Card {
  id: number;
  imagePath: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-matching-card-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  matchedPairs: number = 0;
  remainingTime = '01 : 30';
  round = 1;
  seconds = 90;
  steps = 1;
  phone = '';

  ngOnInit(): void {
    if (this.steps === 1) {
      this.setCard(this.round);
      this.countDown();
      // Initialize the cards array with card objects

      console.log('Before', this.cards);
      // Shuffle the cards
      this.shuffleCards();
      console.log('After', this.cards);
    }
  }

  shuffleCards(): void {
    // Shuffle the cards array using Fisher-Yates algorithm
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  flipCard(card: Card): void {
    console.log(card);
    if (this.flippedCards.length < 2 && !card.isFlipped && !card.isMatched) {
      card.isFlipped = true;
      this.flippedCards.push(card);

      // Check if two cards are flipped for matching
      if (this.flippedCards.length === 2) {
        setTimeout(() => {
          this.checkForMatch();
        }, 1000);
      }
    }
  }

  checkForMatch(): void {
    const [card1, card2] = this.flippedCards;

    if (card1.id === card2.id) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.matchedPairs++;

      if (this.matchedPairs === this.cards.length / 2) {
        if (this.round === 1) {
          this.resetRound(2);
        } else {
          // Game over, all pairs matched
          alert('You win!');
          this.steps = 2;
        }
      }
    } else {
      // Flip the cards back if they don't match
      card1.isFlipped = false;
      card2.isFlipped = false;
    }

    // Clear the flippedCards array
    this.flippedCards = [];
  }

  resetRound(round: number) {
    this.round = round;
    this.setCard(this.round);
    this.shuffleCards();
    this.seconds = 90;
    this.matchedPairs = 0;
    this.phone = '';

    if (this.round === 1) {
      this.steps = 1;
      this.countDown();
    }
  }

  countDown() {
    // Get a reference to the last interval + 1
    const interval_id = window.setInterval(function () {},
    Number.MAX_SAFE_INTEGER);

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }
    let x = setInterval(() => {
      if (this.steps == 1) {
        if (this.seconds >= 0) {
          var minutes = Math.floor(this.seconds / 60);
          var remainingSeconds = this.seconds % 60;

          var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
          var formattedSeconds =
            remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
          this.remainingTime = formattedMinutes + ' : ' + formattedSeconds;
          console.log(formattedMinutes + ':' + formattedSeconds);
          this.seconds--;
        } else {
          alert('Đã hết giờ');
          clearInterval(x);
        }
      } else {
        clearInterval(x);
      }
    }, 1000);
  }

  handleInputNumber(key: string) {
    if (key == 'clear') {
      this.phone = this.phone.substring(0, this.phone.length - 1);
      // this.validateCustomAccount();
    } else if (key == 'reset') {
      this.phone = '';
    } else {
      if (this.phone.length >= 10) {
        return;
      } else {
        this.phone = this.phone + key;
        // this.validateCustomAccount();
      }
    }
  }

  validatePhone() {
    this.steps++;
  }

  back() {
    this.resetRound(1);
  }
  setCard(round: number) {
    if (round === 1) {
      this.cards = [
        {
          id: 1,
          imagePath: 'assets/self-exp/img/card/only_one.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 1,
          imagePath: 'assets/self-exp/img/card/only_one.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          imagePath: 'assets/self-exp/img/card/bamboo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          imagePath: 'assets/self-exp/img/card/bamboo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          imagePath: 'assets/self-exp/img/card/combo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          imagePath: 'assets/self-exp/img/card/combo_card.png',
          isFlipped: false,
          isMatched: false,
        },
      ];
    } else {
      this.cards = [
        {
          id: 1,
          imagePath: 'assets/self-exp/img/card/only_one.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 1,
          imagePath: 'assets/self-exp/img/card/only_one.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          imagePath: 'assets/self-exp/img/card/bamboo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          imagePath: 'assets/self-exp/img/card/bamboo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          imagePath: 'assets/self-exp/img/card/combo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          imagePath: 'assets/self-exp/img/card/combo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 4,
          imagePath: 'assets/self-exp/img/card/nextpay_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 4,
          imagePath: 'assets/self-exp/img/card/nextpay_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 5,
          imagePath: 'assets/self-exp/img/card/tiki_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 5,
          imagePath: 'assets/self-exp/img/card/tiki_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 6,
          imagePath: 'assets/self-exp/img/card/vnairline_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 6,
          imagePath: 'assets/self-exp/img/card/vnairline_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 1,
          imagePath: 'assets/self-exp/img/card/only_one.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 1,
          imagePath: 'assets/self-exp/img/card/only_one.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          imagePath: 'assets/self-exp/img/card/bamboo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          imagePath: 'assets/self-exp/img/card/bamboo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          imagePath: 'assets/self-exp/img/card/combo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          imagePath: 'assets/self-exp/img/card/combo_card.png',
          isFlipped: false,
          isMatched: false,
        },
        // Add more card objects here
      ];
    }
  }
}
