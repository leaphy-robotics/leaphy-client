import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { SketchStatus } from '../domain/sketch.status';
import { scan, map, filter } from 'rxjs/operators';
import { WorkspaceStatus } from '../domain/workspace.status';

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
      startScale: 0.8,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    trashcan: true,
    move: {
      scrollbars: true,
      drag: true,
      wheel: true
    },
    renderer: 'zelos'
  });
  public blocklyConfig$ = this.blocklyConfigSubject$.asObservable();

  private toolboxXmlSubject$ = new BehaviorSubject(null);
  public toolboxXml$ = this.toolboxXmlSubject$.asObservable();

  private workspaceSubject$ = new BehaviorSubject<any>(null);
  public workspace$ = this.workspaceSubject$.asObservable();

  private workspaceXmlSubject$ = new BehaviorSubject(null);
  public workspaceXml$ = this.workspaceXmlSubject$.asObservable();

  private projectFilePathSubject$ = new BehaviorSubject<string>(null);
  public projectFilePath$ = this.projectFilePathSubject$.asObservable();

  public projectName$ = this.projectFilePath$
    .pipe(filter(filePath => !!filePath))
    .pipe(map(filePath => {
      const fileName = filePath.replace(/^.*[\\\/]/, '');
      return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    }));

  private undoSubject$ = new BehaviorSubject<boolean>(false);
  public undo$ = this.undoSubject$.asObservable();

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

  public setWorkspace(workspace: any) {
    this.workspaceSubject$.next(workspace);
  }

  public setWorkspaceXml(workspaceXml: any) {
    this.workspaceXmlSubject$.next(workspaceXml);
  }

  public setProjectFilePath(path: string) {
    this.projectFilePathSubject$.next(path);
  }

  public setUndo(redo: boolean){
    this.undoSubject$.next(redo);
  }
}
