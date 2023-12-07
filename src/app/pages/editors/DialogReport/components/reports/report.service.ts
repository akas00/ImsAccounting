
import {CostCenter,TAcList} from '../../../../../common/interfaces';
import {MasterRepo} from '../../../../../common/repositories/masterRepo.service';
import {GlobalState} from '../../../../../global.state';
import {AuthService} from '../../../../../common/services/permission/authService.service';
import { Injectable, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Subject } from 'rxjs/subject';
import { Observable } from "rxjs/Observable";

export interface IReport {
    name: string;
    title: string;
    reportDialog: IreportDialog;
    reportQuery: Array<IReportParam>;
    reportOptions: Array<IreportOption>;
    reportGrid: any;
    reportDrill: Array<IReportDrill>;
    controls: Array<any>;
}
export interface IreportOption {
    description: string;
    value: any;
    type: string;
    options: Array<IOption>;
}
export interface IOption {
    name: string;
    value: any;
}
export interface IreportDialog {
    name: string;
    title: string;
    controls: Array<IControl>;
}
export interface IReportDrill {
    reportName: string;
    reportParam: Array<IReportParam>;
}
export interface IReportMenu {
    name: string;
    title: string;
    reportName: string;
    children: Array<IReportMenu>;
}
export interface IControl {
    name: string;
    label: string;
    defaultValue: any;
    type: string;
    options: Array<IControlOption>
    column: number;
    listName:string;
}
export interface IControlOption {
    description: string;
    value: any;
    defaultvalue: number;

}
export interface IReportParam {
    param: string;
    value: any;
}

//@Injectable()
export class ReportService implements OnInit {

    private _acList: Array<TAcList> = [];
    private costcenterList:Array<CostCenter> = [];
     private divisionList:Array<any> = [];
    public reports: Array<IReport> = [];
    public reportMenus: Array<IReportMenu> = [];
    private repmenus: Array<IReportMenu> = [{
        name: 'finance',
        title: 'Finance',
        reportName: '',
        children: [{
            name: 'acledger',
            title: 'Account Ledger',
            reportName: 'acledger',
            children: [
                {
                    name: 'test',
                    title: 'Test',
                    reportName: '',
                    children: [{
                        name: 'test1',
                        title: 'Test1',
                        reportName: '',
                        children: [{
                            name: 'test2',
                            title: 'Test2',
                            reportName: '',
                            children: []
                        }]
                    }]
                }]
        }, {
            name: 'partyLedger',
            title: 'Party Ledger',
            reportName: 'partyLedger',
            children: []
        }
        ]
    }, {
        name: 'inventoryReport',
        title: 'Inventory Report',
        reportName: 'inventoryReport',
        children: [{
            name: 'stockPosition',
            title: 'Stock Position',
            reportName: 'stockPosition',
            children: []
        }]
    }]
    public C: IControl[] = [
        { name: "DATE1", label: "From", type: "date", defaultValue: "", options: null,listName:null, column: 1 },
        { name: "ACID", label: "A/C ", type: "MultiDoubleSelect", defaultValue: "", options: null,listName:"ledgerAccountList", column: 1 },

        { name: "DATE2", label: "To", type: "date", defaultValue: "", options: null,listName:null, column: 2 },
        { name: "DIVISION", label: "Division", type: "select", defaultValue: "%", options: null,listName:"divisionList", column: 2 },

        // {name:"ACID",label:"A/C Name",type:"MultiSelect",defaultValue:"",options:null,column:2,row:1},
        // {name:"nDATE1",label:"From(BS)",type:"nepdate",defaultValue:"",options:null,column:2,row:2},
        //  {name:"nDATE2",label:"To(BS)",type:"nepdate",defaultValue:"",options:null,column:2,row:3},
        { name: "COSTCENTER", label: "Cost Center", type: "MultiSelect", defaultValue: "", options: null, listName:"costcenterlist",column: 2 },
        { name: "SHOWPRODUCTDETAIL", label: "Show Product Details Also", type: "checkbox", defaultValue: "0",listName:null, options: null, column: 3 },
        { name: "ShowBsDate", label: "Show BS Date in Report", type: "checkbox", defaultValue: "0", options: null,listName:null, column: 3 },
        // {name:"EnableMultiAc",label:"Enable Multi A/c Selection",type:"checkbox",defaultValue:"",options:null,column:3,row:1},
        //  {name:"EnableMultiCostCenter",label:"Enable Multi CostCenter Selection",type:"checkbox",defaultValue:"",options:null,column:3,row:4},
        { name: "SegregateCostCenter", label: "Segregate Report By CostCenter", type: "checkbox", defaultValue: "",listName:null, options: null, column: 3 },

    ];
    public newC:any[]=[
        {row:[{ name: "ACID", label: "A/C ", type: "MultiDoubleSelect", defaultValue: "", options: {displayname:"ACNAME",displayCode:"ACCODE",value:"ACID",list:null,singleLedgerOption:"InSingleLedger"},listName:"ledgerAccountList", column:"col-md-12" }]},
        {row:[{ name: "DATE1", label: "From", type: "date", defaultValue: "", options: null,listName:null, column:"col-md-3" }, 
            { name: "DATE2", label: "To", type: "date", defaultValue: "", options: null,listName:null, column:"col-md-3" },
            {column:"col-md-3",type:"reportOptions", reportOptions:[{description:"Report Type",type:"radio",value:{name:"summary",value:1 } ,options:[{name:"summary",value:1 },{name:"details",value:0}]}]}]},
        {row:[{ name: "DIVISION", label: "Division", type: "select", defaultValue: "%", options:{displayname:"NAME",value:"INITIAL",list:null} ,listName:"divisionList", column:"col-md-3" }, 
            { name: "COSTCENTER", label: "Cost Center", type: "MultiSelect", defaultValue: "", options: {displayname:"CostCenterName",value:"CostCenterName",list:null}, listName:"costcenterlist",column:"col-md-9" }]},
        {row:[{ name: "SHOWPRODUCTDETAIL", label: "Show Product Details Also", type: "checkbox", defaultValue: "0",listName:null, options: null, column: "col-md-3"}, 
            { name: "ShowBsDate", label: "Show BS Date in Report", type: "checkbox", defaultValue: "0", options: null,listName:null, column: "col-md-3" }, 
            { name: "SegregateCostCenter", label: "Segregate Report By CostCenter", type: "checkbox", defaultValue: "",listName:null, options: null, column: "col-md-3"}]}];
    // private reps:Array<IReport>=[{
    //     name:'accountLedger',
    //     title:'Account Ledger',
    //     reportDialog:{name:'acdialog',title:'Accoount Ledger',controls:this.setDialog('')},
    //     reportDrill:undefined,
    //     reportGrid:undefined,
    //     reportQuery:undefined
    // },{
    //     name:'partyLedger',
    //     title:'Party Ledger',
    //     reportDialog:{name:'acdialog',title:'Accoount Ledger',controls:this.setDialog('')},
    //     reportDrill:undefined,
    //     reportGrid:undefined,
    //     reportQuery:undefined
    // },{
    //     name:'stockPosition',
    //     title:'Stock Position',
    //     reportDialog:{name:'acdialog',title:'Accoount Ledger',controls:this.setDialog('')},
    //     reportDrill:undefined,
    //     reportGrid:undefined,
    //     reportQuery:undefined
    // }]
    constructor(private http: Http, private authService: AuthService, private state: GlobalState, private MasterService: MasterRepo) {
        //console.log('reportservice consutruct')
        //get this from Api
        //this.reportMenus=this.repmenus;
        //  //console.log({reportMenus:this.reportMenus})
        //no need to get this in constructor. this is only for test
        //   this.reports=this.reps;
    }
    ngOnInit() {

    }
    private setDialog(menuName): Array<IControl> {
        let dialog: Array<IControl> = [];
        // dialog.push({ name: 'date1', label: 'From Date', defaultValue: '01/01/2017', options: [], type: 'datetime' })
        // dialog.push({ name: 'date2', label: 'To Date', defaultValue: '01/01/2017', options: [], type: 'datetime' })
        // dialog.push({ name: 'acid', label: 'AccountName', defaultValue: '', options: [], type: 'text' })
        // dialog.push({name:'division',type:'list',defaultValue:'',label:'Division',options:[]})
        return dialog;
    }
    public getDialog(menuName): Array<IControl> {
        let rep = this.reports.find(r => r.name == menuName);
        if (rep) {
            if (rep.reportDialog) {
                //return rep.reportDialog;
            }
        }
        //else get it from the server
        //temporary
        return this.setDialog('test');
    }

