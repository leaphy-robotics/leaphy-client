import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { AfterViewInit, ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Injector, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { DialogState } from 'src/app/state/dialog.state';
import { SerialOutputComponent } from '../serial-output/serial-output.component';

@Component({
  selector: 'app-serial-window',
  template: '',
  styleUrls: ['./serial-window.component.scss']
})
export class SerialWindowComponent implements AfterViewInit {

  constructor(
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private dialogState: DialogState,
    private logger: LogService
  ) { }

  ngAfterViewInit(): void {
    this.openSerialMonitor();
  }

  openSerialMonitor(): void {
    // open a blank "target" window
    // or get the reference to the existing "target" window
    const windowInstance = window.open('', "Leaphy Easybloqs", '');

    // This timeout is needed to make sure the window is ready and visible before loading
    // in the component. Otherwise the view of the component might not load properly
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

      windowInstance.onbeforeunload = () => {
        this.dialogState.setIsSerialOutputWindowOpen(false);
      }

      windowInstance.addEventListener('blur', () => {
        this.dialogState.setIsSerialOutputFocus(false);
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
    return styleSheetElement;
  }
}
