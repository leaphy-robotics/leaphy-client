import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorPage } from './code-editor.page';

describe('CodeEditorPage', () => {
  let component: CodeEditorPage;
  let fixture: ComponentFixture<CodeEditorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeEditorPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
