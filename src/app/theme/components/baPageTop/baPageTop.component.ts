import { Component, OnInit, OnDestroy, Inject, HostListener, SimpleChanges } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { Router, NavigationEnd, Routes } from "@angular/router";
import 'style-loader!./baPageTop.scss';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { BaMenuService } from '../../services/baMenu/baMenu.service';
import { DOCUMENT } from '@angular/platform-browser';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { AlertService } from '../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AuthService } from '../../../common/services/permission/authService.service';
import { session } from 'electron';
import { MdDialog } from '@angular/material';
import { MessageDialog } from '../../../pages/modaldialogs/messageDialog/messageDialog.component';
import { Division } from '../../../common/interfaces';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PAGES_MENU } from '../../../pages/pages.menu';
import _ from 'lodash';
import { Location } from '@angular/common';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
})
export class BaPageTop implements OnInit, OnDestroy {
  public sidebarShow: boolean = false;
  public dropdownShow: boolean = true;
  public activePageTitle: string = '';
  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = true;
  public userData = {
    username: "",
    password: "",
    newPassword: ""
  }
  //for menu top
  public menuItems: any[];
  public selectedMenuItems: any[];
  protected _menuItemsSub: Subscription;
  protected _onRouteChange: Subscription;

  ORGANIZATION_INFO: any = <any>{};
  ORG_TYPE: string = "";
  public icon = '../../../assets/img/HamroSDS.png';
  orgEnum: number;
  APPTYPE: number;
  userProfile: any = <any>{};
  PhiscalObj: any = <any>{};
  private divisionList = []
  division: Division[] = [];
  userdivisionList: Division[] = [];
  userSetting: any;

    /*for menu search suggestions starts*/
  public options = [];
  menuList: any;
  public labelKey: string='name';
  public valueKey: string='path';
  public align: string='down';
  public default: string='Search Here...';
  value: any;
  public expand = false;
  public suggestions = [];
  public selectedIndex = 0;
  public filterForm: FormGroup;
  onChange: any = () => { };
  urlPath: any;
  public activeurlpath: string;

  clickedInside($event: Event) {
      $event.preventDefault();
      $event.stopPropagation();
  }

  @HostListener('document:click', ['$event']) clickedOutside($event) {
      this.expand = false
  }

  public search = new FormControl();
  public filter = new FormControl();
    /*for menu search suggestions ends*/

  constructor(
    private _state: GlobalState,
    private router: Router,
    private _service: BaMenuService,
    authservice: AuthService,
    private spinnerService: SpinnerService,
    public dialog: MdDialog,
    public location: Location,
    private _fb: FormBuilder,
    public alertService:AlertService
  ) {
    this.userProfile = authservice.getUserProfile();
    this.PhiscalObj = authservice.getPhiscalInfo();
    this.userSetting = authservice.getSetting();
    this.FYLIST.push(this.userProfile.CompanyInfo);
    this.FY = this.FYLIST[0].PhiscalID;
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this._state.subscribe('menu.activeLink', (activeLink) => {
      if (activeLink) {
        this.activePageTitle = activeLink.title;
      }
    });
    
    // this._service.getAllDivisions().subscribe(res => {
    //   //console.log('result',res);
    //   this.divisionList.push(<Division>res);
    //   //console.log('div',this.divisionList);
    //   this.userdivisionList.push(<Division>res);

    // });


    if (localStorage.getItem("USER_PROFILE")) {
      this.ORGANIZATION_INFO = JSON.parse(localStorage.getItem("USER_PROFILE"))
      this.ORG_TYPE = this.ORGANIZATION_INFO.CompanyInfo ? this.ORGANIZATION_INFO.CompanyInfo.ORG_TYPE : "";
      this.menuRights = this.ORGANIZATION_INFO.menuRights == null ? [] : this.ORGANIZATION_INFO.menuRights;
      // ////console.log("CheckMenuright",this.menuRights)
      if (this.ORG_TYPE == 'central') { this.orgEnum = 1 }
      else if (this.ORG_TYPE == 'superdistributor') { this.orgEnum = 2 }
      else if (this.ORG_TYPE == 'distributor') { this.orgEnum = 3 }
      else if (this.ORG_TYPE == 'retailer') { this.orgEnum = 4 }
      // this.DefaultMenus=this.ORGANIZATION_INFO.defaultAssignedMenus;
    }
    if (localStorage.getItem("setting")) {
      // this.APPTYPE= JSON.parse(localStorage.getItem("setting")).APPTYPE;

    }
    /*for menu search suggestions starts*/
    this.getPathForGlblSearch();
    this.filterForm = this._fb.group({
      filter: this.filter
  })
  this.suggestions = this.options;
  this.urlPath = this.location.path().split("/").pop();
    /*for menu search suggestions ends*/

  }

