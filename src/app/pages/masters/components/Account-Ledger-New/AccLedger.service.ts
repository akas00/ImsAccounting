import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
// import { IDivision } from '../../../../common/interfaces';
// import { AlternateUnit} from '../../../../common/interfaces/TrnMain';
import { AlternateUnit, IDivision, Item, Product, ItemRate, ProductType, KotCategory, Model, Brand, RateDiscount, TBarcode } from '../../../../common/interfaces';
import { Subject } from 'rxjs/subject'
import { GlobalState } from "../../../../global.state";
import { TreeComponent, IActionMapping, TREE_ACTIONS, KEYS } from 'angular-tree-component';
import { Subscription } from 'rxjs';
import { ContextMenuComponent } from 'ngx-contextmenu';


const actionMapping: IActionMapping = {
    mouse: {
      contextMenu: (tree, node, $event) => {
        $event.preventDefault();
        alert(`context menu for ${node.data.ACNAME}`);
      },
      dblClick: (tree, node, $event) => {
        if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      },
      click: (tree, node, $event) => {
        $event.shiftKey
          ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
          : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event)
      }
    },
    keys: {
      [KEYS.ENTER]: (tree, node, $event) => node.setActiveAndVisible()
      //[KEYS.ENTER]: (tree, node, $event) =>  alert(`This is ${node.data.name}`)
    }
  };






@Injectable()
export class TreeViewAccService {
    private _treeEnable: Boolean = true;
//   mainGroupList: any = [];
//   subGroupAList: any = [];
//   subGroupBList: any = [];
// //   subGroupCList: any = [];
//   groupSelectObj: AccountGroup = <AccountGroup>{};
//   modeTitle: string;/
    public get treeEnable(): Boolean { return this._treeEnable; } 
    public set treeEnable(value: Boolean) { this._treeEnable = value; }

    @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
    ParentInfo:any=<any>{};

