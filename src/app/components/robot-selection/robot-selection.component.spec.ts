import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotSelectionComponent } from './robot-selection.component';

describe('RobotSelectionComponent', () => {
  let component: RobotSelectionComponent;
  let fixture: ComponentFixture<RobotSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RobotSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RobotSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
