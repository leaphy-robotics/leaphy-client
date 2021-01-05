import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsDialog } from './credits.dialog';

describe('CreditsComponent', () => {
  let component: CreditsDialog;
  let fixture: ComponentFixture<CreditsDialog>;

  beforeEach(async(() => {
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
