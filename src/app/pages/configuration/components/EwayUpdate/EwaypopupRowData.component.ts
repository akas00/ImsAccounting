import {
  Component, Output, EventEmitter, ViewChild
} from "@angular/core";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { EwayService, EwayArray } from "./Eway.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { MasterRepo } from "../../../../common/repositories";

@Component({
  selector: "eway-popup-row-data",
  templateUrl: "./EwaypopupRowData.html",
  styleUrls: ["../../../../pages/Style.css", "../../../../common/popupLists/pStyle.css"],
})
export class EwaypopupRowDataComponent {
  @Output('okClicked') okClicked = new EventEmitter();
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  isActive: boolean = false;
  TransporterList: any[] = [];
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  constructor(private alertService: AlertService,
    private loadingService: SpinnerService, private service: EwayService, private masteService: MasterRepo) {
    this.gridPopupSettings = masteService.getGenericGridPopUpSettings('Transporter');
  }

  show() {
    this.isActive = true;
    if (this.service.selectedTransportObj.LRDATE == null || this.service.selectedTransportObj.LRDATE == '') {

    }
    else {
      this.service.selectedTransportObj.LRDATE.substring(0, 10);
    }

  }

  hide() {
    this.isActive = false;
  }
  Update() {

    if (this.service.selectedTransportObj.DISTANCE == null || this.service.selectedTransportObj.DISTANCE == 0) {
      this.alertService.warning("Distance field is required!")
      return
    }
    if (this.service.selectedTransportObj.VEHICLENO == null) {
      this.alertService.warning("Vehicleno field is required!")
      return;
    }
    try {
      this.onsubmit();
    } catch (ex) {
      this.alertService.error(ex);
    }
  }



  onsubmit() {
    try {
      this.loadingService.show("Updating Transporter, please wait...");
      let sub = this.service
        .updateTableRow(this.service.selectedTransportObj)
        .subscribe(
          data => {
            if (data.status == "ok") {
              this.loadingService.hide();
              this.alertService.success("Data updated Successfully");
              this.hide();

            } else {
              this.loadingService.hide();
              if (
                data.result._body ==
                "The ConnectionString property has not been initialized."
              ) {
                return;
              }
              this.alertService.error(
                `Error in Saving Data: ${data.result._body}`
              );
            }
          },
          error => {
            this.loadingService.hide();
            this.alertService.error(error);
          }
        );

    } catch (e) {
      this.alertService.error(e);
    }
  }
  onEnterTransporter() {
    this.loadingService.show("Getting data, please wait...");
    this.masteService.CHECKTRANSPORT().subscribe(res => {

      if (res.status == 'ok') {
        this.loadingService.hide();
        if (res.result.length > 1) {
          this.genericGrid.show()
        }
        else {
          var a = res.result[0];
          this.service.selectedTransportObj.TRANSPORTER = a.NAME;
        }
      }
    })
  }
  onItemDoubleClick(event) {

    this.service.selectedTransportObj.TRANSPORTER = event.NAME;
  }
}


