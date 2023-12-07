import { Component, ViewChild, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { EwayService, EwayArray } from './Eway.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Ewaypopupcomponent } from './Ewaypopup.component';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { AuthService } from '../../../../common/services/permission';
import { EwaypopupRowDataComponent } from './EwaypopupRowData.component';

@Component(
  {
    selector: 'EwayUpdate',
    templateUrl: './Eway.html',
    styleUrls: ["../../../modal-style.css", "./../../../../common/Transaction Components/_theming.scss"],
    providers: [EwayService],
  }
)
export class EwayComponent {
  @ViewChild("ewaypopup") ewaypopup: Ewaypopupcomponent;
  @ViewChild("rowdatapopup") rowdatapopup: EwaypopupRowDataComponent;
  From: Date; //start date bind
  To: Date; //end date bind
  EwayObj: any = <any>{}
  activerowIndex: number = 0;
  multiVchrObj: any;
  downloadJsonHref: any;
  userProfile: any;
  constructor(private masterService: MasterRepo, private authservice: AuthService, private _activatedRoute: ActivatedRoute, private service: EwayService, private sanitizer: DomSanitizer, private alertService: AlertService,
    private loadingService: SpinnerService) {

    this.loadingService.show("Getting E-Way Bills, Please wait...");
    this.service.getAllTodaysEway().subscribe(res => {
      if (res.status == "ok") {
        if (res.result.length == 0) {
          this.alertService.info("No E-Way bills of today!")
        }
        this.service.ewayList = res.result;
        this.loadingService.hide();
      }
    }),
      error => {
        this.loadingService.hide();
        this.alertService.error("Error on getting data!")
        this.masterService.resolveError(error, "E-Way - Getting Bills");
      }
    this.multiVchrObj = '';
  }
  ngAfterViewInit() {
    this.userProfile = this.authservice.getUserProfile()
    this.EwayObj.Location = this.userProfile.CompanyInfo.ADDRESS;
    this.EwayObj.Type = "Sale"
  }
  setDate() {
    this.From = this.EwayObj.from;
  }
  endDate() {
    this.To = this.EwayObj.to;
  }

  update() {
    this.ewaypopup.show();
  }
  download_eway() {
    if (this.service.ewayList.filter(e => e.EWAYCHECK == true)[0] == null) {
      this.alertService.warning("Please select the Bill");
      return;
    }
    this.VoucherCollection();
    if (this.multiVchrObj == '') {
      this.alertService.warning("Please select E-Way Bills first!");
      return
    }
    this.loadingService.show("Preparing JSON..");
    this.service.getEwayJson(this.multiVchrObj).subscribe(res => {
      if (res.status == 'ok') {
        this.loadingService.hide();
        // this.alertService.success("JSON Download Completed!")
        var ewayJSON = JSON.stringify(res.result.result);
        var element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(ewayJSON));
        element.setAttribute('download', "EwayJSON.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    }),
      error => {
        this.loadingService.hide();
        this.alertService.error("Error on preparing JSON!")
        this.masterService.resolveError(error, "E-Way - Preparing JSON");
      }

  }
  ApplyEway() {
    this.loadingService.show("Getting E-Way Bills, Please wait...");
    this.service.getEwayFromDateRange(this.EwayObj.from, this.EwayObj.to).subscribe(res => {
      this.loadingService.hide();
      if (res.status == "ok") {
        if (res.length == 0) {
          this.alertService.info("Cannot find Bills from Date Range!")
        }
        this.masterService.ShowMore = true;
        this.service.ewayList = res.result;
      }
      if (res.status == "error") {
        this.alertService.error(
          `Error in getting Eway Bills: ${res.result}`
        );
      }
    }),
      error => {
        this.loadingService.hide();
        this.alertService.error(
          `Error in getting Eway Bills: ${error.result._body}`
        );
      }
  }
  VoucherCollection() {
    this.multiVchrObj = ''
    for (var i of this.service.ewayList.filter(e => e.EWAYCHECK == true)) {
      this.multiVchrObj += i.VCHRNO + ',';
    }
  }
  vchrno: any;
  checkbox: any;

  RowTransporterClick(value) {
    this.service.selectedTransportObj = value;
    this.rowdatapopup.show();
  }

}
