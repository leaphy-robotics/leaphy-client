import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallDriverDialog } from './install-driver.dialog';

describe('InstallDriverDialog', () => {
  let component: InstallDriverDialog;
  let fixture: ComponentFixture<InstallDriverDialog>;

  beforeEach(async(() => {
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
