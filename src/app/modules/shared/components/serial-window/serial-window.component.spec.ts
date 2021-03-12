import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialWindowComponent } from './serial-window.component';

describe('SerialWindowComponent', () => {
  let component: SerialWindowComponent;
  let fixture: ComponentFixture<SerialWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
