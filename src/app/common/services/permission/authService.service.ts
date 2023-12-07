import { Injectable, OnInit, OnDestroy } from '@angular/core'
import { CACHE_CONSTANT, CacheService } from "./cacheService.service";
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/subscription';
import { CookieService } from 'angular2-cookie/core';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
import { session } from 'electron';

@Injectable()
export class AuthService implements OnInit, OnDestroy {
  cache_constant: CACHE_CONSTANT = <CACHE_CONSTANT>{};
  private _subscriptions: Array<Subscription> = [];
  public showfiscalPopup:boolean = false;
  constructor(private cacheService: CacheService, private _cookieService: CookieService) {

  }
  ngOnInit() {

  }

  isAuthorized(routeInstruction: any) {
    let profile = this.getUserProfile();
    return this.isAuthenticated(profile);
  }
  removeAuth(): void {
    this.cacheService.remove('USER_PROFILE');
    this.cacheService.remove('TOKEN');

  }
  isAuthenticated(profile: any) {
    return !!profile;
  }
  setAuth(auth: any) {
    this.cacheService.set('USER_PROFILE', auth.profile);
    this.cacheService.set('TOKEN', auth.token);
    // if(auth.setting==null){auth.setting=<any>{};}
    this.cacheService.set('setting', auth.setting);
  }
updateCache(auth:any){
  this.cacheService.remove('USER_PROFILE');
  this.cacheService.set('USER_PROFILE',auth)
  sessionStorage.clear();
  this.getPhiscalInfo();
}
  setSessionVariable(key: string, value: any) {
    if (this.cacheService.exist(key))
      this.cacheService.remove(key);
    this.cacheService.set(key, value);

  }

  getSessionVariable(key: string) {
    if (!this.cacheService.exist(key)) {
      return null;
    }
    let sessionVariable = this.cacheService.get(key);
    return sessionVariable;
  }
  removeSessionVariable(key: string) {
    this.cacheService.remove(key);
  }

  getAuth(): any {
    let auth: any = {
      profile: this.cacheService.get('USER_PROFILE'),
      token: this.cacheService.get('TOKEN'),

    };
    return auth;
  }

  getCurrentCompanyId(): any {
    let compnyId = 0;
    var profile = this.cacheService.get('USER_PROFILE');
    if (profile) {
      compnyId = profile.CompanyInfo.COMPANYID ? profile.CompanyInfo.COMPANYID : 0;
    }
    return compnyId;
  }


  getUserProfile(): any {
    if (!this.cacheService.exist('USER_PROFILE')) {
      return null;
    }
    let userProfile = this.cacheService.get('USER_PROFILE');
    return userProfile;
  }

  checkUserRight(right: string) {
    let user_profile: any = this.getUserProfile();
    let user_rights: any;
    var result: any[];
    if (user_profile) {
      user_rights = user_profile.userRights;
      if (user_rights) {
        result = user_rights[right]
      }
    }
    return result;
  }

  ///function for canactivate menu
  public getMenuRight(menu: string, right: string): any {
    var result = { list: false, right: false };
    if (menu == "") return result;
    let user_profile: any = this.getUserProfile();
    let menu_rights: any[] = [];

    var list: boolean = false;
    var mRight: boolean = false;
    if (user_profile) {
      menu_rights = user_profile.menuRights;
      if (menu_rights) {
        for (var m in menu_rights) {
          if (menu_rights[m].menu == menu) {
            if (menu_rights[m].right.length > 0) {  list = true; }
            for (var r in menu_rights[m].right) {
              if (menu_rights[m].right[r] == right) {
                this.canActive = true;
                mRight = true

              }
            }
          }
        }
      }
    }
    result = { list: list, right: mRight };
    return result;
  }

