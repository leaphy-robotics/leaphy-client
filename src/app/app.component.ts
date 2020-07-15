import { Component } from '@angular/core';
import { AppState } from './state/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Leaphy Easybloqs';
  constructor(
    public appState: AppState
  ) { }
}
