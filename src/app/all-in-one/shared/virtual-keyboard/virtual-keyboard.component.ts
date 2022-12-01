import {
  Component,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import Keyboard from 'simple-keyboard';

@Component({
  selector: 'app-aio-virtual-keyboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.css'],
})
export class VirtualKeyboardComponent implements OnInit {
  @Output() onChangeEvent = new EventEmitter<string>();
  @Output() onKeyPressEvent = new EventEmitter<string>();
  @Input() title = '';
  @Input() value = '';
  keyboard: Keyboard;
  constructor() {}

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: (input) => this.onChange(input),
      onKeyPress: (button: any) => this.onKeyPress(button),
      theme: 'hg-theme-default hg-theme-ios',
      layout: {
        default: [
          'q w e r t y u i o p {bksp}',
          'a s d f g h j k l {enter}',
          '{shift} z x c v b n m @ . com',
          '{alt} {space} _ {altright} {downkeyboard}',
        ],
        shift: [
          'Q W E R T Y U I O P {bksp}',
          'A S D F G H J K L {enter}',
          '{shiftactivated} Z X C V B N M @ . com',
          '{alt} {space} _ {altright} {downkeyboard}',
        ],
        alt: [
          '1 2 3 4 5 6 7 8 9 0 {bksp}',
          `@ # $ & * ( ) ' " {enter}`,
          '{shift} % - + = / ; : ! ? {shift}',
          '{default} {space} {back} {downkeyboard}',
        ],
      },
      display: {
        '{alt}': '.?123',
        '{smileys}': '\uD83D\uDE03',
        '{shift}': '⇧',
        '{shiftactivated}': '⇧',
        '{enter}': 'Gửi thông tin',
        '{bksp}': 'Xóa',
        '{altright}': '.?123',
        '{downkeyboard}': '🞃',
        '{space}': ' ',
        '{default}': 'ABC',
        '{back}': '⇦',
      },
    });
    this.keyboard.setInput(this.value);
  }

  clearAll() {
    this.value = '';
    this.keyboard.setInput(this.value);
    this.onChangeEvent.emit('');
  }

  ngOnInit(): void {}

  onChange = (input: string) => {
    this.onChangeEvent.emit(input);
    this.value = input;
  };

  onKeyPress = (button: string) => {
    this.onKeyPressEvent.emit(button);

    this.handleLayoutChange(button);
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleLayoutChange(button: any) {
    let currentLayout = this.keyboard.options.layoutName;
    let layoutName;

    switch (button) {
      case '{shift}':
      case '{shiftactivated}':
      case '{default}':
        layoutName = currentLayout === 'default' ? 'shift' : 'default';
        break;

      case '{alt}':
      case '{altright}':
        layoutName = currentLayout === 'alt' ? 'default' : 'alt';
        break;

      default:
        break;
    }

    if (layoutName) {
      this.keyboard.setOptions({
        layoutName: layoutName,
      });
    }
  }
}
