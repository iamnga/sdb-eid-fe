import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillInfoComponent } from './fill-info.component';

describe('FillInfoComponent', () => {
  let component: FillInfoComponent;
  let fixture: ComponentFixture<FillInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FillInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FillInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
