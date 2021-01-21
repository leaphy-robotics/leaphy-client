import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialOutputComponent } from './serial-output.component';

describe('SerialOutputComponent', () => {
  let component: SerialOutputComponent;
  let fixture: ComponentFixture<SerialOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
