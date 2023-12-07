import { Component, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../../../../common/services/permission/authService.service';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { IActionMapping, KEYS, TREE_ACTIONS, TreeComponent } from 'angular-tree-component';
import { TreeViewAccService } from '../Account-Ledger-New/AccLedger.service';
import { Subject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';


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
  }
};
@Component({
  selector: 'add-budget-master-selector',
  templateUrl: './add-budget-master.component.html',
  providers: [AuthService],
  styleUrls: ["../../../modal-style.css", "./add-budget-master.component.scss"]
})
export class AddBudgetMasterComponent {
  selectedIndex: number;
  public DetailList: BudgetData[];
  public temp_DetailList: BudgetData[];
  is_yearly: boolean;
  genericTableList: any;
  is_quaterly: boolean;
  is_monthly: boolean;
  BudgetObj: Pobj = <Pobj>{};
  userProfile: any = <any>{};
  public SaveBudgetAllocationObj: Pobj = <Pobj>{};
  private returnUrl: string;

  busy: Subscription;
  public nodes: any[] = [];
  public tree: TreeComponent;
  GeoList: any[] = [];
  parentGroupID: string = "";
  showPopup: boolean = false;
  IS_CHECKED: boolean;
  dataAcName: any = []
  dataAcID: any = []
  source: LocalDataSource = new LocalDataSource();
  public selectedNode: any;
  userSetting: any;
  showActionCheckBox: boolean = false;
  loadListSubject: Subject<any> = new Subject<any>();
  root: string;
  costCenterList: any[] = []
  costCenterCategoryList: any[] = [];
  costcenterDetailListTotal:number;
  edit_budg_interval:string;
  edit_adbs:string;

  @ViewChild("genericGridAccountLedger") genericGridAccountLedger: GenericPopUpComponent;
  gridPopupSettingsForAccountLedgerList: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridBudgetList") genericGridBudgetList: GenericPopUpComponent;
  gridPopupSettingsForBudgetList: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridCostCenterList")
  genericGridCostCenterList: GenericPopUpComponent;
  gridCostCenterListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridCostCenterGroupList")
  genericGridCostCenterGroupList: GenericPopUpComponent;
  gridCostCenterGroupListPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  constructor(private masterService: MasterRepo, private loadingService: SpinnerService,
    private router: Router,
    private alertService: AlertService,
    private loader: SpinnerService,
    private _authService: AuthService,
    private _transactionService: TransactionService,
    public AccountService: TreeViewAccService,


    private _activatedRoute: ActivatedRoute
  ) {
    this.userSetting = this._authService.getSetting();
    this.userProfile = _authService.getUserProfile();
    try {
      this.router = router;
      if (!!this._activatedRoute.snapshot.params['returnUrl']) {
        this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
      }
      if (!!this._activatedRoute.snapshot.params['VCHRNO']) {
        let VCHRNO: string = "";
        VCHRNO = this._activatedRoute.snapshot.params['VCHRNO'];

        this.masterService.LoadBudgetAllocation(VCHRNO)
          .subscribe(data => {
            if (data.status == 'ok') {
              if (data.result && data.result.length && data.result.length > 0) {
                this.BudgetObj.VCHRNO = VCHRNO;
                let abc = VCHRNO && VCHRNO.split('-');
                this.BudgetObj.BUDGET_NUMBER = abc && abc[0];
                this.BudgetObj.BUDGET_NAME = data.result[0].BUDGET_NAME;
                this.BudgetObj.BUDGET_TYPE = data.result[0].BUDGET_TYPE;
                this.edit_budg_interval=this.BudgetObj.BUDGET_INTERVAL = data.result[0].BUDGET_INTERVAL;
                this.edit_adbs=this.BudgetObj.INTERVAL_ON_AD_OR_BS = data.result[0].INTERVAL_ON_AD_OR_BS;
                this.BudgetObj.PREFILL_DATA = data.result[0].PREFILL_DATA;
                this.BudgetObj.TRNDATE = data.result[0].TRNDATE;
                this.BudgetObj.BSDATE = data.result[0].BSDATE;
                this.BudgetObj.SUBDIVIDED_BY = data.result[0].SUBDIVIDED_BY;
                this.BudgetObj.FROM_DATE = data.result[0].FROM_DATE;
                this.BudgetObj.FROM_BSDATE = data.result[0].FROM_BSDATE;
                this.BudgetObj.TO_DATE = data.result[0].TO_DATE;
                this.BudgetObj.TO_BSDATE = data.result[0].TO_BSDATE;
                this.BudgetObj.ACTION = data.result[0].ACTION;
                this.BudgetObj.ACTION_TYPE = data.result[0].ACTION_TYPE;
                this.BudgetObj.CREATED_BY = data.result[0].CREATED_BY;
                this.BudgetObj.CREATED_ON = data.result[0].CREATED_ON;

                if(data.result[0].ACTION=="WARN" ||data.result[0].ACTION=="STOP" ){
                  this.showActionCheckBox = true;

                }

                this.ChooseInterval();
              }
              if (data.result2 && data.result2.length && data.result2.length > 0) {
                this.temp_DetailList = [];
                this.DetailList = [];
                this.BudgetObj.COSTCENTER_CATEGORYID = data.result2[0].COSTCENTER_CATEGORYID;
                this.BudgetObj.COSTCENTER_CATEGORYNAME = data.result2[0].COSTCENTER_CATEGORYNAME;
                this.BudgetObj.CCID = data.result2[0].CCID;
                this.BudgetObj.COSTCENTER_NAME = data.result2[0].COSTCENTER_NAME;
                this.temp_DetailList = data.result2[0].CCID ? data.result2.filter(x => x.CCID == data.result2[0].CCID) : data.result2;
                this.DetailList = data.result2[0].CCID ? data.result2 : [];
                let _data = this.DetailList.filter(x => x.CCID == data.result2[0].CCID);
                if (_data && _data.length && _data.length > 0) {
                  for (var a of _data) {
                    let _findIndex = this.DetailList.findIndex(x => x.CCID == data.result2[0].CCID);
                    if (_findIndex >= 0) {
                      this.DetailList.splice(_findIndex, 1);
                    }
                  }

                  console.log("@@DetailList", this.DetailList)
                }
                this.CalculateSum();
                if(  this.temp_DetailList!=null){
                  this.costcenterDetailListTotal=0;
                  this.temp_DetailList.forEach(x => {
                    this.costcenterDetailListTotal += this._transactionService.nullToZeroConverter(x.BUDGET);
                  });

                }

              
              }
              let mode = this._activatedRoute.snapshot.params['mode'];
              if (mode == 'view') {
                this.BudgetObj.MODE = "VIEW";
              } else {
                this.BudgetObj.MODE = "EDIT";
              }
            }
            else {
              this.BudgetObj.MODE = '';
            }
          }, error => {

          }
          )
      }
      else {
        this.BudgetObj.MODE = "ADD";
        this.reset();
      }
    } catch (ex) {
      alert(ex);
    }

    let ACID = 'AL';
    this.masterService.getAcidWiseAccountList(ACID).subscribe(res => {
      if (res.status == "ok") {
        this.AccountService.partyList = res ? res.result : [];
      }
      else {
        this.AccountService.partyList = [];
      }
    })

    // this.masterService.getCostcenter().subscribe(res => {
    //   this.costCenterList = res;
    // })

    this.masterService.getCostCenterGroupPagedList().subscribe(res => {
      this.costCenterCategoryList = res.data;
      console.log('costCenterCategoryList', this.costCenterCategoryList);
    })






    this.masterService.getAccountListTree().map(x => { return x })
    this.busy = this.masterService.getAccountListTree().map(x => { return x })
      .subscribe(res => {
        this.nodes = res;
        if (this.tree != null) {
          this.tree.treeModel.update();
        }
      }, error => {
        this.masterService.resolveError(error, "partyLedger - PartyLedger");
      });

    this.AccountService.getHierachy().subscribe(res => {
      if (res.status == "ok") {
        this.GeoList = res.result.GEO;

      }
    });
    this.AccountService.loadTableListSubject.subscribe(x => {
    })
    this.AccountService.getMainGroupList().subscribe((response) => {
      if (response.length > 0) {
        this.masterService.mainGroupList = response;
      }
      else {
        this.masterService.mainGroupList = [];
      }
    })
  }

