import { Component, Input, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { ReportService, IReportMenu, IControl, IReport, IReportParam } from './report.service';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ModalDirective } from 'ng2-bootstrap'
import { MdDialog } from "@angular/material";
import { MessageDialog } from "../../../modaldialogs/messageDialog/messageDialog.component";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ExcelService } from "./Excel.service";
import { AuthService } from "../../../../common/services/permission/authService.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { EventListenerService } from '../../../../common/services/event-listener.service';

declare let jsPDF;

@Component({
    selector: 'report-dialog',
    templateUrl: './reportdialog.component.html',
    styleUrls: ["./reportdialog.css"]
})
export class ReportDialog implements OnInit {
    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Looding data please wait ..."
    @Input('reportname') reportname: string;
    @Input() reportMaster: IReport = <IReport>{};
    reportMenu: IReportMenu;
    reportForm: FormGroup;
    data: any[] = [];
    form: FormGroup = new FormGroup(<any>{});
    Controls: any[] = [];
    contextMenuActions: any[] = [];
    @Input() loadFromDrill = false;
    @Output() contextmenuEmit = new EventEmitter();
   

    @ViewChild('reportHtmlTable') el: ElementRef;
    @ViewChild('PreviewReportHeader') rPreviewHeader: ElementRef;
    gridTabel: any;

    userProfile: any;
    constructor(private reportService: ReportService, private fb: FormBuilder, public dialog: MdDialog, private excelService: ExcelService, private authService: AuthService, private masterService: MasterRepo) {
        this.userProfile = this.authService.getUserProfile();
         ////console.log("userP",this.userProfile);        
        // this.source=[{title:'SNO',type:'string',mappingname:'sno'},{title:'SNOoooooooo1',type:'string',mappingname:'sno1'},{title:'SNO2',type:'string',mappingname:'sno3'}]

        // this.data=[{sno:1,sno1:2,sno3:3},{sno:1,sno1:2,sno3:3},{sno:1,sno1:2,sno3:3}];
        //this.Controls=reportService.newC;
        // this.reportMaster.controls=reportService.newC;

    }

