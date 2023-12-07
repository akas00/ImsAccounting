import { Component, OnInit, OnDestroy, ViewChild, HostListener } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { AlertService } from "../alert.service";
import { ModalDirective } from "ng2-bootstrap";
import { ComponentCanDeactivate } from "../../guard/can-navigate.guard";
import { PreventNavigationService } from "../navigation-perventor.service";

@Component({
  selector: "navigation-preventor",
  templateUrl: "navigation-preventor.component.html"
})
export class NavigationPreventorComponent implements OnInit, OnDestroy, ComponentCanDeactivate  {
  constructor(private prevent: PreventNavigationService) {}

  ngOnInit() {}
 
  @HostListener("window:beforeunload")
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    return this.prevent.getCurrentPreventStatus();
  }

  ngOnDestroy() {}
}
