import { Schedule } from "./../interfaces/Schedule.interface";
import { Injectable, PACKAGE_ROOT_URL } from "@angular/core";
import { TSubLedger, BillTrack, Trntran } from "./../interfaces/TrnMain";
import { TAcList } from "./../interfaces/Account.interface";
import * as _ from "lodash";
import exportFromJSON from 'export-from-json'
import {
  IRateGroup,
  IDivision,
  BatchStock
} from "../interfaces/commonInterface.interface";
// import { SalesTerminal } from "../../pages/masters/components/sales-terminal/sales-terminal.interface"
import { Http, Response, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { AuthService } from "../services/permission/authService.service";
import { Subject } from "rxjs/subject";
import { GlobalState } from "../../global.state";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import {
  Item,
  VoucherTypeEnum,
  TrnMain,
  CostCenter,
  Warehouse,
  AcListTree,
  PREFIX
} from "../interfaces/index";
import { IndexedDbWrapper, SettingService, AppSettings } from "../services";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { LoginDialog } from "../../pages/modaldialogs/index";
import { MdDialog, MdDialogRef } from "@angular/material";
import { MessageDialog } from "../../pages/modaldialogs/messageDialog/messageDialog.component";
import { Company } from "../interfaces/CompanyInfo.interface";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import * as moment from 'moment'
import { importdocument } from "../interfaces/AddiitonalCost.interface";
import { PaymentCollection } from "../../pages/AccountVoucher/components/PaymentCollection/PaymentCollection.component";
import { LatePost } from "../interfaces/Latepost.interface";
import { AlertService } from "../services/alert/alert.service";
import { NgPluralCase } from "@angular/common";
import { AnonymousSubscription } from "rxjs/Subscription";


@Injectable()
export class MasterRepo {
  //Message dialogbox
  // messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  // message$: Observable<string> = this.messageSubject.asObservable();
  // childDialogRef: MdDialogRef<any>;
  //---end message dialogbox
  private _rateGroups: Array<IRateGroup> = [];

  private _account: TAcList[] = [];
  private _subLedger: TSubLedger[] = [];
  private _reqOption: RequestOptions;
  public _itemList: Item[] = [];
  public PartialProductList: any[] = [];
  public ProductGroupTree: any[] = [];
  public _accountTree: any[] = [];
  public _accountPartyTree: any[] = [];
  public _ptypeList: any[] = [];
  public _Units: any[] = [];
  public _Chanels: any[] = [];
  public Currencies: any[] = [];
  public AdjustedVoucherList: any[] = [];
  public BillTrackedList: BillTrack[] = [];
  public appType;
  disableQuantityEdit: boolean = false;
  Account: any;
  PCL_VALUE: number;
  mainGroupList: any = [];
  subGroupAList: any = [];
  subGroupBList: any = [];
  groupSelectObj: AccountGroup = <AccountGroup>{};
  subGroupCList: any;
  disableSubGroupA: boolean = true;
  disableSubGroupB: boolean = true;
  disableSubGroupC: boolean = true;
    disableGroupSelection: boolean = false;

  partyGroupList: any[];
  subPartyAList:any = [];
  subPartyBList:any = [];
  subPartyCList:any = [];
  partySelectObj: AccountGroup = <AccountGroup>{};
disableSubPartyA: boolean = true;
  disableSubPartyB: boolean = true;
  disableSubPartyC: boolean = true;
  public VCHR:string;
    // disableGroupSelection: boolean = false;
  //private _lastProductStockCheckDateLocal:Date= new Date('1990-01-01T00:00:00');

  private get _lastProductChangeDateLocal(): Date {
    return <Date>(
      this.authService.getSessionVariable("LastProductChangeDateLocal")
    );
  }
  private get _lastProductStockCheckDateLocal(): Date {
    return <Date>(
      this.authService.getSessionVariable("LastProductStockCheckDateLocal")
    );
  }
  public get itemList(): Item[] {
    return this._itemList;
  }
  public get accountList(): TAcList[] {
    return this._account;
  }

  //Observable for divisionList
  public _divisions: Array<IDivision> = [];

  private _divisionListObservable: Observable<Array<IDivision>>;
  public rateGroups: Subject<Array<IRateGroup>> = new Subject();
  private Subscriptions: any[];
  public PartialAccountList: any[] = [];
  private subject: Subject<Command>;
  commands: Observable<Command>;
  ShowMore = false;
  PType: string;
  partyPopUpHeaderText: string = "";
  PlistTitle: string = "";
  PLedgerObj: any = <any>{};
  BankObj: any = <any>{}
  userProfile: any = <any>{};
  userSetting: any;
  ItemList_Available: string;
  AdditionalPurchaseAcObj: any;
  AdditionalPurchaseCreditAcObj: any;
  RefObj: any = <any>{};
  date1: any;
  date2: any;
  nepdate1: any;
  nepdate2: any;
  importDocumentDetailsObj: importdocument = <importdocument>{}
  PhiscalObj: any = <any>{};
  loadedTrnmain: TrnMain = <TrnMain>{};
  costType: any = "GroupCost";
  addnMode: any;
  SelectedRepDiv: string;
  SelectedGroup: any;
  batch:any;
  mcode:any;
  desca:any;
  postdatedvoucher:boolean;
  public viewDivision = new Subject<any>();
  batchid: any;
  addcosting: any;
  AdditionalAMOUNT:any;
  AdditionalREMARKS:any;
  TDSAmount:any;
  TDSAccount_ACID:any;
  TDSAccount_Name:any;
  AdditionalDesc:any;
  AdditionalVAT:number;
  IsTaxableBill:any;
  DoAccountPosting:any;
  showIndividualAmountPopup:boolean;
  TOTALINDAMOUNT:number;

  tdsList:any[]=[];

  AdditionalAMOUNT_2:any;
  AdditionalREMARKS_2:any;
  TDSAmount_2:any;
  TDSAccount_ACID_2:any;
  TDSAccount_Name_2:any;
  AdditionalDesc_2:any;
  AdditionalVAT_2:number;
  IsTaxableBill_2:any;
  DoAccountPosting_2:any;
  AdditionalPurchaseAcObj_2:any;
  AdditionalPurchaseCreditAcObj_2: any;
  IS_ECA_ITEM:any;
  IS_ECA_ITEM_2:any;
  showLoadAllocationbutton:boolean;
  showCostPopup:boolean;
  pi_costdetaillist:any[]=[];
  DR_SL_ACID:any;
  DR_SL_ACNAME:any;
  CR_SL_ACID:string;
  CR_SL_ACNAME:string;
  TDS_SL_ACID:string;
  TDS_SL_ACNAME:string;
  DR_HASSUBLEDGER:number;
  CR_HASSUBLEDGER:number;
  TDS_HASSUBLEDGER:number;

  DR_SL_INDV_ACID:any;
  DR_SL_INDV_ACNAME:any;
  CR_SL_INDV_ACID:string;
  CR_SL_INDV_ACNAME:string;
  TDS_SL_INDV_ACID:string;
  TDS_SL_INDV_ACNAME:string;
  DR_INDV_HASSUBLEDGER:number;
  CR_INDV_HASSUBLEDGER:number;
  TDS_INDV_HASSUBLEDGER:number;
  AdditionalPurchaseAcObj_2_ACID:string;

  // disable_DrSubLedger:boolean=true;
  // disable_CrSubLedger:boolean=true;
  
  //constructor
  constructor(
    private http: Http,
    private authService: AuthService,
    private state: GlobalState,
    private dbWrapper: IndexedDbWrapper,
    public dialog: MdDialog,
    private setting: SettingService,
    private hotkeysService: HotkeysService,
    private alertService: AlertService
  ) {
    this.appType = this.setting.appSetting.APPTYPE;
    this.authService.setSessionVariable(
      "LastProductStockCheckDateLocal",
      new Date("1990-01-01T00:00:00")
    );
    this.userProfile = authService.getUserProfile();
    this.userSetting = authService.getSetting();
    this.PhiscalObj = authService.getPhiscalInfo();
    //setting requestOption with headers and authorizationkey
    //this.getRateGroups();
    //this.getRateGroupsFromApi();
    var y = this.PhiscalObj.BeginDate
    y = y.substring(0, 10);
    this.date2 = y;
    if (this.userProfile.CompanyInfo.ActualFY == this.PhiscalObj.PhiscalID) {
      this.date1 = new Date().toJSON().split('T')[0];
    }
    else {
      var x = this.PhiscalObj.EndDate
      x = x.substring(0, 10);
      this.date1 = x;
    }
    this.refreshTransactionList();

    //this.getRateGroupList();
    if(this.userSetting.SHOW_PURCHASE_MENU==1 && this.userProfile.CompanyInfo.ORG_TYPE=='superdistributor'){
      this.PCL_VALUE =1
    }
  }



  ngAfterViewInit() {
    this.subject = new Subject<Command>();
    this.commands = this.subject.asObservable();
    this.http
      .get("./../../assets/config.json")
      .toPromise()
      .then(r => r.json() as ConfigModel)
      .then(c => {
        for (const key in c.hotkeys) {
          const commands = c.hotkeys[key];
          this.hotkeysService.add(
            new Hotkey(key, (ev, combo) => this.hotkey(ev, combo, commands))
          );
        }
      });
  }

  hotkey(ev: KeyboardEvent, combo: string, commands: string[]): boolean {
    commands.forEach(c => {
      const command = {
        name: c,
        ev: ev,
        combo: combo
      } as Command;
      this.subject.next(command);
    });
    return true;
  }
  public getCustomer(calledFrom: string) {
    if (this._account.length > 0) {
      return Observable.of(this._account);
    } else if (this.getAccountObservable) {
      return this.getAccountObservable;
    } else {
      var aList: TAcList[] = [];
      this.getAccountObservable = this.http
        .get(this.apiUrl + "/getAccountPayableList", this.getRequestOption())
        .flatMap(res => {
          if (res.status == 400) {
            return Observable.of([]);
          } else if (res.status == 200) {
            return res.json() || [];
          }
        })
        .map(data => {
          this.getAccountObservable = null;
          aList.push(<TAcList>data);
          this._account = aList;
          return aList.filter(x => x.TYPE == 'C');
        })
        .share();
      return this.getAccountObservable;
    }
  }

  focusAnyControl(id: string) {
    let control = document.getElementById(id);
    if (control != null) {
      control.focus();
    }
  }

  ValidateNepaliDate(Engdate) {
    //console.log('date1', this.date1);
    //console.log('date2', this.date2);
    // //console.log('Engdate',Engdate);
    if (Engdate < this.date1 && Engdate >= this.date2) {
      return true;

    } else {
      return false;
    }
  }

  public refreshTransactionList() {
    return;
    if (this.accountSubject.getValue().length == 0) {
      this.refreshAccountList("maseter initial");
    }

    if (this._divisionListSubject.getValue().length == 0) {
      this.refreshDivsionList();
    }
    if (this.costCenterSubject.getValue().length == 0) {
      this.refreshCostCenters();
    }
    if (this.warehouseSubject.getValue().length == 0) {
      this.refreshWarehouses();
    }
    if (this.rateGroupSubject.getValue().length == 0) {
      this.refreshRateGroupList();
    }
    if (this.accountSubject.getValue().length == 0) {
      this.refreshAccountList("maseter initial");
    }
  }

  //OBSERVABLE ReDefined
  //Division list observable
  private allDivisionSubject: BehaviorSubject<
    IDivision[]
  > = new BehaviorSubject<IDivision[]>([]);
  public allDivisionList$: Observable<
    IDivision[]
  > = this.allDivisionSubject.asObservable();
  public _divisionListSubject: BehaviorSubject<
    IDivision[]
  > = new BehaviorSubject<IDivision[]>([]);
  public divisionList$: Observable<
    IDivision[]
  > = this._divisionListSubject.asObservable();
  public refreshDivsionList(refresh: boolean = false) {
    let divList: IDivision[] = [];
    this.http
      .get(this.apiUrl + "/getDivisionlist", this.getRequestOption())
      .flatMap(res => res.json() || [])
      .map(ret => {
        divList.push(<IDivision>ret);
        this.allDivisionSubject.next(divList);
        return divList;
      })
      .map(ret => {
        if (this.setting.appSetting.UserwiseDivision == 1) {
          var divs: IDivision[] = [];
          var userdivs = <string[]>this.setting.appSetting.userDivisionList;
          ret.forEach(div => {
            var divitem = userdivs.find(d => d == div.INITIAL);
            if (divitem) {
              divs.push(div);
            }
          });
          return divs;
        }
        else {
          return ret;
        }
      })
      .share()
      .subscribe(
        data => {
          this._divisionListSubject.next(data);
        },
        error => {
          var err = error;
          //alert(err);
        },
        () => {
          this._divisions = divList;
        }
      );
  }
  //-------end of divisionlist----------------

  //Cost Center
  public costCenterSubject: BehaviorSubject<CostCenter[]> = new BehaviorSubject<
    CostCenter[]
  >([]);
  public costCenterList$: Observable<
    CostCenter[]
  > = this.costCenterSubject.asObservable();

  public refreshCostCenters() {
    let _costCenterList: CostCenter[] = [];
    this.http
      .get(this.apiUrl + "/getCostCenterList", this.getRequestOption())
      .flatMap(res => res.json() || [])
      .map(ret => {
        _costCenterList.push(<CostCenter>ret);
        return _costCenterList;
      })
      .share()
      .subscribe(
        data => {
          this.costCenterSubject.next(data);
        },
        error => {
          this.resolveError(error, "masterRepo-getCostCenters");
        }
      );
  }

  //---end costcenter
  // WarehouseList
  public warehouseSubject: BehaviorSubject<Warehouse[]> = new BehaviorSubject<
    Warehouse[]
  >([]);
  public warehouseList$: Observable<
    Warehouse[]
  > = this.warehouseSubject.asObservable();
  private allWarehouseSubject: BehaviorSubject<
    Warehouse[]
  > = new BehaviorSubject<Warehouse[]>([]);
  public allWarehouseList$: Observable<
    Warehouse[]
  > = this.allWarehouseSubject.asObservable();

  public refreshWarehouses() {
    let wlist: Warehouse[] = [];
    this.http
      .get(this.apiUrl + "/getWarehouseList", this.getRequestOption())
      .flatMap(response => response.json() || [])
      .map(ret => {
        wlist.push(<Warehouse>ret);
        this.allWarehouseSubject.next(wlist);
        return wlist;
      })
      // .map(ret => {
      //     if (this.setting.appSetting.UserwiseDivision == 1) {
      //         var wares: Warehouse[] = [];
      //         var userWares = <string[]>this.setting.appSetting.userWarehouseList;
      //         userWares.forEach(ware => {
      //             var war = ret.find(w => w.NAME == ware);
      //             if (war) {
      //                 wares.push(war);
      //             }
      //         });
      //         return wares;
      //     }
      //     else {
      //         return ret;
      //     }
      // })
      .share()
      .subscribe(
        data => {
          this.warehouseSubject.next(data);
        },
        error => {
          this.resolveError(error, "masterService-getwarehouses");
        }
      );
  }
  //---end of WarehouseList
  //------end of redefined

  // RateGroupList
  public rateGroupSubject: BehaviorSubject<IRateGroup[]> = new BehaviorSubject<
    IRateGroup[]
  >([]);
  public rateGroupList$: Observable<
    IRateGroup[]
  > = this.rateGroupSubject.asObservable();
  public refreshRateGroupList() {
    let rlist: IRateGroup[] = [];
    this.http
      .get(this.apiUrl + "/getRateGroupList", this.getRequestOption())
      .flatMap(response => response.json() || [])
      .map(ret => {
        rlist.push(<IRateGroup>ret);
        return rlist;
      })
      .share()
      .subscribe(
        data => {
          this.rateGroupSubject.next(data);
        },
        error => {
          this.resolveError(error, "masterService-getrateGroup");
        }
      );
  }
  //---end of RateGroupList
  //accountlist
  accountSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<TAcList[]>(
    []
  );
  accountList$: Observable<TAcList[]> = this.accountSubject.asObservable();
  VocuherPrefix
  public refreshAccountList(calledFrom: string) {
    var ilist: TAcList[] = [];
    if (this._account.length > 0) return;
    this.http
      .get(this.apiUrl + "/getAccountList", this.getRequestOption())
      .flatMap(res => res.json() || [])
      .share()
      .subscribe(
        data => {
          ilist.push(<TAcList>data);
          this.accountSubject.next(ilist);
        },
        Error => {
          this.accountSubject.complete();
        },
        () => {
          this._account = ilist;
          this.accountSubject.next(ilist);
          this.accountSubject.complete();
        }
      );
  }
  //end accountlist
  public get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    return apiUrl;
  }
  public getRequestOption() {
    let headers: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: this.authService.getAuth().token
    });
    return new RequestOptions({ headers: headers });
  }

  prodListHttp$ = this.http
    .post(
      this.apiUrl + "/getProductList",
      { EDATE: this._lastProductChangeDateLocal },
      this.getRequestOption()
    )
    .flatMap(res => res.json() || [])
    .share();

  public getVoucherNo(TrnMainObj: any, voucherPrefix = this.VocuherPrefix) {
    let returnSubject: Subject<any> = new Subject();

    TrnMainObj.PhiscalID = this.PhiscalObj.PhiscalID;


    // TrnMainObj.VoucherPrefix != undefined ? TrnMainObj.VoucherPrefix : this.VocuherPrefix;
    TrnMainObj.VoucherPrefix = voucherPrefix;
    this.http
      .post(this.apiUrl + "/getVoucherNo", TrnMainObj, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          returnSubject.next(retData);
        } else {
          returnSubject.next(retData);
        }
      });
    return returnSubject;
  }
  // public itemListSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  // public _itemListObservable$: Observable<Item[]> = this.itemListSubject.asObservable();

  public _itemListObservable$: Observable<Item[]>;

  public getProductItemList() {
    try {
      if (this._itemList.length > 0) {
        return Observable.of(this._itemList);
      } else if (this._itemListObservable$) {
        return this._itemListObservable$;
      } else {
        this._itemListObservable$ = null;
        this._itemListObservable$ = this.http
          .post(
            this.apiUrl + "/getProductList",
            { EDATE: this._lastProductChangeDateLocal },
            this.getRequestOption()
          )
          .flatMap(res => res.json() || [])
          .map(data => {
            this._itemList.push(<Item>data);
            return this._itemList;
          })
          .share();
        return this._itemListObservable$;
      }
    }
    catch (ex) {
    }
  }
  public getProductItemPagedList() {
    try {
      if (this._itemList.length > 0) {
        return Observable.of(this._itemList);
      }
      else if (this._itemListObservable$) {
        return this._itemListObservable$;
      }
      else {
        this._itemListObservable$ = null;
        this._itemListObservable$ = this.http.post(this.apiUrl + '/getProductPagedList', { EDATE: this._lastProductChangeDateLocal }, this.getRequestOption())
          .flatMap(res => res.json() || [])
          .map(data => {
            this._itemList.push(<Item>data)
            return this._itemList;
          })
          .share();
        return this._itemListObservable$;
      }
    }
    catch (ex) {
    }
  }

  // public IListSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  // public ItemList$: Observable<Item[]> = this.IListSubject.asObservable();
  // private ItemListSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  // public _itemListObservable$: Observable<Item[]> = this.ItemListSubject.asObservable();
  // public getProductItemList() {
  //     try {
  //         if (this._itemList.length > 0) {
  //             //return this._itemList;
  //             return Observable.of(this._itemList);
  //         }
  //         else if (this._itemListObservable$) {
  //             return this._itemListObservable$;
  //         }
  //         else {
  //             this.http.get(this.apiUrl + '/getWarehouseList', this.getRequestOption()).flatMap(response => response.json() || [])
  //         .map(ret => {
  //             this._itemList.push(<Item>ret);
  //             this.ItemListSubject.next(this._itemList);
  //             return this._itemList;
  //         })
  //         .map(ret => {
  //             if (this.setting.appSetting.UserwiseDivision == 1) {

  //             }
  //             else {
  //                 return ret;
  //             }
  //         })
  //         .share()
  //         .subscribe(data => {
  //             this.ItemListSubject.next(data)
  //         },
  //         error => {
  //             this.resolveError(error, 'masterService-getwarehouses')
  //         })

  //         ;
  //         }

  //     }
  //     catch (ex) {
  //     }
  // }

  // public getProductItemList() {
  //     try {
  //         var db = this.dbWrapper.dbHelper;
  //         if (this._itemList.length > 0) {
  //             return Observable.of(this._itemList);
  //         }
  //         else if(this._itemListObservable$){
  //             return this._itemListObservable$;
  //         }
  //         else if(db){
  //             this.dbWrapper.dbHelper.openCursor('PRODUCT', (evt) => {
  //                 let cursor = <IDBCursorWithValue>evt.target.result;
  //                 if (cursor) {
  //                     this._itemList.push(<Item>cursor.value);
  //                     cursor.continue();
  //                 }
  //                 else {
  //                     return Observable.of(this._itemList);
  //                 }
  //             }).catch((error) => {
  //                 this.refreshProductItemList();
  //                 return;
  //                 //return Observable.of([]);
  //             });
  //         }
  //         else{
  //             var lastProductChangeDateLocal = this.authService.getSessionVariable('LastProductChangeDateLocal');
  //             if (lastProductChangeDateLocal) {
  //                 this.refreshProductItemList();

  //             }

  //         }
  //     }
  //     catch (ex) {
  //     }
  // }
  public refreshProductItemList() {
    try {
      if (this._itemList.length > 0) return;
      var plist: Item[] = [];
      var LastDate = new Date("1900-01-01T00:00:00");
      var db = this.dbWrapper.dbHelper;
      this.prodListHttp$.share().subscribe(
        data => {
          var pitem = <Item>data;
          if (LastDate < pitem.EDATE) {
            LastDate = pitem.EDATE;
          }
          db.update("PRODUCT", pitem).catch(error => {
          });
        },
        Error => { },
        () => {
          this.authService.removeSessionVariable("LastProductChangeDateLocal");
          //this._itemList = plist;
        }
      );
    } catch (ex) {
    }
  }

  // public getProductItemList() {
  //     return new Observable((observer: Subscriber<Array<Item>>) => {
  //         if (this._itemList.length > 0) {
  //             observer.next(this._itemList);
  //             observer.complete();
  //         }
  //         else {
  //             this.http.get(this.apiUrl + '/getProductList', this.getRequestOption())
  //                 .flatMap(res => res.json() || [])
  //                 .subscribe(data => {
  //                     this._itemList.push(<Item>data);
  //                     observer.next(this._itemList)
  //                 },
  //                 Error => {
  //                     observer.complete();
  //                     observer.error(Error);
  //                 }
  //                 ,
  //                 () => observer.complete()
  //                 )
  //         }
  //     }
  //     );
  // }
  // public getRateGroupList(): Array<IRateGroup> {
  //     if (this._rateGroups.length > 0) {
  //         return this._rateGroups;
  //     }
  //     this.http.get(this.apiUrl + '/getRateGroupList', this.getRequestOption())
  //         .flatMap(Response => Response.json() || [])
  //         .subscribe(data => {
  //             this._rateGroups.push(<IRateGroup>data)
  //         })
  // }
  public getRateGroups() {

    this.state.subscribe("rateGroupList", data => {
      this._rateGroups = data;
      this.rateGroups.next(data);
    });
  }

  private getRateGroupsFromApi() {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl;

    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    let retRateGroups: Array<IRateGroup> = [];
    this.http
      .get(apiUrl + "/getRateGroupList", this.getRequestOption())
      .flatMap(Response => Response.json() || [])
      .subscribe(
        data => {
          retRateGroups.push(<IRateGroup>data);
        },
        error => {
        },
        () => {
          this.state.notifyDataChanged("rateGroupList", retRateGroups);
        }
      );
  }

  public getDivisions(refresh: boolean = false) {
    let dlist = [];
    let returnDiv = [];
    this.getAllDivisions().subscribe(res => {
      dlist.push(<any>res);
      if (this.setting.appSetting.UserwiseDivision == 1) {
        var divs = [];
        var userdivs = <string[]>this.setting.appSetting.userDivisionList;
        dlist.forEach(div => {
          var divitem = userdivs.find(d => d == div.INITIAL);
          if (divitem) {
            divs.push(div);
          }
        });
        returnDiv = divs;
      } else {
        returnDiv = dlist;
      }
    });
    return Observable.of(returnDiv);
  }

  //New Api
  public getMGroupFromMenuItem() {
    return this.http
      .get(this.apiUrl + "/getMGroupFromMenuItem", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getPartyGroup() {
    return this.http
      .get(this.apiUrl + "/getPartyGroup", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  //---------------------

  public getAllDivisions() {
    return this.http
      .get(this.apiUrl + "/getDivisionlist", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getAllVoucherType() {
    return this.http
      .get(this.apiUrl + "/getAllVoucherType", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }


  public getReportDetails() {
    return this.http
      .get(this.apiUrl + "/getReportDetails", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }








  public getCurrencies() {
    return this.http
      .get(this.apiUrl + "/getCurrencyList", this.getRequestOption())
      .flatMap(response => response.json() || [])
      .subscribe(res => {
        this.Currencies.push(<any>res);
      });
  }
  public getSalesman(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getSalesmanList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }
  private getSalesmanFromApi() { }

  public getCostCenter(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getCostCenterList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }
  public getAllCostCenter(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getAllCostCenterList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }






  public getAllVoucherList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getAllChalanSeries", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }



  public getAllNEWCostCenter() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getAllNEWCostCenterList", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getAllSalesmanList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getAllSalesmanList", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }



  private getCostCenterFromApi() { }
  public getCategory(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getCategoryList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }
  public getAllCategory(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getAllCategoryList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }
  private getCategoryFromApi() { }
  public getAllCat() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getAllCategoryList", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public getSalesTerminal(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getSalesTerminalList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getWarehouse(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getAllWarehouseList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getTerminalCategory(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getTerminalCategoryList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getPType(refresh: boolean = false) {
    let ptypeList = [];
    return this.http
      .get(this.apiUrl + "/getPTypeList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getAllUnitList(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getUnitList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getCounterProduct(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getCounterProductList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }



  // public getAccountList(): Array<TAcList> {
  //     if (this._account.length > 0) {
  //         return this._account;
  //     }
  //     else {
  //         this.http.get(this.apiUrl + '/getAccountList', this.getRequestOption())
  //             .flatMap(response => response.json() || []).subscribe(res => {
  //                 this._account.push(<TAcList>res);
  //             , () => { return this._account })
  //     }
  // }
  getAccountObservable: Observable<TAcList[]>;

  public getAccount(calledFrom: string) {
    // if (this._account.length > 0) {
    //   return Observable.of(this._account);
    // } else if (this.getAccountObservable) {
    //   return this.getAccountObservable;
    // } else {
    var aList: TAcList[] = [];
    this.getAccountObservable = this.http
      .get(this.apiUrl + "/getAccountList", this.getRequestOption())
      .flatMap(res => {
        if (res.status == 400) {
          return Observable.of([]);
        } else if (res.status == 200) {
          return res.json() || [];
        }
      })
      .map(data => {
        this.getAccountObservable = null;
        aList.push(<TAcList>data);
        this._account = aList;
        return aList.filter(x => x.TYPE == 'A');
      })
      .share();
    return this.getAccountObservable;
    //  }
  }

  public getAccoutFilteredObs(keyword: any, byacid: number = 0) {
    return new Observable((observer: Subscriber<TAcList[]>) => {
      this.getAccount("getAccountFilteredObs")
        .map(aclist => {
          if (byacid == 0) {
            return aclist.filter(ac =>
              ac.ACCODE == null
                ? ""
                : ac.ACCODE.toUpperCase().indexOf(keyword.toUpperCase()) > -1 && ac.TYPE == 'A'
            );
          } else {
            return aclist.filter(ac =>
              ac.ACNAME == null
                ? ""
                : ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1 && ac.TYPE == 'A'
            );
          }
        })
        .subscribe(
          data => {
            observer.next(data);
          },
          Error => {
            observer.complete();
          },
          () => {
            observer.complete();
          }
        );
    });
  }
  // public getAccoutFilteredObs1(keyword: any, byacid: number = 0) {
  //     return new Observable((observer: Subscriber<Array<TAcList>>) => {
  //         if (this._account.length == 0) {
  //             this.http.get(this.apiUrl + '/getAccountList', this.getRequestOption())
  //                 .flatMap(response => response.json() || []).subscribe(res => {
  //                     this._account.push(<TAcList>res);
  //                     if (keyword) {
  //                         let filteredList;
  //                         if (byacid == 0) {
  //                             filteredList = this._account.filter((fil: TAcList) => {
  //                                 if (fil.ACCODE.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
  //                                     return fil;
  //                                 }
  //                             });
  //                         }
  //                         else {
  //                             filteredList = this._account.filter((fil: TAcList) => {
  //                                 if (fil.ACNAME.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
  //                                     return fil;
  //                                 }
  //                             });
  //                         }
  //                         observer.next(filteredList);
  //                     }
  //                     else {
  //                         observer.next(this._account);
  //                     }

  //                 });
  //         }
  //         else {
  //             if (keyword) {
  //                 let filteredList;
  //                 if (byacid == 0) {
  //                     filteredList = this._account.filter((fil: TAcList) => {
  //                         if (fil.ACCODE.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
  //                             return fil;
  //                         }
  //                     });
  //                 }
  //                 else {
  //                     filteredList = this._account.filter((fil: TAcList) => {
  //                         if (fil.ACNAME.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
  //                             return fil;
  //                         }
  //                     });
  //                 }
  //                 observer.next(filteredList);
  //             }
  //             else {
  //                 observer.next(this._account);
  //             }
  //         }
  //     })
  // }
  /*public getAccoutFilteredAcidObs2(keyword: any) {
        return new Observable(observer => {
            if (this._account.length == 0) {
                this.http.get(this.apiUrl + '/getAccountList', this.getRequestOption())
                    .flatMap(response => response.json() || []).subscribe(res => {
                        this._account.push(<TAcList>res);
                        if (keyword) {
                            observer.next(this._account.filter((fil: TAcList) => fil.ACID.includes(keyword)));
                        }
                        else {
                            observer.next(this._account);
                        }

                    });
            }
            else {
                if (keyword) {
                    observer.next(this._account.filter((fil: TAcList) => fil.ACID.includes(keyword)));
                }
                else {
                    observer.next(this._account);
                }
            }
        })
    }*/

  /*public getAccountFiltered5(keyword: any) {
        if (this._account.length == 0) {
            return this.http.get(this.apiUrl + '/getAccountList', this.getRequestOption())
                .flatMap(response => response.json() || [])
                .filter((fil: TAcList) => {
                    return fil.ACNAME.includes(keyword);
                });


        } else {
            if (keyword) {
                var aclist = this._account.filter(ac => ac.ACNAME.includes(keyword))
                return Observable.of(aclist);
            }
            else {

                Observable.of(this._account);
            }
        }

    }*/

  public getMembershipList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getMembershipList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }





  public getOccupationList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getOccupationList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getDesignationList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getDesignationList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getMemberSchemeList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getMemberSchemeList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getSalesmanList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getSalesmanList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getSchemeGroupList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getSchemeGroupList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getSchemeList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getSchemeList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getJournalList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getJournalList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getProductGroupTree(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getProductGroupTree", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getACListTree(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getACListTree", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getUnits() {
    return this.http
      .get(this.apiUrl + "/getUnits", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getMCatList() {
    return this.http
      .get(this.apiUrl + "/getMCatList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getMCat1List() {
    return this.http
      .get(this.apiUrl + "/getMCat1List", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getRGroupList() {
    return this.http
      .get(this.apiUrl + "/getRGroupList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getWarehouseList() {
    return this.http
      .get(this.apiUrl + "/getWarehouseList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  // public getCostCenterList(refresh: boolean = false) {
  //     return this.http.get(this.apiUrl + '/getAllCostCenterList', this.getRequestOption())
  //         .flatMap(response => response.json() || [])
  // }
  public getPTypeList() {
    return this.http
      .get(this.apiUrl + "/getPType", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getItemGroupList() {
    return this.http
      .get(this.apiUrl + "/getAllItemGroupList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getKotCategoryList() {
    return this.http
      .get(this.apiUrl + "/getKotCategoryList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getBCodeDetails() {
    return this.http
      .get(this.apiUrl + "/getBCodeDetails", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getBrandList() {
    return this.http
      .get(this.apiUrl + "/getBrandList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getModelList() {
    return this.http
      .get(this.apiUrl + "/getModelList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getSupplierListFromApi() {
    return this.http
      .get(this.apiUrl + "/getSupplierList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getSupplierList() {
    return this.getAccount("masterrepo-supplierlist").map((data: TAcList[]) => {
      let lst = data.filter(
        fil => fil.ACID.substr(0, 2) == "PA" && fil.PType == "V"
      );
      return lst;
    });
  }

  public getCustomers() {
    return this.getAccount("masterrepo-customerlist").map((data: TAcList[]) => {
      let lst = data.filter(
        fil => fil.ACID.substr(0, 2) == "PA" && fil.PType == "C"
      );
      return lst;
    });
  }

  public getCusSup() {
    return this.getAccount("masterrepo-customerlist").map((data: TAcList[]) => {
      let lst = data.filter(fil => fil.ACID.substr(0, 2) == "PA");
      return lst;
    });
  }

  public getCashList() {
    return this.getAccount("masterrepo-cashlist").map((data: TAcList[]) => {
      let lst = data.filter(
        fil => fil.ACID.substr(0, 2) == "AT" && fil.MAPID == "C"
      );
      return lst;
    });
  }

  public getBankList() {
    return this.getAccount("masterrepo-banklist").map((data: TAcList[]) => {
      let lst = data.filter(
        fil => fil.ACID.substr(0, 2) == "AT" && fil.MAPID == "B"
      );
      return lst;
    });
  }

  public getAcList() {
    return this.http
      .get(this.apiUrl + "/getAcList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getAllCustomers() { return this.http.get(this.apiUrl + '/getCustomers', this.getRequestOption()).flatMap(response => response.json() || []); }
  // public getCashList() { return this.http.get(this.apiUrl + '/getCashList', this.getRequestOption()).flatMap(response => response.json() || []); }
  // public getBankList() { return this.http.get(this.apiUrl + '/getBankList', this.getRequestOption()).flatMap(response => response.json() || []); }
  public getPurchaseAcList() {
    return this.http
      .get(this.apiUrl + "/getPurchaseAcList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getSalesAcList() {
    return this.http
      .get(this.apiUrl + "/getSalesAcList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getCostCenterList() {
    return this.http
      .get(this.apiUrl + "/getCostCenterList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }



  public getSubLedgerList() {
    return new Observable((observer: Subscriber<TSubLedger[]>) => {
      if (this._subLedger.length == 0) {
        this.http
          .get(this.apiUrl + "/getSubLedgerList", this.getRequestOption())
          .flatMap(response => response.json() || [])
          .subscribe(
            res => {
              this._subLedger.push(<TSubLedger>res);
            },
            error => {
              observer.next([]);
            },
            () => {
              observer.next(this._subLedger);
            }
          );
      } else {
        observer.next(this._subLedger);
      }
    });
  }
  public getProductList() {
    return this.http
      .get(this.apiUrl + "/getProductList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getCashAndBankList() {
    return this.http
      .get(this.apiUrl + "/getCashAndBankList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getTrnMainList(prefix: string) {
    return this.http
      .get(this.apiUrl + "/getTrnMainList/" + prefix, this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getCurrentDate() {
    let date: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getCurrentDate", this.getRequestOption())
      .subscribe(response => {
        date.next(response.json());
        date.unsubscribe();
      });
    return date;
  }

  public getBarcodeWiseProductForTran(barcode: string) {
    return this.http
      .get(
        this.apiUrl + "/getBarcodeWiseProductForTran/" + barcode,
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }
  public getProductForTran(mcode: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getProductForTran",
        { mcode: mcode },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getAccountTreeObservable: Observable<any[]>;

  public getacListTree() {
    if (this._accountTree.length > 0) {
      return Observable.of(this._accountTree);
    } else if (this.getAccountTreeObservable) {
      return this.getAccountTreeObservable;
    } else {
      this.getAccountTreeObservable = null;
      var atList: AcListTree[] = [];
      this.getAccountTreeObservable = this.http
        .get(this.apiUrl + "/getAccountTree", this.getRequestOption())
        .flatMap(res => {
          if (res.status == 400) {
            return Observable.of([]);
          } else if (res.status == 200) {
            return res.json() || [];
          }
        })
        .map(data => {
          this.getAccountTreeObservable = null;
          atList.push(<AcListTree>data);
          this._accountTree = atList;
          return atList;
        })
        .share();
      return this.getAccountTreeObservable;
    }
  }

  getPartyTreeObservable: Observable<any[]>;

  public getpartyListTree() {
    if (this._accountPartyTree.length > 0) {
      return Observable.of(this._accountPartyTree);
    } else if (this.getPartyTreeObservable) {
      return this.getPartyTreeObservable;
    } else {
      var apList: any[] = [];
      ////console.log("arrived here")
      this.getPartyTreeObservable = this.http
        .get(this.apiUrl + "/getPartyListTree", this.getRequestOption())
        .flatMap(res => {
          if (res.status == 400) {
            return Observable.of([]);
          } else if (res.status == 200) {
            return res.json() || [];
          }
        })
        .map(data => {
          this.getPartyTreeObservable = null;
          apList.push(<any>data);
          this._accountPartyTree = apList;
          return apList;
        })
        .share();
      return this.getPartyTreeObservable;
    }
  }
  public getAccountListTree() {
    if (this._accountPartyTree.length > 0) {
      return Observable.of(this._accountPartyTree);
    } else if (this.getPartyTreeObservable) {
      return this.getPartyTreeObservable;
    } else {
      var apList: any[] = [];
      ////console.log("arrived here")
      this.getPartyTreeObservable = this.http
        .get(this.apiUrl + "/getAccountTree", this.getRequestOption())
        .flatMap(res => {
          if (res.status == 400) {
            return Observable.of([]);
          } else if (res.status == 200) {
            return res.json() || [];
          }
        })
        .map(data => {
          this.getPartyTreeObservable = null;
          apList.push(<any>data);
          this._accountPartyTree = apList;
          return apList;
        })
        .share();
      return this.getPartyTreeObservable;
    }
  }
  public getAccountListTreeForMaster() {
    if (this._accountPartyTree.length > 0) {
      return Observable.of(this._accountPartyTree);
    } else if (this.getPartyTreeObservable) {
      return this.getPartyTreeObservable;
    } else {
      var apList: any[] = [];
      ////console.log("arrived here")
      this.getPartyTreeObservable = this.http
        .get(this.apiUrl + "/getAccountListTreeForMaster", this.getRequestOption())
        .flatMap(res => {
          if (res.status == 400) {
            return Observable.of([]);
          } else if (res.status == 200) {
            return res.json() || [];
          }
        })
        .map(data => {
          this.getPartyTreeObservable = null;
          apList.push(<any>data);
          this._accountPartyTree = apList;
          return apList;
        })
        .share();
      return this.getPartyTreeObservable;
    }
  }
  getAllAccountList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();

    this.http
      .get(this.apiUrl + "/getAllAccount", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getAllAccount(ACID: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { ACID: ACID } };
    this.http
      .post(this.apiUrl + "/getAccount", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }


  AdditionalCostTrnTran: Trntran[] = [];
  public saveTransaction(mode: string, trnmain: any, extra: any = null) {
    try {
      var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        "Saving data Please wait a moment..."
      );
      var message$: Observable<string> = messageSubject.asObservable();
      let childDialogRef = this.dialog.open(MessageDialog, {
        hasBackdrop: true,
        data: { header: "Information", message: message$ }
      });
      let res = { status: "error", result: "" };
      let returnSubject: Subject<any> = new Subject();
      let opt = this.getRequestOption();
      let hd: Headers = new Headers({ "Content-Type": "application/json" });
      let op: RequestOptions = new RequestOptions();
      let bodyData = {};
      if (extra == null) {
        bodyData = { mode: mode, data: trnmain, AdditionalCost: this.AdditionalCostTrnTran };
      } else {
        bodyData = { mode: mode, data: trnmain, extra: extra };
      }

      this.http
        .post(
          this.apiUrl + "/saveTransaction",
          bodyData,
          this.getRequestOption()
        )
        .subscribe(
          data => {
            let retData = data.json();
            if (retData.status == "ok") {
              messageSubject.next("Data Saved Successfully");
              returnSubject.next(retData);
              setTimeout(() => {
                childDialogRef.close();
              }, 1000);
            } else {
              res.status = "error1";
              res.result = retData.result;
              messageSubject.next(res.result);
              setTimeout(() => {
                childDialogRef.close();
                returnSubject.next(res);
              }, 3000);
            }
          },
          error => {
       
         this.saveErrorLog(trnmain);
            messageSubject.next(error.json());
            this.resolveError(error, "savetransaction");
            setTimeout(() => {
              childDialogRef.close();
              returnSubject.next({ status: "error", result: error});
            }, 3000);
          }
        );
      return returnSubject;
    } catch (ex) {
      //alert(ex);
    }
  }

  public saveStockSettlement(mode: string, trnmain: any, extra: any = null) {
    try {
      var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        "Saving data Please wait a moment..."
      );
      var message$: Observable<string> = messageSubject.asObservable();
      let childDialogRef = this.dialog.open(MessageDialog, {
        hasBackdrop: true,
        data: { header: "Information", message: message$ }
      });
      let res = { status: "error", result: "" };
      let returnSubject: Subject<any> = new Subject();
      let opt = this.getRequestOption();
      let hd: Headers = new Headers({ "Content-Type": "application/json" });
      let op: RequestOptions = new RequestOptions();
      let bodyData = {};
      if (extra == null) {
        bodyData = { mode: mode, data: trnmain };
      } else {
        bodyData = { mode: mode, data: trnmain, extra: extra };
      }

      this.http
        .post(
          this.apiUrl + "/saveStockSettlement",
          bodyData,
          this.getRequestOption()
        )
        .subscribe(
          data => {
            let retData = data.json();
            if (retData.status == "ok") {
              messageSubject.next("Data Saved Successfully");
              returnSubject.next(retData);
              setTimeout(() => {
                childDialogRef.close();
              }, 1000);
            } else {
              res.status = "error1";
              res.result = retData.result;
              messageSubject.next(res.result);
              setTimeout(() => {
                childDialogRef.close();
                returnSubject.next(res);
              }, 3000);
            }
          },
          error => {
            messageSubject.next(error.json());
            this.resolveError(error, "saveStockSettlement");
            setTimeout(() => {
              childDialogRef.close();
              returnSubject.next({ status: "error", result: error });
            }, 3000);
          }
        );
      return returnSubject;
    } catch (ex) {
      //alert(ex);
    }
  }

  public saveStockSettlementApproval(mode: string, trnmain: any, extra: any = null) {
    try {
      var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        "Saving data Please wait a moment..."
      );
      var message$: Observable<string> = messageSubject.asObservable();
      let childDialogRef = this.dialog.open(MessageDialog, {
        hasBackdrop: true,
        data: { header: "Information", message: message$ }
      });
      let res = { status: "error", result: "" };
      let returnSubject: Subject<any> = new Subject();
      let opt = this.getRequestOption();
      let hd: Headers = new Headers({ "Content-Type": "application/json" });
      let op: RequestOptions = new RequestOptions();
      let bodyData = {};
      if (extra == null) {
        bodyData = { mode: mode, data: trnmain };
      } else {
        bodyData = { mode: mode, data: trnmain, extra: extra };
      }
      this.http
        .post(
          this.apiUrl + "/saveApprovalStockSettlement",
          bodyData,
          this.getRequestOption()
        )
        .subscribe(
          data => {
            let retData = data.json();
            if (retData.status == "ok") {
              messageSubject.next("Data Saved Successfully");
              returnSubject.next(retData);
              setTimeout(() => {
                childDialogRef.close();
              }, 1000);
            } else {
              res.status = "error1";
              res.result = retData.result;
              messageSubject.next(res.result);
              setTimeout(() => {
                childDialogRef.close();
                returnSubject.next(res);
              }, 3000);
            }
          },
          error => {
            messageSubject.next(error.json());
            this.resolveError(error, "saveStockSettlement");
            setTimeout(() => {
              childDialogRef.close();
              returnSubject.next({ status: "error", result: error });
            }, 3000);
          }
        );
      return returnSubject;
    } catch (ex) {
      //alert(ex);
    }
  }



  public cancelAccoutingVoucher(data: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    this.http
      .post(this.apiUrl + "/cancelAcVouchers", data, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
          } else {
            res.status = "error";
            res.result = retData.result;
            returnSubject.next(res);
          }
        },
        error => {
          var er = error.json();
          returnSubject.next(er);
        }
      );
    return returnSubject;
  }




  public saveUnit(mode: string, trnmain: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: trnmain };
    this.http
      .post(this.apiUrl + "/saveUnit", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
          }
        },
        error => {
          var er = error.json();
          // res.status = "error2", res.result = error;
          returnSubject.next(er);
        }
      );
    return returnSubject;
  }
  public saveChanel(mode: string, trnmain: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: trnmain };
    this.http
      .post(this.apiUrl + "/saveChanel", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
          }
        },
        error => {
          var er = error.json();
          returnSubject.next(er);
        }
      );
    return returnSubject;
  }

  public saveSalesTerminal(mode: string, salesTerminal: any, cpList: any[]) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = {
      mode: mode,
      data: salesTerminal,
      CounterProductList: cpList
    };
    this.http
      .post(
        this.apiUrl + "/saveSalesTerminal",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveClaimType(mode: string, claimType: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: claimType };
    this.http
      .post(this.apiUrl + "/saveClaimType", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveWarehouse(mode: string, warehouse: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: warehouse };
    this.http
      .post(this.apiUrl + "/saveWarehouse", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveOrganizationHierarchy(mode: string, warehouse: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: warehouse };
    this.http
      .post(
        this.apiUrl + "/saveOrganizationHierarchy",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public saveSalesManType(mode: string, salesmanType: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: salesmanType };
    this.http
      .post(
        this.apiUrl + "/saveSalesmanType",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public saveSalesman(mode: string, salesman: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: salesman };
    this.http
      .post(this.apiUrl + "/saveSalesman", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public savePType(mode: string, salesman: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: salesman };
    this.http
      .post(this.apiUrl + "/savePType", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveProduct(
    mode: string,
    prodObj: any,
    RGLIST: any[],
    AlternateUnits: any[],
    PBarCodeCollection: any[],
    BrandModelList: any[]
  ) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = {
      mode: mode,
      data: {
        product: prodObj,
        rglist: RGLIST,
        alternateunits: AlternateUnits,
        bcodeList: PBarCodeCollection,
        bmList: BrandModelList
      }
    };
    var data = JSON.stringify(bodyData, undefined, 2);
    this.http
      .post(
        this.apiUrl + "/saveProductMaster",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveMembership(mode: string, membership: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: membership };
    this.http
      .post(this.apiUrl + "/saveMembership", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveDivision(mode: string, division: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: division };
    this.http
      .post(this.apiUrl + "/saveDivision", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveCostCenter(mode: string, costCenter: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: costCenter };
    this.http
      .post(this.apiUrl + "/saveCostCenter", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public saveCostCenterCategory(mode: string, costCenterCategory: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: costCenterCategory };
    this.http
      .post(this.apiUrl + "/saveCostCenterCategory", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getAllCostCenterGroupList() {
    return new Observable((observer: Subscriber<Company>) => {
      let res = { status: "error", result: "" };
      this.http
        .get(this.apiUrl + "/getAllCostCenterGroupList", this.getRequestOption())
        .map(ret => ret.json())
        .subscribe(
          data => {
            observer.next(data);
          },
          error => {
            let ret = this.resolveError(error, "getAllCostCenterGroupList");
            if (ret == "Login resolved") {
              this.loadCompany();
              return;
            }
            observer.next(null);
            observer.complete();
          }
        );
    });
  }
  getCostCenterGroup(Initial:string) {
    let res={status:"error",result:""};
    let returnSubject:Subject<any>=new Subject();
    ////console.log("about to edit");
    let bodyData = {mode:'query',data:{COSTCENTERGROUPNAME:Initial}};
    this.http.post(this.apiUrl + '/getCostCenterGroup',bodyData,this.getRequestOption())
        .subscribe(response=>{
            let data = response.json();
            if(data.status == 'ok'){
                returnSubject.next(data);
                returnSubject.unsubscribe();

            }
            else{
                returnSubject.next(data)
                returnSubject.unsubscribe();
            }
        },error =>{
            res.status='error';res.result=error;
            returnSubject.next(res);
            returnSubject.unsubscribe();
        }
        );
        return returnSubject;
   /* return this.http.get("/rategroups.json").toPromise()
        .then((res) => res.json());*/
        

}
  public loadCompany() {
    return new Observable((observer: Subscriber<Company>) => {
      let res = { status: "error", result: "" };
      this.http
        .get(this.apiUrl + "/loadCompanyInfo", this.getRequestOption())
        .map(ret => ret.json())
        .subscribe(
          data => {
            observer.next(data.result);
          },
          error => {
            let ret = this.resolveError(error, "loadcompany");
            if (ret == "Login resolved") {
              this.loadCompany();
              return;
            }
            observer.next(null);
            observer.complete();
          }
        );
    });
  }
  public saveCompany(mode: string, costCenter: any) {
    var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
      "Saving data Please wait a moment..."
    );
    var message$: Observable<string> = messageSubject.asObservable();
    let childDialogRef = this.dialog.open(MessageDialog, {
      hasBackdrop: true,
      data: { header: "Information", message: message$ }
    });
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: costCenter };
    this.http
      .post(this.apiUrl + "/saveCompanyInfo", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            messageSubject.next("Data saved successfully");
            setTimeout(() => {
              childDialogRef.close();
            }, 1000);

            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            messageSubject.next(res.result);
            setTimeout(() => {
              childDialogRef.close();
            }, 1000);
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          let ret = this.resolveError(error, "savecompany");
          messageSubject.next(ret);
          setTimeout(() => {
            childDialogRef.close();
          }, 3000);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveCategory(mode: string, category: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: category };
    this.http
      .post(this.apiUrl + "/saveCategory", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveAccount(mode: string, Account: any, createMember = null, PartyAdditional: any = {}, DObj = null,SalesTargetData:any={},AdditionalBankObj=null) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: Account, PartyAdditional: PartyAdditional, createMember: createMember, DObj,SalesTargetData:SalesTargetData,AdditionalBankObj };
    this.http
      .post(this.apiUrl + "/saveAccount", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  //to load the vouher in trnmain. this is common function to load voucher
  public LoadTransaction(vchrno: string, division: string, phiscalID: string) {
    let bodyData = { VCHRNO: vchrno, DIVISION: division, PHISCALID: phiscalID };
    return this.http
      .post(this.apiUrl + "/getViewVoucher", bodyData, this.getRequestOption())
      .map(data => data.json())
      .share();
  }

  public getInvoiceData(vchrno: string, division: string, phiscalID: string, parac: string, tag: string = '', refbill: string = "") {
    let bodyData = { VCHRNO: vchrno, DIVISION: division, PHISCALID: phiscalID, PARAC: parac, tag: tag, REFBILL: refbill };
    return this.http
      .post(this.apiUrl + "/getInvoiceData", bodyData, this.getRequestOption())
      .map(data => data.json())
      .share();
  }


  public getAllInvoiceData(printParams){

    let bodyData = {
      "filename": printParams.filename,
      "Parameter": {"vchrno":printParams.VCHRNO,"voucherno":printParams.VCHRNO, "rowsnumber":printParams.rownumber,
                  "companyname":printParams.NAME, "companyaddress":printParams.ADDRESS , 
                  "division":printParams.INITIAL,"phiscalid":printParams.PhiscalID,"companyid":printParams.COMPANYID,"numtowords":printParams.numtowords,
                  "p1":printParams.panno1,"p2":printParams.panno2,"p3":printParams.panno3,"p4":printParams.panno4,"p5":printParams.panno5,"p6":printParams.panno6,"p7":printParams.panno7,"p8":printParams.panno8,"p9":printParams.panno9,
                  "branchname":printParams.BRANCHNAME,
                  "phone1":printParams.phone1,"phone2":printParams.phone2,"email":printParams.EMAIL,
                  "PRINTBY":printParams.PRINTBY,"companyemail":printParams.EMAIL,"companyvat":printParams.COMPANYVAT
              
              }
    };

    const type = 'application/pdf';
    const options = new RequestOptions({
      responseType: ResponseContentType.Blob,
      headers: new Headers({
        'Accept': type,
        Authorization: this.authService.getAuth().token
      })
    });
    return this.http
      .post(this.apiUrl + "/Pdf", bodyData, options)
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          })
        };
        return data;
      });
  }







  public getReprintData(vchrno: string, division: string, phiscalID: string, trnUser: string) {
    // let bodyData = { VCHRNO: vchrno, DIVISION: division, PHISCALID: phiscalID,TRNUSER:trnUser };
    return this.http
      .get(this.apiUrl + `/getReprintData?VCHRNO=${vchrno}&DIVISION=${division}&PHISCALID=${phiscalID}&TRNUSER=${trnUser}`, this.getRequestOption())
      .map(data => data.json())
      .share();
  }

  public LoadStockSettlement(vchrno: string) {
    let bodyData = { VCHRNO: vchrno };
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getStockSettlement", bodyData, this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();

          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getPrefixVname(vtype: VoucherTypeEnum) {
    if (vtype == 14) {
      return "TI";
    }
    switch (vtype) {
      case 12:
        return "JV";
      case 65:
        return "SV";
      case 17:
        return "PV";
      case 18:
        return "RV";
      case 3:
        return "PI";
      case 1:
        return "SI";
      // case 14:
      //   return "TI";
      case 5:
        return "IS";
      case 15:
        return "CN";
      case 16:
        return "DN";
      case 7:
        return "TR";
      case 8:
        return "TO";
      case 13:
        return "DL";
      case 2:
        return "SR";
      case 21:
        return "DR";
      case 9:
        return "DM";
      default:
        return "00";
    }
  }

  public checkUserValid() {
    return new Observable((observer: Subscriber<boolean>) => {
      this.http
        .get(this.apiUrl + "/checkLogin", this.getRequestOption())
        .subscribe(
          data => {
            this.state.setGlobalSetting("LoggedIn", ["true"]);
            observer.next(true);
            observer.complete();
          },
          Error => {
            observer.next(false);
            observer.complete();
          },
          () => {
            observer.complete();
          }
        );
    });
  }

  public IsLoginDialogOpened: boolean = false;
  public resolveError(error: any, callFrom: string) {
    try {
      let dialogResult;
      if (error.statusText == "Unauthorized") {
        if (this.IsLoginDialogOpened == true) {
          return;
        }
        this.IsLoginDialogOpened = true;
        let dialogRef = this.dialog.open(LoginDialog, { disableClose: true });
        dialogRef.afterClosed().subscribe(result => {
          this.IsLoginDialogOpened = false;
        });
        return null;
      }
      let err = error;
      if (
        err &&
        err == "The ConnectionString property has not been initialized."
      ) {
        if (this.IsLoginDialogOpened == true) {
          return;
        }
        this.IsLoginDialogOpened = true;
        let dialogRef = this.dialog.open(LoginDialog, { disableClose: true });
        dialogRef.afterClosed().subscribe(result => {
          this.IsLoginDialogOpened = false;
        });
        return null;
      }
      return err;
    } catch (ex) {
    }
  }

  public saveClientTerminal(mode: string, value: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: value };
    this.http
      .post(
        this.apiUrl + "/saveClientTerminal",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  getSingleObject(postData, postUrl: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: postData };
    this.http
      .post(this.apiUrl + postUrl, bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getList(data, url) {
    return this.http
      .post(this.apiUrl + url, data, this.getRequestOption())
      .map(data => data.json())
      .share();
  }
  public getSalesModeList(postobj) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = postobj;
    this.http
      .post(
        this.apiUrl + "/getSalesModeList",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  private _receipeitemList: any[] = [];
  public _receipeitemListObservable$: Observable<any[]>;
  public getReceipeItemList(refreshFromDatabase: boolean = false) {
    try {
      if (this._receipeitemList.length > 0 && refreshFromDatabase == false) {
        return Observable.of(this._receipeitemList);
      } else if (
        this._receipeitemListObservable$ &&
        refreshFromDatabase == false
      ) {
        return this._receipeitemListObservable$;
      } else {
        this._receipeitemListObservable$ = null;
        this._receipeitemList = [];
        this._receipeitemListObservable$ = this.http
          .post(
            this.apiUrl + "/getReceipeItemList",
            { EDATE: this._lastProductChangeDateLocal },
            this.getRequestOption()
          )
          .flatMap(res => res.json() || [])
          .map(data => {
            this._receipeitemList.push(<any>data);
            return this._receipeitemList;
          })
          .share();
        return this._receipeitemListObservable$;
      }
    } catch (ex) {
    }
  }
  public saveObject(mode: string, value: any, url: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: value };
    this.http
      .post(this.apiUrl + url, bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  getParentWiseProduct(MCODE: string) {
    alert("MCODE" + MCODE);
    return this.http
      .get(
        this.apiUrl + "/getParentWiseProduct/" + MCODE,
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }
  public getTreeForSchemeDiscount_MGroup() {
    return this.http
      .get(
        this.apiUrl + "/getTreeForSchemeDiscount_MGroup",
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }
  public getTreeForSchemeDiscount_Parent() {
    return this.http
      .get(
        this.apiUrl + "/getTreeForSchemeDiscount_Parent",
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }

  public saveschedule(mode: string, Account: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: Account };
    this.http
      .post(this.apiUrl + "/saveschedule", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getAllSchedule() {
    return this.http
      .get(this.apiUrl + "/getSchedule", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public saveScheme(
    mode: string,
    Account: any[],
    Flag,
    data: any,
    rangeList: any[]
  ) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = {
      mode: mode,
      data: data,
      dataList: Account,
      flag: Flag,
      dataRange: rangeList
    };
    this.http
      .post(this.apiUrl + "/schemeSave", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveComboList(comboList: any[]) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { data: comboList };
    this.http
      .post(this.apiUrl + "/saveComboList", comboList, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getSelectedComboList(Initial: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { DisID: Initial } };
    alert("getSelectedComboList");
    this.http
      .post(
        this.apiUrl + "/GETSelectedComboList",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  getAllSchemeList(Initial: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { DisID: Initial } };
    this.http
      .post(
        this.apiUrl + "/GetAllSchemeList",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  public getAllScheme() {
    return this.http
      .get(this.apiUrl + "/GetAllScheme", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  getParentWiseProductforScheme(MCODE: string) {
    return this.http
      .get(
        this.apiUrl + "/getParentWiseProductforScheme/" + MCODE,
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }
  private _comboList: any[] = [];
  public _ComboListObservable$: Observable<any[]>;
  public getComboList() {
    try {
      if (this._comboList.length > 0) {
        return Observable.of(this._comboList);
      } else if (this._ComboListObservable$) {
        return this._ComboListObservable$;
      } else {
        this._ComboListObservable$ = null;
        this._ComboListObservable$ = this.http
          .post(
            this.apiUrl + "/GETcombolist",
            { EDATE: this._lastProductChangeDateLocal },
            this.getRequestOption()
          )
          .flatMap(res => res.json() || [])
          .map(data => {
            this._comboList.push(<any>data);
            return this._comboList;
          })
          .share();
        return this._ComboListObservable$;
      }
    } catch (ex) {
    }
  }

  getComboIdWise(CID: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getItemfromComboId",
        { CID: CID },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  getWarehouseWiseCounterProduct(value) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();

    this.http
      .post(
        this.apiUrl + "/getWarehouseWiseCounterProduct",
        value,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  checkConsumptionDate(a: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/checkConsumptionEntryDate",
        { CID: a },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  // List
  getConsumptionList(a: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getConsumptionEntryList",
        { CID: a },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  public SaveConsumptionEntry(mode: string, List: any[], TRN: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: List, data2: TRN };
    this.http
      .post(this.apiUrl + "/saveConsumption", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  //Table
  public getAllConsumption() {
    return this.http
      .get(this.apiUrl + "/getAllConsumption", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  // private _AllConsumptionList: any[] = [];
  // public _AlllConsumptionListObservable$: Observable<any[]>;
  // public getAllConsumption() {
  //     alert("reached")
  //     try {
  //         if (this._AllConsumptionList.length > 0) {
  //             return Observable.of(this._AllConsumptionList);
  //         }
  //         else if (this._AlllConsumptionListObservable$) {

  //             return this._AlllConsumptionListObservable$;
  //         }
  //         else {
  //             this._AlllConsumptionListObservable$ = null;
  //             alert("reached2")
  //             this._AlllConsumptionListObservable$ = this.http.post(this.apiUrl + '/getAllConsumption', this.getRequestOption())
  //                 .flatMap(res => res.json() || [])
  //                 .map(data => {
  //                     this._AllConsumptionList.push(<any>data)
  //                     return this._AllConsumptionList;
  //                 })
  //                 .share();
  //             return this._AlllConsumptionListObservable$;
  //         }

  //     }
  //     catch (ex) {
  //     }
  // }

  getConsumptionFromID(CID: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getConsumptionFromID",
        { CID: CID },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  getAllMcodeNAME() {
    return this.http
      .get(this.apiUrl + "/getAllMcodeNAME", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  getAllSettlement() {
    return this.http
      .get(this.apiUrl + "/getAllSettlement", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  getSettlementMode() {
    return this.http
      .get(this.apiUrl + "/getSettlementMode", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  getStockSettlementFromID(CID: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getStockSettlementFromID",
        { CID: CID },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  public saveBatch(value: any, url: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { data: value };
    this.http
      .post(this.apiUrl + url, bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getReportData(dataToSave, postUrl) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();

    this.http
      .post(this.apiUrl + postUrl, dataToSave, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  //Additional Cost Service
  saveAdditionalCost(saveObj: any): any {
    let res = { status: "error", result: "" };
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { saveObj };
    // alert("masterService!!" + JSON.stringify(bodyData));
    this.http
      .post(
        this.apiUrl + "/saveAdditionalCost",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(res => {
      });
  }

  //Additional Cost Service Ends

  masterGetmethod(geturl) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    this.http.get(this.apiUrl + geturl, this.getRequestOption()).subscribe(
      data => {
        let retData = data.json();
        if (retData.status == "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      },
      error => {
        (res.status = "error2"), (res.result = error);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
    );
    return returnSubject;
  }

  masterPostmethod(posturl, data) {
    let res = { status: "error", result: "", result2: "", message: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();

    this.http
      .post(this.apiUrl + posturl, data, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            res.result2 = retData.result2;
            res.message = retData.message;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  showmessagedialog(message) {
    let dialogRef = this.dialog.open(MessageDialog, message);
    setTimeout(() => {
      this.dialog.closeAll();
    }, 5000);
  }
  public getAllBranch(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllBranchList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getAllChanel(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllChanelList", this.getRequestOption())
      .map(response => response.json() || []);
  }
  public getAllSalesHierarchyParent(refresh: boolean = false) {
    return this.http
      .get(
        this.apiUrl + "/getAllSalesHierarchyParentList",
        this.getRequestOption()
      )
      .map(response => response.json() || []);
  }

  public getAllProductHierarchyParent(refresh: boolean = false) {
    return this.http
      .get(
        this.apiUrl + "/getAllProductHierarchyParentList",
        this.getRequestOption()
      )
      .map(response => response.json() || []);
  }
  public getAllChannelParent(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllChanelParentList", this.getRequestOption())
      .map(response => response.json() || []);
  }
  public getAllProductCategoryLine(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getProdcutCategoryLineList", this.getRequestOption())
      .map(response => response.json() || []);
  }
  public getAllRouteMasterName(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllRouteMasterList", this.getRequestOption())
      .map(response => response.json() || []);
  }

  public getAllDivisionList(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getDivisionList", this.getRequestOption())
      .map(response => response.json() || []);
  }




  getitemfromMenuCat(MENUCAT: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { MCAT: MENUCAT } };
    this.http
      .post(
        this.apiUrl + "/getitemfromMenuCat",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  getStockList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        this.apiUrl + "/getStock/" + this._lastProductStockCheckDateLocal,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            // this._lastProductStockCheckDateLocal=new Date();
            //   this.getCurrentDate().subscribe(date => {
            //     this.authService.setSessionVariable("LastProductStockCheckDateLocal",date.Date);  }, error => {


            // });

            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  getPCL() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + "/getPCL", this.getRequestOption()).subscribe(
      response => {
        let data = response.json();
        if (data.status == "ok") {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        } else {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        }
      },
      error => {
        res.status = "error";
        res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
    );
    return returnSubject;
  }




  loadSalesInvoiceFromSalesOrder(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/GetSODetailForSaleInvoice?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  loadSalesInvoiceFromSupplierHO(voucerNo: string, FROMCOMPANYID: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getHOTaxInvoiceDetail?voucherNo=${voucerNo}&fromcompanyid=${FROMCOMPANYID}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  loadSAPPurchaseInvoiceDetail(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getSAPPurchaseInvoiceDetail?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }



  loadHoPerformaInvoice(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getHOPerformaInvoice?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  rejectPerformaInvoice(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/RejectHOPerformaInvoice?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  loadHoPurchaseOrder(voucerNo: string, FromCompanyid: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getHOPurchaseOrder?voucherNo=${voucerNo}&fromcompanyid=${FromCompanyid}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public inActiveAccount(status, accode: any, ACID) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { data: { ISACTIVE: status, ACCODE: accode, ACID: ACID } };
    this.http
      .post(this.apiUrl + "/DisableActiveAccount", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }



  loadPurchaseOrderForPOCancel(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getPurchaseOrderForPOCancel?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getAllSalesManTypeList(refresh: boolean = false) {
    return this.http.get(this.apiUrl + '/getAllSalesmanTypeList', this.getRequestOption())
      .map(response => response.json() || [])
  }

  approvePerformaInvoice(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/ApproveHOPerformaInvoice?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  approveStockSettlement(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/saveTransaction?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }



  TenderTypes() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/GetTenderTypes', this.getRequestOption()).subscribe(response => {
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

  public getAllExcelImportMasterList(refresh: boolean = false) {
    return this.http.get(this.apiUrl + '/getExcelConfigMasterList', this.getRequestOption())
      .map(response => response.json() || [])
  }

  getState() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getStates', this.getRequestOption()).subscribe(response => {
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
  GETTRNTYPE() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getTrnType', this.getRequestOption()).subscribe(response => {
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
  getDistrict() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getDistrict', this.getRequestOption()).subscribe(response => {
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


  getAreaDetail() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getAreaDetail', this.getRequestOption()).subscribe(response => {
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


  getParentNamebyID(partyID, mode) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + `/getParentName/${partyID}/${mode}`, this.getRequestOption()).subscribe(response => {
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

  getParentSubLedger(partyID) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + `/getParentSubLedger/${partyID}`, this.getRequestOption()).subscribe(response => {
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




  getCustomerBill() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getCustomerBill', this.getRequestOption()).subscribe(response => {
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
  SavePartyOpening(VOUCHERNO: string, TrnDate: string = null) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { data: { trnDate: TrnDate } };
    this.http
      .post(this.apiUrl + `/saveOpenings`, bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  DueVoucher(ACID: string, TrnDate: string = null, from: string = null, showZeroBalance: boolean = true, VIEWMODE = 0, vno = '%') {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { ACID: ACID, trnDate: TrnDate, showZero: showZeroBalance, VIEWMODE: VIEWMODE, VNO: vno } };
    this.http
      .post(this.apiUrl + `/DueVoucherList?from=${from}`, bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  public saveBillTrack() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { BList: this.BillTrackedList };
    this.http
      .post(this.apiUrl + "/saveBillTrack", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  checkAccountType(checkObj) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + '/getACIDForAccountTypeCheck', checkObj, this.getRequestOption()).subscribe(response => {
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




  SupplierDueVoucher(ACID: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { ACID: ACID } };
    this.http
      .post(this.apiUrl + "/DueVoucherList_Supplier", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  getGenericGridPopUpSettings(VoucherPrefix, VType = '',thevouchertag='') {
    var PID = this.PhiscalObj.PhiscalID;
    var division = this.PhiscalObj.Div;
    //console.log("PID",PID);
    PID = PID.replace("/", "ZZ")
    if (VoucherPrefix == "CN" || VoucherPrefix == "DN") {
      return {
        title: VoucherPrefix == "CN" ? "Credit Note" : "Debit Note",
        apiEndpoints: `/getMasterPagedListOfAny/${PID}/vtype/${division}`,
        defaultFilterIndex: 1,
        columns: Object.assign(
          [{
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false,
            alignment: 'right',
          },
          {
            key: 'PREFIXREMOVECHALANNO',
            title: 'REF NO',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          }
          ])
      };
    }

    if (VoucherPrefix == "REFBILLOFPURCHASERETURN") {
      return {
        title: "Bill Details",
        apiEndpoints: `/getTrnMainPagedList/PI/${PID}`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'VCHRNO',
            title: 'BILL NO',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFBILL',
            title: 'INVOICE NO.',
            hidden: false,
            noSearch: false
          },

          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    if (VoucherPrefix == "AO" || VoucherPrefix == "OB") {
      return {
        title: "Vouchers",
        apiEndpoints: `/getTrnMainPagedList/${VoucherPrefix}/${PID}`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'TDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'PREFIXREMOVECHALANNO',
            title: 'REF NO',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }
    if (VoucherPrefix == "AccountLedgerList") { //please use for transaction but  not for reports
      return {
        title: "Accounts",
        apiEndpoints: `/getAccountPagedListByMapId/Details/party Payment Expense`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }
    if (VoucherPrefix == "AllAcountList") {
      return {
        title: "Accounts",
        apiEndpoints: `/getAccountPagedListByMapId/Details/default`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }
   
    if (VoucherPrefix == "AccountGroupList") {
      return {
        title: "Accounts",
        apiEndpoints: `/getAccountGroupPagedList/PA`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACID',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "PartyLedgerList") { //please use for transaction but  not for reports
      return {
        title: "Party List",
        apiEndpoints: `/getAccountPagedListByMapId/Details/PartyOpeningBalance`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ADDRESS',
            title: 'ADDRESS',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "MainLedgerListAtSettingOne") {
      return {
        title: "Accounts",
        apiEndpoints: `/MainLedgerListAtSettingOne`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "MainLedgerListAtSettingTwo") {
      return {
        title: "Accounts",
        apiEndpoints: `/MainLedgerListAtSettingTwo`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "SubLedgerListAtSettingOne") {
      return {
        title: "Accounts",
        apiEndpoints: `/SubLedgerListAtSettingOne/undefined`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "SubLedgerListAtSettingTwo") {
      return {
        title: "Accounts",
        apiEndpoints: `/SubLedgerListAtSettingTwo`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "AccountListForVoucherRegister") {
      return {
        title: "Accounts",
        apiEndpoints: `/getAccountForVoucherRegisterReport`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACCODE',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "CashBookList") {
      return {
        title: "Accounts",
        apiEndpoints: `/getCashListForReport`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "BankBookList") {
      return {
        title: "Accounts",
        apiEndpoints: `/getBankBookListForReport`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "C" || VoucherPrefix == "V") {
      return {
        title: "Accounts",
        apiEndpoints: `/getAccountForOutstandingReport/${VoucherPrefix}`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (thevouchertag == "journal") {
      return {
        title: "Journal Vouchers",
        apiEndpoints: `/getMasterPagedListOfAny/${PID}/${VType}/${division}`,
        defaultFilterIndex: 1,
        columns: Object.assign(
          [{
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false,
            alignment: 'right',
          },
          {
            key: 'PREFIXREMOVECHALANNO',
            title: 'REF NO',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          }
          ])

        // columns: [
        //   {
        //     key: 'TRNDATE',
        //     title: 'DATE',
        //     hidden: false,
        //     noSearch: false
        //   },
        //   {
        //     key: 'VCHRNO',
        //     title: 'VOUCHER NO.',
        //     hidden: false,
        //     noSearch: false
        //   },
        //   {
        //     key: 'NETAMNT',
        //     title: 'AMOUNT',
        //     hidden: false,
        //     noSearch: false,
        //     alignment: true,
        //   },
        //   {
        //     key: 'PREFIXREMOVECHALANNO',
        //     title: 'REF NO',
        //     hidden: false,
        //     noSearch: false
        //   },

        //   // {
        //   //   key: 'RCM',
        //   //   title: 'TYPE',
        //   //   hidden: false,
        //   //   noSearch: false
        //   // },
        //   // {
        //   //   key: 'TRNSTATUS',
        //   //   title: 'STATUS',
        //   //   hidden: false,
        //   //   noSearch: false
        //   // },
        //   {
        //     key: 'REMARKS',
        //     title: 'REMARKS',
        //     hidden: false,
        //     noSearch: false
        //   }
        // ]
      };
    } if (VoucherPrefix == "AdditionalCost") {
      return {
        title: "Bill Details",
        apiEndpoints: `/getTrnMainPagedList/AD/${PID}`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'CHALANNO',
            title: 'BILL NO',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFBILL',
            title: 'TYPE',
            hidden: false,
            noSearch: false
          },

          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    if (VoucherPrefix == "AccountListAndSupplier") {
      return {
        title: "Accounts",
        apiEndpoints: `/getAccountLedgerAndSupplier`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "PAYMENTCOLLECTION") {
      return {
        title: "PAYMENT COLLECTION",
        apiEndpoints: `/getMasterPagedListOfAny/${PID}/vtype/${division}`,
        defaultFilterIndex: 1,
        columns: Object.assign(
          [
            {
              key: 'RECEIVEDATE',
              title: 'DATE',
              hidden: false,
              noSearch: false,
            },
            {
              key: 'COLLECTED_AMOUNT',
              title: 'COLLECTED AMOUNT',
              hidden: false,
              noSearch: false,
              alignment: 'right',
            },
          ])
      };
    }

    if (VoucherPrefix == "PIVoucherListForAdditionalCostReport") {
      return {
        title: "Voucher No",
        apiEndpoints: `/getPIVoucherNoForReport`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'VCHRNO',
            title: 'Invoice No',
            hidden: false,
            noSearch: false
          },
          {
            key: 'PI_REFBILL',
            title: 'Ref bill',
            hidden: false,
            noSearch: false
          },
          {
            key: 'AD_VCHRNO',
            title: 'Voucher No',
            hidden: false,
            noSearch: false
          },
          {
            key: 'AD_TRNDATE',
            title: 'Date',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "SalesManList") {
      return {
        title: "SalesMan",
        apiEndpoints: `/getAllSalesmanList/`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: "SALESMANID",
            title: "ID",
            hidden: false,
            noSearch: false
          },
          {
            key: "NAME",
            title: "NAME",
            hidden: false,
            noSearch: false
          },

        ]
      };

    }

    if (VoucherPrefix == "ProductList") {
      return {
        title: "Product",
        apiEndpoints: `/getProductCodePagedList`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: "MCODE",
            title: "ID",
            hidden: false,
            noSearch: false
          },
          {
            key: "DESCA",
            title: "NAME",
            hidden: false,
            noSearch: false
          }

        ]
      };

    }

    if (VoucherPrefix == "BrandList") {
      return {
        title: "Brand",
        apiEndpoints: `/getBrandCodePagedList`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: "BRANDCODE",
            title: "Brand ID",
            hidden: false,
            noSearch: false
          }
        ]
      };

    }

    if (VoucherPrefix == "RetailerList") {
      return {
        title: "Retailers",
        apiEndpoints: `/getRetailerPagedList/`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: "customerID",
            title: "ID",
            hidden: false,
            noSearch: false
          },
          {
            key: "ACNAME",
            title: "NAME",
            hidden: false,
            noSearch: false
          },

        ]
      };

    }

    if (VoucherPrefix == "SupplierList") {
        var voucherprefix="voucherprefix";
      return {
        title: "Supplier",
        apiEndpoints: `/getAccountPagedListByPType/PA/V/${voucherprefix}`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: "ACNAME",
            title: "NAME",
            hidden: false,
            noSearch: false
          },
          {
            key: "ACCODE",
            title: "CODE",
            hidden: false,
            noSearch: false
          },
          {
            key: "ADDRESS",
            title: "ADDRESS",
            hidden: false,
            noSearch: false
          },
          {
            key: "EMAIL",
            title: "EMAIL",
            hidden: false,
            noSearch: false
          }
        ]
      };

    }

    if (VoucherPrefix == "WarehouseList") {
      return {
        title: "Warehouse",
        apiEndpoints: `/getAllWarehousePagedList`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: "NAME",
            title: "Name",
            hidden: false,
            noSearch: false
          },
        ]
      };

      
    }

    
    if (VoucherPrefix == "Customer") { //please donot use for report
      return {
        title: "Party List",
        apiEndpoints: `/getAccountPagedListByMapId/Master/Customer`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "Supplier") { //donot use for reports
      return {
        title: "Party List",
        apiEndpoints: `/getAccountPagedListByMapId/Master/Supplier`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "ReverseCreditNote") {
      return {
        title: "Bill Details",
        apiEndpoints: `/getAdditionalCostData/RR`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'CHALANNO',
            title: 'BILL NO',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFBILL',
            title: 'TYPE',
            hidden: false,
            noSearch: false
          },

          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }

    if (VoucherPrefix == "PC") {
      return {
        title: "Vouchers",
        apiEndpoints: `/getTrnMainPagedList/${VoucherPrefix}/${PID}`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'TDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
          {
            key: 'PREFIXREMOVECHALANNO',
            title: 'REF NO',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
          {
            key: 'NETAMOUNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false,
            alignment: 'right',
          },
          {
            key: 'ISPOSTDATED',
            title: 'STATUS',
            hidden: false,
            noSearch: false,
            alignment: 'left',
          },
        ]
      };
    }

    if (VoucherPrefix == "Expenses Voucher") {
      return {
        title: "Party List",
        apiEndpoints: `/getAccountPagedListByMapId/Details/Expenses Voucher`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }
   
    if (VoucherPrefix == "PartyLedgerListForReport") { //toshow also party used in transaction & isactive 0
      return { //use for reports only, not for transaction 
        title: "Party List",
        apiEndpoints: `/getAccountPagedListByMapId/Details/PartyLedgersForReport`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ADDRESS',
            title: 'ADDRESS',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "AccountLedgerListForReport") { //toshow also ledger used in transaction & isactive 0
      return { //use for reports only, not for transaction 
        title: "Accounts",
        apiEndpoints: `/getAccountPagedListByMapId/Details/AccountLedgersForReport`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "CustomerListForReport") { //toshow also customer used in transaction & isactive 0
      return { //use for reports only, not for transaction 
        title: "Party List",
        apiEndpoints: `/getAccountPagedListByMapId/Master/CustomerListForReport`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "SupplierListForReport") { //toshow also customer used in transaction & isactive 0
      return { //use for reports only, not for transaction 
        title: "Party List",
        apiEndpoints: `/getAccountPagedListByMapId/Master/SupplierListForReport`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }
    if (VoucherPrefix == "PI" || VoucherPrefix == "IS") {
      return {
        title: "Purchase Invoices",
        apiEndpoints: `/getTrnMainPagedList/${VoucherPrefix}/tag`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'REFBILL',
            title: 'REFBILL.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'GRNNO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    if (VoucherPrefix == "DirectAndIndirectExpenseOnly") {
      return {  
        title: "Account List",
        apiEndpoints: `/getAccountPagedListByMapId/Master/DirectAndIndirectExpenseOnly`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACCODE',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }

    if (VoucherPrefix == "CC") {
      return {
        title: "Cash Collection",
        apiEndpoints: `/getTrnMainPagedList/${VoucherPrefix}/tag`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'CC_VCHRNO',
            title: 'Entry Number',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ENTRYDATE',
            title: 'Date',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TOTAL_CASHCOLLECTION',
            title: 'Amount',
            hidden: false,
            noSearch: false
          },
          {
            key: 'SALESMAN_NAME',
            title: 'Salesman',
            hidden: false,
            noSearch: false
          },
          {
            key: 'RV_VCHRNO',
            title: 'RV VoucherNo',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    return {
      title: "Vouchers",
      apiEndpoints: `/getTrnMainPagedList/${VoucherPrefix}/${PID}`,
      defaultFilterIndex: 1,
      columns: Object.assign([
        {
          // key: 'TRNDATE',
          key: 'TDATE', //IDATE is TRN_DATE
          title: 'DATE',
          hidden: false,
          noSearch: false,
          alignment: 'left',
        },
        {
          key: 'VCHRNO',
          title: 'VOUCHER NO',
          hidden: false,
          noSearch: false,
          alignment: 'left',
        },
        {
          key: 'PREFIXREMOVECHALANNO',
          title: 'REF NO',
          hidden: false,
          noSearch: false,
          alignment: 'left',
        },
        {
          key: 'NETAMOUNT',
          title: 'AMOUNT',
          hidden: false,
          noSearch: false,
          alignment: 'right',
        },
      ])
    };
  }

  getGenericGridPopUpSettingsForAdditionalCost(VoucherPrefix,PURCHASETYPE) {
    var PID = this.PhiscalObj.PhiscalID;
    PID = PID.replace("/", "ZZ")
    if (VoucherPrefix == "AdditionalCost") {
      return {
        title: "Bill Details",
        apiEndpoints: `/getAdditionalCostData/AD/${PURCHASETYPE}`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'VCHRNO',
            title: 'BILL NO',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFBILL',
            title: 'REFBILL',
            hidden: false,
            noSearch: false
          },

          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          
          {
            key: 'BILLTO',
            title: 'Supplier',
            hidden: PURCHASETYPE=='ALL'?false:true,
            noSearch: false
          }
        ]
      };
    }
  }
  getGenericGridPopUpSettingsForAdditionalCostReWork() {
    var Rno = this.RefObj.Refno.replace("/", "ZZ");

    return {
      title: "Bill Details",
      apiEndpoints: `/getAdditionalCostDataRework/${Rno}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'CHALANNO',
          title: 'BILL NO',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TRNDATE',
          title: 'DATE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'REFBILL',
          title: 'TYPE',
          hidden: false,
          noSearch: false
        },

        {
          key: 'NETAMNT',
          title: 'AMOUNT',
          hidden: false,
          noSearch: false
        }
      ]

    }
  }
  getAllChalanSeries(vType: string) {
    return this.http.get(`${this.apiUrl}/getChalanSeriesByVoucherType?vType=${vType}`, this.getRequestOption());
  }

  CHECKTRANSPORT() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/CheckTransport', this.getRequestOption()).subscribe(response => {
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
  public saveAccountLedgerOnly(mode: string, Account: any, SOLIST: any[] = [], BankPartyVerify = "", bankObj = "", PLedgerObj = "", AdditionalInfo = 0, autoCalculationParam = <any>{}, DObj = null) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: Account, SOList: SOLIST, BankPartyVerify: BankPartyVerify, bankObj: bankObj, PLedgerObj: PLedgerObj, AdditionalInfo: AdditionalInfo, autoCalculationParam: autoCalculationParam, DObj };
    this.http
      .post(this.apiUrl + "/saveAccountLedgerOnly", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  deleteAccount(mcode: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/DeleteAccount/' + mcode, this.getRequestOption()).subscribe(response => {
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


  getChildrenPartyAccount(PARENT) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getChildrenPartyAccount/' + PARENT, this.getRequestOption()).subscribe(response => {
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



  getAccountWiseTrnAmount(trnDate: string, companyId: string, acid: string, division: string, requestType: number = 0) {
    return new Observable((observer: Subscriber<any>) => {
      let url = `${this.apiUrl}/getAccountWiseTrnAmount/${requestType}?trnDate=${trnDate}&companyId=${companyId}&acid=${acid}&division=${division}`;
      this.http
        .get(url, this.getRequestOption())
        .subscribe(
          res => {
            let data = res.json();
            if (data.status == 'ok') {
              observer.next(data);
              observer.unsubscribe();
            }
            else {
              observer.next(data)
              observer.unsubscribe();
            }
          },
          error => {
            observer.next(<any>{});
          });
    });
  }

  invoiceListByDate(filter) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + '/getInvoiceListByDate', filter, this.getRequestOption()).subscribe(response => {
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

  public downloadAccountsForOpeningBalance() {
    return this.http
      .get(this.apiUrl + `/downloadledgerAcForOpeningBalance`, this.getRequestOption())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `Accounts_${this.userProfile.CompanyInfo.COMPANYID}.csv`
        };
        return data;
      });
  }

  getCostcenter() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getAllCostCenterList`, this.getRequestOption())
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

  getAreaList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getArea`, this.getRequestOption())
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

  getReportTitle(reportName: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getReportTitle/${reportName}`, this.getRequestOption())
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

  getUserList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getUserList', this.authService.getRequestOption())
      .map(res => res.json())
      .subscribe(data => {
        if (data.status == 'ok') {
          let r = data.result;
          returnSubject.next(r);
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







  getAccountListACIDNotLikePA() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getAccountLedgerForReport`, this.getRequestOption())
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

  getAccountListACIDLikePA() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getPartyLedgerForReport`, this.getRequestOption())
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


  getAccountList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getAllAccount`, this.getRequestOption())
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




  ValidateDate(date: string) {
    var dateFieldArray = date.split('/');
    var year = parseInt(dateFieldArray[2]);
    var month = parseInt(dateFieldArray[1]) - 1;
    var day = parseInt(dateFieldArray[0]);
    var d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
      return true;
    }
    return false;
  }
  changeIMsDateToDate(date) {
    var dateFieldArray = date.split('/');
    var year = dateFieldArray[2];
    var month = dateFieldArray[1];
    var day = dateFieldArray[0];
    var d = `${year}-${month}-${day}`
    return d;
  }

  customDateFormate(date: string) {
    var dateFieldArray = date.split('-');
    var year = dateFieldArray[0];
    var month = dateFieldArray[1];
    var day = dateFieldArray[2];
    var d = `${day}/${month}/${year}`;
    return d;
  }
  getAcidWisePartyList(ACID: string,sort:string = "") {
   
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodydata = {ACID:ACID, sort:sort};
    this.http.post(this.apiUrl + '/getParentWiseAccountPagedList', bodydata, this.getRequestOption()).subscribe(response => {
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
  getAcidWisePartyList_old(value) {

    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();

    this.http
      .post(
        this.apiUrl + "/getParentWiseAccountPagedList",
        value,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getCashListForReport() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getCashListForReport`, this.getRequestOption())
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

  getBankBookListForReport() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getBankBookListForReport`, this.getRequestOption())
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

  getSubLedgerForReport() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getSubLedgerForReport`, this.getRequestOption())
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

  getMainGroupForQuickAccountMaster() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getMainGroupForQuickAccountMaster`, this.getRequestOption())
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

  getSubGroupForQuickAccountMaster(acid) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodydata = { acid: acid }
    this.http.post(`${this.apiUrl}/getSubGroupForQuickAccountMaster`, bodydata, this.getRequestOption())
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

  getPartyGroupForQuickPartyMaster() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getPartyGroupForQuickPartyMaster`, this.getRequestOption())
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

  public getPrintFileName(voucherprefix: string) {
    let bodyData = { voucherprefix: voucherprefix };
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getPrintFileName", bodyData, this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();

          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getNumberToWords(vchrno, division, phiscalid, companyid,trnmode) {
    let bodyData = { vchrno: vchrno, division: division, phiscalid: phiscalid, companyid: companyid, trnmode: trnmode };
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getNumberToWords", bodyData, this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();

          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getCostCenterName(CCID: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { CCID: CCID };
    this.http
      .post(this.apiUrl + "/getCostCenterName", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getDetailsOfAccount(ACNAME: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { ACNAME: ACNAME };
    this.http
      .post(this.apiUrl + "/getDetailsOfAccount", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  validateDate(value) {
    ////console.log("Checaaa", value)
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    var FB = this.PhiscalObj.BeginDate
    FB = FB.substring(0, 10);
    var FE = this.PhiscalObj.EndDate
    FE = FE.substring(0, 10);
    if (value < FB) {
      returnSubject.next("error");
      returnSubject.unsubscribe();

    }
    return returnSubject;
  }
  DueVoucherAmendment(ACID: string, TrnDate: string = null, from: string = null, showZeroBalance: boolean = true, VIEWMODE = 0, vno = '%') {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { ACID: ACID, trnDate: TrnDate, showZero: showZeroBalance, VIEWMODE: VIEWMODE, VNO: vno } };
    this.http
      .post(this.apiUrl + `/DueVoucherListAmendment?from=${from}`, bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  DueVoucherAmendment_Nontracking(ACID: string, TrnDate: string = null, from: string = null, showZeroBalance: boolean = true, VIEWMODE = 0, vno = '%') {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { ACID: ACID, trnDate: TrnDate, showZero: showZeroBalance, VIEWMODE: VIEWMODE, VNO: vno } };
    this.http
      .post(this.apiUrl + `/DueVoucherListAmendment_NonTracking?from=${from}`, bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  public getAllSubLedger() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getAllSubLedger", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public saveSubLedgerMaster(mode: string, data: any) {
    let res = { status: "error", result: "" }
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
    let op: RequestOptions = new RequestOptions()
    let bodyData = { mode: mode, data: data };
    ////console.log("company item" + bodyData);
    this.http.post(this.apiUrl + "/saveSubLedgerMaster", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          res.status = "ok";
          res.result = retData.result
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
        else {
          res.status = "error1"; res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      },
        error => {
          res.status = "error2", res.result = error;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;

  }
  deleteVoucherSeriesMaster(mode: string, data: any){
    let res = { status: "error", result: "" }
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
    let op: RequestOptions = new RequestOptions()
    let bodyData = { mode: mode, data: data };
    ////console.log("company item" + bodyData);
    this.http.post(this.apiUrl + "/deleteVoucherByVseriesID", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          res.status = "ok";
          res.result = retData.result
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
        else {
          res.status = "error1"; res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      },
        error => {
          res.status = "error2", res.result = error;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;

  }

  public deleteSubLedgerMaster(mode: string, data: any) {
    let res = { status: "error", result: "" }
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
    let op: RequestOptions = new RequestOptions()
    let bodyData = { mode: mode, data: data };
    ////console.log("company item" + bodyData);
    this.http.post(this.apiUrl + "/deleteSubLedgerMaster", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          res.status = "ok";
          res.result = retData.result
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
        else {
          res.status = "error1"; res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      },
        error => {
          res.status = "error2", res.result = error;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;

  }

  getGenericGridSettingForSubLedger(mainledgeracid) {
    return {
      title: "Accounts",
      apiEndpoints: `/SubLedgerListAtSettingOne/${mainledgeracid}`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: 'ACCODE',
          title: 'AC CODE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'ACNAME',
          title: 'A/C NAME',
          hidden: false,
          noSearch: false
        },
      ]
    };

  }
  LoadData(LObj: LatePost) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { LObj: LObj };

    this.http.post(this.apiUrl + "/getVoucherLatePost", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getOwnCustomerIDForSelfBill(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getOwnCustomerIDForSelfBill?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getPclandCNDNmode(voucherprefix: string, voucherno: string) {
    let bodyData = { voucherprefix: voucherprefix, voucherno: voucherno };
    return this.http
      .post(this.apiUrl + "/getPclandCNDNmode", bodyData, this.getRequestOption())
      .map(data => data.json()).share()
  }

  public getLastSyncDate() {
    return this.http
      .get(this.apiUrl + "/getLastSyncDate", this.getRequestOption())
      .map(data => data.json()).share()
  }

  public getVoucherTypeList() {
    return this.http.get(this.apiUrl + "/getAllVoucherList", this.getRequestOption()).map(data => data.json()).share()
  }

  public saveVoucherSeries(mode: string, vseries: any) {
    ////console.log("inside master");
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: mode, data: vseries };
    this.http.post(this.apiUrl + "/saveVoucherSeries", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();

        } else {
          res.status = "error1"; res.result = retData.result;
         
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2", res.result = error;
  
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }

  public getAllVoucherSeriesList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getAllVoucherSeries", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getVoucherSeriesByName(vID: string) {
    let bodyData = { VseriesID: vID };
    return this.http
      .post(this.apiUrl + "/getVoucherByVseriesID", bodyData, this.getRequestOption())
      .map(data => data.json()).share();
  }

  getReceiveLogDataFromDate(DateTime: any, prefix: string, paymentmode: any = '') {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { DateTime: DateTime, PaymentMode: paymentmode };

    this.http.post(this.apiUrl + "/getReceiveLogDataFromDate/" + prefix, bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  getDateRangeValue(renumeringObj) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let data = { Data: renumeringObj }
    this.http.post(this.apiUrl + "/getDateRangeValue", data, this.getRequestOption())
      .subscribe(x => {
        let data = x.json();
        if (data.status == 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        }
        else {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        }
      },
        error => {
          res.status = 'error';
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();


        })
    return returnSubject;
  }

  savePaymentCollection(bodyData) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + "/savePaymentCollection", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  deletePaymentCollection(receivedate: string) {
    let bodyData = { RECEIVEDATEIS: receivedate };
    return this.http
      .post(this.apiUrl + "/deletePaymentCollection", bodyData, this.getRequestOption())
      .map(data => data.json()).share()
  }

  getEnableLatePost() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getEnableLatePost', this.getRequestOption()).subscribe(response => {
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

  saveVoucherLatePost(bodyData) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + "/saveVoucherLatePost", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  vlist: any[] = [];
  vlistObservable: Observable<any[]>;
  getVoucherType(voucherType: VoucherTypeEnum) {
    if (this.vlist.length > 0) {
      return Observable.of(this.vlist);
    }
    else if (this.vlistObservable) {
      return this.vlistObservable;
    }
    else {

      this.vlistObservable = this.http.post(this.apiUrl + '/getVoucherTypeList', { voucherType: voucherType }, this.getRequestOption())
        .flatMap(res => {
          return res.json() || []
        })
        .map(data => {
          this.vlistObservable = null;
          this.vlist.push(data)
          return this.vlist;
        }).share();
      return this.vlistObservable;
    }
  }

  LoadPostDirectory(FROMDATE: string,TODATE: string,PARTYID: string="", prefix: string,phiscalid:string,Voucher_Type:string="") {
    let bodyData = { FROMDATE: FROMDATE,TODATE: TODATE,PARTYID: PARTYID, PREFIX: prefix, PHISCALID: phiscalid,VOUCHER_TYPE:Voucher_Type };
    return this.http
      .post(this.apiUrl + "/LoadPostDirectory", bodyData, this.getRequestOption())
      .map(data => data.json()).share()
  }

  LoadCashCollection(CC_VCHRNO: string) {
    let bodyData = {CC_VCHRNO: CC_VCHRNO};
    return this.http
      .post(this.apiUrl + "/LoadCashCollection ", bodyData, this.getRequestOption())
      .map(data => data.json()).share()
  }

  public printPartyBalance(filename, PartyBalanceData) {
    let bodyData = {
      "filename": filename,
      "Parameter": {
        "DATE1": PartyBalanceData.DATE1, "DATE2": PartyBalanceData.DATE2, "DIVISION": PartyBalanceData.DIVISION, "COSTCENTER": PartyBalanceData.COSTCENTER, "ACID": PartyBalanceData.ACID, "PHISCALID": PartyBalanceData.PHISCALID, "COMPANYID": PartyBalanceData.COMPANYID,
        "COMPANYNAME": PartyBalanceData.COMPANYNAME, "COMPANYADDRESS": PartyBalanceData.COMPANYADDRESS, "PANNO": PartyBalanceData.PANNO,"NAME":PartyBalanceData.NAME,"ADDRESS":PartyBalanceData.ADDRESS,"VATNO":PartyBalanceData.VATNO,
        "numtowords": PartyBalanceData.numtowords, "NETAMOUNT": PartyBalanceData.NETAMOUNT,"vchrno": PartyBalanceData.VCHRNO,"voucherno": PartyBalanceData.VCHRNO,"TRNUSER":PartyBalanceData.TRNUSER,"caption":PartyBalanceData.caption
      }
    };

    const type = 'application/pdf';
    const options = new RequestOptions({
      responseType: ResponseContentType.Blob,
      headers: new Headers({
        'Accept': type,
        Authorization: this.authService.getAuth().token
      })
    });
    return this.http
      .post(this.apiUrl + "/Pdf", bodyData, options)
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          })
        };
        return data;
      });
  }

  LoadPartyBalanceData(PartyBalanceData: any = []) {
    return this.http
      .post(this.apiUrl + "/LoadPartyBalanceData", PartyBalanceData, this.getRequestOption())
      .map(data => data.json()).share()
  }

  public SaveAdditionalCostReport(reportparam) {
    return this.http
      .post(this.apiUrl + "/SaveAdditionalCostReport", reportparam, this.getRequestOption())
      .map(data => data.json())
      .share();
  }
  public getRoleUserRights() {
    return this.http.get(this.apiUrl + "/getRoleUserRights", this.getRequestOption()).map(data => data.json()).share()
  }

  LoadOpeningValue(bodyData, fname) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + "/loadOpeningValue/" + fname, bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getAllPhiscalYearExceptCurrent() {
    let res = { status: 'error', result: '' };
    let returnSubject: Subject<any> = new Subject();
    let header = new Headers({ 'content-type': 'application/json' });
    let option = new RequestOptions({ headers: header })
    let re = /\//gi;
    let CurrentPhiscalID = this.PhiscalObj.PhiscalID.replace(re, "ZZ");
    this.http.get(this.apiUrl + '/getAllPhiscalYearExceptCurrent/' + CurrentPhiscalID, option)
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

  public validateMasterCreation(value) {

    if (this.userProfile.CompanyInfo.MAIN == 0 && this.userSetting.EnableCentralMasterCreation == 1) {
      this.alertService.warning("Sorry, Cannot " + value + " masters from other branch");
      return false;
    }
    else {
      return true;
    }
  }
  getAccListDivision() {
    return this.http.get(this.apiUrl + "/getAccListDivision", this.getRequestOption()).map(data => data.json()).share()
  }
  getDivisionFromRightPrivelege() {
    return this.http.get(this.apiUrl + "/getDivisionFromRightPrivelege", this.getRequestOption()).map(data => data.json()).share()
  }
  showAll: Boolean;
  AccListDiv: any[] = [];
  getAccDivList() {
    this.getAccListDivision().subscribe(data => {
      if (data.status == 'ok' && data.result.length > 0) {
        if (data.result[0].ISSELECTALL == "%") {

          this.showAll = true;
          this.AccListDiv = data.result;
        }
        else {
          this.showAll = false;
        }
        this.viewDivision.next();
      }
    })
  }
  getExcelFile(url: any, fileName: any) {
    const type = 'application/vnd.ms-excel';
    const options = new RequestOptions({
      responseType: ResponseContentType.Blob,
      headers: new Headers({
        'Accept': type,
        Authorization: this.authService.getAuth().token
      })
    });

    return this.http
      .post(this.apiUrl + url, fileName, options)
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: fileName.filtername + `.xlsx`
        };
        return data;
      });
  }
  getExcelFileFilter(url: any, fileName: any) {
    console.log("@@fileName",fileName)
    const type = 'application/vnd.ms-excel';
    const options = new RequestOptions({
      responseType: ResponseContentType.Blob,
      headers: new Headers({
        'Accept': type,
        Authorization: this.authService.getAuth().token
      })
    });
    // let opt = this.getRequestOption();
    // let hd: Headers = new Headers({ "Content-Type": "application/json" });
    // let op: RequestOptions = new RequestOptions();
    return this.http
      .post(this.apiUrl + url, fileName, options)
      .map((response: Response) => {

        let data = {

          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: fileName.data.FILTER + `.xlsx`
        };

        return data;
      });
  }
  downloadFile(response: any) {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(response.content);
    element.download = response.filename;
    document.body.appendChild(element);
    element.click();
  }


  getAccountListOfTree() {
    return this.http.get(this.apiUrl + "/getAccountTree", this.getRequestOption())
      .map(data => data.json()).share()
  }

  ShiftParent(params) {
    return this.http.post(this.apiUrl + "/ShiftParent", params, this.getRequestOption())
      .map(data => data.json()).share()
  }


  getGridSettingForRetailerBySalesman(salemanId) {
    return {
      title: "Retailers",
      apiEndpoints: `/getPagedRetailerListBySalesman/${salemanId}`,
      defaultFilterIndex: 0,
      useDefinefilterValue: salemanId,
      columns: [
        {
          key: "ACNAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "customerID",
          title: "ID",
          hidden: false,
          noSearch: false
        },
        {
          key: "ADDRESS",
          title: "ADDRESS",
          hidden: false,
          noSearch: false
        },
        {
          key: "EMAIL",
          title: "EMAIL",
          hidden: false,
          noSearch: false
        }
      ]
    };
  }

  deleteCostCenter(CCID: string) {
    let bodyData = { CCID: CCID };
    return this.http
      .post(this.apiUrl + "/deleteCostCenter", bodyData, this.getRequestOption())
      .map(data => data.json()).share()
  }
  deleteCostCenterGroup(CCID: string) {
    let bodyData = { ccgid: CCID };
    return this.http
      .post(this.apiUrl + "/deleteCostCenterGroup", bodyData, this.getRequestOption())
      .map(data => data.json()).share()
  }
  
  saveRenumering(bodyData) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + "/saveRenumering", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getunsalableWarehouseList() {
    return this.http
      .get(this.apiUrl + "/getAllUnsalableWarehouseList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getDetailsByUserDivision(userDivision) {
    return this.http
      .get(this.apiUrl + "/getDetailsByUserDivision/" + userDivision, this.getRequestOption())
      .map(response => response.json() || []);
  }
  getProductListByIDandDate(GroupID: string, ParentID: string, HasChild: number, sort: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { sort: sort };
    this.http.post(this.apiUrl + '/getProductListByID', bodyData).subscribe(response => {
      let data = response;
      //console.log("CheckDateLog", data)
      returnSubject.next(data);
      returnSubject.unsubscribe();

    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  DownLoadAllExcelReportPreparedFromAPI(reportData: any) {

    const type = 'application/vnd.ms-excel';
    if (reportData.extension == "xlsx") {
      const type = 'application/vnd.ms-excel';
    }
    else if (reportData.extension == "zip") {
      const type = 'application/zip';
    }

    const options = new RequestOptions({
      responseType: ResponseContentType.Blob,
      headers: new Headers({
        'Accept': type,
        Authorization: this.authService.getAuth().token
      })
    });
    let reportdownloadname = reportData.REPORTDISPLAYNAME ? reportData.REPORTDISPLAYNAME : reportData.reportname;
    let agingLimit =  this.userProfile.userRights.find(x => x.right =='StockAgeingLimit').value;    
    reportData.AgeLimit=agingLimit;
    return this.http
      .post(this.apiUrl + `/downLoadAllReportExcel`, reportData, options,)
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `${reportdownloadname}.${reportData.extension}`
        };
        return data;
      });

  }

  getAcidWiseAccountList(ACID: string, sort: string = "") {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { ACID: ACID, sort: sort };
    this.http.post(this.apiUrl + '/getAccountWisePagedList', bodyData, this.getRequestOption()).subscribe(response => {
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

  saveBankDetail(bodyData) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + "/saveBankDetails", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  LoadDataForEPayment(LObj: LatePost) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { LObj: LObj };

    this.http.post(this.apiUrl + "/getEPaymentStatus", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  saveEPayment(bodyData) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + "/saveEPayment", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getGivenNumberToWords(givennumber) {
    let bodyData = { givennumber: givennumber };
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getGivenNumberToWords", bodyData, this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();

          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getPartyGroupList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getPartyGroup`, this.getRequestOption())
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
  public getRequestOptionCellPay() {
    let headers: Headers = new Headers({
      "Content-type": "application/json",
     
    });
    return new RequestOptions({ headers: headers });
  }
  public getFeeFromCellPay(amount) {
    let bodyData = { "amount": amount };
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    const options = {withCredentials: false, 'access-control-allow-origin': "http://localhost:4200", 'Content-Type': 'application/json'}
    let headers: Headers = new Headers({
      "Content-type": "application/json",
    });
   this.http
      .post("https://sdk.cellpay.com.np/api/getFee", bodyData, options)
      .subscribe(response => {
        let data = response.json();
        if (data.statusText == 'OK') {
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

  getPartyCategoryList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getPartyCategory`, this.getRequestOption())
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

  getEpaymentbankdetails(voucherno) {
    let bodyData = {VCHRNO: voucherno };
    return this.http
      .post(this.apiUrl + "/getEpaymentDetails", bodyData, this.getRequestOption())
      .map(data => data.json()).share()
  }

  
  public saveMerchantDetails(details: any) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { data: details };
    this.http.post(this.apiUrl + "/saveMerchantDetails", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();

        } else {
          res.status = "error1"; res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2", res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }
  
  public savePartyCategory(details: any) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { data: details };
    this.http.post(this.apiUrl + "/savePartyCategory", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();

        } else {
          res.status = "error1"; res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2", res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }


  //Save Print Log of Payment Voucher
  public savePrintLog(vchrno: string, division: string, phiscalID: string, trnUser: string) {
     return this.http
     .get(this.apiUrl + `/savePrintLog?VCHRNO=${vchrno}&DIVISION=${division}&PHISCALID=${phiscalID}&TRNUSER=${trnUser}`, this.getRequestOption())
     .map(data => data.json())
     .share();
      }

   // Reprinted caption for payment voucher
   public getPrintTitleAsReprinted(vchrno: string, division: string, phiscalID: string, trnUser: string) {
       return this.http
         .get(this.apiUrl + `/getPrintTitleAsReprinted?VCHRNO=${vchrno}&DIVISION=${division}&PHISCALID=${phiscalID}&TRNUSER=${trnUser}`, this.getRequestOption())
         .map(data => data.json())
         .share();
  }

  public LatePostDatedinRVPV(vchrno: any) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { vchrno: vchrno };
    this.http.post(this.apiUrl + "/LatePostDatedinRVPV", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error1";
          res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2",
        res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }

  public getBatchOfItem(vchrno: any,mcode:any) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { vchrno: vchrno,mcode:mcode };
    this.http.post(this.apiUrl + "/getBatchOfItem", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error1";
          res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2",
        res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }

  public CheckIfRefbillIsCellpay(vchrno: any) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { vchrno: vchrno };
    this.http.post(this.apiUrl + "/CheckIfRefbillIsCellpay", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error1";
          res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2",
        res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }

  public CheckCellPayPaymentDone(vchrno: any) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { vchrno: vchrno };
    this.http.post(this.apiUrl + "/CheckCellPayPaymentDone", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error1";
          res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2",
        res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }
  nullToZeroConverter(value) {

    if (
      value === undefined ||
      value == null ||
      value === null ||
      value === '' ||
      value === 'Infinity' ||
      value === 'NaN' ||
      Number.isNaN(value) ||
      isNaN(parseFloat(value))
    ) {
      return 0;
    }
    return parseFloat(value);
  }


  checkDuplicateReverseEntry(RefBill: string) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { REFBILL: RefBill };
    this.http.post(this.apiUrl + "/checkDuplicateReverseEntry", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error1";
          res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2",
        res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }

  
  reverseEntryAutorisation(reverseAuth:any){
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    // let bodyData = { REFBILL: RefBill };
    this.http.post(this.apiUrl + "/authorizeReverseEntry", reverseAuth, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error1";
          res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2",
        res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }
  public CheckPost(vchrno: any) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { vchrno: vchrno };
    this.http.post(this.apiUrl + "/CheckPost", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error1";
          res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2",
        res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }

  getBatchidVoucherwise(VCHRNO: string) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { VCHRNO: VCHRNO };
    this.http.post(this.apiUrl + "/getBatchidVoucherwise", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error1";
          res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2",
        res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }
  saveErrorLog(bodyData){
   
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
    .post(
      this.apiUrl + "/saveErrorTransactionJson",
      bodyData,
      this.getRequestOption()
    ).subscribe(
      data => {
        // let ErrorObj : any = <any>{};
        // let Formname = bodyData.VoucherPrefix;
        // ErrorObj.Formname = Formname;
        // ErrorObj.Data = bodyData;
        // console.log("A",ErrorObj)
        // localStorage.setItem("Error_Json",JSON.stringify(ErrorObj))
        let retData = data.json();
        if (retData.status == "ok") {
          returnSubject.next();
        } else {
          res.status = "error1";
          res.result = retData.result;
      
            returnSubject.next(res);
        
        }
      }, error => {
        // localStorage.setItem("ErrorJson",JSON.stringify(bodyData))
        if(confirm(
          "Do you want to download the error  json? "
        )){
          var theJSON = JSON.stringify(bodyData);
          var element = document.createElement('a');
          element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
          element.setAttribute('download', "ErrorJson.json");
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }

        res.status = "error2",
        res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      })
  }
  public importJsonFileForTransaction(voucherType) {
    let res = { status: 'error', result: "" }
    let returnSubject: Subject<any> = new Subject();
    // let bodyData = { vchrno: vchrno };
    this.http.get(this.apiUrl + "/importJsonFileForTransaction/"+voucherType, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status = "ok") {
          res.status = "ok";
          res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error1";
          res.result = retData.result;
          //console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = "error2",
        res.result = error;
        //console.log(res);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }

  public downloadErrorFile(downloadUrl: string, filename: string = "download") {
    const type = 'application/vnd.ms-excel';
    const options = new RequestOptions({
              responseType: ResponseContentType.Blob,
              headers: new Headers({ 'Accept': type,
              Authorization: this.authService.getAuth().token
            })
          });

    return this.http
      .get(this.apiUrl + `${downloadUrl}`, options) 
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `${filename}.xlsx`
        };
        return data;
      });
  }

  getDetailsforchartjs(date: string, divison: string, fyid: string) {
    return this.http
      .get(this.apiUrl + `/getDashBoardDebtorsCreditorsValue?date=${date}&div=${divison}&fyid=${fyid}`, this.getRequestOption())
      .map(data => data.json())
      .share();
  }
  getdashboardmaindata(date: string, divison: string, fyid: string) {
    return this.http.get(this.apiUrl + `/getDashBoardMainData?date=${date}&div=${divison}&fyid=${fyid}`, this.getRequestOption())
      .map(data => data.json())
      .share();
  }



  getIncomeExpensesAccounting(date: string, divison: string, fyid: string, reportmode: number) {
    return this.http.get(this.apiUrl + `/getDashboardIncomeExpenses?date=${date}&div=${divison}&fyid=${fyid}&REPORTMODE=${reportmode}`, this.getRequestOption())
      .map(data => data.json())
      .share();
  }

  getDashboardexpensesforchart(date: string, divison: string, fyid: string, reportmode: number) {
    return this.http.get(this.apiUrl + `/getDashboardIndirectExpenses?date=${date}&div=${divison}&fyid=${fyid}&REPORTMODE=${reportmode}`, this.getRequestOption())
      .map(data => data.json())
      .share();
  }

  getReceivePaymentforchart(date: string, divison: string, fyid: string, reportmode: number) {
    return this.http
      .get(this.apiUrl + `/getDashBoardReceivePayment?date=${date}&div=${divison}&fyid=${fyid}&REPORTMODE=${reportmode}`, this.getRequestOption())
      .map(data => data.json())
      .share();
  }

    public saveImporterPurchaseCosting(ImporterCostingList: any={}) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = {ImporterCostingList:ImporterCostingList};
    this.http
      .post(this.apiUrl + "/saveImporterPurchaseCosting", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getPurchaseImportDetails(voucherno: string) {
    let _voucherno = voucherno.replace("/", "ZZ");
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getPurchaseImportDetails/${_voucherno}`, this.getRequestOption())
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

  public extractData(res: Response) {
    let response = res.json();
    return response || {};
  }
  public handleError(error: Response | any) {
    return Observable.throw(error);
  }

  public PIVoucherDetail(voucherno) {
    let _voucherno = voucherno.replace("/", "ZZ");
    return this.http.get(`${this.apiUrl}/PIVoucherDetail/${_voucherno}`, this.getRequestOption())
      .map(this.extractData)
      .catch(this.handleError)
  }
  public saveFiscalYear(fiscalData: any,StartDate_BS:any,EndDate_BS:any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { data: fiscalData,StartDateInBS:StartDate_BS,EndDateInBS:EndDate_BS};
    this.http
      .post(this.apiUrl + "/saveFiscalYear", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          //    console.log(retData);
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            // console.log(res);
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          // console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getTDSTypeList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(`${this.apiUrl}/getTDSTypeList`, this.getRequestOption())
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

  // OpeningDetails(date,acid,div,phiscalid){
  //   return this.http
  //   .get(this.apiUrl + `/OpeningDetails?date=${date}&acid=${acid}&div=${div}&phiscalid=${phiscalid}`, this.getRequestOption())
  //   .map(data => data.json())
  //   .share();
  //    }

  getSalesDataDateWise(Fromdate: any, Todate: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { Fromdate: Fromdate, Todate: Todate };

    this.http.post(this.apiUrl + "/getSalesDataDateWise", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getCashCollectionDetails(cashCollection: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let mode:any="query"
    let bodyData = { data:cashCollection};

    this.http.post(this.apiUrl + "/getCashCollectionDetails", bodyData, this.getRequestOption())
    .subscribe(
      response => {
        let data = response.json();
        if (data.status == "ok") {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        } else {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        }
      },
      error => {
        res.status = "error";
        res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
    );
  return returnSubject;
  }
  getCostCenterGroupPagedList(){
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + "/getCostCenterGroupPagedList", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  saveCashCollection(bodyData) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + "/saveCashCollection", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

    saveBudgetAllocation(bodyData) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + "/saveBudgetAllocation", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getAllBudgetList(fiscalyear:string,division:string) {
    let re = /\//gi;
    fiscalyear = fiscalyear.replace(re, "ZZ");
    return new Observable((observer: Subscriber<Company>) => {
      let res = { status: "error", result: "" };
      this.http
        .get(this.apiUrl + `/getAllBudgetList/${fiscalyear}/${division}`, this.getRequestOption())
        .map(ret => ret.json())
        .subscribe(
          data => {
            observer.next(data);
          },
          error => {
            let ret = this.resolveError(error, "getAllBudgetList");
            if (ret == "Login resolved") {
              return;
            }
            observer.next(null);
            observer.complete();
          }
        );
    });
  }

  // public showCostCenterList(ccgid) {
  //   return new Observable((observer: Subscriber<Company>) => {
  //     let res = { status: "error", result: "" };
  //     this.http.get(this.apiUrl + `/getCostCenterPagedListAccordingToId/${ccgid}`, this.getRequestOption())
       
  //       .map(ret => ret.json())
  //       .subscribe(
  //         data => {
  //           observer.next(data);
  //         },
  //         error => {
  //           let ret = this.resolveError(error, "getCostCenterPagedList");
  //           if (ret == "Login resolved") {
  //             return;
  //           }
  //           observer.next(null);
  //           observer.complete();
  //         }
  //       );
  //   });
  // }

  sendCostCenterList(ccgid) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + `/getCostCenterPagedListAccordingToId/${ccgid}`, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }


  
  deleteBudgetAllocated(VCHRNO: string) {
    let bodyData = { VCHRNO: VCHRNO };
    return this.http
      .post(this.apiUrl + "/deleteBudgetAllocated", bodyData, this.getRequestOption())
      .map(data => data.json()).share()
  }

  LoadBudgetAllocation(VCHRNO: string) {
    let bodyData = {VCHRNO: VCHRNO};
    return this.http
      .post(this.apiUrl + "/LoadBudgetAllocation ", bodyData, this.getRequestOption())
      .map(data => data.json()).share()
  }

  getBudgetStatus(parameters: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let mode:any="query"
    let bodyData = { data:parameters};

    this.http.post(this.apiUrl + "/getBudgetStatus", bodyData, this.getRequestOption())
    .subscribe(
      response => {
        let data = response.json();
        if (data.status == "ok") {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        } else {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        }
      },
      error => {
        res.status = "error";
        res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
    );
  return returnSubject;
  }

}







export class HotkeyConfig {
  [key: string]: string[];
}
export class ConfigModel {
  hotkeys: HotkeyConfig;
}
export class Command {
  name: string;
  combo: string;
  ev: KeyboardEvent;
}
export class PhiscalTab {
  BeginDate: Date;
  EndDate: Date;
  PhiscalID: string;
  tabID: number;
}

export interface AccountGroup {
  MGROUP: string;
  SUBGROUP_A: string;
  SUBGROUP_B: string;
  SUBGROUP_C: string;
  PARENT: string;
}
