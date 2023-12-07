import {
  Component, Output, EventEmitter
} from "@angular/core";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { EwayService, EwayArray } from "./Eway.service";

@Component({
  selector: "eway-popup",
  templateUrl: "./Ewaypopup.html",
  styleUrls: ["../../../../pages/Style.css", "../../../../common/popupLists/pStyle.css"],
})
export class Ewaypopupcomponent {
  @Output('okClicked') okClicked = new EventEmitter();
  // @ViewChild("Transporter") Transporter: ElementRef;

  isActive: boolean = false;
  TransportObj: any = <any>{};
  ewayObj: any = <any>{};
  constructor(private alertService: AlertService,
    private loadingService: SpinnerService, private service: EwayService) {
  }

  show() {

    this.isActive = true;
  }

  hide() {
    this.isActive = false;
  }
  Update() {
    try {
      //   if(this.multiVchrObj == ''){
      //     this.alertService.warning("Cannot update eway! No selected E-Way bills found.");
      //   }
      var updateObj = this.service.ewayList;
      let filterList: EwayArray[] = [];

      for (let i of updateObj) {
        if (i.EWAYCHECK == true) {
          let a: any = <any>{};
          a.VCHRNO = i.VCHRNO;
          a.EWAYNO = this.ewayObj.ewayno;
          filterList.push(a);
        }

      }
      this.onsubmit(filterList);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  RefreshEway() {
    this.service.getAllTodaysEway().subscribe(res => {
      this.service.ewayList = res
    })

  }
  onsubmit(filterList) {
    try {
      this.loadingService.show("Updating E-Way, please wait...");
      let sub = this.service
        .updateEway(filterList)
        .subscribe(
          data => {
            if (data.status == "ok") {
              this.loadingService.hide();
              this.alertService.success("Data updated Successfully");
              this.hide();
              this.RefreshEway();
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
}


