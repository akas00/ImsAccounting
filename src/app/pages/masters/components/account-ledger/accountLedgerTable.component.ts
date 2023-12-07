import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'
import { Router } from "@angular/router";
import { TAcList, SelectedDivisions } from '../../../../common/interfaces/Account.interface';
import { FormBuilder } from '@angular/forms';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, TreeComponent } from 'angular-tree-component';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!../Companies/smartTables.scss';
import { TreeViewAcService } from './accountLedger.service';
import { Subscription } from "rxjs/Subscription";
import { ContextMenuComponent } from 'ngx-contextmenu';
import { LedgComponent } from './addLedg.component';
import { PreventNavigationService } from '../../../../common/services/navigation-perventor/navigation-perventor.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { PLedgerComponent } from '../PLedger/PLedger.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Division } from '../../../../common/interfaces';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';

const actionMapping: IActionMapping = {

  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
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
  selector: "accountLedger",
  templateUrl: "./accountLedgerTable.component.html",
  // styleUrls: ["../../../Style.css"],
  providers: [TreeViewAcService, AuthService]

})

export class AccountLedgerComponent {


  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild('fields') fieldsEl: ElementRef;
  @ViewChild("LedgerChild") LedgerChild: LedgComponent;
  @ViewChild('lgModal') lgModel: ModalDirective;
  @ViewChild(TreeComponent)
  @ViewChild('DeleteAcc') DeleteAcc: ModalDirective;
  @ViewChild("PLedgerChild") PLedgerChild: PLedgerComponent;
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
  @ViewChild("Name") _BE: ElementRef;
  @ViewChild('ShiftParent') ShiftParent: ModalDirective;

