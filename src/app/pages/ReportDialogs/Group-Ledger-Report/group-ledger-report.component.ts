import { Component, Output, EventEmitter, ViewChild, Input, ElementRef } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, TreeComponent } from 'angular-tree-component';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription, Subject, Observable } from 'rxjs';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { PLedgerComponent } from '../../masters/components/PLedger/PLedger.component';
import { ContextMenuComponent } from 'ngx-contextmenu';


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
    selector: 'group-ledger-report',
    templateUrl: './group-ledger-report.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class GroupLedgerReportComponent {
    GroupLedgerReport: any = <any>{};

    @ViewChild('division') division: ElementRef
    @ViewChild(TreeComponent)
    @ViewChild("PLedgerChild") PLedgerChild: PLedgerComponent;
    @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;



    private divisionList = []
    showopeningBl: string
    @Output() reportdataEmit = new EventEmitter();
    @Input() reportType: string;
    // private _treeEnable: Boolean = true;
    public nodes: any[] = [];
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
    selectedNodeEdit: number = 0;
    public mode: string;
    root: string;
    modeTitle: string;
    addMode: boolean = false;
    fromTreeTag: number;


    constructor(public masterService: MasterRepo, private loadingService: SpinnerService) {
        this.GroupLedgerReport.DATE1 = new Date().toJSON().split('T')[0];
        this.changeEntryDate(this.GroupLedgerReport.DATE1, "AD");
        this.GroupLedgerReport.DATE = new Date().toJSON().split('T')[0];
        this.changeEndDate(this.GroupLedgerReport.DATE, "AD");

        this.masterService.getAllDivisions().subscribe((res) => {
            this.divisionList.push(res)
        })

        this.busy = this.masterService.getGroupLedgerTree().map(x => { return x })
      .subscribe(res => {
        // ////console.log("cjeck account tree");
        // //console.log(res);
        this.nodes = res;
        if (this.tree != null) {
          this.tree.treeModel.update();
        }
        // //console.log(this.tree);
      }, error => {
        var err = this.masterService.resolveError(error, "groupLedger - groupLedger");
        if (err) { alert(err.json()); }
      }
      );
    }

    onload() {
        this.DialogClosedResult("ok");

    }

    public DialogClosedResult(res) {
        this.reportdataEmit.emit({
            status: res, data: {
                reportname: 'Group Ledger Report', reportparam: {
                    DATE1: this.GroupLedgerReport.DATE1,
                    DATE2: this.GroupLedgerReport.DATE,
                    DIV: this.GroupLedgerReport.DIV,
                    COMPANYID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                }
            }
        });
    }

    divisionChanged() {
        this.GroupLedgerReport.DIV = this.division.nativeElement.value
    }

    hide() {
        this.DialogClosedResult("Error");
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.GroupLedgerReport.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this.GroupLedgerReport.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.GroupLedgerReport.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this.GroupLedgerReport.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    cancel() {
        this.DialogClosedResult("cancel");
    }

    preventInput($event) {
        $event.preventDefault();
        return false;
    }
    //Tree Part

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
        this.source = new LocalDataSource();
        this.AdditionalInfo = 0;
        this.showBank = 0;
        this.showPLedgerInfo = 0
        this.selectedNode = tree.treeModel.getFocusedNode().data;
        this.selectedNodeEdit = this.selectedNode.ACID;

        this.getRootParent(this.selectedNode, this.nodes);
        this.loadListSubject.next(this.selectedNode);
        this.formObj.ACNAME = this.selectedNode.ACNAME;

        if (this.selectedNode.PARENT !== null && this.selectedNode !== null) {
            if (this.selectedNode.ACNAME == 'BANK' || this.selectedNode.PARENT.MAPID == 'B' || this.selectedNode.MAPID == 'B') {
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
        var childAccountList = this.masterService.PartialAccountList.filter(a => a.PARENT == this.selectedNode.id);
        this.mode = "select";
        ////console.log("this.selectedNode",this.selectedNode)
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
                    ////console.log("selectedData", customerData);
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
        else {
            this.masterService.getAllAccount(this.selectedNode.ACID).subscribe(
                data => {
                    this.NewItem()
                    this.modeTitle = 'View And Edit'



                    this.PTypeForParty = this.selectedNode.PType
                    this.formObj.ACNAME = this.selectedNode.ACNAME;
                    this.formObj.mode = "edit"
                    this.mode = "view"
                    this.loadingService.hide();
                    customerData = data.result;
                    this.formObj.isAutoGSTApplicable = customerData.isAutoGSTApplicable;
                    this.formObj.isRCMApplicable = customerData.isRCMApplicable;
                    this.formObj.isReverseChargeApplicable = customerData.isReverseChargeApplicable;

                },
                error => {
                    this.loadingService.hide();
                }
            );
        }
    }


    getRootParent(node, list) {
        this.nodeObj = node;
        this.UnderObj = node.PARENT;
        if (node.PARENTID == 'BS' || node.PARENTID == 'PL' || node.PARENTID == 'TD') {
            this.PrimaryGrpObj = node; this.Parent.Primary = node.ACNAME;
            this.isOnlyMainParent = 1; this.UnderObj = node; return;

        }
        for (let t of list) {
            if (node.PARENTID != t.ACID) { this.loopingChild(node, t.children, t); }
            else { this.root = node.PARENTID; this.PrimaryGrpObj = node }
        }
        this.Parent.Under = this.UnderObj.ACNAME;
        if (node.TYPE == 'G') {
            this.UnderObj = node;
            this.isGroup == 1
            this.modeTitle = 'View Group'
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
        // this.Parent.Primary=this.PrimaryGrpObj.ACNAME;
        if (this.root == 'LB') {
            this.Parent.Primary = 'LIABILITES'
        }
        else if (this.root == 'AT') {
            this.Parent.Primary = 'ASSETS'
        }
        else if (this.root == 'DI') {
            this.Parent.Primary = 'DIRECT INCOME'
        }
        else if (this.root == 'DE') {
            this.Parent.Primary = 'DIRECT EXPENSES'
        }
        else if (this.root == 'IE') {
            this.Parent.Primary = 'INDIRECT EXPENSES'
        }
        else if (this.root == 'II') {
            this.Parent.Primary = 'INDIRECT INCOME'
        }
        else if (this.root == 'CA') {
            this.Parent.Primary = 'Capital'
        }

        this.isOnlyMainParent = 0;
        // ////console.log("RootCheck", this.root, this.PrimaryGrpObj, this.UnderObj)

    }

    NewItem() {
        //console.log(this.nodeObj)
        //console.log(this.formObj.MAPID)
        // this._BE.nativeElement.focus();
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

    }

    loopingChild(node, cList, root) {
        for (let c of cList) {
            if (c != node) { this.loopingChild(node, c.children, root); }
            else { this.root = root.ACID; this.PrimaryGrpObj = root }
        }
    }

    childrenCount(node: TreeNode): string {
        return node && node.children ? `(${node.children.length})` : '';
      }

    filterNodes(text, tree) {
        try {
            tree.treeModel.filterNodes(text, true);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
}