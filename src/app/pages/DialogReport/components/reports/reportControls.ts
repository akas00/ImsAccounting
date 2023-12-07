import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TAcList, CostCenter } from "../../../../common/interfaces";
import { ReportService } from "./report.service";
import { Observable } from "rxjs/Observable";
import { Subscriber } from 'rxjs/Subscriber';
import { IActionMapping } from "angular-tree-component/dist/models/tree-options.model";
import { TREE_ACTIONS, KEYS } from "angular-tree-component/dist/angular-tree-component";
import { TreeComponent } from "angular-tree-component/dist/components/tree.component";
import { Subscription } from "rxjs/Subscription";
import { TreeNode } from "angular-tree-component/dist/models/tree-node.model";
@Component({
    selector: 'reportcontrols',
    templateUrl: './reportControls.html',
    providers: [],
    styleUrls: ['./reportdialog.css']
})
export class ReportControls {
    @Input() control: any = <any>{};
    ledgerdialog: any = <any>{};
    @Input() form: FormGroup;

    selectedAccount: TAcList;

    multiSelectList: any[] = [];
    multiSelectCostCenterList: any[] = [];
    accountList: TAcList[] = [];
    costcenterList: CostCenter[] = [];
    selectList: any[] = [];
    multiNameList: string[] = [];
    multiIdList: string[] = [];
    selectedObj: any;
    selectedName: any;
    selectedCode: any;
    masterListHolder: any[] = [];
    listFilterHolder: any[] = [];

