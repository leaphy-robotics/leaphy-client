import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditsDialog } from './credits.dialog';

describe('CreditsComponent', () => {
  let component: CreditsDialog;
  let fixture: ComponentFixture<CreditsDialog>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditsDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
