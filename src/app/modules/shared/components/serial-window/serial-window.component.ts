import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Injector, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { DialogState } from 'src/app/state/dialog.state';
import { SerialOutputComponent } from '../serial-output/serial-output.component';

@Component({
  selector: 'app-serial-window',
  template: '',
  styleUrls: ['./serial-window.component.scss']
})
export class SerialWindowComponent implements OnInit {

  constructor(
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private dialogState: DialogState
  ) { }

  ngOnInit(): void {
    this.dialogState.isSerialOutputWindowOpen$
      .pipe(filter(isOpen => isOpen))
      .subscribe(() => this.openSerialMonitor());
  }

  openSerialMonitor(): void {
    console.log("Opening Portal window");
    // open a blank "target" window
    // or get the reference to the existing "target" window
    const windowInstance = window.open('', "Leaphy Easybloqs", '', true);
    // if the "target" window was just opened, change its url
    if (windowInstance.location.href === 'about:blank') {
      windowInstance.location.href = 'about:blank';
    }

    // Wait for window instance to be created
    setTimeout(() => {
      this.createCDKPortal(windowInstance);
    }, 1000);
  }

  styleSheetElement: any = null;

  createCDKPortal(windowInstance) {
    if (windowInstance) {
      // Clear popout modal content
      windowInstance.document.body.innerText = '';

      windowInstance.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles.scss"></head><body>');

      // create a PortalOutlet with the body of the new window document
      const outlet = new DomPortalOutlet(windowInstance.document.body, this.componentFactoryResolver, this.applicationRef, this.injector);

      // Create an injector with modal data
      const injector = Injector.create({ providers: [], parent: this.injector }) // ToDo: find out how to pass modal data in new way

      // Attach the portal
      windowInstance.document.title = 'Leaphy Easybloqs';
      const containerPortal = new ComponentPortal(SerialOutputComponent, null, injector);
      const containerRef: ComponentRef<SerialOutputComponent> = outlet.attach(containerPortal);

      // Copy styles from parent window
      document.querySelectorAll('style, link').forEach(htmlElement => {
        windowInstance.document.head.appendChild(htmlElement.cloneNode(true));
      });
    }
  }

  getStyleSheetElement() {
    const styleSheetElement = document.createElement('link');
    document.querySelectorAll('link').forEach(htmlElement => {
      if (htmlElement.rel === 'stylesheet') {
        const absoluteUrl = new URL(htmlElement.href).href;
        styleSheetElement.rel = 'stylesheet';
        styleSheetElement.href = absoluteUrl;
      }
    });
    console.log(styleSheetElement.sheet);
    return styleSheetElement;
  }
}
