import { Component, Inject, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import { TREE_ACTIONS, KEYS, IActionMapping, TreeNode, TreeComponent } from 'angular-tree-component';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthService } from '../../../common/services/permission/authService.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { PLedgerComponent } from '../../masters/components/PLedger/PLedger.component';
import { TreeViewAcService } from '../../masters/components/account-ledger/accountLedger.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ReportMainService, reportWiseParamandData } from '../../Reports/components/ReportMain/ReportMain.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { Division } from '../../../common/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';

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
    selector: 'summary-ledger-report',
    templateUrl: './summaryledgerreport.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']
    providers: [TreeViewAcService]


})
export class SummaryLedgerReport implements OnInit {
    showTree: boolean;
    showCCtable: boolean;
    PARENTacid: any;

    @ViewChild("PLedgerChild") PLedgerChild: PLedgerComponent;
    @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;


    source: LocalDataSource = new LocalDataSource();
    busy: Subscription;
    loadListSubject: Subject<any> = new Subject<any>();
    loadList$: Observable<any> = this.loadListSubject.asObservable();
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
    public nodes: any[] = [];
    reportnameFormatWise: string;

    public mode: string;
    public tree: TreeComponent;
    public selectedNode: any;
    selectedNodeEdit: number = 0;
    modeTitle: string;
    root: string;
    addMode: boolean = false;
    fromTreeTag: number;
    userProfile: any;
    division: any[] = [];
    CostcenterList: any[] = [];
    showMultipleCC: boolean;
    @Output() reportdataEmit = new EventEmitter();

    instanceWiseRepName:string='Summary Ledger Report';

    constructor(public masterService: MasterRepo, private _authService: AuthService,
        private loadingService: SpinnerService, private _reportFilterService: ReportMainService,
        private alertService: AlertService, private arouter: Router,public _ActivatedRoute: ActivatedRoute, public reportService: ReportFilterService,
    ) {
        // this._reportFilterService.showAllcontactsInCC = false;

        this.reportnameFormatWise = 'Summary Ledger Report';
        this.mode = "add";
        this.masterService.PType = '';

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

        this.userProfile = this._authService.getUserProfile();

        this.division=[];
        //let data: Array<IDivision> = [];
        if(this.masterService.userSetting.userwisedivision == 1){
          this.masterService.getDivisionFromRightPrivelege().subscribe(res=>{
              if(res.status == 'ok'){
                  this.division = res.result;
              }
          })
        }
        else{
         this.masterService.getAllDivisions()
         .subscribe(res => {
           //////console.log("div" + JSON.stringify(res));
           this.division.push(<Division>res);
         }, error => {
           this.masterService.resolveError(error, "divisions - getDivisions");
         });
        }
        // this.masterService.getAccDivList();
        this.masterService.getCostcenter().subscribe(res => {
            this.CostcenterList = res;
        })
    }

