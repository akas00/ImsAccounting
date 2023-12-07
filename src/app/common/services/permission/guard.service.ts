import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "./authService.service";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Permissions } from './permission.service';
import { UserToken } from './userToken.service';
import { GlobalState } from '../../../global.state';
import { MasterRepo } from "../../repositories/index";
import { MdDialog, MdDialogRef } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MessageDialog } from "../../../pages/modaldialogs/messageDialog/messageDialog.component";

@Injectable()
export class CanActivateTeam implements CanActivate {
  viewPermission: Array<string> = [];

  constructor(
    private permission: Permissions,
    private userToken: UserToken,
    private gblstate: GlobalState,
    private _authService: AuthService,
    private masterService: MasterRepo,
    private router: Router,
    public dialog: MdDialog
  ) {
    this.viewPermission = gblstate.getGlobalSetting("View-Permission") || [];
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    return true;

    var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("")
    var message$: Observable<string> = messageSubject.asObservable();
    var LoggedIn = this._authService.getAuth()
    if (!(LoggedIn && LoggedIn.profile)) {
      messageSubject.next("You are not logged In . Please login in");
      var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
      setTimeout(() => {
        dialogref.close();

      }, 2000);
      return false;
    }
    else {
      var sub = this.masterService.checkUserValid().subscribe(res => {
        if (res == false) {
          messageSubject.next("Invalid User");
          var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
          setTimeout(() => {
            dialogref.close();
            return false;
          }, 2000);
          return false;
        }
      })
    }
    let viewToOpen = route.routeConfig.path;
    var path: string = route.url[0].path;

    if ((LoggedIn && LoggedIn.profile) && path == 'dashboard') {
      return true;
    }

    // if(route.params[]) {}
    if (route.params["vt"] != null && route.params["vt"] == 18) {
      path = "incomevoucher";
    } else if (route.params["vt"] != null && route.params["vt"] == 17) {
      path = "expensesvoucher";
    } else if (route.params["vt"] != null && route.params["vt"] == 15) {
      path = "creditnote";
    } else if (route.params["vt"] != null && route.params["vt"] == 16) {
      path = "debitnote";
    } else if (route.params["pf"] != null && route.params["pf"] == "DN") {
      path = "debitnoteitembase";
    } else if (route.params["pf"] != null && route.params["pf"] == "CN") {
      path = "creditnoteitembase";
    } else {
      path = route.url[0].path
    }

    // path = route.url[0].path;
    var right: string = route.params["mode"];
    if (right == undefined) right = "list";
    var result = this._authService.getMenuRight(path, right)

    if (!path) {
      if (result.list == true) {
        return true;
      }
    }
    else {
      if (result.right == true) {
        return true;
      }
      else {
        if (right == 'list') {
          if (result.list == true) {
            return true;
          }

        }
      }
    }
    messageSubject.next("You are not authorize for this operation");
    var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
    setTimeout(() => {
      dialogref.close();
      return false;
    }, 2000);
  }
}