    ngOnInit() {
    
        try {
            this.gridTabel = { mainHeader: this.reportMaster.reportGrid.mainHeader, optionalHeader: this.reportMaster.reportGrid.optionalHeader };
            ////console.log("ReportDialog"+this.gridTabel);
            
            if (this.reportMaster.reportQuery != null) {
                for (let c of this.reportMaster.reportQuery) {
                    if (c.param == "DATE1") { c.value = this.authService.getUserProfile().PhiscalYearInfo.BeginDate; }
                    if (c.param == "DATE2") { c.value = new Date().toJSON().split('T')[0]; }
                    if (this.loadFromDrill == false) {
                        for (let c1 of this.reportMaster.controls) {
                            for (let r of c1.row) {
                                if (c.param == r.name) {
                                    if (r.defaultValue != null) {
                                        c.value = r.defaultValue;
                                    }
                                }
                                if (r.type == 'reportOptions') {
                                    for (let rf of r.reportOptions) {
                                        if (c.param == rf.mappingname) {
                                            c.value = rf.defaultValue;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    let control: FormControl = new FormControl(c.value, Validators.required);
                    this.form.addControl(c.param, control);
                }

            }

        } catch (ex) { alert(ex); }
    }
    ngAfterViewInit() {
        if (this.loadFromDrill == true) {
            ////console.log("load From drill");
            this.onloadReportClickEvent(true);
        }
    }
    contextMenuParam(param) {
        this.contextmenuEmit.emit(param);
    }
    onClear() {

    }
    getContextMenuList() {
        let rdList = [];
        if (this.reportMaster.reportDrill != null) {
            for (let rd of this.reportMaster.reportDrill) {
                rdList.push({ html: (item) => rd.title, reportDrillValue: rd });
            }
        }
        return rdList;
    }
    excelDownload() {
        let tempArray = [];
        for (let v of this.data) {
            tempArray.push(v);
        }
        let ExcelExportData = [];
        for (let ee of tempArray) {
            let v = {};
            Object.assign(v, ee)
            Object.keys(v).forEach(element => {
                if (this.reportMaster.reportGrid.mainHeader.indexOf(this.reportMaster.reportGrid.mainHeader.filter(x => x.mappingname == element)[0]) < 0) {
                    delete v[element];
                }
            }
            )
            ExcelExportData.push(v);
        }
        this.excelService.exportAsExcelFile(ExcelExportData, 'ReportExcel');
    }
    csvDownload() {
        var json2csv = require('json2csv');
        let MHeader = [];
        let Header = [];
        this.reportMaster.reportGrid.mainHeader.forEach(element => {
            MHeader.push(element.mappingname);
        });
        this.reportMaster.reportGrid.mainHeader.forEach(element => {
            Header.push(element.title);
        });
        var csv = json2csv({ data: this.data, fields: MHeader, fieldNames: Header });
        var blob = new Blob([csv], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, 'ExcelReport.csv');
        }
        else //create a link and click it
        {
            var link = document.createElement("a");
            if (link.download !== undefined) // feature detection
            {
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", 'ExcelReport.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    convert() {

        var doc = new jsPDF();
        doc.fromHTML($('#BlueHeaderResizableTable').get(0), 25, 15, {
            'width': 200,
        });
        doc.save('Test.pdf');
    }

    excelDownloadFromHtml() {        
        let header = '<p style=" text-align:center;font-weight:bold;font-size:16px;">' + this.reportMaster.title.toUpperCase() + '</p><p style=" text-align:center;font-weight:bold;font-size:14px;">' + this.userProfile.CompanyInfo.NAME + '</p> <p style=" text-align:center;font-weight:bold;font-size:13px">' + this.userProfile.CompanyInfo.ADDRESS + '</p> <p style=" text-align:center;font-weight:bold"> PAN No : <label style="letter-spacing:5px">' + this.userProfile.CompanyInfo.VAT + '</label></p>';
        var Ht = header + this.el.nativeElement.outerHTML;
        window.open('data:application/vnd.ms-excel,' + encodeURIComponent(Ht), 'testExcel.xlsx');
    }
    
     xmlDownloadFromHtml() {
         var doc = $.parseXML("<xml></xml>");
         var json = this.data;
         var xml = doc.getElementsByTagName('xml')[0];
         var key, elem, prop, propElem;
         //console.log(json);
         for(key in json)
         {
            if(json.hasOwnProperty(key))            {                
                elem = doc.createElement("DataRow")
                for(prop in json[key])
                {
                    propElem = doc.createElement(prop);
                    $(propElem).text(json[key][prop]);
                    elem.appendChild(propElem);
                }
                xml.appendChild(elem);
            }
         }        
        //console.log(doc);        
        var blob = new Blob([xml.outerHTML], {
            type: "application/xml"
        });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, 'XmlReport.xml');
        }
        else //create a link and click it
        {
            var link = document.createElement("a");
            if (link.download !== undefined) // feature detection
            {
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", 'XmlReport.Xml');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    pdf2DownloadFromHtml() {
        
        let header = '<label style=" text-align:center;font-weight:bold;font-size:16px;">' + this.reportMaster.title.toUpperCase() + '</label><label style=" text-align:center;font-weight:bold;font-size:14px;">' + this.userProfile.CompanyInfo.NAME + '</label> <label style=" text-align:center;font-weight:bold;font-size:13px">' + this.userProfile.CompanyInfo.ADDRESS + '</label> <label style=" text-align:center;font-weight:bold"> PAN No : <label style="letter-spacing:5px">' + this.userProfile.CompanyInfo.VAT + '</label></label>';
      let param='<label style=" text-align:center;font-weight:bold;font-size:12px;">'+this.getReportParamForPreview()+'</label>';
        var Ht = header +param+ this.el.nativeElement.outerHTML;
        let printContents, popupWin;
        printContents = document.createElement("test");
        //console.log(printContents);
        popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1500px');
        popupWin.document.write(`<html><head><style>
        table{
            border-collapse: collapse;
        }
        table th,td{   
           
            border:1px solid #bbb;
           }</style></head></html>`);
        popupWin.document.body.innerHTML = Ht;
        popupWin.focus();
        popupWin.print();
        // popupWin.document.body.innerHTML = Ht;
        // popupWin.document.save("rrr.pdf");

        //window.open('data:application/pdf;base64,'+encodeURI(Ht),'testpdf.pdf');
    }
    pdfDownloadFromHtml() {
        let pdf = new jsPDF();
        let options = {
            pagesplit: true,

            background: '#fff'
        };
        pdf.addHTML(this.el.nativeElement, 15, 15, options, () => {
            pdf.save("test1.pdf");
        });
    }
    onloadPreviewEvent() {
        this.pdf2DownloadFromHtml();
    }
    onloadExcelEvent() {
        this.excelDownloadFromHtml();
        //  this.csvDownload();
    }
    getReportParamForPreview(){
        let pp="(";
         for(let q of this.reportMaster.reportQuery){
             if(q.param.toUpperCase()=="DATE1"){
                 pp+=" From : "+q.value+",";
             }
                 if(q.param.toUpperCase()=="DATE2"){
                 pp+=" To : "+q.value+",";
             }
             if(q.param.toUpperCase()=="DIVISION"){
                 if(q.value=="%" || q.value==null || q.value==''){
                     pp+=" Division : All "+",";
                 }
                 else
                { pp+=" Division : "+this.reportService.divisionList.filter(x=>x.INITIAL==q.value)[0].NAME +",";
                }
             }
        
        }
         pp=pp.substring(0, pp.length - 1);
            pp+=")";
        return pp;
    }

    onloadReportClickEvent(loadFromDrill = false) {
        this.contextMenuActions = this.getContextMenuList();
        // this.DialogMessage = "Loading Data please wait..."
        // this.childModal.show();
        let DialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject("Loading Data Please wait...");
        let message$ = DialogMessageSubject.asObservable();
        // let message$ = "Loading Data Please wait...";
        let messageDialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
        this.data = [];
        if (loadFromDrill == false) {
            Object.keys(this.form.value).forEach((key: any) => {
                for (let rp of this.reportMaster.reportQuery) {
                    if (rp.param == key) { rp.value = this.form.value[key]; }
                }
            });
        }
        let ropt = [];
        for (let r of this.reportMaster.controls) {
            for (let c of r.row) {
                if (c.type == 'reportOptions') {
                    ropt = c.reportOptions;
                }
            }
        }
        var rdata = { reportname: this.reportMaster.name, reportdata: this.reportMaster.reportQuery, reportoption: ropt };
        ////console.log("reportdata", JSON.stringify(rdata));
        this.changeHeaderOption(rdata.reportdata);
        this.reportService.loadReportData(rdata).subscribe(data => {
            if (data.status == 'ok') {
                this.data = data.result;
                if (this.data.length == 0) {
                    //this.DialogMessage = "Sorry,There is no reports for provided values." }
                    DialogMessageSubject.next("Sorry,There is no reports for provided values.");
                }
                else {
                    if (this.reportname == "annex7" || this.reportname == "reprintlog" || this.reportname == "tranactivitylog")
                        this.data.push(<any>{});
                    //this.DialogMessage = "Data Loaded Successfully"
                }
                setTimeout(() => {
                    messageDialogRef.close()
                    //this.childModal.hide();
                }, 1000)
            }
            else {
                DialogMessageSubject.next(data.result);
                setTimeout(() => {
                    messageDialogRef.close();
                }, 3000)
            }
        }, error => {
            alert(error); this.DialogMessage = "Error"
            setTimeout(() => {
                messageDialogRef.close();
                //this.childModal.hide();
            }, 1000)
        });
    }
    changeHeaderOption(reportdata) {
        if (this.reportMaster.name == "trialbalance") {
            var O = reportdata.filter(x => x.param == "ONLYOPENINGTRIAL")[0];
            if (O) {
                if (O.value == 1) {
                    this.gridTabel.optionalHeader = this.reportMaster.reportGrid.replacementOptionalHeader;
                    this.gridTabel.mainHeader = this.reportMaster.reportGrid.replacementMainHeader;
                }
                else {
                    this.gridTabel.optionalHeader = this.reportMaster.reportGrid.optionalHeader;
                    this.gridTabel.mainHeader = this.reportMaster.reportGrid.mainHeader;
                }
            }
        }
        else if (this.reportMaster.name == "debitorsreport" || this.reportMaster.name == "creditorsreport") {
            var tree = reportdata.filter(x => x.param == "GROUPWISEFORMAT")[0];
            var showdetail = reportdata.filter(x => x.param == "SHOWDETAIL")[0];
            var flag = reportdata.filter(x => x.param == "FLAG")[0];
            var showageing = reportdata.filter(x => x.param == "SHOWAGEINGREPORT")[0];
            if (tree) {
                if (tree.value == 1) {

                    this.gridTabel.mainHeader = this.reportMaster.reportGrid.replacementMainHeader4;
                    if (showdetail) {
                        if (showdetail.value == 1) { this.gridTabel.mainHeader = this.reportMaster.reportGrid.replacementMainHeader5 }
                    }
                    if (showageing) {
                        if (showageing.value == 1) {
                            for (let h of this.reportMaster.reportGrid.replacementMainHeader6) {
                                if (h.mappingname == "D1") { h.title = '<' + reportdata.filter(x => x.param == "D1")[0].value + 'DAYS'; }
                                if (h.mappingname == "D2") { h.title = '>=' + reportdata.filter(x => x.param == "D1")[0].value + '&<' + reportdata.filter(x => x.param == "D2")[0].value + 'DAYS'; }
                                if (h.mappingname == "D3") { h.title = '>=' + reportdata.filter(x => x.param == "D2")[0].value + '&<' + reportdata.filter(x => x.param == "D3")[0].value + 'DAYS'; }
                                if (h.mappingname == "D4") { h.title = '>=' + reportdata.filter(x => x.param == "D3")[0].value + '&<' + reportdata.filter(x => x.param == "D4")[0].value + 'DAYS'; }
                                if (h.mappingname == "D5") { h.title = '>=' + reportdata.filter(x => x.param == "D4")[0].value + 'DAYS'; }
                            }
                            this.gridTabel.mainHeader = this.reportMaster.reportGrid.replacementMainHeader6
                        }
                    }
                }
                else {
                    this.gridTabel.mainHeader = this.reportMaster.reportGrid.mainHeader;
                    if (flag) {
                        // ////console.log("falg", flag);
                        if (flag.value == 2) { this.gridTabel.mainHeader = this.reportMaster.reportGrid.replacementMainHeader }
                    }
                    if (showdetail) {
                        if (showdetail.value == 1) { this.gridTabel.mainHeader = this.reportMaster.reportGrid.replacementMainHeader2 }
                    }
                    if (showageing) {
                        if (showageing.value == 1) {
                            for (let h of this.reportMaster.reportGrid.replacementMainHeader3) {
                                if (h.mappingname == "D1") { h.title = '<' + reportdata.filter(x => x.param == "D1")[0].value + 'DAYS'; }
                                if (h.mappingname == "D2") { h.title = '>=' + reportdata.filter(x => x.param == "D1")[0].value + '&<' + reportdata.filter(x => x.param == "D2")[0].value + 'DAYS'; }
                                if (h.mappingname == "D3") { h.title = '>=' + reportdata.filter(x => x.param == "D2")[0].value + '&<' + reportdata.filter(x => x.param == "D3")[0].value + 'DAYS'; }
                                if (h.mappingname == "D4") { h.title = '>=' + reportdata.filter(x => x.param == "D3")[0].value + '&<' + reportdata.filter(x => x.param == "D4")[0].value + 'DAYS'; }
                                if (h.mappingname == "D5") { h.title = '>=' + reportdata.filter(x => x.param == "D4")[0].value + 'DAYS'; }
                            }
                            this.gridTabel.mainHeader = this.reportMaster.reportGrid.replacementMainHeader3
                        }
                    }

                }
            }

        }
        else if (this.reportMaster.name == "tranactivitylog") {
            var O = reportdata.filter(x => x.param == "FLAG")[0];
            if (O) {
                if (O.value == 1) {
                    this.gridTabel.mainHeader = this.reportMaster.reportGrid.replacementMainHeader2;
                }
                else if (O.value == 2) {
                    this.gridTabel.mainHeader = this.reportMaster.reportGrid.replacementMainHeader;
                }
                else if (O.value == 3) {
                    this.gridTabel.mainHeader = this.reportMaster.reportGrid.mainHeader;
                }
            }
        }
    }


    // radiochangeEvent(value,name,des){
    // if(value==true){
    //     this.reportMaster.reportOptions.filter(x=>x.description==des)[0].value={name:name,value:1};
    // }
    // }
    //   checkboxchangeEvent(value,name,des){
    // if(value==true){ this.reportMaster.reportOptions.filter(x=>x.description==des)[0].value={name:name,value:1};}
    // else{this.reportMaster.reportOptions.filter(x=>x.description==des)[0].value={name:name,value:0};}
    // }
}