    public nodes: any[] = [];
    @ViewChild(TreeComponent)
    public tree: TreeComponent;
    busy: Subscription;
    subTitle:string;
    isGroup : boolean;
    addGroupSubject: Subject<any> = new Subject<any>();
   // addGroup$: Observable<any> = this.addGroupSubject.asObservable();
    loadTableListSubject : Subject<any>=new Subject<any>();
    loadTableList$ : Observable<any> = this.loadTableListSubject.asObservable();
    partyList: any = [];
    sortAccount:any;

    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState, private masterService: MasterRepo) {
    
        ////console.log("tree",this.tree);
        this.isGroup = false;
    }


    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }
    getParentWisePartyList(ACID: string) {
        return this.http.get(this.apiUrl + '/getParentWiseAccount/' + ACID, this.getRequestOption()).flatMap(response => response.json() || []);
    }


    getParentWisePartyPgwsList(ACID: string) {
        return this.http.get(this.apiUrl + '/getParentWiseAccount/' + ACID, this.getRequestOption()).flatMap(response => response.json() || []);
    }

    getNewValues(mcode: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getNewValues/' + mcode, this.getRequestOption()).subscribe(response => {
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

    getPartyList(mcode: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getPartyList/' + mcode, this.getRequestOption()).subscribe(response => {
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
    getAllParty(ACID: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getAllData/' + ACID, this.getRequestOption()).subscribe(response => {
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
    savePartyList(mode: string, prodObj: Product, RGLIST: ItemRate[], AlternateUnits: AlternateUnit[], PBarCodeCollection: TBarcode[]) {
        let res = { status: "error", result: "" }
        let returnSubject: Subject<any> = new Subject();
        let opt = this.getRequestOption();
        let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
        let op: RequestOptions = new RequestOptions()
        let bodyData = { mode: mode, data: { product: prodObj, rglist: RGLIST, alternateunits: AlternateUnits, pbarcodes: PBarCodeCollection } };
        ////console.log("product json");
        var data = JSON.stringify(bodyData, undefined, 2);
        //console.log(data);
        this.http.post(this.apiUrl + "/savePartyList", bodyData, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                //console.log(retData);
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
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        //console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }

    public getParentGroups(acid: string) {
        //console.log({ acid: acid })
        return new Observable((observer: Subscriber<GroupParty[]>) => {
            this.http.get(this.masterService.apiUrl + '/getParents?acid=' + acid, this.masterService.getRequestOption())
                .map(data => {
                    //console.log({ parentGrop: data })
                    return data.json()
                })
                .subscribe(res => {
                    if (res.status == 'ok') {
                        observer.next(res.result);
                    }
                }, error => {
                    this.masterService.resolveError(error, 'getParents');
                    observer.complete();
                },
                () => {
                    observer.complete();
                }
                )
        })


    }

    public getChildrenGroups(acid: string) {
        //console.log({ getChildrenAcid: acid, url: this.masterService.apiUrl + '/getChildren?' + acid });
        return new Observable((observer: Subscriber<GroupParty[]>) => {
            this.http.get(this.masterService.apiUrl + '/getChildren?acid=' + acid, this.masterService.getRequestOption())
                .map(data => data.json())
                .subscribe(res => {
                    //console.log({ getChildrenResult: res });
                    observer.next(res.result);
                }, error => {
                    this.masterService.resolveError(error, 'getChildren');
                    observer.complete();
                },
                () => {
                    observer.complete();
                }
                )
        })
    }

    public getTopGroups() {
        return new Observable((observer: Subscriber<GroupParty[]>) => {
            this.http.get(this.masterService.apiUrl + '/getTopPartyGroups', this.masterService.getRequestOption())
                .map(data => data.json())
                .subscribe(res => {
                    observer.next(<GroupParty[]>res.result);
                }, error => {
                    this.masterService.resolveError(error, 'getTopGroups');
                    observer.complete();
                },
                () => {
                    observer.complete();
                }
                )
        })
    }
    getHierachy() {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getAllHierachy', this.getRequestOption()).subscribe(response => {
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


    Refresh() {
        this.masterService._accountTree = [];
        this.masterService.getAccountTreeObservable = null;
        this.busy = this.masterService.getacListTree().map(x => { return x })
          .subscribe(res => {
            this.nodes = res;
            if (this.tree != null) {
              this.tree.treeModel.update();
            }
          }, error => {
            var err = this.masterService.resolveError(error, "partyledger - partyledger");
            if (err) { alert(err.json()); }
          }
          );
      }
    
      getMainGroupList(){
        let res = {status: 'error', result: ""};
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl+'/getMainGroupList', this.getRequestOption())
        .subscribe( response =>{
            let data = response.json();
            if(data.status == 'ok'){
                returnSubject.next(data);
                returnSubject.unsubscribe();
            }else{
                returnSubject.next(data)
                returnSubject.unsubscribe();
            }
        }, error =>{
            res.status = 'error'; res.result = error;
            returnSubject.next(res);
            returnSubject.unsubscribe();
        });
        return returnSubject;
      }

      public getSubGroupList(groupID){
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl+'/getSubGroupList?SELECTEDGROUPID='+groupID, this.getRequestOption())
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
            res.status = 'error2'; res.result = error;
            returnSubject.next(res);
            returnSubject.unsubscribe();
        }
        );
    return returnSubject;
  }

  

  public getAccountHeirarchy(groupID){
    let res = {status:"error",result:""};
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl+'/getAccountHeirarchy?GROUPID='+groupID, this.getRequestOption())
    .subscribe(response =>{
      let data = response.json();
      if(data.status=='ok'){
        returnSubject.next(data);
        returnSubject.unsubscribe();
      }
      else{
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error=>{
      res.status = 'error2'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    });
    return returnSubject;
  }

  getSelectNodeObj(groupID){
    let res = {status:"error",result:""};
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl+'/getAccountLedgerDetails?GROUPID='+groupID, this.getRequestOption())
    .subscribe(response =>{
      let data = response.json();
      if(data.status=='ok'){
        returnSubject.next(data);
        returnSubject.unsubscribe();
      }
      else{
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error=>{
      res.status = 'error2'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    });
    return returnSubject;
  }

      public contextMenuActions = [
        {
          html: (item) => `Edit`,
          tag: 'edit',
          enabled: (item) => true,
          visible: (item) => true,
        },
        {
          divider: true,
          visible: true,
        },
        {
          html: (item) => `Delete`,
          tag: 'delete',
          enabled: (item) => true,
          visible: (item) => true,
        },
      ];
}

export interface GroupParty {
    ACID: string;
    ACNAME: string;
    PARENT: string;
    TYPE: string;
    PType: string;
    MAPID: string;
    CHILDLIST: any[];
    SELECTEDGROUP: any;
    LIST: Observable<any[]>;
    SELECTEDGROUPAC: GroupParty;
}

