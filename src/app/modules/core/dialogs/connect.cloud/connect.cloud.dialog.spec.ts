import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConnectCloudDialog } from './connect.cloud.dialog';

describe('ConnectCloudDialog', () => {
  let component: ConnectCloudDialog;
  let fixture: ComponentFixture<ConnectCloudDialog>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectCloudDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectCloudDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
