import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Injector, HostListener } from '@angular/core';
import { AuthService } from "../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'
import { Router } from "@angular/router";
import { AccountGroup, MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, TreeComponent } from 'angular-tree-component';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';

import { TreeViewPartyervice } from "./partyledger.service";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { ContextMenuComponent } from 'ngx-contextmenu';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AppComponentBase } from '../../../../app-component-base';
import { Division } from '../../../../common/interfaces';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TreeViewAccService } from './AccLedger.service';

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

@Component({
  selector: "AccLedgerNew",
  templateUrl: "./AccLedgerTable.component.html",
  styleUrls: ["../../../Style.css", '../../../modal-style.css', './AccLedgerTable.component.css'],
  providers: [MasterRepo, TreeViewAccService, AuthService]

})

export class AccNewLedgerComponent extends AppComponentBase implements OnInit {
  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
  @ViewChild('DeleteAcc') DeleteAcc: ModalDirective;
  @ViewChild("genericGridACList") genericGridACList: GenericPopUpComponent;
  gridACListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  DialogMessage: string = "You are not authorized";
  addMode: boolean = false;
  public mode: string;
  public grp: string;
  modeTitle: string;
  loadListSubject: Subject<any> = new Subject<any>();
  areaList: any[] = [];
  loadList$: Observable<any> = this.loadListSubject.asObservable();
  
  partyFilter: any;
  searchParty: any;
  isLoader = true;
  currentPage = 1;
  totalCount: number;
  itemsPerPage = 200;
  // showPartyLedgerFilterpopUp: boolean;
  LedgerFilterObj: IsLedgerFilter = <IsLedgerFilter>{};
  FormName : ExportLedgerFilterDto = <ExportLedgerFilterDto>{};

