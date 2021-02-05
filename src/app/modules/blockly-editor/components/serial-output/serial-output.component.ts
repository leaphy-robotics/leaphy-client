import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RobotWiredState } from 'src/app/state/robot.wired.state';

@Component({
  selector: 'app-serial-output',
  templateUrl: './serial-output.component.html',
  styleUrls: ['./serial-output.component.scss']
})
export class SerialOutputComponent implements AfterViewInit {

  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;
  
  constructor(public robotWiredState: RobotWiredState) { }

  ngAfterViewInit() {
    //https://stackoverflow.com/a/45655337/1056283
    this.scrollToBottom();
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }

  public onClearSerialDataClicked() {
    this.robotWiredState.clearSerialData();
  }
}
