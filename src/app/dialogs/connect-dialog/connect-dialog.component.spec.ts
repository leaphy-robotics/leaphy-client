import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectDialogComponent } from './connect-dialog.component';

describe('ConnectDialogComponent', () => {
  let component: ConnectDialogComponent;
  let fixture: ComponentFixture<ConnectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
