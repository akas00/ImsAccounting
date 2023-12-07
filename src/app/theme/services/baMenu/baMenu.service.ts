import { AuthService } from '../../../common/services/permission/authService.service';
import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import * as _ from 'lodash';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { GlobalState } from '../../../global.state';


@Injectable()
export class BaMenuService {
  menuItems = new BehaviorSubject<any[]>([]);

  protected _currentMenuItem = {};
  showchangePasswordPopUp: boolean;
  userProfile: any = <any>{};
  userSetting: any;


  constructor(
    private _router: Router,
    private _authService: AuthService,
    private http: Http,
    private state: GlobalState
  ) {
    this.userProfile = _authService.getUserProfile();
    this.userSetting = _authService.getSetting();
   }

  /**
   * Updates the routes in the menu
   *
   * @param {Routes} routes Type compatible with app.menu.ts
   */
  public updateMenuByRoutes(routes: Routes) {
    let convertedRoutes = this.convertRoutesToMenus(_.cloneDeep(routes));
    this.menuItems.next(convertedRoutes);

  }

  public convertRoutesToMenus(routes: Routes): any[] {
    let items = this._convertArrayToItems(routes);
    return this._skipEmpty(items);
  }

  public getCurrentItem(): any {
    return this._currentMenuItem;
  }

  public selectMenuItem(menuItems: any[]): any[] {
    let items = [];

    menuItems.forEach((item) => {
      this._selectItem(item);

      if (item.selected) {
        this._currentMenuItem = item;
      }

      if (item.children && item.children.length > 0) {
        item.children = this.selectMenuItem(item.children);
      }
      // let user_profile = this._authService.getUserProfile();
      // if (user_profile.menuRights.filter(res => res.menu == item.route.path).length != 0) {
      //   items.push(item);
      // }
      items.push(item);
    });

    return items;

  }

  protected _skipEmpty(items: any[]): any[] {
    let menu = [];
    items.forEach((item) => {
      let menuItem;
      if (item.skip) {
        if (item.children && item.children.length > 0) {
          menuItem = item.children;
        }
      } else {
        menuItem = item;
      }

      if (menuItem) {
        menu.push(menuItem);
      }
    });

    return [].concat.apply([], menu);
  }

  protected _convertArrayToItems(routes: any[], parent?: any): any[] {
    let items = [];
    routes.forEach((route) => {
      items.push(this._convertObjectToItem(route, parent));
    });
    return items;
  }

  protected _convertObjectToItem(object, parent?: any): any {
    let item: any = {};
    if (object.data && object.data.menu) {
      // this is a menu object
      item = object.data.menu;
      item.route = object;
      delete item.route.data.menu;
    } else {
      item.route = object;
      item.skip = true;
    }

    // we have to collect all paths to correctly build the url then
    if (Array.isArray(item.route.path)) {
      item.route.paths = item.route.path;
    } else {
      item.route.paths = parent && parent.route && parent.route.paths ? parent.route.paths.slice(0) : ['/'];
      if (!!item.route.path) item.route.paths.push(item.route.path);
    }

    if (object.children && object.children.length > 0) {
      item.children = this._convertArrayToItems(object.children, item);
    }

    let prepared = this._prepareItem(item);

    // if current item is selected or expanded - then parent is expanded too
    if ((prepared.selected || prepared.expanded) && parent) {
      parent.expanded = true;
    }

    return prepared;
  }

  protected _prepareItem(object: any): any {
    if (!object.skip) {
      object.target = object.target || '';
      object.pathMatch = object.pathMatch || 'full';
      return this._selectItem(object);
    }

    return object;
  }

  protected _selectItem(object: any): any {
    object.selected = this._router.isActive(this._router.createUrlTree(object.route.paths), object.pathMatch === 'full');
    return object;
  }