   busy:Subscription;
    constructor(private reportService: ReportService, private masterService: MasterRepo) { 
       
    }
    listChooser(listName, keyword = "") {
        return new Observable((observer: Subscriber<Array<any>>) => {
            switch (listName.toUpperCase()) {
                case 'LEDGERACCOUNTLIST':
                    this.reportService.getAcList().map(fdata=>{return fdata.filter(x=>x.ACID.substring(0,2).toUpperCase()!='PA')}).map(data => {
                        this.listFilterHolder = data.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                        return data;
                    }).subscribe(res => { observer.next(res); })
                    break;
                case 'PARTYLIST':
                    this.reportService.getAcList().map(fdata=>{return fdata.filter(x=>x.ACID.substring(0,2).toUpperCase()=='PA')}).map(data => {
                        this.listFilterHolder = data.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                        return data;
                    }).subscribe(res => { observer.next(res); })
                    break;
                case 'COSTCENTERLIST':
                    this.reportService.getCostCenterList().map(data => {
                        this.listFilterHolder = data.filter(ac => ac.CostCenterName.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                        return data;
                    }).subscribe(res => { observer.next(res); })
                    break;
                case 'DIVISIONLIST':
                    this.reportService.getDivisionList().map(data => {
                        this.listFilterHolder = data.filter(ac => ac.NAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                        return data;
                    }).subscribe(res => { observer.next(res); })
                    break;
                     case 'WAREHOUSELIST':
                    this.reportService.getWarehouseList().map(data => {
                        this.listFilterHolder = data.filter(ac => ac.NAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                        return data;
                    }).subscribe(res => { observer.next(res); })
                    break;
                     case 'USERLIST':
                    this.reportService.getUserList().map(data => {
                        this.listFilterHolder = data.filter(ac => ac.username.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                        return data;
                       
                    }).subscribe(res => { observer.next(res); })
                    break;
                      case 'ACTIONLIST':
                    this.reportService.getActionList().map(data => {
                        this.listFilterHolder = data.filter(ac => ac.action.toUpperCase().indexOf(keyword.toUpperCase()) > -1);            
                        return data;
                       
                    }).subscribe(res => { observer.next(res); })
                    break;
                    //  case 'productList':
                    // this.reportService.getProductListList().map(data => {
                    //     this.listFilterHolder = data.filter(ac => ac.DESCA.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                    //     return data;
                    // }).subscribe(res => { observer.next(res); })
                    // break;
                default:
                    ////console.log("list not found",listName);
                    break;
            }
        });
    }
    dropListItemForCode = (keyword: any): Observable<Array<any>> => {
        return new Observable((observer: Subscriber<Array<any>>) => {
            if (keyword) {
                this.listChooser(this.control.listName, keyword).map(data => {
                    var lst = data.filter(ac => ac.ACCODE.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                    return lst;
                }).subscribe(res => { observer.next(res); })
            }
            // else {
            //     this.listChooser(this.control.listName, keyword)
            //         .map(fList => fList.filter((data) => data.ACCODE.toUpperCase().indexOf(keyword.toUpperCase()) > -1))
            //         .subscribe(data => {
            //             observer.next(data);
            //         }, Error => {
                        this.masterService.resolveError(Error, "reprotControls - DropListItemForCode");
            //         },
            //         () => { observer.complete(); })
            // }
        }).share();
    }

    dropListItem = (keyword: any): Observable<Array<any>> => {
        return new Observable((observer: Subscriber<Array<any>>) => {
            if (keyword) {

                this.listChooser(this.control.listName, keyword).map(data => {
                    return this.listFilterHolder;
                }).subscribe(res => { observer.next(res); })
            }

            else {
                this.listChooser(this.control.listName, keyword)
                    .map(fList => { return this.listFilterHolder; })
                    .subscribe(data => {
                        observer.next(data);
                    }, Error => {
                        this.masterService.resolveError(Error, "reprotControls - DropListItem");
                        //console.log({ droplist: Error }); observer.complete();
                    },
                    () => { observer.complete(); })
            }
        }).share();
    }
    // filterIt(arr, searchKey) {
    //     return arr.filter(obj => Object.keys(obj).some(key => obj[key].includes(searchKey)));
    // }
    ngAfterViewInit() {


    }
    ngOnInit() {

        if (this.control.type == "date") {
            this.ledgerdialog.DATE1 =  ((this.form.value[this.control.name] == null) ? "" : this.form.value[this.control.name].substring(0, 10));

            if (this.ledgerdialog.DATE1 != null && this.ledgerdialog.DATE1!="") {
               
                ////console.log("date check"+this.ledgerdialog.DATE1);
                this.changeAccountReportDate(this.ledgerdialog.DATE1, "AD");
            }
        }
        if (this.control.listName != null && this.form.value[this.control.name] != null && this.form.value[this.control.name] != "") {
            this.switchCaseFordropdownvalue();
        }
        //  if(this.control.type=='tree'){
        //     if(this.control.listName=="LedgerGroupList"){
        //     this.loadledgerGroupTree();
        // }
        // else if(this.control.listName=="PartyGroupList"){
        //     this.loadPartyGroupTree();
        // }
        // }

    }
    switchCaseFordropdownvalue() {
        switch (this.control.listName.toUpperCase()) {
            case 'LEDGERACCOUNTLIST':
                this.reportService.getAcList().subscribe(data => {

                    this.selectedObj = data.filter(x => x.ACID == this.form.value[this.control.name])[0];
                    if (this.selectedObj != null) {
                        this.selectedName = this.selectedObj.ACNAME;
                        this.selectedCode = this.selectedObj.ACCODE;
                    }
                });
                break;
            case 'PARTYLIST':
                this.reportService.getAcList().subscribe(data => {

                    this.selectedObj = data.filter(x => x.ACID == this.form.value[this.control.name])[0];
                    if (this.selectedObj != null) {
                        this.selectedName = this.selectedObj.ACNAME;
                        this.selectedCode = this.selectedObj.ACCODE;
                    }

                });
                break;
            case 'COSTCENTERLIST':
                this.reportService.getCostCenterList().subscribe(data => {

                    this.selectedObj = data.filter(x => x.CostCenterName == this.form.value[this.control.name])[0];
                    if (this.selectedObj != null) {
                        this.selectedName = this.selectedObj.CostCenterName;
                    }
                });
                break;
            case 'DIVISIONLIST':
                this.reportService.getDivisionList().subscribe(data => {
                    this.selectedObj = data.filter(x => x.INITIAL == this.form.value[this.control.name])[0];
                   ////console.log("check div",this.selectedObj);
                    if (this.selectedObj != null) {
                        this.selectedName = this.selectedObj.NAME;
                        ////console.log("div name",this.selectedName);
                    }
                });
                break;
        }
    }

    changeAccountReportDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.ledgerdialog.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this.ledgerdialog.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
        }
        if (this.control.name == "DATE1") {
            this.form.controls['DATE1'].setValue(this.ledgerdialog.DATE1);
        }
        else if (this.control.name == "DATE2") {
            this.form.controls['DATE2'].setValue(this.ledgerdialog.DATE1);

        }
    }
    clickDate(value) {
        if (value != null && value != 0) {
            var adbs = require("ad-bs-converter");
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this.ledgerdialog.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            this.form.controls['DATE1'].setValue(this.ledgerdialog.DATE1);
        }
    }
    // onAddAccount(value: TAcList) {
    //     this.multiSelectList.push(<TAcList>value);
    //     this.form.controls['ACID'].setValue(this.acListChanges());
    //     this.selectedAccount = null;
    // }
    // onAddCostCenter(value) { this.multiSelectCostCenterList.push(<CostCenter>value); }
    onAddSelectedObj() {
        if (this.selectedObj == null) return;
        //multiNameList For viewer visual
        let rName: any = "";
        Object.keys(this.selectedObj).forEach((key: any) => { if (key == this.control.options.displayname) { rName = this.selectedObj[key] } });
        this.multiNameList.push(<string>rName);
        //multiIdList For report Load value
        let rValue: any = "";
        Object.keys(this.selectedObj).forEach((key: any) => { if (key == this.control.options.value) { rValue = this.selectedObj[key] } });
        this.multiIdList.push(<string>rValue);
        this.form.controls[this.control.name].setValue(this.multiListSeperateByComma());
        this.selectedObj = null;
        this.selectedName = null;
        this.selectedCode = null;
    }
    onRemoveMultiObj(index) {
        this.multiNameList.splice(index, 1);
        this.multiIdList.splice(index, 1);
    }

    // onRemoveAccount(index) {
    //     this.multiSelectList.splice(index, 1);
    //     this.form.controls['ACID'].setValue(this.acListChanges());
    // }
    // onRemoveCostCenter(index) { this.multiSelectCostCenterList.splice(index, 1); }

    // acChange(value) { if (this.multiSelectList.length == 0) { this.form.controls['ACID'].setValue(value.ACID); } }

    // acListChanges() {
    //     let result = "";
    //     if (this.multiSelectList.length > 0) {
    //         for (let a of this.multiSelectList) {
    //             result += a.ACID + ",";
    //         }
    //     }
    //     result = result.slice(0, -1);
    //     //console.log(result);
    //     return result;

    // }
    multiListSeperateByComma() {
        let result = "";
        for (let a of this.multiIdList) {
            result += a + ",";
        }
        return result.slice(0, -1);

    }
    //     multiselectChangeEvent(selectedObj){
    //         if (this.multiObjList.length == 0) {
    //      if (typeof (selectedObj) === 'object') {
    //     let rvalue:any="";
    //     Object.keys(selectedObj).forEach((key:any)=>{if(key==this.control.options.value){rvalue= selectedObj[key]}});
    //          //console.log(rvalue);
    // this.form.controls[this.control.name].setValue(rvalue);
    //      }
    // }}
    selectChangeEvent(selectedObj) {
        if (typeof (selectedObj) === 'object') {
            this.selectedObj = selectedObj;
            let rvalue: any = "";
            Object.keys(selectedObj).forEach((key: any) => { if (key == this.control.options.value) { rvalue = selectedObj[key] } });
            //console.log(rvalue);
            if (this.multiIdList.length == 0) {
                this.form.controls[this.control.name].setValue(rvalue);
            }
            Object.keys(selectedObj).forEach((key: any) => { if (key == this.control.options.displayname) { this.selectedName = selectedObj[key] } });
            Object.keys(selectedObj).forEach((key: any) => { if (key == this.control.options.displayCode) { this.selectedCode = selectedObj[key] } });


        }
        else{
             this.form.controls[this.control.name].setValue(this.control.defaultValue);
        }
    }
    radiochangeEvent(value, name, des,mappingname) {
        if (value == true) {
            this.control.reportOptions.filter(x => x.description == des)[0].value = { name: name, value: 1 };
        }
    }
    checkboxchangeEvent(value, name, des) {
        if (value == true) { this.control.reportOptions.filter(x => x.description == des)[0].value = { name: name, value: 1 }; }
        else { this.control.reportOptions.filter(x => x.description == des)[0].value = { name: name, value: 0 }; }
    }
    IndividualcheckboxChangeEvent(ischecked){
        ischecked?(this.form.controls[this.control.name].setValue(1)):(this.form.controls[this.control.name].setValue(0));
        
    }
     IndividualrcheckboxChangeEvent(ischecked){
        ischecked?(this.form.controls[this.control.name].setValue(0)):(this.form.controls[this.control.name].setValue(1));
        
    }
}