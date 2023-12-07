import { Component, ViewChild, OnInit } from '@angular/core';
import { ReportFilterComponent } from '../../../common/popupLists/report-filter/report-filter.component';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericReportListSettings, ReportData } from '../report-body.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportFilterService } from '../../../common/popupLists/report-filter/report-filter.service';
import { EventListenerService } from '../event-listener.service';
import { Location } from '@angular/common';
import { OpeningBalanceService } from './openingBalance.service';




@Component({
    selector: '"openingbalance',
    templateUrl: './openingBalance.component.html',
})

export class OpeningBalanceComponent implements OnInit {
    private isActive: boolean = false
    listSetting: GenericReportListSettings = new GenericReportListSettings()
    public reportType: string = "OpeningBalance"
    public returnUrl:string;
    public _reportFilterData: any;
    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    ReportDataObj: ReportData = <ReportData>{}
    public filterObj: any
    private reportHeaders: any[] = [];
    public reportData: any[] = [];
   
    constructor(private _location: Location,public eventListener:EventListenerService,public _reportFilterService:ReportFilterService,
        private router:Router,private activatedRoute: ActivatedRoute, private _alertService: AlertService, private _openingService: OpeningBalanceService, private _spinnerService: SpinnerService) {
            this.listSetting = {
                title: "Opening Balance",
                columns: [
                   
                    {
                        key: "MAIN GROUP NAME",
                        title: "Main Group"
                    },
                    {
                        key: "GROUP NAME"                        ,
                        title: "Group Name"
                    },
                    {
                        key: "LEDGER NAME",
                        title: "Ledger Name"
                    },
                    {
                        key: "TRNDATE",
                        title: "Date"
                    },
                    {
                        key: "DEBIT",
                        title: "Debit"
                    },
                    {
                        key: "CREDIT",
                        title: "Credit"
                    }
                  
                   
                   
                ]
    
            }
       
    }
    ngOnInit() {
        this.eventListener.onreportObjectChange.subscribe((data:any)=>{
            this._reportFilterService.ReportFilterObj =data
        })
        
        const mode = this.activatedRoute.snapshot.params['mode']
        if (mode=="D") {
            this.queryAndLoad(this.activatedRoute.snapshot.params)
            
        }else{
            this.reportFilter.show()
        }

    }

    loadFilter() {
        this.reportFilter.show()
    }
    
  show() {
    this.isActive = false
  }

  popupClose() {
    this.isActive = false;
  }


    applyFilter(filterObj) {
        try {
            this.queryAndLoad(filterObj)
        } catch (ex) {
            this._alertService.error(ex)
        }
    }


    
queryAndLoad(filterObj) {
    this.returnUrl = filterObj.returnUrl
    this.filterObj = filterObj
    this.reportFilter.popupClose()
    this._spinnerService.show(' Please Wait! Getting Report Data.')
    this._openingService.getOpeningBalanceData().subscribe((res) => {
        if(res.status =='ok'){
            this.ReportDataObj.particularsRow = res.result.data
            this.ReportDataObj.totalRow = res.result2 == null ? [] : res.result2
            this._spinnerService.hide()
          
        }
        else{  this._spinnerService.hide();
            this._alertService.warning("No Result Found")}
        
      
    }, error => {
        this._alertService.error(error)
    })
}

    return(){
        this.eventListener.updateReportObject(this._reportFilterService.ReportFilterObj)
        this._location.back()

    }

  
    getFormattedValue(value) {
        if (value != null) {
          if (typeof value === 'number') { return value.toLocaleString('en-us', { minimumFractionDigits: 2 }) }
    
          else if (new Date(value).toString() != 'Invalid Date') {
            //return new Date(value).toJSON().split('T')[0];
            return value.split('T')[0];
          }
        }
        return value;
    
      }

       ExportReportInExcel() {
        this._reportFilterService.exportTableToExcel("reportTable", "OpeningBalance")
  }


  excelDownloadFromHtml_manualTable() {
    try {
     
      let table = '<table>  <thead>   <tr>';
      for (let column1 of this.reportHeaders) {
        table += '<th>' + column1.colHeader + '</th>';
      };
      table += '</tr> </thead>';
      table += '<tbody>';

      for (let row of this.reportData) {
        table += '<tr>';
        for (let column1 of this.reportHeaders) {
          var v = row[column1.mappingName];
          if (v == null) v = "";
          table += '<td>' + v + '</td>';
        };

        '</tr>';
      };

      table += '</tbody></table>';
      // var Ht = header + param + table;
      var Ht =  table;

      var blob = new Blob([Ht], { type: "application/vnd.ms-excel" });
      var blobUrl = URL.createObjectURL(blob);

      var downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "OpeningBalance.xls";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (ex) { alert(ex) };
  }
}


