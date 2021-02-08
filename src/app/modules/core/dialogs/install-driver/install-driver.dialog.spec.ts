import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstallDriverDialog } from './install-driver.dialog';

describe('InstallDriverDialog', () => {
  let component: InstallDriverDialog;
  let fixture: ComponentFixture<InstallDriverDialog>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallDriverDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallDriverDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
