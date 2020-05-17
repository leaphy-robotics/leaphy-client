import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { SketchStatus } from '../domain/sketch.status';
import { scan, filter, map, tap } from 'rxjs/operators';
import { WorkspaceStatus } from '../domain/workspace.status';

declare var Blockly: any;

@Injectable({
  providedIn: 'root'
})
export class BlocklyEditorState {

  private initialCode = `void setup()
{

}

void loop()
{

}
  `;
  private codeSubject$ = new BehaviorSubject(this.initialCode);
  public code$ = this.codeSubject$.asObservable();

  private sketchStatusSubject$: BehaviorSubject<SketchStatus> = new BehaviorSubject(SketchStatus.UnableToSend);
  public sketchStatus$ = this.sketchStatusSubject$.asObservable();

  private sketchStatusMessageSubject$ = new BehaviorSubject('');
  public sketchStatusMessage$ = this.sketchStatusMessageSubject$.asObservable();

  private isSideNavOpenSubject$ = new BehaviorSubject(false);
  public isSideNavOpen$ = this.isSideNavOpenSubject$.asObservable()
    .pipe(scan((current) => !current));

  private blocklyElementSubject$ = new BehaviorSubject<ElementRef<any>>(null);
  public blocklyElement$ = this.blocklyElementSubject$.asObservable();

  private workspaceStatusSubject$: BehaviorSubject<WorkspaceStatus> = new BehaviorSubject(WorkspaceStatus.Clean);
  public workspaceStatus$ = this.workspaceStatusSubject$.asObservable();

  private blocklyConfigSubject$ = new BehaviorSubject<any>({
    scrollbars: true,
    zoom: {
      controls: true,
      wheel: false,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    trashcan: true,
    move: {
      scrollbars: true,
      drag: true,
      wheel: true
    }
  });
  public blocklyConfig$ = this.blocklyConfigSubject$.asObservable();

  private toolboxXmlSubject$ = new BehaviorSubject(null);
  public toolboxXml$ = this.toolboxXmlSubject$.asObservable();

  public workspace$ = combineLatest(this.blocklyElement$, this.blocklyConfig$, this.toolboxXml$)
    .pipe(tap(() => "Creating workspace"))
    .pipe(filter(([element, config, toolbox]) => !!element && !!config && !!toolbox))
    .pipe(map(([element, config, toolbox]) => {
      config.toolbox = toolbox;
      return Blockly.inject(element, config);
    }));

  public workspaceXmlToSave$ = combineLatest(this.workspaceStatus$, this.workspace$)
    .pipe(filter(([status,]) => status === WorkspaceStatus.Saving))
    .pipe(map(([,workspace]) => {
      var xml = Blockly.Xml.workspaceToDom(workspace);
      var data = Blockly.Xml.domToPrettyText(xml);
      console.log(data);
      return data;
    }))


  public setCode(code: string): void {
    this.codeSubject$.next(code);
  }

  public setSketchStatus(status: SketchStatus) {
    this.sketchStatusSubject$.next(status);
  }

  public setSketchStatusMessage(message: string) {
    this.sketchStatusMessageSubject$.next(message);
  }

  public toggleIsSideNavOpen() {
    this.isSideNavOpenSubject$.next(true);
  }

  public setBlocklyElement(element: ElementRef<any>) {
    this.blocklyElementSubject$.next(element);
  }

  public setWorkspaceStatus(status: WorkspaceStatus) {
    this.workspaceStatusSubject$.next(status);
  }

  public setToolboxXml(toolboxXml: any) {
    this.toolboxXmlSubject$.next(toolboxXml);
  }
}
