import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaphyBlocklyComponent } from './leaphy-blockly.component';

describe('LeaphyBlocklyComponent', () => {
  let component: LeaphyBlocklyComponent;
  let fixture: ComponentFixture<LeaphyBlocklyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaphyBlocklyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaphyBlocklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