  DialogMessage: string = "You are not authorized";
  public get treeEnable(): Boolean { return this._treeEnable; }
  public set treeEnable(value: Boolean) { this._treeEnable = value; }
  public nodes: any[] = [];
  PartialAccountList: any[] = [];
  data: Array<any> = [];
  private subcriptions: Array<Subscription> = [];
  dynamicDDList: any[] = [];
  public mode: string;
  public grp: string;
  modeTitle: string;
  root: string;
  addMode: boolean = false;
  selectedNodeEdit: number = 0;
  GroupStatus: string;
  fromTreeTag: number;
  autoCalculationParam: any = <any>{};
  settings = {
    mode: "external",
    add: {
      addButtonContent: '',
    },
    // view: {
    //   viewButtonContent: 'View',
    //   saveButtonContent: '<i class="ion-checkmark"></i>',
    //   cancelButtonContent: '<i class="ion-close"></i>',
    // },
    edit: {
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    columns: {
      ACID: {
        title: 'AC ID',
        type: 'number'
      },
      PARENT: {
        title: 'Parent',
        type: 'string'
      },
      ACNAME: {
        title: 'AcName',
        type: 'string'
      }
    }
  };
  private _treeEnable: Boolean = true;
  public selectedNode: any;
  public tree: TreeComponent;
  source: LocalDataSource = new LocalDataSource();
  busy: Subscription;
  loadListSubject: Subject<any> = new Subject<any>();
  loadList$: Observable<any> = this.loadListSubject.asObservable();
  userProfile: any;
  formObj: any = <any>{}
  isGroup: number;
  PrimaryGrpObj: any;
  UnderObj: any;
  nodeObj: any = <any>{}
  isOnlyMainParent = 0
  Parent: any = <any>{}
  BankPartyVerification: any = <any>{}
  AdditionalInfo: number = 0;
  showPLedgerInfo: number = 0;
  showCustomer: number = 0;
  showBank: number = 0
  showAssets = 0;
  PTypeForParty: any;
  HSN_Active = 0;
  Party: any;
  isAccount = true;
  parentHasSubLedger = false;
  tagForDisplayingAccname: string;
  OverdraftIs: string;
  division: any[] = [];
  divisionList: any[] = [];
  showDivSelectionTable: boolean;
  SelectedDivisionList: SelectedDivisions[] = [];
  divisioncheckObj: any = <any>{}
  enableDivisionMapping: boolean;
  ParentList: any[] = [];
  ShiftParentObj: any = <any>{};
  showShiftParentButton: boolean;
  showAccountLedgerFilterpopUp: boolean;
  LedgerFilterObj: IsLedgerFilter = <IsLedgerFilter>{};
  FormName: ExportLedgerFilterDto = <ExportLedgerFilterDto>{};
  SubGroupAccountMaster: any[] = [];
  ChildrenList: any[] = [];

  constructor(private masterService: MasterRepo, private _authService: AuthService, private router: Router,
    private AccountService: TreeViewAcService, private _hotkeysService: HotkeysService,
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    private _fb: FormBuilder, public _transactionService: TransactionService) {
    //console.log("@@authservice", _authService.getPhiscalInfo())

    // this.lgModel.show();
    // ////console.log("@@_transactionService.userSetting.ENABLESUBLEDGER", this._transactionService.userSetting.ENABLESUBLEDGER)
    this.mode = "add";
    this.masterService.PType = '';
    this.userProfile = this._authService.getUserProfile();
    this.busy = this.masterService.getacListTree().map(x => { return x })
      .subscribe(res => {
        this.nodes = res;
        if (this.tree != null) {
          this.tree.treeModel.update();
        }
      }, error => {
        var err = this.masterService.resolveError(error, "accountLedger - accountLedger");
        if (err) { alert(err.json()); }
      }
      );

    this.division = [];
    this.masterService.getAllDivisions()
      .subscribe(res => {
        this.division.push(<Division>res);
        this.divisionList.push(<Division>res);
      }, error => {
        this.masterService.resolveError(error, "divisions - getDivisions");
      });

    if (this.masterService.userSetting.DIVISIONWISEACLISTING == 1) {
      this.enableDivisionMapping = true
      this.formObj.enableDivSelectionTable = false;

    }
    else {
      this.enableDivisionMapping = false;
    }


  }
  ngOnInit() {
    this.autoCalculationParam.igst = 0;
    this.autoCalculationParam.cgst = 0;
    this.autoCalculationParam.sgst = 0;
    this.autoCalculationParam.cess = 0;
    
    this._hotkeysService.add(
      new Hotkey(
        "f10",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          this.ngOnInit();
          return false;
        }
      )
    );
    this.formObj.DIV = this.userProfile.userDivision;
    this.enableDivision = false;
    

    this.loadListSubject.switchMap(snode => {
      this.data = [];
      return this.AccountService.getParentWiseAccountList(snode.ACID)
    })
      .subscribe(res => {
        
        this.data.push(<any>res);
        this.source.load(this.data);
        if (this.AccountService.selectAcdivisionList.length > 0) {
          this.formObj.DIV = this.AccountService.selectAcdivisionList[0].MAINDIV;
          
          this.changeDivision(this.AccountService.selectAcdivisionList[0].MAINDIV)
          this.divisioncheckObj.ShareAccount = 1;
          this.ClickShareAccount("x");
          this.enableDivSelectionTable(1);
          // //console.log("checkValue##", this.divisionList, this.AccountService.selectAcdivisionList)
          for (let i of this.divisionList) {
            for (let j of this.AccountService.selectAcdivisionList) {
              
              if (i.INITIAL == j.DIV) {
                this.AccountService.selectAcdivisionList[0].MAINDIV == j.DIV ? i.isDefault = true : i.isDefault = false;
               
                i.isCheck = true;
              }

            }
          }
          if (this.AccountService.selectAcdivisionList[0].ISCOMMONAC == 1) {
              this.divisioncheckObj.ShareAllDiv = "2";
            this.formObj.ISCOMMONAC = 1;
            this.divisioncheckObj.ShareAccount = 1;
            this.showDivSelectionTable = false;
          }
          else {
            this.divisioncheckObj.ShareAllDiv = "0";
            this.formObj.ISCOMMONAC = 0;
            this.divisioncheckObj.ShareSelectiveDiv = "1";
            this.divisioncheckObj.ShareAccount = 1;
          }
        }
        else {
          this.divisioncheckObj.ShareAccount = 0;
          this.ClickShareAccount("x");
          this.enableDivSelectionTable(0);
         
          if(this.selectedNode.ISCOMMONAC == 0){
            this.formObj.DIV = this.selectedNode.DIV;
          }else{
            this.formObj.DIV = this.userProfile.userDivision;
          }

        }

      })


      this.divisioncheckObj.ShareSelectiveDiv = 1;

    // this.loadListSubject.switchMap(snode => {
    //   return this.AccountService.getAccountAutomationGSTRate(snode.ACID, snode.PARENTID)
    // })
    //   .subscribe(res => {
    //     let gstRate: any = res;
    //     for (let i in gstRate) {
    //       if (gstRate[i].PARTICULAR == "Integrated Tax") {
    //         this.autoCalculationParam.igst = gstRate[i].RATE;
    //       }
    //       if (gstRate[i].PARTICULAR == "Central Tax") {
    //         this.autoCalculationParam.cgst = gstRate[i].RATE;
    //       }
    //       if (gstRate[i].PARTICULAR == "UT Tax") {
    //         this.autoCalculationParam.sgst = gstRate[i].RATE;
    //       }
    //       if (gstRate[i].PARTICULAR == "Cess") {
    //         this.autoCalculationParam.cess = gstRate[i].RATE;
    //       }
    //     };
    //   })
    this.isParentBank = false;
  }


