import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LanguageSelectDialog } from './language-select.dialog';

describe('LanguageSelectComponent', () => {
  let component: LanguageSelectDialog;
  let fixture: ComponentFixture<LanguageSelectDialog>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageSelectDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