  changePassword(paswordResetObj: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + '/changePassword/', paswordResetObj, this._authService.getRequestOption())
      .map(res => res.json())
      .subscribe(data => {
        if (data.status == 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        }
        else {
          returnSubject.next(data)
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
      );
    return returnSubject;
  }

  public get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";
    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    return apiUrl;
  }
  public getAllPhiscalYear() {
    let res = { status: 'error', result: '' };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getAllPhiscalYearList', this._authService.getRequestOption())
      .map(res => res.json()).subscribe(data => {
        if (data.status == 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe
        }
        else {
          returnSubject.next(data)
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }

  public updatePhiscalYear(NewPhiscalYear: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let re = /\//gi;
    NewPhiscalYear = NewPhiscalYear.replace(re, "ZZ");
    this.http.get(this.apiUrl + '/updatePhiscalYear/' + NewPhiscalYear, this._authService.getRequestOption())
      .map(res => res.json()).subscribe(data => {
        if (data.status == 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe;
        }
        else {
          returnSubject.next(data);
          returnSubject.unsubscribe;
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }
  public updateDivision(NewDivision: string,DivisionName : string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let re = /\//gi;
    this.http.get(this.apiUrl + '/updateDivision/' + NewDivision, this._authService.getRequestOption())
      .map(res => res.json()).subscribe(data => {
        if (data.status == 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe;

          var UserProfileObj = this._authService.getUserProfile();
          UserProfileObj.division = NewDivision;
          UserProfileObj.INITIAL = NewDivision;
          UserProfileObj.userDivision = NewDivision;
          UserProfileObj.CompanyInfo.INITIAL = NewDivision;
          UserProfileObj.CompanyInfo.DivisionName = DivisionName;
          this._authService.updateCache(UserProfileObj)

        }
        else {
          returnSubject.next(data);
          returnSubject.unsubscribe;
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }

  Relogin(username: string) {
    let arr = this.state.getGlobalSetting("apiUrl");


    let header = new Headers({ 'content-type': 'application/json' });
    let option = new RequestOptions({ headers: header })
    return this.http.post(this.apiUrl + '/Relogin', { username: username }, option)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let user = response.json();
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this._authService.setAuth(user)

          // //console.log(user);
          this.state.setGlobalSetting("LoggedIn", [true])
          //  //console.log(this.gblstate.getGlobalSetting("LoggedIn"))
          this.state.setGlobalSetting("userName", [username])
          this.state.setGlobalSetting("View-Permission", ['Divisions', 'smartTables', 'addDivision']);
          //  //console.log(this.gblstate.getGlobalSetting("View-Permission"))

          this._authService.setSessionVariable("LastProductChangeDateLocal", new Date('1990-01-01T00:00:00'));
          this._authService.setSessionVariable("LastProductStockCheckDateLocal", new Date('1990-01-01T00:00:00'));

        }
      });
  }

  public getList(data, url) {
    return this.http
      .post(this.apiUrl + url, data, this._authService.getRequestOption())
      .map(data => data.json())
      .share();
  }

  public saveBackupHistory(status: any, remarks: any) {
    let bodyData = { status: status, remarks: remarks };
    return this.http
      .post(this.apiUrl + "/saveBackupHistory", bodyData, this._authService.getRequestOption())
      .map(data => data.json())
      .share();
  }
  public getAllDivisions() {
    return this.http
      .get(this.apiUrl + "/getDivisionlist", this._authService.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  getDivisionForTrnPrivilege() {
    return this.http.get(this.apiUrl + "/getDivisionForTrnPrivilege", this._authService.getRequestOption()).map(data => data.json()).share()
  }
  updateDatabase() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/updateDatabaseNewSP`, this.getRequestOption())
      .subscribe(response => {
        let data = response.json();
        if (data.status == 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe();

        }
        else {
          returnSubject.next(data)
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
      );
    return returnSubject;
  }

  updateDatabaseNewQuery() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/updateDatabaseNewQuery`, this.getRequestOption())
      .subscribe(response => {
        let data = response.json();
        if (data.status == 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe();

        }
        else {
          returnSubject.next(data)
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
      );
    return returnSubject;
  }
  public getRequestOption() {
    let headers: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: this._authService.getAuth().token
    });
    return new RequestOptions({ headers: headers });
  }
}