  public ngOnInit(): void {
    this._onRouteChange = this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        if (this.menuItems) {
          this.selectMenuAndNotify();
        } else {
          // on page load we have to wait as event is fired before menu elements are prepared
          setTimeout(() => this.selectMenuAndNotify());
        }
      }
    });

    this._menuItemsSub = this._service.menuItems.subscribe(this.updateMenu.bind(this));

    /*for menu search suggestions starts*/
    if(this.valueKey){
      if (typeof this.valueKey !== "string") {
          throw Error("valueKey must be a string type.");
      }
      if (typeof this.labelKey !== "string") {
          throw Error("labelKey must be a string type.");
      }
      if (this.valueKey === "") {
          throw Error("Please provide a valid valueKey.");
      }
      if (this.labelKey === "") {
          throw Error("Please provide a valid labelKey.");
      }
      this.search.valueChanges.subscribe((res) => {
          this.suggestions = [];
          for (let i in this.options) {
              if (this.options[i][this.valueKey].toUpperCase().replace("-", " ")
                  .includes(this.search.value.toUpperCase()) || this.options[i][this.labelKey].toUpperCase().replace("-", " ")
                      .includes(this.search.value.toUpperCase())) {
                  this.suggestions.push(this.options[i])
              }
          }
      })

      if (!this.suggestions.length) {
          this.suggestions = this.options;
      }   
  }
    /*for menu search suggestions ends*/

  }

  setSelectedMenu(menuItem) {
    this.selectedMenuItems = menuItem
    // //console.log("imserp",this.selectedMenuItems);
    this.router.navigate(["/pages/dashboard/dashboard"]);

  }
  logoClickEvent() {
    // this.selectedMenuItems = this.menuItems.filter(x => x.title == "IMSPOS")[0];
    this.router.navigate(["/pages/dashboard/dashboard"]);

  }
  public selectMenuAndNotify(): void {
    if (this.menuItems) {
      this.menuItems = this._service.selectMenuItem(this.menuItems);
      this._state.notifyDataChanged('menu.activeLink', this._service.getCurrentItem());
    }
  }

  public hoverItem($event): void {

  }

  public toggleSubMenu($event): boolean {
    let submenu = jQuery($event.currentTarget).next();
    $event.item.expanded = !$event.item.expanded;
    return false;
  }

  public ngOnDestroy(): void {
    this._onRouteChange.unsubscribe();
    this._menuItemsSub.unsubscribe();
  }

  public updateMenu(newMenuItems) {
    this.selectedMenuItems = newMenuItems.length ? newMenuItems[0] : null;
    this.menuItems = newMenuItems;
    // this.selectMenuAndNotify();
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  onHoverItem() {

  }
  menuRights: any[] = [];
  getMenuRight(menuname: string): boolean {
    let right = false;
    let men = this.menuRights.filter(x => x.menu == menuname)[0];

    if (men != null) {
      right = men.right.indexOf('view') > -1;
    }
    if (menuname == "") {
      right = true;
    }
    return right;
  }
  isShowPageMenu(menuItem: any): boolean {
    let res: boolean = false;


    if (menuItem.route) {
      if (menuItem.route.menuType) {
        // ////console.log("reachedMenbu")
        if (menuItem.route.menuType.filter(x => x == 0 || x == this.orgEnum)[0] != null && this.getMenuRight(menuItem.route.path)) return true;
      }
      else {
        return true;
      }
    }
    else if (menuItem.children) {
      let childrens = menuItem.children.filter(x => x.route.menuType.filter(y => y == 0 || y == this.orgEnum));
      if (childrens.length == menuItem.children.length) {
        return false;
      }
      return true;


    }
    else {
      return true;
    }
    return res;
  }

  // isShowPageMenu(menuItem: any): boolean {
  //   if (this.ORG_TYPE == 'central') {
  //     return true;
  //   }
  //   else {
  //     if (menuItem.route && menuItem.route.isOnlyCentral) {
  //       return false;
  //     }
  //     else if (menuItem.children) {
  //       let childrens = menuItem.children.filter(x => x.route.isOnlyCentral);
  //       if (childrens.length == menuItem.children.length) {
  //         return false;
  //       }
  //       return true;
  //     }
  //     else {
  //       if (this.ORGANIZATION_INFO != null) {
  //         if (this.ORGANIZATION_INFO.CompanyInfo != null) {
  //           if (this.ORGANIZATION_INFO.CompanyInfo.ORG_TYPE == "retailer") {
  //             if (menuItem.route.path == "loadchart") {
  //               return false;
  //             }
  //           }
  //         }
  //       }

  //       return true;
  //     }
  //   }
  //   // return false;
  // }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
  public logout() {

    if (confirm('Are you sure to log out?')) {
      this.router.navigate(["login", { logout: 'logout' }]);
    }
  }

  // public forgetPassword: boolean = false
  changePassword(value) {

    this._service.showchangePasswordPopUp=true;
    this.userData.password = "";
  }

  onClickUpdatePassword() {
    ////console.log("value",this.passwordResetObj);
    if(this.userData.newPassword==""||this.userData.newPassword==null){
      this.alertService.error("New Password cannot be null");
      return;
    }
    let updateObj = { data:this.userData };
    this._service.showchangePasswordPopUp = false;
    this.spinnerService.show('Please wait... Updating Password!!');
    try {
        this._service.changePassword(updateObj).subscribe(
          data => {
            if (data.status == "ok") {
              this.spinnerService.hide();
              this.alertService.success("Password updated successfully");
               this.userData.newPassword = "";
               this.userData.password = "";
               this.userData.username = "";
               this.router.navigate(["/login"]);
            }else{
              this.spinnerService.hide();
              this.alertService.error("Error in updating password!!");
            }
          },
        );
    } catch (ex) {
      alert(ex);
    }
  }

  onClickCancelPassword(){
    this._service.showchangePasswordPopUp = false;
  }

  public downloadPrintService() {
    if (confirm('Are you sure to configure printer?')) {
      document.location.href = 'http://www.imsnepal.com:1060/PrintSetup.exe';
    }
  }
  showFiscalYearPopUp: boolean = false;
  showDivisionPopUp: boolean = false;
  PhiscalYearList: any[] = [];
  NewPhiscalYear: string;
  NewDivision: string;
  FYClose: string;
  FY: string; FYLIST: any[] = [];
  ChangeFY(value) {
    //console.log("Checkvalyue", this.activePageTitle)
    if (this.activePageTitle != "Dashboard") { alert("please goto Dashboard for FISCAL YEAR change!"); return; }
    if (value == 'changeFY') {
      this._service.getAllPhiscalYear().subscribe(res => {
        if (res.status == 'ok') {
          this.PhiscalYearList = res.result.result;
          this.NewPhiscalYear = this.PhiscalYearList[0].PhiscalID;
          this.checkBookClose(this.PhiscalYearList[0].FYClose);
        }
      }

      )
      this.showFiscalYearPopUp = true;
    }
  }
  ClickDivPopup(value) {
    //console.log("Checkvalyue", this.activePageTitle)
    if (this.activePageTitle != "Dashboard") { alert("please goto Dashboard for Division change!"); return; }
    if (value == 'changeDiv') {
      this.division = [];
      if (this.userSetting.userwisedivision == 1) {
        this._service.getDivisionForTrnPrivilege().subscribe(res => {
          // //console.log('res',res);
          if (res.status == 'ok') {
            this.division = res.result;
            // //console.log("div",this.division);
          }
        })
      }
      else {
        this._service.getAllDivisions()
          .subscribe(res => {
            //////console.log("div" + JSON.stringify(res));
            this.division.push(<Division>res);

          }, error => {

          });
      }
      this.showDivisionPopUp = true;
    }
  }
  divisionChanged() {



  }
  checkBookClose(value) {
    this.FYClose = value == 0 ? "No" : "Yes";
  }
  onClickChangeFY() {
    this._service.updatePhiscalYear(this.NewPhiscalYear).subscribe(res => {
      if (res.status == 'ok') {
        this.showFiscalYearPopUp = false;



        this._service.Relogin(this.userProfile.username)
          .subscribe(
            data => {
              sessionStorage.clear()
              window.location.reload();
            },


          )


      }
    })
  }
  onClickChangeDivision() {
    var divName: string;
    var DivObj = this.division.filter(x => x.INITIAL == this.NewDivision);
    divName = DivObj[0].NAME;
    this._service.updateDivision(this.NewDivision, divName).subscribe(res => {
      if (res.status == 'ok') {
        this.showDivisionPopUp = false;
        alert("Division Changed sucesfully")
      }
    })
  }
  onClickCancelFY() {
    this.showFiscalYearPopUp = false;
    this.FY = this.FYLIST[0].PhiscalID;
  }
  onClickCancelDiv() {
    this.showDivisionPopUp = false;

  }
  changeFY(value) {
    for (let i of this.PhiscalYearList) {
      if (i.PhiscalID == value) {
        this.checkBookClose(i.FYClose);
      }
    }

  }

  TakeBackup() {

    if(this._service.userSetting.DISPLAY == 1 || this._service.userSetting.DONOT_TAKE_DB_BACKUP == 1 ){
      this.logout();
    } else{
      var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Backing up data Please wait a moment...");
    var message$: Observable<string> = messageSubject.asObservable();
    let childDialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
    this._service.getList(null, '/backup').subscribe(ret => {
      if (ret.status = 'ok') {
        messageSubject.next("Database backup successful.");
        this.logout();
        setTimeout(() => {
          childDialogRef.close();
        }, 2000)
      }
    }, error => {
      childDialogRef.close();
      this.logout();
      alert(error);
    }
    )

    }


  }

  SaveBackupStatus(status, remarks) {
    this._service.saveBackupHistory(status, remarks).subscribe(res => {
    });
  }

    /*for menu search suggestions starts*/

  getPathForGlblSearch() {
    this.menuList = PAGES_MENU;
    let convertedMenuObject: Routes = _.cloneDeep(<Routes>this.menuList)[0].children;
    this.options = [];

    convertedMenuObject.forEach(child => {
      child.children.forEach(children => {
        if (children.hasOwnProperty("children")) {
          children.children.forEach(subchildren => {
        if(this.checkMenuWiseSetting(subchildren.path)){          
          this.options.push({
            name: subchildren.data.menu.title,
            path: (`${child.path}/${children.path}/${subchildren.path}`).replace("//", "/")
          })
        }
          })
        } else {
          if(this.checkMenuWiseSetting(children.path)){
            this.options.push({
              name: children.data.menu.title,
              path: (`${child.path}/${children.path}`).replace("//", "/")
            })
          }
        }
      })
    });
  }

  checkMenuWiseSetting(menuPath: string): boolean{
    let menuDependency = this.ORGANIZATION_INFO.menuRights.find(x=>x.menu == menuPath);
    if(menuDependency){
      return true;
    }
  return false;
}

ngOnChanges(changes: SimpleChanges){
  if(changes.options){
      this.suggestions = this.options;
  }
}

registerOnChange = (_fn: any): void => {

  this.onChange = _fn;
}

// registerOnTouched = (_fn: any): void => {
//   this.onTouch = _fn;
// }

keyUp = (): void => {
  if (this.selectedIndex > 0) {
      this.selectedIndex--;
      return;
  }

}

keyDown = (): void => {
  if (this.selectedIndex < this.suggestions.length - 1) {
      this.selectedIndex++;
      return;
  }

}


filterWord = (res: any): void => {
  if (res === "") {
      this.suggestions = this.options;
      this.expand = true;
      this.selectedIndex = 0;
      return;
  }
  this.suggestions = [];
  for (let i in this.options) {
      if (this.options[i][this.valueKey].toUpperCase().replace("-", " ")
          .includes(res.toUpperCase()) || this.options[i][this.labelKey].toUpperCase().replace("-", " ")
              .includes(res.toUpperCase())) {
          this.suggestions.push(this.options[i])
      }
  }

  if(this.urlPath!='stock-summary-report' && this.urlPath!='stock-ledger-report' && this.urlPath!='openingstock-report' && this.urlPath!='stock-abcanalysis-report' && this.urlPath!='purchasereport-itemwise' && this.urlPath!='salesreport-itemwise' && !this.suggestions.length){
      this.search.setValue("");
  }
}

setSearch = (value: any): void => {
  this.search.setValue(value[this.labelKey]);
  this.filterForm.controls['filter'].setValue(value[this.valueKey]);
  this.propagateChange(value[this.valueKey]);
  this.router.navigate([`./pages/${value[this.valueKey]}`]);
}

setSearchKeyword = (): void => {
  let label = this.suggestions[this.selectedIndex][this.labelKey];
  let value = this.suggestions[this.selectedIndex][this.valueKey];
  this.search.setValue(label);
  this.filterForm.controls['filter'].setValue(value);
  this.propagateChange(value);
  let obj = this.options.find((x:any) => x.MCODE == value);
}


propagateChange = (value: any) => {
  this.onChange(value);
  this.expand = false;
  this.selectedIndex = 0;
  if (document.getElementById("ngx-simple-suggest")) {
      document.getElementById("ngx-simple-suggest").blur();
  }
}

changeInInput(event){
}

    /*for menu search suggestions ends*/


}
