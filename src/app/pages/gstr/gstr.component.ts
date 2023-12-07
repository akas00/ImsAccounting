import { Component, OnInit } from "@angular/core";
import * as moment from 'moment'
import { GstrService } from "./gstr.service";
import { CacheService } from "../../common/services/permission";
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AlertService } from "../../common/services/alert/alert.service";

@Component({
    selector: "gstr",
    templateUrl: './gstr.component.html'
})
export class GstrComponent implements OnInit{
    
    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
    public refresh: boolean = false
    public SHOWGSTRREPORT:boolean=false
    alwaysShowCalendars: boolean = true;
    public gstSelectedForExport:string="";
    public typeSelectedForExport:string=""
    ranges: any = {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Financial Year': [moment().set('date', 1).set('month', 3), moment().endOf('month').set('month', 2).add(1, 'year')],

    }
    locale = {
        format: 'DD/MM/YYYY',
        direction: 'ltr', // could be rtl
        weekLabel: 'W',
        separator: ' - ', // default is ' - '
        cancelLabel: 'Cancel', // detault is 'Cancel'
        applyLabel: 'Okay', // detault is 'Apply'
        clearLabel: 'Clear', // detault is 'Clear'
        customRangeLabel: 'Custom Range',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: 0 // first day is monday
    }
    listOfGST: any;
    constructor(private _gstrService: GstrService, private _cacheService: CacheService, private _router: Router, private _alertService: AlertService) {
        this.selectedDate = {
            startDate: moment().startOf('month'),
            endDate: moment().endOf('month')
        }
    }


    ngOnInit() {
        this._gstrService.getGstType().subscribe((res) => {
            this.listOfGST = res.result
        }, error => {
            this._alertService.error(error)
        })
    }

    dateChanged(date) {
        this._gstrService.gstMain.startDate = moment(date.startDate).format('MM-DD-YYYY')
        this._gstrService.gstMain.endDate = moment(date.endDate).format('MM-DD-YYYY')
        this._cacheService.set('startDate', moment(date.startDate).format('MM-DD-YYYY'))
        this._cacheService.set('endDate', moment(date.endDate).format('MM-DD-YYYY'))
    }
    reloadGst() {
        let activeUrlArray = (this._router.url).split("/")

        if (activeUrlArray.length == 5) {
            if (activeUrlArray[activeUrlArray.length - 1] == "gstr-3b") {
                this.refresh = true
                this._gstrService.getGstSubTypeById(this._gstrService.gstMain.activeGstType).subscribe((res) => {
                    this._gstrService.gstMain.detailOfOutwaredSupplies = res.result[0].detailOfOutwardSupplies
                    this._gstrService.gstMain.eligibleTax = res.result[0].eligibleTax
                    this._gstrService.gstMain.lateFeePayable = res.result[0].lateFeePayable
                    this._gstrService.gstMain.exempted = res.result[0].exempted
                    this._gstrService.gstMain.interIntraState = res.result[0].interIntraState
                    this._gstrService.gstMain.isGstReport = true
                    this.refresh = false
                }, error => {
                    this._alertService.error(error)
                    this.refresh = false
                })
            } else if (activeUrlArray[activeUrlArray.length - 1] == "dashboard") {
                this.refresh = true
                this._gstrService.getGstType().subscribe((res) => {
                    this._gstrService.gstMain.listOfCard = res.result
                    this.refresh = false
                }, error => {
                    this._alertService.error(error)
                    this.refresh = false
                })
            }
            else {
                this.refresh = true
                this._gstrService.getGstSubTypeById(this._gstrService.gstMain.activeGstType).subscribe((res) => {
                    this._gstrService.gstMain.gstrSubReport = res.result;
                    this.refresh = false
                }, error => {
                    this._alertService.error(error)
                    this.refresh = false
                })
            }
        } else if (activeUrlArray.length == 6) {
            if (this._gstrService.gstMain.activeSubGstType) {
                this.refresh = true
                this._gstrService.getGstSubTypeDetailById(this._gstrService.gstMain.activeGstType, this._gstrService.gstMain.activeSubGstType).subscribe((res) => {
                    if (res.status == "ok" && res.result != null) {
                        this._gstrService.gstMain.totalRowData = res.result2 == null ? res.result : res.result2
                        this._gstrService.gstMain.summaryData = res.result
                    } else {
                        this._gstrService.gstMain.totalRowData = []
                        this._gstrService.gstMain.summaryData = []
                    }
                    this.refresh = false
                }, error => {
                    this._alertService.error(error)
                    this.refresh = false
                })
            }
        }
    }
    onokClick(){
           
            if(this.typeSelectedForExport.toLowerCase()=="excel"){
                this.exportGstReport();
            }
            else{this.exportGstToJson()}

    }

    exportGstToJson(){

        if(this.typeSelectedForExport=="" || this.typeSelectedForExport==undefined || this.typeSelectedForExport==null){
            this._alertService.error("please select Type to export");
            return;
        }
        this._gstrService.exportGstToJson(this.gstSelectedForExport,this._gstrService.gstMain.startDate,this._gstrService.gstMain.endDate).subscribe((res)=>{
            
            this.downloadFile(res);

        },error=>{
            this._alertService.error(error)
        })


    }

    exportGstReport(){
        if(this.gstSelectedForExport=="" || this.gstSelectedForExport==undefined || this.gstSelectedForExport==null){
            this._alertService.error("please select GST type to export");
            return;
        }
        this._gstrService.exportGSTReport(this.gstSelectedForExport,this._gstrService.gstMain.startDate,this._gstrService.gstMain.endDate).subscribe((res)=>{
            
            this.downloadFile(res);

        },error=>{
            this._alertService.error(error)
        })

    }


    downloadFile(response: any) {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(response.content);
        element.download = response.filename;
        document.body.appendChild(element);
        element.click();
        this.SHOWGSTRREPORT = false
      }

}