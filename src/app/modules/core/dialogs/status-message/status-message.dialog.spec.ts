import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatusMessageDialog } from './status-message.dialog';

describe('StatusMessageComponent', () => {
  let component: StatusMessageDialog;
  let fixture: ComponentFixture<StatusMessageDialog>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusMessageDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusMessageDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