  getTreeItem() {
    this.AccountService.Refresh();
    this.busy = this.AccountService.busy;
    this.nodes = this.AccountService.nodes;
    this.tree = this.AccountService.tree;
  }

  ngOnInit() {
    this.onChangeYa();

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
  getSubgroupA(e) {
    let ACID = e.target.value
    this.selectedNode = {};
    this.masterService.SelectedGroup = this.selectedNode.ACID;
    this.getRootParent(this.selectedNode, this.nodes);
    this.loadListSubject.next(this.selectedNode);
    this.AccountService.ParentInfo = this.selectedNode;
    let mainGroupID = e.target.value;
    this.parentGroupID = mainGroupID;
    this.AccountService.getSubGroupList(mainGroupID).subscribe((res) => {
      if (res.length > 0) {
        this.masterService.subGroupAList = res;
        this.masterService.disableSubGroupA = false;
        this.masterService.disableSubGroupB = true;
        this.masterService.disableSubGroupC = true;
        this.masterService.groupSelectObj.SUBGROUP_A = "";
        this.masterService.groupSelectObj.SUBGROUP_B = "";
        this.masterService.groupSelectObj.SUBGROUP_C = "";


      } else {
        this.masterService.subGroupAList = [];
        this.masterService.disableSubGroupA = true;
        this.masterService.disableSubGroupB = true;
        this.masterService.disableSubGroupC = true;
        this.masterService.groupSelectObj.SUBGROUP_A = "";
        this.masterService.groupSelectObj.SUBGROUP_B = "";
        this.masterService.groupSelectObj.SUBGROUP_C = "";
      }
    });

    this.masterService.getAcidWiseAccountList(ACID).subscribe(res => {
      if (res.status == "ok") {
        this.AccountService.partyList = res ? res.result : [];
      }
      else {
        this.AccountService.partyList = [];
      }
    })
  }
  getSubgroupB(e) {
    let subGroupID = e.target.value;
    this.parentGroupID = subGroupID;
    this.AccountService.getSubGroupList(this.masterService.groupSelectObj.SUBGROUP_A).subscribe((res) => {
      if (res.length > 0) {
        this.masterService.subGroupBList = res;
        this.masterService.disableSubGroupB = false;
        this.masterService.disableSubGroupC = true;

      } else {
        this.masterService.subGroupBList = [];
        this.masterService.disableSubGroupB = true;
        this.masterService.disableSubGroupC = true;
        this.masterService.groupSelectObj.SUBGROUP_B = "";
      }
    })
    this.selectedNode = {};
    this.loadListSubject.next(this.selectedNode);
    this.masterService.getAcidWiseAccountList(subGroupID).subscribe(res => {
      if (res.status == "ok") {
        this.AccountService.partyList = res ? res.result : [];
      }
      else {
        this.AccountService.partyList = [];
      }
    })
  }


  reset() {

    this.is_yearly = true;
    this.is_quaterly = false;
    this.is_monthly = false;
    this.BudgetObj = {} as Pobj;
    this.DetailList = [] as Array<BudgetData>;
    this.temp_DetailList = [] as Array<BudgetData>;
    let newRow = <BudgetData>{};
    newRow.ACCOUNTGROUP_ID = null;
    newRow.ACCOUNTGROUP_NAME = null;
    newRow.ACID = null;
    newRow.ACNAME = null;
    newRow.BUDGET = null;
    // this.DetailList.push(newRow);
    this.temp_DetailList.push(newRow);
    this.BudgetObj.MODE = "ADD";
    this.BudgetObj.BUDGET_INTERVAL = "YEARLY";
    this.BudgetObj.ACTION = "IGNORE";
    this.BudgetObj.BUDGET_TYPE = "ON_NET_TRANSACTION";
    this.BudgetObj.SUBDIVIDED_BY = "DONOT_SUBDIVIDE";
    this.BudgetObj.INTERVAL_ON_AD_OR_BS = "BSINTERVAL";
    this.showActionCheckBox = false;
    this._transactionService.TrnMainObj.VoucherName = "BudgetAllocate";
    this.BudgetObj.DIVISION = this._transactionService.TrnMainObj.DIVISION = this.userProfile.division;
    this.BudgetObj.PHISCALID = this._transactionService.TrnMainObj.PhiscalID = this.userProfile.PhiscalYearInfo.PhiscalID;
    this.BudgetObj.COMPANYID = this.userProfile.CompanyInfo.COMPANYID;
    this.BudgetObj.CURRENT_YEAR = "20" + this.userProfile.PhiscalYearInfo.PhiscalID.split("/")[0];
    this.BudgetObj.NEXT_YEAR = "20" + this.userProfile.PhiscalYearInfo.PhiscalID.split("/")[1];
    this.BudgetObj.BEGINDATE = this.BudgetObj.FROM_DATE = this.masterService.PhiscalObj.BeginDate.split('T')[0];
    this.BudgetObj.ENDDATE = this.BudgetObj.TO_DATE = this.masterService.PhiscalObj.EndDate.split('T')[0];
    this.changeFromDate(this.BudgetObj.FROM_DATE, "AD");
    this.changeToDate(this.BudgetObj.TO_DATE, "AD");
    this.AccountService.partyList=[];
    this.edit_budg_interval="";
    this.edit_adbs="";
    this.masterService.getVoucherNo(this._transactionService.TrnMainObj, "BG").subscribe(res => {
      if (res.status == "ok") {
        this.BudgetObj.VCHRNO = res.result.VCHRNO;
        let abc = res.result.VCHRNO && res.result.VCHRNO.split('-');
        this.BudgetObj.BUDGET_NUMBER = abc && abc[0];
      } else {
        alert("Failed to retrieve VoucherNo");
      }
    });
  }

  getSubgroupC(e) {
    let subGroupID = e.target.value;
    this.parentGroupID = subGroupID;
    this.AccountService.getSubGroupList(this.masterService.groupSelectObj.SUBGROUP_B).subscribe((res) => {
      if (res.length > 0) {
        this.masterService.subGroupCList = res;
        this.masterService.disableSubGroupC = false;
      } else {
        this.masterService.subGroupCList = [];
        this.masterService.disableSubGroupC = true;
        this.masterService.groupSelectObj.SUBGROUP_C = "";
      }
    })

    this.masterService.getAcidWiseAccountList(subGroupID).subscribe(res => {
      if (res.status == "ok") {
        this.AccountService.partyList = res ? res.result : [];
      }
      else {
        this.AccountService.partyList = [];
      }
    })
  }

  selectSubgroupC(e) {
    let subGroupID = e.target.value;
    this.parentGroupID = subGroupID;
    this.masterService.getAcidWiseAccountList(this.masterService.groupSelectObj.SUBGROUP_C).subscribe(res => {
      if (res.status == "ok") {
        this.AccountService.partyList = res ? res.result : [];
      }
      else {
        this.AccountService.partyList = [];
      }
    })
  }

  onChangeYa() {

    if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "BSINTERVAL") {
      this.genericTableList = [
        {
          header: 'So No.',
          inputType: 'text',
          hidden: false,
          headerNgStyle: { width: "4%" },
        },
        {
          header: 'Account Group',
          inputType: 'text',
          hidden: false,
          headerNgStyle: { width: "15%" },
        },
        {
          header: 'Account Ledger',
          inputType: 'text',
          hidden: false,
          headerNgStyle: { width: "15%" },
        },

        {
          header: 'Shrawan-Ashoj',
          inputType: 'number',
          hidden: this.is_yearly || this.is_monthly,
          headerNgStyle: { width: "15%" },
        },
        {
          header: 'Kartik-Poush',
          inputType: 'number',
          hidden: this.is_yearly || this.is_monthly,
          headerNgStyle: { width: "15%" },
        },
        {
          header: 'Magh-Chaitra',
          inputType: 'number',
          hidden: this.is_yearly || this.is_monthly,
          headerNgStyle: { width: "15%" },
        },
        {
          header: 'Baisakh-Asar',
          inputType: 'number',
          hidden: this.is_yearly || this.is_monthly,
          headerNgStyle: { width: "15%" },
        },
       
        {
          header: 'Shrawan',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Bhadra',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Ashoj',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Kartik',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Mangsir',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Poush',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },

        {
          header: 'Magh',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },

        {
          header: 'Falgun',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },

        {
          header: 'Chaitra',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Baisakh',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Jestha',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Asar',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Amount',
          inputType: 'number',
          hidden: false,
          headerNgStyle: { width: "15%" },
        },

      ]
        this.temp_DetailList && this.temp_DetailList.length && this.temp_DetailList.forEach(x => {
          x.JULY_SEPTEMBER = 0;
          x.OCTOBER_DECEMBER = 0;
          x.JANUARY_MARCH = 0;
          x.APRIL_JUNE = 0;
          x.JANUARY = 0;
          x.FEBRUARY = 0;
          x.MARCH = 0;
          x.APRIL = 0;
          x.MAY = 0;
          x.JUNE = 0;
          x.JULY = 0;
          x.AUGUST = 0;
          x.SEPTEMBER = 0;
          x.OCTOBER = 0;
          x.NOVEMBER = 0;
          x.DECEMBER = 0;
          x.BUDGET=0;
        })
    } else {
      this.genericTableList = [
        {
          header: 'So No.',
          inputType: 'text',
          hidden: false,
          headerNgStyle: { width: "4%" },
        },
        {
          header: 'Account Group',
          inputType: 'text',
          hidden: false,
          headerNgStyle: { width: "15%" },
        },
        {
          header: 'Account Ledger',
          inputType: 'text',
          hidden: false,
          headerNgStyle: { width: "15%" },
        },
        {
          header: 'July-Sept',
          inputType: 'number',
          hidden: this.is_yearly || this.is_monthly,
          headerNgStyle: { width: "15%" },
        },
        {
          header: 'Oct-Dec',
          inputType: 'number',
          hidden: this.is_yearly || this.is_monthly,
          headerNgStyle: { width: "15%" },
        },
        {
          header: 'Jan-Mar',
          inputType: 'number',
          hidden: this.is_yearly || this.is_monthly,
          headerNgStyle: { width: "15%" },
        },
        {
          header: 'Apr-Jun',
          inputType: 'number',
          hidden: this.is_yearly || this.is_monthly,
          headerNgStyle: { width: "15%" },
        },
       
        {
          header: 'Apr',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'May',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Jun',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Jul',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Aug',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Sept',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Oct',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Nov',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },

        {
          header: 'Dec',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Jan',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Feb',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Mar',
          inputType: 'number',
          hidden: this.is_yearly || this.is_quaterly,
          headerNgStyle: { width: "73px" },
        },
        {
          header: 'Amount',
          inputType: 'number',
          hidden: false,
          headerNgStyle: { width: "15%" },
        },
      ]
      this.temp_DetailList && this.temp_DetailList.length && this.temp_DetailList.forEach(x => {
        x.SHRAWAN_ASHOJ = 0;
        x.KARTIK_POUSH = 0;
        x.MAGH_CHAITRA = 0;
        x.BAISAKH_ASAR = 0;
        x.BAISAKH = 0;
        x.JESTHA = 0;
        x.ASAR = 0;
        x.SHRAWAN = 0;
        x.BHADRA = 0;
        x.ASHOJ = 0;
        x.KARTIK = 0;
        x.MANGSIR = 0;
        x.POUSH = 0;
        x.MAGH = 0;
        x.FALGUN = 0;
        x.CHAITRA = 0;
        x.BUDGET=0;
      })
    }
    this.BudgetObj.TOTAL_BUDGET=0;
  }

  SelectionAction() {
    if (this.BudgetObj.ACTION == "WARN" || this.BudgetObj.ACTION == "STOP") {
      this.showActionCheckBox = true;
      if (this.BudgetObj.BUDGET_INTERVAL == "YEARLY") {
        this.BudgetObj.ACTION_TYPE = "ANNUALLY";
      } else if (this.BudgetObj.BUDGET_INTERVAL == "QUARTERLY") {
        this.BudgetObj.ACTION_TYPE = "QUARTERLY";
      } else if (this.BudgetObj.BUDGET_INTERVAL == "MONTHLY") {
        this.BudgetObj.ACTION_TYPE = "MONTHLY";
      }
    } else {
      this.showActionCheckBox = false;
      this.BudgetObj.ACTION_TYPE = "";
    }
  }

  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this.BudgetObj.BSDATE =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
      }
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      let yearValue = moment(value).year();
      var adDate = adbs.bs2ad(bsDate);
      this.BudgetObj.TRNDATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }

  changeFromDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this.BudgetObj.FROM_BSDATE =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
      }
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      let yearValue = moment(value).year();
      var adDate = adbs.bs2ad(bsDate);
      this.BudgetObj.FROM_DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }

  changeToDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      let yearValue = moment(value).year();
      if (yearValue.toString().length == 4) {
        var adDate = (value.replace("-", "/")).replace("-", "/");
        var bsDate = adbs.ad2bs(adDate);
        bsDate.en.month = bsDate.en.month <= 9 ? "0" + (bsDate.en.month) : bsDate.en.month
        this.BudgetObj.TO_BSDATE =
          (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
      }
    }
    else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[2] + "/" + datearr[1] + "/" + datearr[0];
      let yearValue = moment(value).year();
      var adDate = adbs.bs2ad(bsDate);
      this.BudgetObj.TO_DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    }
  }
  AccountGroupClick(event: any) {
    this.AccountService.partyList.forEach(x => {
      if (x.IS_CHECKED == true) {
        x.IS_CHECKED = false;
      }
    });
    this.masterService.groupSelectObj.MGROUP = ""
    this.showPopup = true
  }
  Close() {
    this.showPopup = false

  }
  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == "Escape") {
      $event.preventDefault();
      this.showPopup = false
    }
  }

  rowClick(i) {
    this.selectedIndex = i;
  }
  AccountEnterClicked(event: any) {
    this.gridPopupSettingsForAccountLedgerList = this.masterService.getGenericGridPopUpSettings('AccountLedgerListForReport');
    this.genericGridAccountLedger.show();
  }
  dblClickAccountSelect(account) {
    this.temp_DetailList[this.selectedIndex].ACID = account.ACID;
    this.temp_DetailList[this.selectedIndex].ACNAME = account.ACNAME;
  }

  ChooseInterval() {
    if (this.BudgetObj.MODE == "EDIT") {
      if (confirm("All previous amount data will be reset. Are you sure you want to change interval?")) {
        
      }else{
        this.BudgetObj.BUDGET_INTERVAL=this.edit_budg_interval;
        return;
      }
    }
    this.BudgetObj.TOTAL_BUDGET = 0;
    if (this.BudgetObj.BUDGET_INTERVAL == "YEARLY") {
      this.is_yearly = true;
      this.is_quaterly = false;
      this.is_monthly = false;
      this.onChangeYa();
      this.temp_DetailList && this.temp_DetailList.length && this.temp_DetailList.forEach(x => {
        x.SHRAWAN_ASHOJ = 0;
        x.KARTIK_POUSH = 0;
        x.MAGH_CHAITRA = 0;
        x.BAISAKH_ASAR = 0;
        x.JULY_SEPTEMBER = 0;
        x.OCTOBER_DECEMBER = 0;
        x.JANUARY_MARCH = 0;
        x.APRIL_JUNE = 0;
        x.BAISAKH = 0;
        x.JESTHA = 0;
        x.ASAR = 0;
        x.SHRAWAN = 0;
        x.BHADRA = 0;
        x.ASHOJ = 0;
        x.KARTIK = 0;
        x.MANGSIR = 0;
        x.POUSH = 0;
        x.MAGH = 0;
        x.FALGUN = 0;
        x.CHAITRA = 0;
        x.JANUARY = 0;
        x.FEBRUARY = 0;
        x.MARCH = 0;
        x.APRIL = 0;
        x.MAY = 0;
        x.JUNE = 0;
        x.JULY = 0;
        x.AUGUST = 0;
        x.SEPTEMBER = 0;
        x.OCTOBER = 0;
        x.NOVEMBER = 0;
        x.DECEMBER = 0;
        x.BUDGET = 0;
      })
    } else if (this.BudgetObj.BUDGET_INTERVAL == "QUARTERLY") {
      this.is_yearly = false;
      this.is_quaterly = true;
      this.is_monthly = false;
      this.onChangeYa();
      this.temp_DetailList && this.temp_DetailList.length && this.temp_DetailList.forEach(x => {
        x.BAISAKH = 0;
        x.JESTHA = 0;
        x.ASAR = 0;
        x.SHRAWAN = 0;
        x.BHADRA = 0;
        x.ASHOJ = 0;
        x.KARTIK = 0;
        x.MANGSIR = 0;
        x.POUSH = 0;
        x.MAGH = 0;
        x.FALGUN = 0;
        x.CHAITRA = 0;
        x.JANUARY = 0;
        x.FEBRUARY = 0;
        x.MARCH = 0;
        x.APRIL = 0;
        x.MAY = 0;
        x.JUNE = 0;
        x.JULY = 0;
        x.AUGUST = 0;
        x.SEPTEMBER = 0;
        x.OCTOBER = 0;
        x.NOVEMBER = 0;
        x.DECEMBER = 0;
        x.BUDGET = 0;
      })
    } else if (this.BudgetObj.BUDGET_INTERVAL == "MONTHLY") {
      this.is_yearly = false;
      this.is_quaterly = false;
      this.is_monthly = true;
      this.onChangeYa();
      this.temp_DetailList && this.temp_DetailList.length && this.temp_DetailList.forEach(x => {
        x.SHRAWAN_ASHOJ = 0;
        x.KARTIK_POUSH = 0;
        x.MAGH_CHAITRA = 0;
        x.BAISAKH_ASAR = 0;
        x.JULY_SEPTEMBER = 0;
        x.OCTOBER_DECEMBER = 0;
        x.JANUARY_MARCH = 0;
        x.APRIL_JUNE = 0;
        x.BAISAKH = 0;
        x.JESTHA = 0;
        x.ASAR = 0;
        x.SHRAWAN = 0;
        x.BHADRA = 0;
        x.ASHOJ = 0;
        x.KARTIK = 0;
        x.MANGSIR = 0;
        x.POUSH = 0;
        x.MAGH = 0;
        x.FALGUN = 0;
        x.CHAITRA = 0;
        x.JANUARY = 0;
        x.FEBRUARY = 0;
        x.MARCH = 0;
        x.APRIL = 0;
        x.MAY = 0;
        x.JUNE = 0;
        x.JULY = 0;
        x.AUGUST = 0;
        x.SEPTEMBER = 0;
        x.OCTOBER = 0;
        x.NOVEMBER = 0;
        x.DECEMBER = 0;
        x.BUDGET = 0;
      })
    }
    else {
      return false

    }

  }

  saveClick() {

    if (this.BudgetObj.BUDGET_NAME === '' ||
      this.BudgetObj.BUDGET_NAME === null ||
      this.BudgetObj.BUDGET_NAME === undefined||
      this.BudgetObj.BUDGET_NAME.trim() === '') {
      this.alertService.info("Please Enter Budget Name.");
      return;
    }

    if (this.BudgetObj.SUBDIVIDED_BY == "DONOT_SUBDIVIDE") {
      this.DetailList = this.temp_DetailList.filter(x => x.BUDGET > 0);
    } else {
      if (this.BudgetObj.CCID != null && this.BudgetObj.CCID != undefined && this.BudgetObj.CCID != "") {
        if (this.temp_DetailList.length > 0) {
          if (this.temp_DetailList[0].ACID != null) {
            this.alertService.info("Please add the data of the table to save.");
            return;
          }
        }
      }
    }

    // if (this.DetailList.length == 0) {
    //   this.alertService.info("No data to save!");
    //   return false;
    // }
    if (!this.BudgetObj.TRNDATE) {
      this.BudgetObj.TRNDATE = new Date().toJSON().split('T')[0];
      this.changeEntryDate(this.BudgetObj.TRNDATE, 'AD');
    }
    if (!this.BudgetObj.FROM_DATE) {
      this.BudgetObj.FROM_DATE = this.masterService.PhiscalObj.BeginDate.split('T')[0];
      this.changeFromDate(this.BudgetObj.FROM_DATE, 'AD');
    }
    if (!this.BudgetObj.TO_DATE) {
      this.BudgetObj.TO_DATE = this.masterService.PhiscalObj.EndDate.split('T')[0];
      this.changeToDate(this.BudgetObj.TO_DATE, 'AD');
    }

    this.CalculateFinalSum();
    this.BudgetObj.DIVISION = this.userProfile.division;
    this.BudgetObj.PHISCALID = this.userProfile.PhiscalYearInfo.PhiscalID;
    this.BudgetObj.COMPANYID = this.userProfile.CompanyInfo.COMPANYID;
    this.BudgetObj.CURRENT_YEAR = "20" + this.userProfile.PhiscalYearInfo.PhiscalID.split("/")[0];
    this.BudgetObj.NEXT_YEAR = "20" + this.userProfile.PhiscalYearInfo.PhiscalID.split("/")[1];
    this.BudgetObj.BEGINDATE = this.masterService.PhiscalObj.BeginDate.split('T')[0];
    this.BudgetObj.ENDDATE = this.masterService.PhiscalObj.EndDate.split('T')[0];
    this.changeFromDate(this.BudgetObj.FROM_DATE, "AD");
    this.changeToDate(this.BudgetObj.TO_DATE, "AD");
    this.SaveBudgetAllocationObj = this.BudgetObj;
    this.SaveBudgetAllocationObj.BudgetDataList = this.DetailList;
    this.SaveBudgetAllocationObj.BudgetDataList.forEach(x => {
      //Budget Allocation data prepare starts
      x.VCHRNO = this.BudgetObj.VCHRNO;
      x.DIVISION = this.userProfile.division;
      x.PHISCALID = this.userProfile.PhiscalYearInfo.PhiscalID;
      x.COMPANYID = this.userProfile.CompanyInfo.COMPANYID;
    })

    let bodyData = { data: this.SaveBudgetAllocationObj, MODE: this.BudgetObj.MODE };
    this.masterService.saveBudgetAllocation(bodyData).subscribe(x => {
      if (x.status == "ok") {
        this.reset();
        this.alertService.info("Saved Successfully.");
        this.returnUrl = "/pages/account/AccountLedger/budget-master";
        this.router.navigate([this.returnUrl]);

      } else {
        var _error = JSON.parse(x.result._body);
        this.alertService.error(_error.result);
      }
    }), err => {
      this.alertService.error(err);
    }
  }

  CalculateSum() {
    this.BudgetObj.TOTAL_BUDGET = 0;
    this.temp_DetailList.forEach(x => {
      if (this.BudgetObj.BUDGET_INTERVAL == "QUARTERLY") {
        if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "BSINTERVAL") {
          x.BUDGET = this._transactionService.nullToZeroConverter(x.SHRAWAN_ASHOJ) + this._transactionService.nullToZeroConverter(x.KARTIK_POUSH) +
            this._transactionService.nullToZeroConverter(x.MAGH_CHAITRA) + this._transactionService.nullToZeroConverter(x.BAISAKH_ASAR);
        } else if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "ADINTERVAL") {
          x.BUDGET = this._transactionService.nullToZeroConverter(x.JULY_SEPTEMBER) + this._transactionService.nullToZeroConverter(x.OCTOBER_DECEMBER) +
            this._transactionService.nullToZeroConverter(x.JANUARY_MARCH) + this._transactionService.nullToZeroConverter(x.APRIL_JUNE);
        }
      } else if (this.BudgetObj.BUDGET_INTERVAL == "MONTHLY") {
        if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "BSINTERVAL") {
          x.BUDGET = this._transactionService.nullToZeroConverter(x.BAISAKH) + this._transactionService.nullToZeroConverter(x.JESTHA) +
            this._transactionService.nullToZeroConverter(x.ASAR) + this._transactionService.nullToZeroConverter(x.SHRAWAN) +
            this._transactionService.nullToZeroConverter(x.BHADRA) + this._transactionService.nullToZeroConverter(x.ASHOJ) +
            this._transactionService.nullToZeroConverter(x.KARTIK) + this._transactionService.nullToZeroConverter(x.MANGSIR) +
            this._transactionService.nullToZeroConverter(x.POUSH) + this._transactionService.nullToZeroConverter(x.MAGH) +
            this._transactionService.nullToZeroConverter(x.FALGUN) + this._transactionService.nullToZeroConverter(x.CHAITRA);
        } else if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "ADINTERVAL") {
          x.BUDGET = this._transactionService.nullToZeroConverter(x.JANUARY) + this._transactionService.nullToZeroConverter(x.FEBRUARY) +
            this._transactionService.nullToZeroConverter(x.MARCH) + this._transactionService.nullToZeroConverter(x.APRIL) +
            this._transactionService.nullToZeroConverter(x.MAY) + this._transactionService.nullToZeroConverter(x.JUNE) +
            this._transactionService.nullToZeroConverter(x.JULY) + this._transactionService.nullToZeroConverter(x.AUGUST) +
            this._transactionService.nullToZeroConverter(x.SEPTEMBER) + this._transactionService.nullToZeroConverter(x.OCTOBER) +
            this._transactionService.nullToZeroConverter(x.NOVEMBER) + this._transactionService.nullToZeroConverter(x.DECEMBER);
        }
      }
    })
    this.temp_DetailList.forEach(x => {
      this.BudgetObj.TOTAL_BUDGET += this._transactionService.nullToZeroConverter(x.BUDGET);
    });
  }

  CalculateFinalSum() {
    this.BudgetObj.TOTAL_BUDGET = 0;
    this.DetailList.forEach(x => {
      if (this.BudgetObj.BUDGET_INTERVAL == "QUARTERLY") {
        if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "BSINTERVAL") {
          x.BUDGET = this._transactionService.nullToZeroConverter(x.SHRAWAN_ASHOJ) + this._transactionService.nullToZeroConverter(x.KARTIK_POUSH) +
            this._transactionService.nullToZeroConverter(x.MAGH_CHAITRA) + this._transactionService.nullToZeroConverter(x.BAISAKH_ASAR);
        } else if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "ADINTERVAL") {
          x.BUDGET = this._transactionService.nullToZeroConverter(x.JULY_SEPTEMBER) + this._transactionService.nullToZeroConverter(x.OCTOBER_DECEMBER) +
            this._transactionService.nullToZeroConverter(x.JANUARY_MARCH) + this._transactionService.nullToZeroConverter(x.APRIL_JUNE);
        }
      } else if (this.BudgetObj.BUDGET_INTERVAL == "MONTHLY") {
        if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "BSINTERVAL") {
          x.BUDGET = this._transactionService.nullToZeroConverter(x.BAISAKH) + this._transactionService.nullToZeroConverter(x.JESTHA) +
            this._transactionService.nullToZeroConverter(x.ASAR) + this._transactionService.nullToZeroConverter(x.SHRAWAN) +
            this._transactionService.nullToZeroConverter(x.BHADRA) + this._transactionService.nullToZeroConverter(x.ASHOJ) +
            this._transactionService.nullToZeroConverter(x.KARTIK) + this._transactionService.nullToZeroConverter(x.MANGSIR) +
            this._transactionService.nullToZeroConverter(x.POUSH) + this._transactionService.nullToZeroConverter(x.MAGH) +
            this._transactionService.nullToZeroConverter(x.FALGUN) + this._transactionService.nullToZeroConverter(x.CHAITRA);
        } else if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "ADINTERVAL") {
          x.BUDGET = this._transactionService.nullToZeroConverter(x.JANUARY) + this._transactionService.nullToZeroConverter(x.FEBRUARY) +
            this._transactionService.nullToZeroConverter(x.MARCH) + this._transactionService.nullToZeroConverter(x.APRIL) +
            this._transactionService.nullToZeroConverter(x.MAY) + this._transactionService.nullToZeroConverter(x.JUNE) +
            this._transactionService.nullToZeroConverter(x.JULY) + this._transactionService.nullToZeroConverter(x.AUGUST) +
            this._transactionService.nullToZeroConverter(x.SEPTEMBER) + this._transactionService.nullToZeroConverter(x.OCTOBER) +
            this._transactionService.nullToZeroConverter(x.NOVEMBER) + this._transactionService.nullToZeroConverter(x.DECEMBER);
        }
      }
    })
    this.DetailList.forEach(x => {
      this.BudgetObj.TOTAL_BUDGET += this._transactionService.nullToZeroConverter(x.BUDGET);
    });
  }

  PreFillDataClicked() {
    let fiscal_Data = this.userProfile.PhiscalYearInfo.PhiscalID.split('/');
    let previous_fiscal_front = fiscal_Data[0] - 1;
    let previous_fiscal_back = fiscal_Data[0];
    let previous_fiscalid = previous_fiscal_front + "ZZ" + previous_fiscal_back;
    // let re = /\//gi;
    // let fiscalid = this.userProfile.PhiscalYearInfo.PhiscalID.replace(re, "ZZ");
    let division = this.userProfile.division;
    this.gridPopupSettingsForBudgetList = {
      title: "Budget List",
      apiEndpoints: `/getBudgetNameList/${previous_fiscalid}/${division}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "BUDGET_NUMBER",
          title: "Budget No",
          hidden: false,
          noSearch: false
        },
        {
          key: "BUDGET_NAME",
          title: "Budget Name",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.genericGridBudgetList.show();
  }

  dblClickBudgetSelect(value) {
    this.BudgetObj.PREFILL_DATA = value.BUDGET_NAME;
    this.masterService.LoadBudgetAllocation(value.VCHRNO)
      .subscribe(data => {
        if (data.status == 'ok') {
          if (data.result && data.result.length && data.result.length > 0) {
            this.BudgetObj.MODE = "ADD";
            this.BudgetObj.BUDGET_TYPE = data.result[0].BUDGET_TYPE;
            this.BudgetObj.BUDGET_INTERVAL = data.result[0].BUDGET_INTERVAL;
            this.BudgetObj.INTERVAL_ON_AD_OR_BS = data.result[0].INTERVAL_ON_AD_OR_BS;
            this.BudgetObj.TRNDATE = data.result[0].TRNDATE;
            this.BudgetObj.BSDATE = data.result[0].BSDATE;
            this.BudgetObj.SUBDIVIDED_BY = data.result[0].SUBDIVIDED_BY;
            this.BudgetObj.FROM_DATE = data.result[0].FROM_DATE;
            this.BudgetObj.FROM_BSDATE = data.result[0].FROM_BSDATE;
            this.BudgetObj.TO_DATE = data.result[0].TO_DATE;
            this.BudgetObj.TO_BSDATE = data.result[0].TO_BSDATE;
            this.BudgetObj.ACTION = data.result[0].ACTION;
            this.BudgetObj.ACTION_TYPE = data.result[0].ACTION_TYPE;
            this.ChooseInterval();
            this.SelectionAction();

          }
          if (data.result2 && data.result2.length && data.result2.length > 0) {
            this.temp_DetailList = [];
            this.DetailList = [];
            this.BudgetObj.COSTCENTER_CATEGORYID = data.result2[0].COSTCENTER_CATEGORYID;
            this.BudgetObj.COSTCENTER_CATEGORYNAME = data.result2[0].COSTCENTER_CATEGORYNAME;
            this.BudgetObj.CCID = data.result2[0].CCID;
            this.BudgetObj.COSTCENTER_NAME = data.result2[0].COSTCENTER_NAME;
            this.temp_DetailList = data.result2;
            this.CalculateSum();
          }
          //this.addrow()
        }
      }, error => {

      }
      )

  }

  addrow() {
    let _emptyrow = this.temp_DetailList.filter(x => x.ACID == null && (x.BUDGET == null || x.BUDGET == 0));
    if (_emptyrow && _emptyrow.length && _emptyrow.length > 0) {
      this.CalculateSum();
      return;
    }
    let newRow = <BudgetData>{};
    newRow.ACCOUNTGROUP_ID = null;
    newRow.ACCOUNTGROUP_NAME = null;
    newRow.ACID = null;
    newRow.ACNAME = null;
    newRow.BUDGET = null;
    this.temp_DetailList.push(newRow);
    this.CalculateSum();
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }

  clearRow($event, index, value) {
    $event.preventDefault();

    if (confirm("Are you sure you want to delete the row?")) {
      if (this.temp_DetailList.length < 1) return;

      if (this.temp_DetailList.length == 1) {
        this.temp_DetailList.splice(index, 1);
        this.addrow();
        return;
      } else {
        this.temp_DetailList.splice(index, 1);
        this.CalculateSum();
      }
    }
  }

  showCostCenterGroupList(i) {
    this.selectedIndex = i;
    this.gridCostCenterGroupListPopupSettings = {
      title: "Cost Centers Group",
      apiEndpoints: `/getCostCenterGroupPagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "ccgid",
          title: "ID",
          hidden: false,
          noSearch: false
        },
        {
          key: "COSTCENTERGROUPNAME",
          title: "Cost Center Group Name",
          hidden: false,
          noSearch: false
        },

      ]
    };
    this.genericGridCostCenterGroupList.show();
  }

  onCostCenterGroupSelect(category) {
    this.BudgetObj.COSTCENTER_CATEGORYID = category.ccgid;
    this.BudgetObj.COSTCENTER_CATEGORYNAME = category.COSTCENTERGROUPNAME;
  }

  // showCostCenterList() {
  //   if (this.userSetting.EnableCompulsoryCostCategory == 1) {
  //     let ccgid = this.BudgetObj.COSTCENTER_CATEGORYID;
  //     this.gridCostCenterListPopupSettings = {
  //       title: "Cost Centers",
  //       apiEndpoints: `/getCostCenterPagedListAccordingToId/${ccgid}`,
  //       defaultFilterIndex: 0,
  //       columns: [
  //         {
  //           key: "COSTCENTERNAME",
  //           title: "Cost Center Name",
  //           hidden: false,
  //           noSearch: false
  //         }
  //       ]
  //     };
  //   }
  //   else {
  //     this.gridCostCenterListPopupSettings = {
  //       title: "Cost Centers",
  //       apiEndpoints: `/getCostCenterPagedList`,
  //       defaultFilterIndex: 0,
  //       columns: [
  //         {
  //           key: "COSTCENTERNAME",
  //           title: "Cost Center Name",
  //           hidden: false,
  //           noSearch: false
  //         }
  //       ]
  //     };
  //   }

  //   this.genericGridCostCenterList.show();

  // }

  // showCostCenterList() {
  //   this.masterService.showCostCenterList().subscribe((res: any) => {
  //     console.log('res', res)
  //     this.costCenterList.push(res.data)
  //     console.log('costCenterList', this.costCenterList)

  //   })

  // }





  onCostCenterSelect(costCenter) {
    console.log('costCenter', costCenter, this.costCenterList)
    this.BudgetObj.CCID = costCenter.target.value;
    this.BudgetObj.COSTCENTER_NAME = costCenter.COSTCENTERNAME;
    
    let _data = this.DetailList.filter(x => x.CCID == costCenter.CCID);
    console.log('_data', _data)
    if (_data && _data.length && _data.length > 0) {
      this.temp_DetailList = [];
      this.temp_DetailList = _data;
      for (var a of _data) {
        let _findIndex = this.DetailList.findIndex(x => x.CCID == costCenter.CCID);
        if (_findIndex >= 0) {
          this.DetailList.splice(_findIndex, 1);
        }
      }
      this.CalculateSum();
    }
  }

  showCostCenterGroupChange(costCentercategory) {
    console.log('costCenter', costCentercategory)
    this.BudgetObj.COSTCENTER_CATEGORYID = costCentercategory.target.value;
    console.log('costCentercategory.ccgid', costCentercategory.target.value)

    if (this.userSetting.EnableCompulsoryCostCategory == 1) {

    this.masterService.sendCostCenterList(costCentercategory.target.value).subscribe((res: any) => {
      console.log('res', res)
      // this.costCenterList.push(res.data)
      this.costCenterList = res.data;
      console.log('costCenterList', this.costCenterList)

    })
  }

  }

  nextrow(index, value) {
    if (value.ACCOUNTGROUP_ID === "" || value.ACCOUNTGROUP_ID === null || value.ACCOUNTGROUP_ID === undefined ||
      value.ACID === "" || value.ACID === null || value.ACID === undefined
    ) {
      this.alertService.info("Please enter all data.");
      return;
    }
    if (value.BUDGET === "" || value.BUDGET === null || value.BUDGET === undefined) {
      this.alertService.info("Budget cannot be null or special characters");
    }
    this.addrow();
  }

  Apply() {
    // if (this.DetailList.length == 0) {
    //   this.alertService.info("Data is not Selected!");
    //   return true;
    // }


    if (this.BudgetObj.SUBDIVIDED_BY == "COSTCENTER") {
      if (!this.BudgetObj.CCID) {
        this.alertService.info("Please enter costcenter.");
        return;
      }
      if (this.BudgetObj.TOTAL_BUDGET <= 0) {
        this.alertService.info("Please enter amount.");
        return;
      }
      console.log("@@this.BudgetObj", this.BudgetObj)
    }
    this.temp_DetailList.forEach(element => {
      let acs1: BudgetData = <BudgetData>{
        COSTCENTER_CATEGORYID: "",
        COSTCENTER_CATEGORYNAME: "",
        CCID: "",
        COSTCENTER_NAME: "",
        ACCOUNTGROUP_ID: "",
        ACCOUNTGROUP_NAME: "",
        ACID: "",
        ACNAME: "",
        BUDGET: 0
      }
      if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "BSINTERVAL") {
        if (this.BudgetObj.BUDGET_INTERVAL == "QUARTERLY") {
          acs1.SHRAWAN_ASHOJ = element.SHRAWAN_ASHOJ,
            acs1.KARTIK_POUSH = element.KARTIK_POUSH,
            acs1.MAGH_CHAITRA = element.MAGH_CHAITRA,
            acs1.BAISAKH_ASAR = element.BAISAKH_ASAR
        } else if (this.BudgetObj.BUDGET_INTERVAL == "MONTHLY") {
          acs1.BAISAKH = element.BAISAKH,
            acs1.JESTHA = element.JESTHA,
            acs1.ASAR = element.ASAR,
            acs1.SHRAWAN = element.SHRAWAN,
            acs1.BHADRA = element.BHADRA,
            acs1.ASHOJ = element.ASHOJ,
            acs1.KARTIK = element.KARTIK,
            acs1.MANGSIR = element.MANGSIR,
            acs1.POUSH = element.POUSH,
            acs1.MAGH = element.MAGH,
            acs1.FALGUN = element.FALGUN,
            acs1.CHAITRA = element.CHAITRA
        }
      } else if (this.BudgetObj.INTERVAL_ON_AD_OR_BS == "ADINTERVAL") {
        if (this.BudgetObj.BUDGET_INTERVAL == "QUARTERLY") {
          acs1.JULY_SEPTEMBER = element.JULY_SEPTEMBER,
            acs1.OCTOBER_DECEMBER = element.OCTOBER_DECEMBER,
            acs1.JANUARY_MARCH = element.JANUARY_MARCH,
            acs1.APRIL_JUNE = element.APRIL_JUNE
        } else if (this.BudgetObj.BUDGET_INTERVAL == "MONTHLY") {
          acs1.JANUARY = element.JANUARY,
            acs1.FEBRUARY = element.FEBRUARY,
            acs1.MARCH = element.MARCH,
            acs1.APRIL = element.APRIL,
            acs1.MAY = element.MAY,
            acs1.JUNE = element.JUNE,
            acs1.JULY = element.JULY,
            acs1.AUGUST = element.AUGUST,
            acs1.SEPTEMBER = element.SEPTEMBER,
            acs1.OCTOBER = element.OCTOBER,
            acs1.NOVEMBER = element.NOVEMBER,
            acs1.DECEMBER = element.DECEMBER
        }
      }
      acs1.COSTCENTER_CATEGORYID = this.BudgetObj.COSTCENTER_CATEGORYID,
        acs1.COSTCENTER_CATEGORYNAME = this.BudgetObj.COSTCENTER_CATEGORYID && this.BudgetObj.COSTCENTER_CATEGORYID != '%' ? this.costCenterCategoryList.filter(x => x.ccgid == this.BudgetObj.COSTCENTER_CATEGORYID)[0].COSTCENTERGROUPNAME : "",
        acs1.CCID = this.BudgetObj.CCID,
        acs1.COSTCENTER_NAME = this.BudgetObj.CCID && this.BudgetObj.CCID != '%' ? this.costCenterList.filter(x => x.CCID == this.BudgetObj.CCID)[0].COSTCENTERNAME : "",
        acs1.ACCOUNTGROUP_ID = element.ACCOUNTGROUP_ID,
        acs1.ACCOUNTGROUP_NAME = element.ACCOUNTGROUP_NAME,
        acs1.ACID = element.ACID,
        acs1.ACNAME = element.ACNAME,
        acs1.BUDGET = element.BUDGET
      if (element.ACCOUNTGROUP_ID && element.ACID && element.BUDGET > 0) {
        this.DetailList.push(acs1);
      }
      console.log("@@DetailList", this.DetailList)

      this.costcenterDetailListTotal=0;

      this.DetailList.forEach(x => {
        this.costcenterDetailListTotal += this._transactionService.nullToZeroConverter(x.BUDGET);
      });

    });
    this.CalculateFinalSum();
    this.BudgetObj.COSTCENTER_CATEGORYID = "";
    this.BudgetObj.COSTCENTER_CATEGORYNAME = "";
    this.BudgetObj.CCID = "";
    this.BudgetObj.COSTCENTER_NAME = "";
    this.BudgetObj.TOTAL_BUDGET = 0;
    this.temp_DetailList.forEach(x => {
      x.SHRAWAN_ASHOJ = 0;
      x.KARTIK_POUSH = 0;
      x.MAGH_CHAITRA = 0;
      x.BAISAKH_ASAR = 0;
      x.JULY_SEPTEMBER = 0;
      x.OCTOBER_DECEMBER = 0;
      x.JANUARY_MARCH = 0;
      x.APRIL_JUNE = 0;
      x.BAISAKH = 0;
      x.JESTHA = 0;
      x.ASAR = 0;
      x.SHRAWAN = 0;
      x.BHADRA = 0;
      x.ASHOJ = 0;
      x.KARTIK = 0;
      x.MANGSIR = 0;
      x.POUSH = 0;
      x.MAGH = 0;
      x.FALGUN = 0;
      x.CHAITRA = 0;
      x.JANUARY = 0;
      x.FEBRUARY = 0;
      x.MARCH = 0;
      x.APRIL = 0;
      x.MAY = 0;
      x.JUNE = 0;
      x.JULY = 0;
      x.AUGUST = 0;
      x.SEPTEMBER = 0;
      x.OCTOBER = 0;
      x.NOVEMBER = 0;
      x.DECEMBER = 0;
      x.BUDGET = 0;
    });
  }
  ChooseBsInterval(event: any) {
    if (this.BudgetObj.MODE == "EDIT") {
      if (confirm("All previous amount data will be reset. Are you sure you want to change interval mode?")) {
        
      }else{
        this.BudgetObj.INTERVAL_ON_AD_OR_BS=this.edit_adbs;
        return;
      }
    }
    if (event.target.value == "BSINTERVAL") {
      this.onChangeYa();
    }

  }
  ChooseAdInterval(event: any) {
    if(this.BudgetObj.MODE=="EDIT"){
      if (confirm("All previous amount data will be reset. Are you sure you want to change interval mode?")) {
        
      }else{
        this.BudgetObj.INTERVAL_ON_AD_OR_BS=this.edit_adbs;
        return;
      }
    }
    if (event.target.value == "ADINTERVAL") {
      this.onChangeYa();
    }
  }


  method() {
    if (this.AccountService.partyList && this.AccountService.partyList.length > 0) {
      let _selecteddata = this.AccountService.partyList.filter(x => x.IS_CHECKED == true);
      if (_selecteddata.length == 0) {
        return;
      }
    } else {
      return;
    }



    let checkedlist = this.AccountService.partyList.filter(x => x.IS_CHECKED);
    let dublicateACID = this.temp_DetailList.find(x => x.ACID == checkedlist[0].ACID);
    if (dublicateACID) {
      let dublicate_acname = dublicateACID.ACNAME;
      alert("Duplicate ledger "+ dublicate_acname + " detected!")
      return;
    }


    this.AccountService.partyList.forEach(x => {
      if (x.IS_CHECKED == true) {
        let data: BudgetData = <BudgetData>{
          ACCOUNTGROUP_ID: "",
          ACCOUNTGROUP_NAME: "",
          ACID: "",
          ACNAME: "",
        }
        data.ACCOUNTGROUP_ID = x.PARENTID;
        data.ACCOUNTGROUP_NAME = x.PARENT_NAME;
        data.ACID = x.ACID;
        data.ACNAME = x.ACNAME;
        if (this.BudgetObj.BUDGET_INTERVAL == "QUARTERLY"||this.BudgetObj.BUDGET_INTERVAL == "MONTHLY") {
          data.BUDGET=0
        }
        this.temp_DetailList.push(data);  
      }
    })
    // let _emptyindex=this.temp_DetailList.findIndex(x=>x.ACID==null && x.ACCOUNTGROUP_ID==null && x.BUDGET==null);
    let _emptyindex = this.temp_DetailList.findIndex(x => x.ACID == null && x.ACCOUNTGROUP_ID == null);
    if (_emptyindex >= 0) {
      this.temp_DetailList.splice(_emptyindex, 1);
    }
  }

  handleChange(event: any) {
    if (event.target.checked == true) {
      this.AccountService.partyList.forEach(x => {
        x.IS_CHECKED = true;
      })
    } else {
      this.AccountService.partyList.forEach(x => {
        x.IS_CHECKED = false;
      })
    }
  }


}



