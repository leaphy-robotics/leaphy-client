import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RobotSelectionComponent } from './robot-selection.component';

describe('RobotSelectionComponent', () => {
  let component: RobotSelectionComponent;
  let fixture: ComponentFixture<RobotSelectionComponent>;

  beforeEach(waitForAsync(() => {
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
