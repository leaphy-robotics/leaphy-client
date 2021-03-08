import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SerialOutputComponent } from './serial-output.component';

describe('SerialOutputComponent', () => {
  let component: SerialOutputComponent;
  let fixture: ComponentFixture<SerialOutputComponent>;

  beforeEach(waitForAsync(() => {
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
