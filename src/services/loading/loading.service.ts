import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { LoadingComponent } from '../../app/components/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCount = 0;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  get isLoading$() {
    return this.loadingSubject.asObservable();
  }

  show(message: string = 'Loading...', size: 'small' | 'medium' | 'large' = 'medium') {
    this.loadingCount++;
    this.loadingSubject.next(true);

    // Create and show loading component
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingComponent);
    const componentRef = componentFactory.create(this.injector);

    componentRef.instance.message = message;
    componentRef.instance.fullScreen = true;
    componentRef.instance.size = size;

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  hide() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    this.loadingSubject.next(this.loadingCount > 0);

    // Remove all loading components from the DOM
    const loadingElements = document.querySelectorAll('app-loading');
    loadingElements.forEach(element => element.remove());
  }

  // Helper method for API calls
  showLoadingForApiCall() {
    this.show('Loading data...', 'medium');
  }

  hideLoadingForApiCall() {
    this.hide();
  }
}
