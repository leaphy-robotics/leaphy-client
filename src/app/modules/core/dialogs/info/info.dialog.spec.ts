import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoDialog } from './info.dialog';

describe('InfoDialog Component', () => {
  let component: InfoDialog;
  let fixture: ComponentFixture<InfoDialog>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