  ngAfterViewInit() {
    this._BE.nativeElement.focus();
    this.formObj.ISCOMMON = 0;
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
    var Node = this.tree.treeModel.getFocusedNode();
    // if (fNode == null) {
    //   this.tree.treeModel.nodes.push(addednode);
    // }
    // else {
    //   alert("child")
    this.tree.treeModel.getFocusedNode().data.children.push(addednode);
    // }
    this.tree.treeModel.update();
  }

  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length})` : '';
  }

  filterNodes(text, tree) {
    try {
      tree.treeModel.filterNodes(text, true);
    } catch (ex) {
      alert(ex);
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
    // //console.log.bind(console);
  }

  onselect(tree, $event) {
    //console.log("TreeSelec",tree)
    this.OverdraftIs = ' ';

    this.source = new LocalDataSource();
    this.AdditionalInfo = 0;
    this.showBank = 0;
    this.showPLedgerInfo = 0

    this.selectedNode = tree.treeModel.getFocusedNode().data;
    this.selectedNodeEdit = this.selectedNode.ACID;
    this.GroupStatus = this.selectedNode.TYPE;
    ////console.log("onselect", this.selectedNode, this.nodes);
    this.tagForDisplayingAccname = this.selectedNode.TYPE;
    this.ViewMode = true;
    this.getRootParent(this.selectedNode, this.nodes);
    this.loadListSubject.next(this.selectedNode);
    this.formObj.ACNAME = this.selectedNode.ACNAME;
    this.formObj.ACCODE = this.selectedNode.ACCODE;
    this.parentHasSubLedger = false;
    //console.log("@@this.selectedNode.", this.selectedNode)

    if (this.selectedNode.TYPE == "A") {
      this.ShiftParentObj.ACID = this.selectedNode.ACID;
      this.ShiftParentObj.ACNAME = this.selectedNode.ACNAME;
      if (this.selectedNode.PARENT != null) {
        this.ShiftParentObj.FROMPARENT = this.selectedNode.PARENT.ACID;
      }
      this.showShiftParentButton = true;
    }
    else {
      this.showShiftParentButton = false;
    }


    this.searchParentHasSubLedger();
    if (this.selectedNode.ACID == 'AG013' || (this.selectedNode.PARENT ? this.selectedNode.PARENT.MAPID == 'OD' : this.selectedNode.MAPID == 'OD') || this.selectedNode.MAPID == 'OD') {
      this.OverdraftIs = 'OD';
    }


    if (this.selectedNode.PARENT !== null && this.selectedNode !== null) {
      if (this.selectedNode.PARENT.MAPID == 'B' || this.selectedNode.MAPID == 'B') {
        this.showBank = 1;
        this.isGroup = 0;
      } else {
        this.isGroup = 0;
        this.showBank = 0;
      }
    }
    else {
      this.showBank = 0;
      this.showBank = 0;
    }


    this.formObj.HASSUBLEDGER = this.selectedNode.HASSUBLEDGER;
    this.formObj.HSN_SACCODE = this.selectedNode.HSN_SACCODE;
    this.formObj.CRLIMIT = this.selectedNode.CRLIMIT;


    var childAccountList = this.masterService.PartialAccountList.filter(a => a.PARENT == this.selectedNode.id);
    this.mode = "select";
    let customerData: any
    let checkAcid = this.selectedNode.ACID.substring(0, 2);
    if (this.selectedNode.PType == "C" && this.selectedNode.TYPE == "A") {

      this.loadingService.show("Getting data, Please wait...");
      this.masterService.getAllAccount(this.selectedNode.ACID).subscribe(
        data => {
          this.NewItem()
          this.modeTitle = 'View And Edit Customer'
          this.showPLedgerInfo = 1;
          this.isGroup = 0;
          this.Party = "Customer"
          this.PTypeForParty = this.selectedNode.PType
          this.formObj.ACNAME = this.selectedNode.ACNAME;
          this.formObj.mode = "edit"
          this.mode = "view"
          this.loadingService.hide();
          customerData = data.result;
          // this.formObj.isAutoGSTApplicable = customerData.isAutoGSTApplicable;
          // this.formObj.isRCMApplicable = customerData.isRCMApplicable;
          this.formObj.isAutoGSTApplicable = 0;
          this.formObj.isRCMApplicable = 0;
          this.PLedgerChild.setEditFromValue(customerData);

        },
        error => {
          this.loadingService.hide();
        }
      );
    } else if ((this.selectedNode.PType == 'V' && checkAcid == 'PA') || this.selectedNode.ACID == 'LB1199') {
      this.loadingService.show("Getting data, Please wait...");
      this.masterService.getAllAccount(this.selectedNode.ACID).subscribe(
        data => {
          this.NewItem()
          this.modeTitle = 'View And Edit Supplier'
          this.showPLedgerInfo = 1;
          this.isGroup = 0;
          this.Party = "Supplier"
          this.PTypeForParty = this.selectedNode.PType
          this.formObj.ACNAME = this.selectedNode.ACNAME;
          this.formObj.mode = "edit"
          this.mode = "view"
          this.loadingService.hide();
          customerData = data.result;
          this.formObj.isAutoGSTApplicable = customerData.isAutoGSTApplicable;
          this.formObj.isRCMApplicable = customerData.isRCMApplicable;
          this.formObj.isReverseChargeApplicable = customerData.isReverseChargeApplicable;
          this.PLedgerChild.setEditFromValue(customerData);
        },
        error => {
          this.loadingService.hide();
        }
      );
    }
    // else {
    //   this.masterService.getAllAccount(this.selectedNode.ACID).subscribe(
    //     data => {
    //       // this.NewItem()
    //       this.modeTitle = 'View And Edit'



    //       this.PTypeForParty = this.selectedNode.PType
    //       this.formObj.ACNAME = this.selectedNode.ACNAME;
    //       this.formObj.mode = "edit"
    //       this.mode = "view"
    //       this.loadingService.hide();
    //       customerData = data.result;
    //       this.formObj.isAutoGSTApplicable = customerData.isAutoGSTApplicable;
    //       this.formObj.isRCMApplicable = customerData.isRCMApplicable;
    //       this.formObj.isReverseChargeApplicable = customerData.isReverseChargeApplicable;

    //     },
    //     error => {
    //       this.loadingService.hide();
    //     }
    //   );
    // }
  }

  searchParentHasSubLedger() {
    ////console.log("subledger", this.selectedNode.PARENT);
    if (this.selectedNode.PARENT != null &&
      this.selectedNode.PARENT != undefined &&
      this.selectedNode.PARENT != "" &&
      this.selectedNode.PARENT !== null
    ) {
      if (this.selectedNode.PARENT.HASSUBLEDGER == 1) {
        this.parentHasSubLedger = true;
        ////console.log("reach here1");
      } else {
        this.parentHasSubLedger = false;
        ////console.log("reach here2");
      }
    } else {
      ////console.log("reach here");
      this.parentHasSubLedger = false;
    }

  }


  ViewMode: boolean;
  getRootParent(node, list) {
    this.Parent.Under = '';
    if (node.ACID == "CA") this.formObj.ACTYPE = "LB";
    else this.formObj.ACTYPE = node.ACID;


    this.nodeObj = node;
    this.UnderObj = node.PARENT;
    if (node.PARENTID == 'BS' || node.PARENTID == 'PL' || node.PARENTID == 'TD') {
      this.PrimaryGrpObj = node; this.Parent.Primary = node.ACNAME;
      this.isOnlyMainParent = 1; this.UnderObj = node; return;

    }
    for (let t of list) {

      if (node.PARENTID != t.ACID) {
        this.loopingChild(node, t.children, t);


      }
      else { this.root = node.PARENTID; this.PrimaryGrpObj = node }
    }
    this.Parent.Under = this.UnderObj.ACNAME;
    if (node.TYPE == "G") {
      this.UnderObj = node;
      this.isGroup == 1
      this.modeTitle = 'View Group'
      this.ViewMode = true;

      ////console.log("isgroup value", this.isGroup);
      // ////console.log("viewmode",this.ViewMode);
      //   this.formObj.HASSUBLEDGER =

      //     this.selectedNode.Parent.HASSUBLEDGER
      //       ? 1
      //       : 0

      // }
      // else{
      //   this.isGroup=0;
      //   this.formObj.HASSUBLEDGER=0;
      //   this.modeTitle='View Account'
    }
    else {
      this.modeTitle = 'View Account';
      this.ViewMode = true;
    }
    // this.Parent.Primary=this.PrimaryGrpObj.ACNAME;
    if (this.root == 'LB') {
      this.Parent.Primary = 'LIABILITES'
      this.formObj.ACTYPE = 'LB'

    }
    else if (this.root == 'AT') {
      this.Parent.Primary = 'ASSETS'
      this.formObj.ACTYPE = 'AT'

    }
    else if (this.root == 'DI') {
      this.Parent.Primary = 'DIRECT INCOME'
      this.formObj.ACTYPE = 'DI'
    }
    else if (this.root == 'DE') {
      this.Parent.Primary = 'DIRECT EXPENSES'
      this.formObj.ACTYPE = 'DE'
    }
    else if (this.root == 'IE') {
      this.Parent.Primary = 'INDIRECT EXPENSES'
      this.formObj.ACTYPE = 'IE'
    }
    else if (this.root == 'II') {
      this.Parent.Primary = 'INDIRECT INCOME'
      this.formObj.ACTYPE = 'II'
    }
    else if (this.root == 'CA') {
      this.Parent.Primary = 'CAPITAL A/C'
      this.formObj.ACTYPE = 'LB'
    }

    this.isOnlyMainParent = 0;

  }
  loopingChild(node, cList, root) {
    for (let c of cList) {
      if (c != node) { this.loopingChild(node, c.children, root); }
      else { this.root = root.ACID; this.PrimaryGrpObj = root }
    }
  }

  getNoOfChild(list, selectedid, rootid) {
    for (let i of list) {
      if (i.ACID == selectedid) { break; }
      else {
        this.dynamicDDList.push({ label: 'Parent' });
        this.getNoOfChild(i.children, selectedid, rootid);
      }
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
    this.addMode = true;
    this.modeTitle = "AddLedger"
    this.mode = "add";
    this.grp = "A"
    return;
  }
  AddSubGroup(trees) {
    this.addMode = true;
    this.modeTitle = "AddSubGroup"
    this.mode = "add";
    this.grp = "G"
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEditClick(event): void {
    this.addMode = true;
    this.mode = "edit";
    this.selectedNode = event.data;
    this.grp = "A"
  }

  onAddClose(event) {

    this.addMode = false;
  }
  hideChildModal() {
    this.childModal.hide();
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
      this.addMode = true;
      this.mode = "edit";
      this.selectedNode = selecteddata;
      this.grp = "G"
    }
    else if (selectedmenu.tag == "delete") {
    }
  }

  SaveAcEmit(value) {
    if (value.type == "G") {
      this.getGivenNode(value.lastparent, this.nodes, value.value);
      this.tree.treeModel.update();
    }
    else {
      var childAccountList = this.masterService.PartialAccountList.filter(a => a.PARENT == value.value.PARENT);
      if (childAccountList.length > 0) {
        this.source.load(childAccountList);
      }
    }
  }

  getGivenNode(nodeid: string, list: any[], savedNode): any {
    for (let ag of list) {
      if (ag.ACID == nodeid) {
        ag.children.push(savedNode);
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

  NewGroup() {
    if(!this.validateBranch("create new group")){
      return;
     }
    // if(this.nodeObj.ACID=='AG01001' || this.nodeObj.ACID=='AG01002'){
    //   this.DialogMessage = "Cannot create Group or Account inside this.";
    //   this.childModal.show()
    //                           setTimeout(() => {
    //                         this.childModal.hide();
    //                     }, 2000)
    //   return;
    // }
    if (this.masterService.validateMasterCreation("create") == false) {
      return;
    }

    if (this.nodeObj.ACID == 'AG01001' || this.nodeObj.ACID == 'AG01002') {
      this.alertService.info('Cannot create Group or Account inside this.');
      return;
    }


    this.ViewMode = false;
    this.tagForDisplayingAccname = 'G';
    setTimeout(() => {
      this._BE.nativeElement.focus();
    }, 20);

    this.mode = "add"
    this.addMode = true;
    this.formObj.ACNAME = ''
    this.modeTitle = 'New Group'
    this.formObj.TYPE = 'G'
    this.isGroup = 1;
    this.showPLedgerInfo = 0;
    this.BankPartyVerification.SupplierGrp = 0
    this.isAccount = false;
    // this.Parent.Primary=this.PrimaryGrpObj.ACNAME;
    if (this.nodeObj.TYPE == 'G') {
      // this.UnderObj = this.nodeObj.ACNAME;


      if (this.selectedNode.HASSUBLEDGER == 1) {
        //if parent has subledger then hide child has subledger option
        this.parentHasSubLedger = true;
      }



      this.Parent.Under = this.nodeObj.ACNAME;
      this.formObj.HASSUBLEDGER = 0;
      this.formObj.PARENT = this.nodeObj.ACID;
      this.formObj.MAPID = this.nodeObj.MAPID;
      this.formObj.PType = this.nodeObj.PType;
      var checkAcid = this.nodeObj.ACID.substring(0, 2);
      this.formObj.LEVELS = this.nodeObj.LEVELS + 1;
      if ((this.formObj.PType == 'V' && checkAcid == 'PA') || this.nodeObj.ACID == 'LB1199') {

        this.BankPartyVerification.SupplierGrp = 1
      }
      if (this.nodeObj.ACID.substring(0, 2) == 'IE' || this.UnderObj.ACID.substring(0, 2) == 'DE') {
        this.HSN_Active = 1;
      }
    }
    else {
      // this.UnderObj = this.nodeObj.PARENT.ACNAME;
      this.Parent.Under = this.UnderObj.ACNAME;
      this.formObj.PARENT = this.UnderObj.ACID;
      this.formObj.MAPID = this.nodeObj.MAPID;
      this.formObj.PType = this.nodeObj.PType;
      this.formObj.LEVELS = this.nodeObj.LEVELS;
    }
    this.divisioncheckObj = {};

  }
  isParentBank : Boolean;
  NewItem() {
   
    if(!this.validateBranch("create new item")){
      return;
     }
    // if(this.nodeObj.ACID=='AG01001' || this.nodeObj.ACID=='AG01002'){
    //   this.DialogMessage = "Cannot create Group or Account inside this.";
    //   this.childModal.show()
    //                           setTimeout(() => {
    //                         this.childModal.hide();
    //                     }, 2000)
    //   return;
    // }
    if (this.masterService.validateMasterCreation("create") == false) {
      return;
    }

    this.GroupStatus = '';
    if (this.nodeObj.ACID == 'AG01001' || this.nodeObj.ACID == 'AG01002') {
      this.alertService.info('Cannot create Group or Account inside this.');
      return;
    }


    this.ViewMode = false;
    this.tagForDisplayingAccname = 'A';
    //console.log("CHeckValue#",this.nodeObj.ACID)
    if(this.nodeObj.ACID == "AG006"){
      this.isParentBank = true;
    }
    setTimeout(() => {
      this._BE.nativeElement.focus();
    }, 20);


    if (document.getElementById("Name") != null) {
      document.getElementById("Name").focus();
    }


    this.mode = "add"
    this.isAccount = true;
    this.addMode = true;
    this.formObj.ACNAME = ''
    this.modeTitle = 'New Account'
    this.formObj.TYPE = 'A'
    this.isGroup = 0
    this.showBank = 0
    this.showPLedgerInfo = 0
    this.HSN_Active = 0;
    this.BankPartyVerification.Bank = 0;
    this.BankPartyVerification.Customer = 0;
    this.BankPartyVerification.Supplier = 0;
    this.BankPartyVerification.SupplierGrp = 0;
    // this.PLedgerChild.BindValue('Q');
    this.formObj.CRLIMIT = '';
    var checkAcid = this.nodeObj.ACID.substring(0, 2);


    if (this.nodeObj.TYPE == 'G') {
      this.Parent.Under = this.nodeObj.ACNAME;
      this.formObj.PARENT = this.nodeObj.ACID;
      this.formObj.MAPID = this.nodeObj.MAPID;
      this.formObj.PType = this.nodeObj.PType
      this.formObj.LEVELS = this.nodeObj.LEVELS + 1;
      if (this.nodeObj.ACID.substring(0, 2) == 'IE' || this.nodeObj.ACID.substring(0, 2) == 'DE') {
        this.HSN_Active = 1;
      }
    }
    else {
      this.Parent.Under = this.UnderObj.ACNAME;
      this.formObj.PARENT = this.UnderObj.ACID;
      this.formObj.MAPID = this.nodeObj.MAPID;
      this.formObj.PType = this.nodeObj.PType
      this.formObj.LEVELS = this.nodeObj.LEVELS
    }

    if (this.formObj.MAPID == 'B') {
      this.AdditionalInfo = 1;
      this.showBank = 1
      this.isGroup = 0
      this.BankPartyVerification.Bank = 1
      this.formObj.MAPID = 'B';
    }
    else if (this.formObj.MAPID == 'C') {
      this.showAssets = 1
      this.formObj.MAPID = 'C'
    }
    else {
      this.showAssets = 0
      this.formObj.MAPID = ''
    }

    if (this.formObj.PType == 'C') {

      this.AdditionalInfo = 1;
      this.showPLedgerInfo = 1;
      this.showCustomer = 1;
      // this.PLedgerChild.BindValue('C', 0);
      this.masterService.PType = 'C';
      this.Party = "Customer"
      this.isGroup = 0
      this.BankPartyVerification.Customer = 1
      this.fromTreeTag = 1;
    }
    if ((this.formObj.PType == 'V' && checkAcid == 'PA') || this.nodeObj.ACID == 'LB1199') {

      this.AdditionalInfo = 1;
      this.showPLedgerInfo = 1;
      this.PTypeForParty = 'V'
      this.Party = "Supplier"
      this.isGroup = 0
      this.showCustomer = 0;
      // this.PLedgerChild.BindValue('V', 0);
      this.masterService.PType = 'V';
      this.BankPartyVerification.Supplier = 1
      this.fromTreeTag = 2;

    }

    this.divisioncheckObj = {};
    this.showDivSelectionTable=false;
    this.division.forEach(x => {
       x.isCheck = false;
    })
    this.formObj.DIV = this.userProfile.userDivision;
    
  }

  DivListForSave: DivList[] = [];
  SumbitSave() {
    if (this.masterService.validateMasterCreation("save") == false) {
      return;
    }
    if (this.mode == "view") {
      this.alertService.warning("Cannot Save. You are in view Mode")
    } else {
      try {
        // this.form.value.MAPID = "N";
        ////console.log("@@nodeObj", this.nodeObj)

        if (this.nodeObj.ACID == 'AG013' || (this.nodeObj.PARENT ? this.nodeObj.PARENT.MAPID == 'OD' : this.nodeObj.MAPID == 'OD') || this.nodeObj.MAPID == 'OD') {
          this.formObj.MAPID = "OD";
        }
        let saveModel = Object.assign(<TAcList>{}, this.formObj);
        if (saveModel.ACNAME == '') {
          alert("Please enter ACNAME first!")
          return;
        }
        else if (saveModel.PARENT == '') {
          alert("Please Choose Parent!")
          return;
        }
        if (this.BankPartyVerification.Customer == 1 || this.BankPartyVerification.Supplier == 1) {


          // if (this.masterService.PLedgerObj.GSTTYPE == '') {
          //   alert("Please Choose GSTTYPE!")
          //   return;
          // }
          // if (this.masterService.PLedgerObj.PSTYPE == '') {
          //   alert("Please Choose Sales/Purchase Type!")
          //   return;
          // }
          // if (this.masterService.PLedgerObj.STATE == '') {
          //   alert("Please Choose States!")
          //   return;
          // }
        }
        if (saveModel.HASSUBLEDGER == 1 && this.isGroup == 1) {
          saveModel.MCAT = 'SG'
        }
        if (saveModel.DIV == '' || saveModel.DIV == null) {
          saveModel.DIV = this.userProfile.userDivision;

        }
        if (this.formObj.CRLIMIT == '' || this.formObj.CRLIMIT === null || this.formObj.CRLIMIT == null || this.formObj.CRLIMIT === undefined || this.formObj.CRLIMIT === '') {
          this.formObj.CRLIMIT = 0;
          saveModel.CRLIMIT = 0;
        }


        if (this.divisioncheckObj.ShareAllDiv == 2) {
          saveModel.ISCOMMONAC = 1;
          if (this.mode == "add") {

          }
        }
        else {
          saveModel.ISCOMMONAC = 0;
        }



        saveModel.enableDivSelectionTable = this.formObj.enableDivSelectionTable;
        let divisionObj = <SelectedDivisions>{};
        divisionObj.DIV = this.divisioncheckObj.MultipleDivision;

        ////console.log("divisionObj", divisionObj)
        // this.SelectedDivisionList.push(divisionObj);

        this.loadingService.show("Saving Data please wait...");
        if (this.masterService.PLedgerObj.PType == "C") {
          this.masterService.PLedgerObj.GEO = this.PLedgerChild.geo
        }
        let DObj: DObj = <DObj>{};
        if (this.showDivSelectionTable == true) {
          this.DivListForSave = [];
          for (let i of this.division) {
            if (i.isCheck == true) {
              let dObj: DivList = <DivList>{};
              dObj.ACID = i.ACID;
              dObj.DIV = i.INITIAL;
              this.DivListForSave.push(dObj);
            }
          }

          DObj.DivList = this.DivListForSave;
        } else {
          if (this.divisioncheckObj.ShareAllDiv == 2 || this.divisioncheckObj.ShareAllDiv == 1) {
            saveModel.enableDivSelectionTable = true;
            this.DivListForSave = [];
            for (let i of this.division) {
              let dObj: DivList = <DivList>{};
              dObj.ACID = i.ACID;
              dObj.DIV = i.INITIAL;
              this.DivListForSave.push(dObj);
            }

            DObj.DivList = this.DivListForSave;
          }
        }



        // ////console.log("CheckDivisionList",this.DivListForSave,this.showDivSelectionTable,this.division)
        // return;
        let sub = this.masterService.saveAccountLedgerOnly(
          this.mode,
          saveModel,
          null,
          this.BankPartyVerification,
          this.masterService.BankObj,
          this.masterService.PLedgerObj,
          this.AdditionalInfo,
          this.autoCalculationParam,
          DObj


        ).subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              this.nodes.map(data => { data })
              this.alertService.success("Data Saved Successfully");
              this.preventNavigationService.preventNavigation(false);
              this.showPLedgerInfo = 0;
              this.isGroup = 0;
              this.showBank = 0;
              this.masterService.BankObj = {};
              this.masterService.PLedgerObj = {};
              this.formObj.ACNAME = '';
              this.formObj.ACCODE = '';
              document.getElementById('generalInfo').click()
              this.addMode = false;
              this.Refresh();
              this.autoCalculationParam.igst = 0;
              this.autoCalculationParam.cgst = 0;
              this.autoCalculationParam.sgst = 0;
              this.autoCalculationParam.cess = 0;
              this.formObj.isAutoGSTApplicable = 0;
              this.formObj.isRCMApplicable = 0;
              this.formObj.isReverseChargeApplicable = 0;
              this.formObj.CRLIMIT = '';
              this.divisioncheckObj = {};
              DObj = <DObj>{};
              this.cancel();
              this.formObj.enableDivSelectionTable = false;
              this.showDivSelectionTable = false;

            } else {

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
              this.alertService.error(
                "Error in Saving Data:" + data.result._body
              );

            }
          },
          error => {
            this.loadingService.hide();
            this.alertService.error(error);

          }
        );
        this.subcriptions.push(sub);
      } catch (e) {
        this.alertService.error(e);
      }
    }
  }
  initilizeAl() {
    this.formObj.ACNAME = '';
    this.Parent.Under = '';
    this.Parent.Primary = '';
    this.formObj.HASSUBLEDGER = 0;
    this.formObj.HSN_SACCODE = ''
  }
  cancel() {
    this.addMode = false;
    this.showPLedgerInfo = 0;
    this.isGroup = 0;
    this.modeTitle = ""
    this.initilizeAl()
    document.getElementById('generalInfo').click()
    this.mode = 'new';
    //this.ViewMode = true;
    this.isAccount = true;
    this.parentHasSubLedger = false;
    this.ViewMode = true;
    this.divisioncheckObj = {};
    this.showDivSelectionTable=false;
    this.division.forEach(x => {
       x.isCheck = false;
    })
    this.formObj.DIV = this.userProfile.userDivision;
  }
  EditItem() {
   if(!this.validateBranch("Edit")){
    return;
   }
    this.ViewMode = false;
    this.modeTitle = 'Edit Account'
    this.mode = 'edit';
    this.HSN_Active = 0;
    // this.Parent.Under = this.nodeObj.PARENT;
    this.formObj.PARENT = this.nodeObj.PARENTID;
    this.formObj.MAPID = this.nodeObj.MAPID;
    this.formObj.PType = this.nodeObj.PType;
    this.formObj.TYPE = this.nodeObj.TYPE;
    this.formObj.ACCODE = this.nodeObj.ACCODE;
    //this.formObj.ACID = this.nodeObj.ACID;
    this.formObj.ACID = this.selectedNodeEdit;
    if (this.nodeObj.ACID.substring(0, 2) == 'IE' || this.nodeObj.ACID.substring(0, 2) == 'DE') {
      this.HSN_Active = 1;
    }
    setTimeout(() => {
      this._BE.nativeElement.focus();
    }, 20);


  }
  DeleteItem() {
    //this.DeleteAcc.show();
    if(!this.validateBranch("delete")){
      return;
     }
    let childreenList = [];
    childreenList = this.nodeObj.children;
    if (childreenList.length > 0) {
      this.alertService.info("TRANSACTION EXIST UNDER SELECTED ACCOUNT NAME. HENCE, REQUESTED COMMAND IS ABORTED.");
    } else {
      this.DeleteAcc.show();
    }

  }

  DeleteYes() {
    if(!this.validateBranch("delete")){
      return;
     }
    this.DeleteAcc.hide();
    this.loadingService.show("Deleting Data please wait...");
    this.masterService.deleteAccount(this.nodeObj.ACID).subscribe(data => {
      if (data.status == "ok") {
        this.alertService.success("Data Deleted Successfully");
        this.loadingService.hide();
        this.Parent = <any>{};
        this.formObj = <any>{};
        this.Refresh();
      }
      else {
        this.loadingService.hide();
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
        this.alertService.info(
          "Error in Deleting Data:" + data.result._body
        );

      }
    })
  }
  DeleteNo() {
    if(!this.validateBranch("delete")){
      return;
     }

    this.DeleteAcc.hide();
  }

  onClickNo() {
    this.DeleteAcc.hide();
  }


  GSTApplicablecheck(e) {
    if (e.target.checked) { this.formObj.GSTchecked = 1; }
    else { this.formObj.GSTchecked = 0; }
  }
  TDSApplicablecheck(e) {
    if (e.target.checked) { this.formObj.TDSchecked = 1; }
    else { this.formObj.TDSchecked = 0; }
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
        var err = this.masterService.resolveError(error, "accountLedger - accountLedger");
        if (err) { alert(err.json()); }
      }
      );
  }

  autoCalculationevent(e) {
    if (e.target.checked) { this.formObj.isAutoGSTApplicable = 1; }
    else { this.formObj.isAutoGSTApplicable = 0; }
  }

  rcmChangeEvent(e) {
    if (e.target.checked) { this.formObj.isRCMApplicable = 1; }
    else { this.formObj.isRCMApplicable = 0; }
  }

  backToDashboard() {
    this.router.navigate(["pages/dashboard"])
  }
  validateBranch(text){
    return true;
    if(this._transactionService.userProfile.CompanyInfo.MAIN == 0 && this._transactionService.userSetting.EnableCentralMasterCreation == 1){
      this.alertService.warning("Cannot "+text+" Ledger under branch office");
      return false;
    }
    else{
      return true;
    }
  }
  enableDivSelectionTable(showTable) {
    // ////console.log("@@showTable", showTable)
    if (showTable == 1) {
      this.showDivSelectionTable = true;
      this.formObj.enableDivSelectionTable = true;
      this.division.forEach(x => {
        x.INITIAL == this.userProfile.CompanyInfo.INITIAL ? x.isCheck = true : '';
      })


    } else {
      this.showDivSelectionTable = false;
      this.formObj.enableDivSelectionTable = false;

    }
    this.divisioncheckObj.ShareAllDiv = 0;
    this.formObj.ISCOMMONAC = 0;
  }

  ShareAllDiv(event) {
    // ////console.log("@@event", event)
    this.formObj.enableDivSelectionTable = false;
    if (event == 1) {
      this.showDivSelectionTable = false;
      this.formObj.ISCOMMONAC = 1;
    }
    else {
      this.formObj.ISCOMMONAC = 0;
    }
  }

  check(e) {

    this.divisioncheckObj.MultipleDivision = e.target.value;

    // //console.log('checkValue@!', this.divisioncheckObj.MultipleDivision)
  }
  activeIndex: any;
  rowClick(i) {
    this.activeIndex = i;
  }
  changeDivision(e) {
    
    this.division.forEach(x => {
      x.INITIAL == e ? x.isDefault = true : x.isDefault = false;

    })

    if (this.mode == "edit") {
      this.division.forEach(x => {
        x.INITIAL == e ? x.isCheck = true : x.isCheck = false;
      })
    } else {
      this.division.forEach(x => {
        x.INITIAL == e ? x.isCheck = true : x.isCheck = false;
      })
    }
  }

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == 'F6') {
      $event.preventDefault();
      this.SumbitSave();
    }
    else if ($event.code == 'F3') {
      $event.preventDefault();
      this.cancel();
    }
    else if ($event.code == 'F5') {
      $event.preventDefault();
      this.EditItem();
    }
    if ($event.code == 'F10') {
      $event.preventDefault();
      this.backToDashboard();
    }
  }
  enableDivision: Boolean;
  ClickShareAccount(value) {
    this.formObj.enableDivSelectionTable = false;
    if (this.divisioncheckObj.ShareAccount == 1) {
      this.changeDivision(this.masterService.userProfile.CompanyInfo.INITIAL)
      this.enableDivision = true;


    }
    else {

      this.divisioncheckObj.ShareAllDiv = 0
      this.divisioncheckObj.ShareSelectiveDiv = 0
      this.enableDivision = false;

    }
    this.formObj.enableDivSelectionTable = false;
    this.showDivSelectionTable = false;
    
  }

  shiftParent() {
    this.masterService.getAccountListOfTree().subscribe(res => {
      this.ParentList = res;
    })
    this.ShiftParent.show();
  }

  onClose() {
    this.ShiftParentObj = {};
    this.ShiftParent.hide();
  }

  ConfirmShiftParent() {
    this.masterService.ShiftParent(this.ShiftParentObj).subscribe(res => {
      this.onClose();
      this.Refresh();
    })
  }

  ExportAccountLedger() {
    this.masterService.getAccountListOfTree().subscribe(res => {
      this.ParentList = res;
    })
    this.showAccountLedgerFilterpopUp = true;
  }

  ExportAll() {
    this.FormName.data = "Account";
    let filterObjData = { data: this.FormName, filtername: "AllAccountList" }
    this.masterService.getExcelFile('/getAllLegerList', filterObjData).subscribe(
      data => {
        this.alertService.hide();
        this.masterService.downloadFile(data);
        this.CancelCommand();
      },
      error => {
        this.alertService.hide();
      }
    )
  }

  OkCommand() {
    this.LedgerFilterObj.FILTER = "Account";
    let filterObjData = { data: this.LedgerFilterObj }
    this.masterService.getExcelFileFilter('/getLedgerByFilter', filterObjData).subscribe(
      data => {
        this.alertService.hide();

        this.masterService.downloadFile(data);
        this.CancelCommand();
      },
      error => {
        this.alertService.hide();
      }
    )
    this.showAccountLedgerFilterpopUp = false;
  }

  CancelCommand() {
    this.LedgerFilterObj = <IsLedgerFilter>{};
    this.FormName = <ExportLedgerFilterDto>{};
    this.showAccountLedgerFilterpopUp = false;
  }

  changeAccountGroup() {
    this.LedgerFilterObj.SUBGROUP = "";
    this.LedgerFilterObj.ACID = "";
    this.masterService.getSubGroupForQuickAccountMaster(this.LedgerFilterObj.MAINGROUP).subscribe(res => {
      this.SubGroupAccountMaster = res.result;
    })

    this.masterService.getAccountListOfTree().subscribe(res => {
      let abc = res.filter(x => x.ACID == this.LedgerFilterObj.MAINGROUP);
      this.ChildrenList = abc.length > 0 && abc[0].children.filter(x => x.TYPE == "A");
    })
  }

  changeAccountType() {
    this.LedgerFilterObj.SUBGROUP = "";
    this.LedgerFilterObj.ACID = "";
  }
  @ViewChild("genericGridBankList") genericGridBankList: GenericPopUpComponent;
  gridBankPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  showBankPopup(){
    this.gridBankPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getBankPagedList/`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: "BANKCODE",
          title: "Bank CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "BANKNAME",
          title: "Bank NAME",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.genericGridBankList.show();
  }
  onBankSelect(value){
    //console.log("ValueCheck",value)
    this.formObj.ACNAME = value.BANKNAME;
    this.formObj.ACCODE = value.BANKCODE;
  }
}

export class DObj {
  DivList: DivList[]
}
export class DivList {
  ACID: string;
  DIV: string;
  STAMP: number;
  ISACTIVE: number;
}

export interface IsLedgerFilter {
  FILTER: string;
  accountName: string;
  ACID: string;
  ACCOUNTTYPE: string;
  MAINGROUP: string;
  SUBGROUP: string;
}
export interface ExportLedgerFilterDto {
  data: string;
  filtername: string;
}