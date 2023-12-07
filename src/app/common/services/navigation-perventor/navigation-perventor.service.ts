import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";

@Injectable()
export class PreventNavigationService { 
  private preventToNavigate : boolean = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        //this.preventToNavigate = false;
      }
    }); 
  }
  
  getCurrentPreventStatus() : boolean {
    return this.preventToNavigate;
  }

  preventNavigation(isNavigationPrevent : boolean = true){
    this.preventToNavigate = isNavigationPrevent;
  } 
}