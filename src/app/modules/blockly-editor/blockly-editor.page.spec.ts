import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocklyEditorPage } from './blockly-editor.page';

describe('BlocklyEditorPage', () => {
  let component: BlocklyEditorPage;
  let fixture: ComponentFixture<BlocklyEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocklyEditorPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocklyEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
