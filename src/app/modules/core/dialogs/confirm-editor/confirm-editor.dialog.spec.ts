import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmEditorDialog } from './confirm-editor.dialog';

describe('ConfirmEditorDialog', () => {
  let component: ConfirmEditorDialog;
  let fixture: ComponentFixture<ConfirmEditorDialog>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmEditorDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEditorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
