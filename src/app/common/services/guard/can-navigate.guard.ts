import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PreventNavigationService } from '../navigation-perventor/navigation-perventor.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor( 
    private prevent : PreventNavigationService 
    ) {}

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first    
      if(this.prevent.getCurrentPreventStatus()){
        var result = confirm('You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?')
        if (result) {
           this.prevent.preventNavigation(false);
           return true;
        }else return false;
      }else return true;
  }
}