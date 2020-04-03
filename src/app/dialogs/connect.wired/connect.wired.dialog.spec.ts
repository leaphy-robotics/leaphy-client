import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectWiredDialog } from './connect.wired.dialog';

describe('ConnectWiredDialog', () => {
  let component: ConnectWiredDialog;
  let fixture: ComponentFixture<ConnectWiredDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectWiredDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectWiredDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
