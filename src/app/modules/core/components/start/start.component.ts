import { Component } from "@angular/core";
import { AppState } from "src/app/state/app.state";

@Component({
  selector: "app-start",
  templateUrl: "./start.component.html",
  styleUrls: ["./start.component.scss"],
})
export class StartComponent {
  constructor(public appState: AppState) {}
}