export interface Pobj {
  VCHRNO: string;
  BUDGET_NUMBER: string;
  TRNDATE: Date | string;
  BSDATE: string;
  BUDGET_NAME: string;
  BUDGET_TYPE: string;
  BUDGET_INTERVAL: string;
  INTERVAL_ON_AD_OR_BS: string;
  PREFILL_DATA: string;
  SUBDIVIDED_BY: string;
  FROM_DATE: Date | string;
  FROM_BSDATE: string;
  TO_DATE: Date | string;
  TO_BSDATE: string;
  ACTION: string;
  ACTION_TYPE: string;
  TOTAL_BUDGET: number;
  DIVISION: string;
  PHISCALID: string;
  COMPANYID: string;
  MODE: string;
  BEGINDATE: string;
  ENDDATE: string;
  CURRENT_YEAR: string;
  NEXT_YEAR: string;
  COSTCENTER_CATEGORYID: string;
  COSTCENTER_CATEGORYNAME: string;
  CCID: string;
  COSTCENTER_NAME: string;
  CREATED_BY: Date | string;
  CREATED_ON: string;
  BudgetDataList: BudgetData[];
}
export interface BudgetData {
  VCHRNO: string;
  COSTCENTER_CATEGORYID: string;
  COSTCENTER_CATEGORYNAME: string;
  CCID: string;
  COSTCENTER_NAME: string;