  settings = {
    mode: "external",
    add: {
      addButtonContent: '',
    },
    view: {
      viewButtonContent: 'View',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    pager: {
      display: true,
      perPage: 14
    },
    columns: {
      ACNAME: {
        title: 'PARTY NAME',
        type: 'number'

      },
      ADDRESS: {
        title: 'ADDRESS',
        type: 'string'

      },
      VATNO: {
        title: 'VAT NO',
        type: 'string'

      }
      ,
      PartyType: {
        title: 'PARTY TYPE',
        type: 'string'

      }
      ,
      Category: {
        title: 'CATEGORY',
        type: 'string',
        width: '20px'
      }
      ,
      Parent: {
        title: 'PARTY GROUP',
        type: 'string',
        width: '20px'
      }
    }
  };



  private _treeEnable: Boolean = true;
  subTitle: string;
  // disableSubGroupA: boolean = true;
  // disableSubGroupB: boolean = true;
  // disableSubGroupC: boolean = true;
  parentGroupID: string = "";
  overdraftIs: string;
  isBank: boolean;

  public get treeEnable(): Boolean { return this._treeEnable; }

  public set treeEnable(value: Boolean) { this._treeEnable = value; }
  public selectedNode: any;
  public nodes: any[] = [];
  @ViewChild(TreeComponent)
  public tree: TreeComponent;
  source: LocalDataSource = new LocalDataSource();
  busy: Subscription;
  division: any[] = [];
  GeoList: any[] = [];
  ParentList: any[] = [];
  showAccountLedgerFilterpopUp: boolean;
  SubGroupAccountMaster: any[] = [];
  ChildrenList: any[] = [];
  userSetting:any;

  constructor(public masterService: MasterRepo,
    public _alertService: AlertService,
    public _spinerService: SpinnerService,
    public _authService: AuthService,
    public router: Router,
    public AccountService: TreeViewAccService,
    public injector: Injector,
    protected MasterService: MasterRepo,
  ) {
    super(injector);
    this.searchParty = "searchByName";
    this.AccountService.sortAccount = "sortByName";
    this.masterService.getAccountListTree().map(x => { return x })
    this.busy = this.masterService.getAccountListTree().map(x => { return x })
      .subscribe(res => {
        // //console.log(res);
        this.nodes = res;
        // //console.log(this.nodes);
        if (this.tree != null) {
          this.tree.treeModel.update();
        }
        // //console.log(this.tree);
      }, error => {
        this.masterService.resolveError(error, "partyLedger - PartyLedger");
      });


     
    this.division = [];
    this.masterService.getAllDivisions()
      .subscribe(res => {
        this.division.push(<Division>res);
      }, error => {
        this.masterService.resolveError(error, "divisions - getDivisions");
      });


    this.AccountService.getHierachy().subscribe(res => {
      if (res.status == "ok") {
        this.GeoList = res.result.GEO;

      }
    });
    // this.getTreeItem();
    this.AccountService.loadTableListSubject.subscribe(x=>{
      // //console.log("CheckXValu5",x);
  })

    this.AccountService.getMainGroupList().subscribe((response)=>{
      // //console.log("Main group,", response);
      if(response.length > 0){
        this.masterService.mainGroupList = response;
      }
      else{
        this.masterService.mainGroupList = [];
      }
    })


    this.userSetting = this._authService.getSetting();
  }

  getTreeItem() {
    this.AccountService.Refresh();
    this.busy = this.AccountService.busy;
    this.nodes = this.AccountService.nodes;
    this.tree = this.AccountService.tree;
  }



  ngOnInit() {
    this.AccountService.subTitle = "";
    let data: Array<any> = [];


    // this.loadListSubject.switchMap(snode => {
    //   data = [];
    //   ////console.log("reach here");
    //   return this.AccountService.getParentWisePartyList(snode.ACID)
    // })
    //   .subscribe(res => {
    //     data.push(<any>res);
    //     this.source.load(data);
    //   })


    // try { 
    //   let apiUrl = `${this.apiUrl}/getAllGeographicalHierarchyPagedList/${snode.ACID}`;
    //   this.source =  this.source = new ServerDataSource(this._http, 
    //     { endPoint: apiUrl, 
    //       dataKey : "data", 
    //       pagerPageKey : "currentPage",
    //       pagerLimitKey : "maxResultCount"
    //     }); 


    // } catch (ex) {
    //   //console.log(ex);
    //   alert(ex);
    // }


  }


  ngAfterViewInit() {
    // document.getElementsByClassName('ACNAME')['0'].style.width = '20%';
    // document.getElementsByClassName('ADDRESS')['0'].style.width = '20%';
    // document.getElementsByClassName('VATNO')['0'].style.width = '8%';
    // document.getElementsByClassName('PartyType')['0'].style.width = '10%';
    // document.getElementsByClassName('Category')['0'].style.width = '8%';
    // document.getElementsByClassName('Parent')['0'].style.width = '20%';

    // this.ledgercomponent.getParentName();
  }



  getPartyPagedList() {
    // let apiUrl = `${this.apiUrl}/getParentWiseAccountPagedList/${this.selectedNode.ACID}`;  
    // this.source  = new ServerDataSource(this._http, 
    //   { endPoint: apiUrl, 
    //     dataKey : "data", 
    //     pagerPageKey : "currentPage",
    //     pagerLimitKey : "maxResultCount"
    //   }); 
    let data: Array<any> = [];
    // this.masterService.getAcidWisePartyList(this.selectedNode.ACID)
    // .subscribe(res => {
    //   data.push(<any>res);
    //   this.source.load(data);
    // }, error => {
    //   this.masterService.resolveError(error, "divisions - getDivisions");
    // }

    // );
    this.masterService.getAcidWiseAccountList(this.selectedNode.ACID).subscribe(res => {
      if (res.status == "ok") {
        data = res.result;
        this.source.load(data);
        this.AccountService.partyList = res ? res.result : [];
        ////console.log("PledgerTable",data)
      } else {
        this.AccountService.partyList = [];
      }
    });

    ////console.log("sourcevalue",this.source);
  }


  getChildren(node: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.asyncChildren.map((c) => {
        return Object.assign({}, c, {
          hasChildren: node.level < 5
        });
      })), 1000);
    });
  }

  asyncChildren = [
    {
      name: 'child2.1',
      subTitle: 'new and improved'
    }, {
      name: 'child2.2',
      subTitle: 'new and improved2'
    }
  ];

  addNode(addednode) {
    ////console.log("node reached")
    this.tree.treeModel.getFocusedNode().data.children.push(addednode);
    this.tree.treeModel.update();
  }

  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length})` : '';
  }

  filterNodes(value, tree) {
    try {
      // displayField: 'ACNAME', is required
      this.tree.treeModel.filterNodes(value, true);
    } catch (ex) {
      ////console.log("PartyFilter", ex);
      alert("PartyFilter-" + ex)
    }
  }

  activateSubSub(tree) {
    // tree.treeModel.getNodeBy((node) => node.data.name === 'subsub')
    tree.treeModel.getNodeById(1001)
      .setActiveAndVisible();
  }

  customTemplateStringOptions = {
    displayField: 'ACNAME',
    isExpandedField: 'expanded',
    idField: 'uuid',
    getChildren: this.getChildren.bind(this),
    actionMapping,
    allowDrag: false
  }

  onEvent($event) {
    //console.log.bind(console);
  }
  root: string;

  onselect(tree, $event) {
    //this.source = new ServerDataSource();
    console.log("CheckTree",this.tree);

    this.overdraftIs = '';
    this.selectedNode = tree.treeModel.getFocusedNode().data;
    console.log("on tree click", this.selectedNode);
    this.masterService.SelectedGroup = this.selectedNode.ACID;
    this.getRootParent(this.selectedNode, this.nodes);
    this.loadListSubject.next(this.selectedNode);
    this.AccountService.ParentInfo = this.selectedNode;
    this.getPartyPagedList();
    this.AccountService.sortAccount = "sortByName";
    if (this.selectedNode.ACID == 'AG013' || (this.selectedNode.PARENT ? this.selectedNode.PARENT.ACID == 'AG013' : this.selectedNode.MAPID == 'OD') || this.selectedNode.MAPID == 'OD') {
      this.overdraftIs = 'OD';
    }

    if(this.selectedNode.ACID == 'AG006' || this.selectedNode.MAPID == 'B'){
      this.isBank = true;
    }else{
      this.isBank = false;
    }


  }



  getList(selNod) {
    //$event.stopPropagation();
    let data: Array<any> = [];
    this.AccountService.getParentWisePartyList(selNod.ACID)
      .subscribe(res => {
        data.push(<any>res);
        this.source.load(data);
      }
      );

  }
  getRootParent(node, list) {
    if (node.PARENTID == "PA") { this.root = node.ACID; return; }
    for (let t of list) {
      if (node.PARENTID != t.ACID) { this.loopingChild(node, t.children, t) }
      else { this.root = t.ACID; }
    }
  }
  loopingChild(node, cList, root) {
    for (let c of cList) {
      if (c != node) { this.loopingChild(node, c.children, root); }
      else { this.root = root.ACID; }
    }
  }
  go($event) {
    $event.stopPropagation();
    alert('this method is on the app component')
  }

  onTreeEnable(value: boolean) {
    this.treeEnable = value;
  }

  AddLedger() {
    if (this.masterService.validateMasterCreation("create") == false) {
      return;
    }

    if(this.selectedNode.ACID == 'AG01001' || this.selectedNode.ACID == 'AG01002'){
      this._alertService.warning("Cannot add account under this group");
      return;
    }
    this.addMode = true;
    this.modeTitle = "AddLedger"
    this.AccountService.subTitle = ">> Add New Ledger A/C"
    this.mode = "add";
    this.grp = "A";
    this.AccountService.isGroup = false;
    this.masterService.focusAnyControl("ACCODE");
  }

  AddGroup(trees) {
    if (this.masterService.validateMasterCreation("create") == false) {
      return;
    }

    if(this.selectedNode.ACID == 'AG01001' || this.selectedNode.ACID == 'AG01002'){
      this._alertService.warning("Cannot add group under this group");
      return;
    }

    this.addMode = true;
    this.modeTitle = "AddGroup"

    this.AccountService.subTitle = ">> Add New Account Group";
    this.mode = "add";
    this.grp = "G";
    this.AccountService.isGroup = true;
    this.masterService.focusAnyControl("ACCODE");

    this.AccountService.addGroupSubject.next(true);

  }

  onEditClick(party): void {
    if (this.masterService.validateMasterCreation("edit") == false) {
      return;
    }
    this.addMode = true;
    this.mode = "edit";
    this.AccountService.subTitle = ">> Edit Ledger A/C";
    // this.selectedNode = event.data;
    // //console.log("@selected party for edit", party);
    this.selectedNode = party;
    this.selectedNode.PARENT_CODE = party.PARENTID;
    this.MasterService.SelectedGroup = party.PARENTID;
    ////console.log("selectedNode",this.selectedNode);

    this.grp = "A"

  }

  onViewClick(party): void {
    this.addMode = true;
    this.mode = "view";
    this.AccountService.subTitle = ">> View Ledger A/C"
    // this.selectedNode = event.data;
    this.selectedNode = party;
    this.selectedNode.PARENT_CODE = party.PARENTID;
    this.MasterService.SelectedGroup = party.PARENTID;
    this.grp = "A"
  }

  hideChildModal() {
    this.childModal.hide();
  }
  onAddClose(event) {
    this.addMode = false;
    this.mode = "";
    this.masterService.groupSelectObj = <AccountGroup>{};
    this.masterService.disableSubGroupA=true;
    this.masterService.disableSubGroupB=true;
    this.masterService.disableSubGroupC=true;
    this.parentGroupID = "";
    this.selectedNode = undefined;

    this.masterService.getAcidWiseAccountList(event,"sortItemByDate").subscribe(res => {
      if (res.status == "ok") {
        this.AccountService.partyList = res ? res.result : [];
      } else {
        this.AccountService.partyList = [];
      }
    });

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

  contextMenuClick(selecteddata, selectedmenu) {
    if (selectedmenu.tag == "edit") {
      if(selecteddata.LEVELS == 1){
        this._alertService.warning("Cannot edit Main Group");
        return;
      }
      // //console.log("Edit Context menu", selecteddata)
      this.addMode = true;
      this.modeTitle = "AddGroup"
      this.AccountService.subTitle = ">> Edit Account Group"
      this.mode = "edit";
      this.selectedNode = selecteddata;
      this.selectedNode.PARENT_CODE = selecteddata.PARENTID;


      ////console.log("selecteddata",selecteddata)
      this.grp = "G"
    }
    else if (selectedmenu.tag == "delete") {
      let childrenPartyList = [];
      let childreenList = [];
      this.masterService.getChildrenPartyAccount(this.selectedNode.ACID).subscribe(
        res => {
          if (res) {
            childrenPartyList = res.result;
            ////console.log("partylist",childrenPartyList)
            if (childrenPartyList.length > 0) {
              this._alertService.info("PARTY ACCOUNT EXIST UNDER SELECTED PARTY GROUP. HENCE, REQUESTED COMMAND IS ABORTED");
            } else {
              ////console.log("children",this.selectedNode.children);
              childreenList = this.selectedNode.children;
              if (childreenList.length > 0) {
                this._alertService.info("PARTY ACCOUNT EXIST UNDER SELECTED PARTY GROUP. HENCE, REQUESTED COMMAND IS ABORTED");
              } else {
                this.DeleteAcc.show();
              }
            }
          }
        }
      )



    }
  }
  SavePartyEmit(value) {
    // //console.log("Party$$$$", value, this.tree)
    if (value.type == "G") {
      this.Refresh();
      this.loadListSubject.next(this.selectedNode);
    }
    else {
      var childAccountList = this.masterService.PartialAccountList.filter(a => a.PARENT == value.value.PARENT);
      if (childAccountList.length > 0) {
        ////console.log("Data from Array");
        this.loadListSubject.next(this.selectedNode);
      }
    }
  }

  EditPartyEmit() {
    this.Refresh();
  }




  getGivenNode(nodeid: string, list: any[], savedNode): any {
    for (let ag of list) {
      // //console.log({ 'recusiveIteration': ag.ACID })
      ////console.log("ag", ag)
      if (ag.ACID == nodeid) {
        ag.children.push(savedNode);
        // //console.log('requiredvalue', ag);
        return ag;
      }
      else if (ag.children && ag.children.length > 0) {
        var node = this.getGivenNode(nodeid, ag.children, savedNode);
        if (node) {
          return node;
        }
      }
    }
    return null;
  }


  DeleteYes() {
    this.DeleteAcc.hide();
    this._spinerService.show("Deleting Data please wait...");
    this.masterService.deleteAccount(this.selectedNode.ACID).subscribe(data => {
      if (data.status == "ok") {
        this._alertService.success("Data Deleted Successfully");
        this._spinerService.hide();
        this.Refresh();
      }
      else {

        //alert(data.result);
        //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
        if (
          data.result._body ==
          "The ConnectionString property has not been initialized."
        ) {
          this.router.navigate(["/login", this.router.url]);
          return;
        }
        //Some other issues need to check
        this._alertService.error(
          "Error in Deleting Data:" + data.result._body
        );

      }
    })
  }
  DeleteNo() {
    this.DeleteAcc.hide();
  }

  onClickNo() {
    this.DeleteAcc.hide();
  }



  Refresh() {
    this.masterService._accountPartyTree = [];
    this.masterService.getPartyTreeObservable = null;
    //this.masterService.getpartyListTree().map(x => { return x })
    this.busy = this.masterService.getAccountListTree().map(x => { return x })
      .subscribe(res => {
        // //console.log(res);

        this.nodes = res;
        // //console.log(this.nodes);
        if (this.tree != null) {
          this.tree.treeModel.update();
        }
        // //console.log(this.tree);
      }, error => {
        this.masterService.resolveError(error, "AccountLedger - AccountLedger");
      });

  }

  onDeleteConfirm(event): void {

    if (window.confirm('Are you sure you want to delete?')) {
      //event.confirm.resolve();
      event.data.ISACTIVE = 0;
      this._spinerService.show("please Wait..");
      this.masterService.inActiveAccount(event.data.ISACTIVE, event.data.ACCODE, event.data.ACID).subscribe(res => {
        if (res.status == "ok") {
          this._spinerService.hide();
          this._alertService.info("Deleted successfully..");
          this.getPartyPagedList();
        } else {
          ////console.log("response",res.result._body)
          this._spinerService.hide();
          this._alertService.info(res.result._body)
        }
      })
    } else {
      // event.confirm.reject();
    }
  }

  partyPagination(event) {
    this.isLoader = true;
    this.currentPage = event;
    const t = this;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      t.isLoader = false;
    }, 500);
  }

  backToDashboard() {
    this.router.navigate(["pages/dashboard"])
  }


  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == 'F10') {
      $event.preventDefault();
      this.backToDashboard();
    }
  }


  ExportAll() {
    this.FormName.data = "Account";
    let filterObjData = {data: this.FormName, filtername: "AllAccountList" }
    this.masterService.getExcelFile('/getAllLegerList',filterObjData).subscribe(
      data => {
        this._alertService.hide();
        this.masterService.downloadFile(data);
        this.CancelCommand();
      },
      error => {
        this._alertService.hide();
      }
    )
  }
  OkCommand() {
    this.LedgerFilterObj.FILTER = "Account";
    let filterObjData = { data: this.LedgerFilterObj }
    this.masterService.getExcelFileFilter('/getLedgerByFilter', filterObjData).subscribe(
      data => {
        this._alertService.hide();

        this.masterService.downloadFile(data);
        this.CancelCommand();
      },
      error => {
        this._alertService.info("Data not found");
      }
    )
    this.showAccountLedgerFilterpopUp = false;
  }
  CancelCommand() {
    this.LedgerFilterObj = <IsLedgerFilter>{};
    this.FormName = <ExportLedgerFilterDto>{};
    this.showAccountLedgerFilterpopUp = false;
  }

  showAcList(i) {
    let TRNMODE = "";
    if(this.LedgerFilterObj.type == "Customer"){
      TRNMODE = "Customer_Pay";
    }else if(this.LedgerFilterObj.type == "Supplier"){
      TRNMODE = "SupplierListOnly";
    }
    // //console.log("TRNMODE",TRNMODE)
    this.gridACListPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Details/${TRNMODE}`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: "ACID",
          title: "AC CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACNAME",
          title: "A/C NAME",
          hidden: false,
          noSearch: false
        }
      ]
    };

    this.genericGridACList.show();
  }

  onAcSelect(acItem) {
    this.LedgerFilterObj.accountName = acItem.ACNAME;
    this.LedgerFilterObj.ACID = acItem.ACID;
  }

  changeType(){
    this.LedgerFilterObj.accountName = "";
    this.LedgerFilterObj.ACID = "";
    this.LedgerFilterObj.accountType = "";
  }
  sortProductListByDate(){
    //console.log("CheckvalueFromTable",this.AccountService.partyList)
    
  }

  getSubgroupA(e){
    let mainGroupID = e.target.value;
    this.parentGroupID = mainGroupID;
    // let acname=this.masterService.mainGroupList.filter(x=>x.ACID==e.target.value)[0].ACNAME;
    // this.masterService.groupSelectObj.MGROUP=acname;
    this.AccountService.getSubGroupList(mainGroupID).subscribe((res) =>{
      if(res.length > 0 ){
        // //console.log("list A", res);
        this.masterService.subGroupAList = res;
        this.masterService.disableSubGroupA = false;
        this.masterService.disableSubGroupB = true;
        this.masterService.disableSubGroupC = true;
        this.masterService.groupSelectObj.SUBGROUP_A = "";
        this.masterService.groupSelectObj.SUBGROUP_B = "";
        this.masterService.groupSelectObj.SUBGROUP_C = "";


      }else{
        this.masterService.subGroupAList = [];
        this.masterService.disableSubGroupA = true;
        this.masterService.disableSubGroupB = true;
        this.masterService.disableSubGroupC = true;
        this.masterService.groupSelectObj.SUBGROUP_A = "";
        this.masterService.groupSelectObj.SUBGROUP_B = "";
        this.masterService.groupSelectObj.SUBGROUP_C = "";
      }
    })
  }

  getSubgroupB(e){
    let subGroupID = e.target.value;
    this.parentGroupID = subGroupID;
    // this.masterService.groupSelectObj.SUBGROUP_A = e.target.value;
    // //console.log("sub group A selected", this.parentGroupID)
    this.AccountService.getSubGroupList(this.parentGroupID).subscribe((res) =>{
      if(res.length > 0 ){
        // //console.log("list B", res);
        this.masterService.subGroupBList = res;
        this.masterService.disableSubGroupB = false;
        this.masterService.disableSubGroupC = true;

      }else{
        this.masterService.subGroupBList = [];
        this.masterService.disableSubGroupB = true;
        this.masterService.disableSubGroupC = true;
        this.masterService.groupSelectObj.SUBGROUP_B = "";
      }
    })
  }

  
  getSubgroupC(e){
    let subGroupID = e.target.value;
    if(subGroupID == 'AG01001' || subGroupID == 'AG01002'){
      this._alertService.warning("Cannot add account under this group");
      return;
    }
    this.parentGroupID = subGroupID;
    // this.masterService.groupSelectObj.SUBGROUP_B = e.target.value;
    //console.log("sub group B selected", this.parentGroupID)
    this.AccountService.getSubGroupList(this.parentGroupID).subscribe((res) =>{
      if(res.length > 0 ){
        // //console.log("list C", res);
        this.masterService.subGroupCList = res;
        this.masterService.disableSubGroupC = false;

      }else{
        this.masterService.subGroupCList = [];
        this.masterService.disableSubGroupC = true;
        this.masterService.groupSelectObj.SUBGROUP_C = "";
        
      }
    })
  }

  selectSubgroupC(e){
    let subGroupID = e.target.value;
    this.parentGroupID = subGroupID;
    // this.masterService.groupSelectObj.SUBGROUP_C = e.target.value;
  }

  sortAccountListByName(){
    // //console.log("ACID k ?", this.selectedNode);
    this.masterService.getAcidWiseAccountList(this.selectedNode.ACID).subscribe(res => {
      if (res.status == "ok") {
        this.AccountService.partyList = res ? res.result : [];
      } else {
        this.AccountService.partyList = [];
      }
    });
  }

  sortAccountListByDate(){
    // //console.log("ACID k @@@", this.selectedNode);
    this.masterService.getAcidWiseAccountList(this.selectedNode.ACID,"sortItemByDate").subscribe(res => {
      if (res.status == "ok") {
        this.AccountService.partyList = res ? res.result : [];
      } else {
        this.AccountService.partyList = [];
      }
    });
  }

  showAllAccountList(){
    this.selectedNode = {};
    this.selectedNode.ACID = 'AL';
    // this.masterService.SelectedGroup = this.selectedNode.ACID;
    this.loadListSubject.next(this.selectedNode);


    this.masterService.getAcidWiseAccountList('AL').subscribe(res => {
      if(res.status == "ok"){
        this.AccountService.partyList = res ? res.result : [];
      }
      else{
        this.AccountService.partyList = [];
      }
    })
  }

  ExportAccountLedger() {
    this.masterService.getAccountListOfTree().subscribe(res => {
      this.ParentList = res;
    })
    this.showAccountLedgerFilterpopUp = true;
  }

  changeAccountType() {
    this.LedgerFilterObj.SUBGROUP = "";
    this.LedgerFilterObj.ACID = "";
  }

  changeAccountGroup(event) {
    this.LedgerFilterObj.SUBGROUP = "";
    this.LedgerFilterObj.ACID = "";
    this.masterService.getSubGroupForQuickAccountMaster(this.LedgerFilterObj.MAINGROUP).subscribe(res => {
      this.SubGroupAccountMaster = res.result;
    })

    this.masterService.getAcidWiseAccountList(event).subscribe((res:any) => {
      // let abc = res.filter(x => x.ACID == this.LedgerFilterObj.MAINGROUP);
      // this.ChildrenList = abc.length > 0 && abc[0].children.filter(x => x.TYPE == "A");
      this.ChildrenList=res.result;
    })
  }
  
}
export interface IsLedgerFilter {
  FILTER:string;
  type: string;
  accountType: string;
  accountName: string;
  ACID: string;
  MAINGROUP: string;
  SUBGROUP: string;
}
export interface  ExportLedgerFilterDto{
  data: string;
  filtername: string;
  
}