    public getReport(reportname): IReport {
        //console.log({ reports: this.reports });
        if (this.reports.length == 0) {
            //fill this report array through http
        }
        if (this.reports.length == 0) return null;
        let rep = this.reports.find(rep => rep.name == reportname);
        if (rep) {
            return rep;
        }
        else {
            //fill this report array through http
        }
        return null
    }

    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        //console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }
    public getReportMenus() {
       
        return  this.http.get(this.apiUrl + '/getReportMenus', this.getRequestOption()).flatMap(response => response.json() || []);
                
           
      
    }

    public getReportDataList(RObj: any) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        let bodyData = { data: RObj };

        this.http.post(this.apiUrl + '/getReportDataList', bodyData, this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                //console.log(data);
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
        /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/


    }

    public getReportMaster(rname: string) {
        ////console.log("reportname:::" + rname);
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getReportMaster/' + rname, this.getRequestOption()).subscribe(response => {
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


    public getAcList() {
        if (this._acList.length == 0) {
            let acL=[];
            this.MasterService.getAcList().subscribe(res => { acL.push(<any>res);this._acList=acL; });
            
        }
         return Observable.of(this._acList); 

    }
     public getCostCenterList() {
          if (this.costcenterList.length == 0) {
            let clist=[];
            this.MasterService.getCostCenterList().subscribe(res => { clist.push(<any>res);
                this.costcenterList=clist;
           });
        }
        return Observable.of(this.costcenterList); 

    }
     public getDivisionList() {
        if (this.divisionList.length == 0) {
            let dlist=[];
            this.MasterService.getDivisions().subscribe(res => { dlist.push(<any>res);
                this.divisionList=dlist;
           });
        }
        return Observable.of(this.divisionList); 

    }
    public getD(){
        
        return this.divisionList;
    }


    public loadReportData(RData: any) {

        return this.http.post(this.apiUrl + '/loadreportdata', RData, this.getRequestOption())
            .flatMap(response => response.json() || []);

    }

}