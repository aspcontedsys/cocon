import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EventEmitter } from '@angular/core';
import { NotificationComponent } from '../../app/components/notification/notification.component';

interface NotificationRef {
  instance: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration: number;
    onClose: EventEmitter<void>;
  };
  hostView: any;
  destroy: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationId = 0;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  showNotification(
    message: string|null,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration: number = 3000
  ) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NotificationComponent);
    const componentRef = componentFactory.create(this.injector) as NotificationRef;

    componentRef.instance.message = message || 'Please Contact Administrator';
    componentRef.instance.type = type;
    componentRef.instance.duration = duration;

    componentRef.instance.onClose.subscribe(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }
}
