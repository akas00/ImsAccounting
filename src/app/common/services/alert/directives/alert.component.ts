import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { AlertService } from "../alert.service";
import { ModalDirective } from "ng2-bootstrap";

@Component({
  selector: "alert",
  templateUrl: "alert.component.html"
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private showHideSubscription: Subscription;
  @ViewChild("alertModeal") alertModeal: ModalDirective;

  private message: any;

  displayMessage: string = "";
  displayHeading: string = "";
  displayLink: string = "";

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      if (message) {
        this.message = message;
        switch (message.type) {
          case "success": {
            //statements;
            this.displayHeading = "Success !!!";
            break;
          }
          case "error": {
            //statements;
            this.displayHeading = "Error !!!";
            break;
          }
          case "warning": {
            //statements;
            this.displayHeading = "Warning !!!";
            break;
          }
          case "info": {
            //statements;
            this.displayHeading = "Information !!!";
            break;
          }
          default: {
            //statements;
            break;
          }
        }
        this.displayMessage = message.text;
        this.displayLink= message.link;
        if (this.alertService.autoDisplay) this.show();
      }
    });

    this.showHideSubscription = this.alertService
      .getShowHide()
      .subscribe(isShow => {
        if (isShow) this.show();
        else this.hide();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.showHideSubscription.unsubscribe();
  }

  show() {
    this.alertModeal.show();
    if (this.alertService.autoDisplay) {
      setTimeout(() => {
        this.alertModeal.hide();
      }, 3000);
    }
  }

  hide() {
    this.close();
  }

  private close() {
    try {
      this.alertModeal.hide();
      this.alertService.autoDisplay = true;
      this.alertService.emitShowHideSubject.next();
    } catch (ex) {
    }
  }
}
