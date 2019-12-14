import { TestBed } from '@angular/core/testing';

import { BlocklyState } from './blockly.state';

describe('BlocklyState', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlocklyState = TestBed.get(BlocklyState);
    expect(service).toBeTruthy();
  });
});
