import { Component } from '@angular/core';
import { AppState } from './state/app.state';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Leaphy Easybloqs';
  constructor(
    public appState: AppState,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "block",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/block.svg")
    );
  }
}
