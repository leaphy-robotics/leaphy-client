import { TestBed } from '@angular/core/testing';

import { BlocklyEditorState } from './blockly-editor.state';

describe('BlocklyEditorState', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlocklyEditorState = TestBed.get(BlocklyEditorState);
    expect(service).toBeTruthy();
  });
});
