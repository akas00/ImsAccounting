import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { of } from "rxjs/observable/of";

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  private showHideSubject = new Subject<boolean>();
  private keepAfterNavigationChange = false;
  public autoDisplay: boolean = true;

  public emitShowHideSubject = new Subject<boolean>(); 

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  success(message: string, autoDisplay = true) {
    return new Promise<void>((resolve, reject) => {
      this.autoDisplay = autoDisplay;
      this.subject.next({ type: "success", text: message });
      resolve();
    }); 
  }

  error(message: string, autoDisplay = false) {
    return new Promise<void>((resolve, reject) => {
      this.autoDisplay = autoDisplay; 
      this.subject.next({ type: "error", text: message });
      this.show();
      resolve();
    }); 
  }

  warning(message: string, autoDisplay = false) {
    return new Promise<void>((resolve, reject) => {
      this.autoDisplay = autoDisplay;
      this.subject.next({ type: "warning", text: message });
      this.show()
      resolve();
    });
  }

  info(message: string, autoDisplay = false) {
    return new Promise<void>((resolve, reject) => {
      this.autoDisplay = autoDisplay;
      this.subject.next({ type: "Information Alert", text: message });
      this.show();
      resolve();
    });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  getShowHide(): Observable<boolean> {
    return this.showHideSubject.asObservable();
  }

  show() {
    this.showHideSubject.next(true);
  }

  hide() {
    this.showHideSubject.next(false);
  }
  license(message: string, link: string = '',autoDisplay = false) {
    return new Promise<void>((resolve, reject) => {
      this.autoDisplay = autoDisplay;
      this.subject.next({ type: "license", text: message, link: link });
      this.show();
      resolve();
    });
  }
}