  public canActive: boolean = false;
  checkMenuRight(menu: string, right: string) {
    let user_profile: any = this.getUserProfile();
    let menu_rights: any[] = [];
    var result = false;
    if (user_profile) {
      menu_rights = user_profile.menuRights;
      if (menu_rights) {
        for (var m in menu_rights) {
          if (menu_rights[m].menu == menu) {
            for (var r in menu_rights[m].right) {
              if (menu_rights[m].right[r] == right) {
                this.canActive = result;
                result = true;
              }
            }
          }
        }
      }
    }
    return result;
  }
  public getMenuRight_DivWise(menu: string, right: string): any {
    var result = { list: false, right: false };
    if (menu == "") return result;
    let user_profile: any = this.getUserProfile();
    let menu_rights: any[] = [];

    var list: boolean = false;
    var mRight: boolean = false;
    if (user_profile) {
      menu_rights = user_profile.menuRights_DivWise;
      if (menu_rights) {
        for (var m in menu_rights) {
          if (menu_rights[m].menu == menu) {
            if (menu_rights[m].right.length > 0) {  list = true; }
            for (var r in menu_rights[m].right) {
              if (menu_rights[m].right[r] == right) {
                this.canActive = true;
                mRight = true

              }
            }
          }
        }
      }
    }
    result = { list: list, right: mRight };
    return result;
  }

  checkMenuRight_DivWise(menu: string, right: string) {
    let user_profile: any = this.getUserProfile();
    let menu_rights: any[] = [];
    var result = false;
    if (user_profile) {
      menu_rights = user_profile.menuRights_DivWise;
      if (menu_rights) {
        for (var m in menu_rights) {
          if (menu_rights[m].menu == menu) {
            for (var r in menu_rights[m].right) {
              if (menu_rights[m].right[r] == right) {
                this.canActive = result;
                result = true;
              }
            }
          }
        }
      }
    }
    return result;
  }
  getSetting() {
    if (!this.cacheService.exist('setting')) {
      return undefined;
    }
    let setting = this.cacheService.get('setting');
    return setting;
  }

  getCookie() {
    var cookie = this._cookieService.get("imsposcookie");

    var j
    if (!cookie) {

      return undefined
    }

    return JSON.parse(cookie);

  }
  getRequestOption() {
    let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.getAuth().token })
    return new RequestOptions({ headers: headers });
  }
  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
  PhiscalObj:any=<any>{};
  userProfile: any = <any>{};
  getPhiscalInfo(){
    
    this.userProfile = this.getUserProfile();
    if(!this.userProfile) return;
    if(!this.userProfile.CompanyInfo)return;
    this.PhiscalObj.tabID = sessionStorage.tabID ? sessionStorage.tabID : sessionStorage.tabID = Math.random();
    this.PhiscalObj.PhiscalID =  sessionStorage.PhiscalID ? sessionStorage.PhiscalID : sessionStorage.PhiscalID =this.userProfile.CompanyInfo.PhiscalID;
    this.PhiscalObj.BeginDate = sessionStorage.BeginDate ? sessionStorage.BeginDate : sessionStorage.BeginDate =this.userProfile.CompanyInfo.FBDATE;
    this.PhiscalObj.EndDate = sessionStorage.EndDate ? sessionStorage.EndDate : sessionStorage.EndDate =this.userProfile.CompanyInfo.FEDATE;
    this.PhiscalObj.PhiscalName = sessionStorage.PhiscalName ? sessionStorage.PhiscalName : sessionStorage.PhiscalName =this.userProfile.CompanyInfo.PHISCALNAME;
    this.PhiscalObj.Token = sessionStorage.Token ? sessionStorage.Token : sessionStorage.Token =this.getAuth().token;
    this.PhiscalObj.Div = sessionStorage.Div ? sessionStorage.Div : sessionStorage.Div =this.userProfile.CompanyInfo.INITIAL;
    this.PhiscalObj.DivisionName = sessionStorage.DivisionName ? sessionStorage.DivisionName : sessionStorage.DivisionName =this.userProfile.CompanyInfo.DivisionName;
    this.PhiscalObj.setting = sessionStorage.setting ? sessionStorage.setting : sessionStorage.setting = this.getSetting();
    this.PhiscalObj.USER_PROFILE = sessionStorage.USER_PROFILE ? sessionStorage.USER_PROFILE : sessionStorage.USER_PROFILE = this.getUserProfile()
    
    return this.PhiscalObj;
  }

 
}