  ACCOUNTGROUP_ID: string;
  ACCOUNTGROUP_NAME: string;
  ACID: string;
  ACNAME: string;
  BUDGET: number;
  FROMDATE_AD: Date | string;
  FROMDATE_BS: string;
  TODATE_AD: Date | string;
  TODATE_BS: string;
  QUARTER_TYPE: number;
  QUARTER_NAME: string;
  MONTH_NAME: string;

  SHRAWAN_ASHOJ: number;
  KARTIK_POUSH: number;
  MAGH_CHAITRA: number;
  BAISAKH_ASAR: number;

  JULY_SEPTEMBER: number;
  OCTOBER_DECEMBER: number;
  JANUARY_MARCH: number;
  APRIL_JUNE: number;

  BAISAKH: number;
  JESTHA: number;
  ASAR: number;
  SHRAWAN: number;
  BHADRA: number;
  ASHOJ: number;
  KARTIK: number;
  MANGSIR: number;
  POUSH: number;
  MAGH: number;
  FALGUN: number;
  CHAITRA: number;

  JANUARY: number;
  FEBRUARY: number;
  MARCH: number;
  APRIL: number;
  MAY: number;
  JUNE: number;
  JULY: number;
  AUGUST: number;
  SEPTEMBER: number;
  OCTOBER: number;
  NOVEMBER: number;
  DECEMBER: number;

  DIVISION: string;
  PHISCALID: string;
  COMPANYID: string;
}