    ngOnInit() {
        this._ActivatedRoute.queryParams.subscribe(params => {
            const mode = params.mode;
            // ////console.log("@@drillParam",this.reportService.drillParam)
            if (mode == "DRILL" && this.reportService.drillParam.returnUrl && this.reportService.drillParam.reportname=='Summary Ledger Report' && this._reportFilterService.SummaryLedgerObj.assignPrevioiusDate != true) {
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE1=this.reportService.drillParam.reportparam.DATE1;
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE2=this.reportService.drillParam.reportparam.DATE2;
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV=this.reportService.drillParam.reportparam.DIV;
            this._reportFilterService.SummaryLedgerObj.CCENTER=this.reportService.drillParam.reportparam.COSTCENTER;
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType = 0;
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_selectedNode=this.reportService.drillParam.reportparam.PARENT;

            this.changeEntryDate(this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE1, "AD");
            this.changeEndDate(this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE2, "AD");
            this.checkValue();

            }else{
                if (this._reportFilterService.SummaryLedgerObj.assignPrevioiusDate != true) {
                    this.masterService.getAccDivList();
                    this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE1 = this.masterService.PhiscalObj.BeginDate.split('T')[0];
                    if (this.userProfile.CompanyInfo.ActualFY == this.masterService.PhiscalObj.PhiscalID) {
                        this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE2 = new Date().toJSON().split('T')[0];
                    }
                    else {
                        var x = this.masterService.PhiscalObj.EndDate
                        x = x.substring(0, 10);
                        this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE2 = x
                    }

                    // this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV = this.masterService.userProfile.CompanyInfo.INITIAL;
                    this.masterService.viewDivision.subscribe(() => {
                        if(this.masterService.userSetting.userwisedivision==0 ||  this.masterService.showAll == true){ //ALL OPTION SELECTION IN DIVISION IN REPORT DIALOG BOX
                          this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV='%';
                      }else{
                        if(this.masterService.userSetting.userwisedivision==1 && this.division.length ==1){
                            this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV=this.division[0].INITIAL;
                          }else{
                            this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV=this.masterService.userProfile.CompanyInfo.INITIAL;
                        }
                      }
                      })
                    this._reportFilterService.SummaryLedgerObj.SummaryLedger_CostCenter = '%'
                    this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType = 0;
                    ////console.log("@@selecctednde", this._reportFilterService.SummaryLedgerObj.SummaryLedger_selectedNode)
                    this.changeEntryDate(this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE1, "AD");
                    this.changeEndDate(this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE2, "AD");
                    // this.checkValue();
                }

                if(params.instancename){
                    // ////console.log("@@[Summary Ledger Report0]",params.instancename,this._reportFilterService.reportDataStore[params.instancename].param.reportparam)
                    this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE1=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DATE1;
                    this.changeEntryDate(this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE1, "AD");
                    this.changeEndDate(this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE2, "AD");
                    this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.DIV;
                    this._reportFilterService.SummaryLedgerObj.CCENTER=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.COSTCENTER;
                    this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType =this._reportFilterService.reportDataStore[params.instancename].param.reportparam.REPORTTYPE;
                    this._reportFilterService.SummaryLedgerObj.SummaryLedger_selectedNode=this._reportFilterService.reportDataStore[params.instancename].param.reportparam.PARENT;
                }
                this.checkValue();
            }
        });


    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_BSDATE1 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
                const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
                if(Validatedata == true){
                  const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
                  var adDate1 = adbs.bs2ad(bsDate1);
                  this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE1= (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
                }else{
                    this.alertService.error("Cannot Change the date");
                  return;
                }
            // this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_BSDATE2 = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/'+ bsDate.en.month + '/' + bsDate.en.year;
        }
        else if (format == "BS") {
          var datearr = value.split('/');
          const bsDate = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
            // var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            var Engdate = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            const Validatedata = this.masterService.ValidateNepaliDate(Engdate)
            if(Validatedata == true){
              const bsDate1 = datearr[2]+"/"+datearr[1]+"/"+datearr[0];
              var adDate1 = adbs.bs2ad(bsDate1);
              this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE2 = (adDate1.year + '-' + ((adDate1.month).toString().length == 1 ? '0' + adDate1.month : adDate1.month) + '-' + ((adDate1.day).toString().length == 1 ? '0' + adDate1.day : adDate1.day));
            }else{
                this.alertService.error("Cannot Change the date");
              return;
            }
            // this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
    }

    onload() {
        if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType == 0 && (this._reportFilterService.SummaryLedgerObj.SummaryLedger_selectedNode === undefined || this._reportFilterService.SummaryLedgerObj.SummaryLedger_selectedNode == '')) {
            this.alertService.info("Please Select a Account Group");
            return;
        } else if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType == 2 && 
            ((this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter === undefined || this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter.length == 0) &&
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_showAllContacts!=true)) {
            this.alertService.info("Please Select Costcenter");
            return;
        } else {
            this.DialogClosedResult("ok");
        }
    }

    public DialogClosedResult(res) {

        let multipleSelectedCC = [];
        let SelectedCC = '';
        if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter === undefined) {
                SelectedCC = this._reportFilterService.SummaryLedgerObj.CCENTER;
        } else {
            if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter.length != 0) {
                this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter.forEach(COSTCENTER => {
                    multipleSelectedCC.push(COSTCENTER.CCID)
                    SelectedCC += `${multipleSelectedCC},`
                });
            } else {
                SelectedCC = this._reportFilterService.SummaryLedgerObj.CCENTER
            }
        }

        if(this._reportFilterService.SummaryLedgerObj.SummaryLedger_showAllContacts==true){
            SelectedCC='%';
        }
        
        if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType == 0) {
            this.PARENTacid = this._reportFilterService.SummaryLedgerObj.SummaryLedger_selectedNode ? this._reportFilterService.SummaryLedgerObj.SummaryLedger_selectedNode : '%';
        } else {
            this.PARENTacid = '%';
        }

        if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType != 2) {
            SelectedCC = this._reportFilterService.SummaryLedgerObj.SummaryLedger_CostCenter
        }

        if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV && this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV == '%') {
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIVISIONNAME = 'All';
          }else if( this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV && this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV!= '%'){
            let abc = this.division.filter(x=>x.INITIAL == this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV);
              if(abc && abc.length>0 && abc[0]){
                this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIVISIONNAME = abc[0].NAME;
              }else{
                this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIVISIONNAME = '';
              }
          }else{
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIVISIONNAME = '';
          }

          if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_CostCenter && this._reportFilterService.SummaryLedgerObj.SummaryLedger_CostCenter == '%') {
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_COSTCENTERDISPLAYNAME = 'All';
          }else if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_CostCenter != '%') {
            let abc = this.CostcenterList.filter(x=>x.CCID == this._reportFilterService.SummaryLedgerObj.SummaryLedger_CostCenter);
            if(abc && abc.length>0 && abc[0]){
              this._reportFilterService.SummaryLedgerObj.SummaryLedger_COSTCENTERDISPLAYNAME = abc[0].COSTCENTERNAME;
            }else{
              this._reportFilterService.SummaryLedgerObj.SummaryLedger_COSTCENTERDISPLAYNAME = '';
            }
          } else {
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_COSTCENTERDISPLAYNAME = '';
          }

        if (res == "ok") {
            this._reportFilterService.SummaryLedgerObj.assignPrevioiusDate = true;
            let routepaths = this.arouter.url.split('/');
            let activeurlpath2;
            if (routepaths && routepaths.length) {
                activeurlpath2 = routepaths[routepaths.length - 1]
            }
            if(this._reportFilterService.loadedTimes == 0){
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Account Group Ledger Report',
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName+this._reportFilterService.loadedTimes
                    });
            }else{
                this._reportFilterService.previouslyLoadedReportList.push(
                    {
                        reportname: 'Account Group Ledger Report' +'_'+this._reportFilterService.loadedTimes,
                        activeurlpath: this.arouter.url,
                        activerurlpath2: activeurlpath2,
                        instanceWiseRepName: this.instanceWiseRepName+this._reportFilterService.loadedTimes
                    });
            }


        }

        this.reportdataEmit.emit({
            status: res, data: {
                REPORTDISPLAYNAME : 'Account Group Ledger',
                reportname: this.reportnameFormatWise,instanceWiseRepName:this.instanceWiseRepName+this._reportFilterService.loadedTimes, reportparam: {
                    ACCOUNTGROUPDISPLAYNAME : this._reportFilterService.SummaryLedgerObj.SummaryLedger_GROUPDISPLAYNAME?this._reportFilterService.SummaryLedgerObj.SummaryLedger_GROUPDISPLAYNAME:'',
                    REPORTOPTIONDISPLAYNAME: this._reportFilterService.SummaryLedgerObj.SummaryLedger_REPORTOPTIONDISPLAYNAME?this._reportFilterService.SummaryLedgerObj.SummaryLedger_REPORTOPTIONDISPLAYNAME:'',
                    DATE1: this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE1,
                    DATE2: this._reportFilterService.SummaryLedgerObj.SummaryLedger_DATE2,
                    BSDATE1: this._reportFilterService.SummaryLedgerObj.SummaryLedger_BSDATE1,
                    BSDATE2: this._reportFilterService.SummaryLedgerObj.SummaryLedger_BSDATE2,
                    DIV: this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV ? this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIV : '%',
                    PARENT: this.PARENTacid,
                    CCENTER: SelectedCC ? SelectedCC : '%',
                    AREA: '%',
                    COMID: this.masterService.userProfile.CompanyInfo.COMPANYID,
                    ISPARTYGROUPLEDGER: '0',
                    REPORTTYPE: this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType,
                    PHISCALID: this.masterService.PhiscalObj.PhiscalID,
                    DIVISIONNAME : this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIVISIONNAME ? this._reportFilterService.SummaryLedgerObj.SummaryLedger_DIVISIONNAME : '',
                    COSTCENTERDISPLAYNAME: this._reportFilterService.SummaryLedgerObj.SummaryLedger_COSTCENTERDISPLAYNAME?this._reportFilterService.SummaryLedgerObj.SummaryLedger_COSTCENTERDISPLAYNAME:'',


                }
            }
        });
        if(res == "ok"){
            this._reportFilterService.loadedTimes = this._reportFilterService.loadedTimes+1;
        }

    }

    // Close Method
    closeReportBox() {
        this.DialogClosedResult("cancel");
    }

    checkValue() {
        if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType == 0) {
            this.showTree = true;
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter = [];
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter = [];
            this.reportnameFormatWise = 'Summary Ledger Report';
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_REPORTOPTIONDISPLAYNAME = '';
        } else {
            this.showTree = false;
        }
        if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_ReportType == 2) {
            this.showCCtable = true;
            this.showMultipleCC=true;
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_selectedNode = '';
            this.reportnameFormatWise = 'Summary Ledger Report_1';
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_REPORTOPTIONDISPLAYNAME = 'Cost Center Wise Report';
            this._reportFilterService.showAllcontactsInCC=true;
        } else {
            this.showCCtable = false;
        }
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
        this._reportFilterService.SummaryLedgerObj.SummaryLedger_selectedNode = this.selectedNode.ACID;
        this._reportFilterService.SummaryLedgerObj.SummaryLedger_GROUPDISPLAYNAME = this.selectedNode.ACNAME?this.selectedNode.ACNAME:'';

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
        }
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
    }

    NewItem() {
        //console.log(this.nodeObj)
        //console.log(this.formObj.MAPID)
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

    checkCostCnterValue() {
        if (this._reportFilterService.SummaryLedgerObj.SummaryLedger_showAllContacts == true) {
            this.showMultipleCC = false;
        } else {
            this.showMultipleCC = true;
        }
    }

    addCostcenterToList() {
        const ccData = this._reportFilterService.SummaryLedgerObj.CCENTER;
        this._reportFilterService.SummaryLedgerObj.CCENTER = ccData && ccData.CCID ? ccData.CCID : '';
        let selectCCenterList = this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter.filter(centerList => centerList.COSTCENTERNAME == ccData.COSTCENTERNAME)
        if (
            ccData.COSTCENTERNAME === "" ||
            ccData.COSTCENTERNAME === null ||
            ccData.COSTCENTERNAME === undefined
        ) {
            return;
        }

        if (selectCCenterList.length === 0) {
            this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter.push({ CCID: ccData.CCID, COSTCENTERNAME: ccData.COSTCENTERNAME })
        }

    }

    deleteCostcenter(index) {
        this._reportFilterService.SummaryLedgerObj.SummaryLedger_multipleCostcenter.splice(index, 1)
    }

}
