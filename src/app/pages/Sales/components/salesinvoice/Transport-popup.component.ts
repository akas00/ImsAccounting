import {
    Component, Output, EventEmitter, ViewChild, ElementRef
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MasterRepo } from "../../../../common/repositories";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { GenericPopUpSettings, GenericPopUpComponent } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AuthService } from "../../../../common/services/permission";

@Component({
    selector: "Transport-Popup",
    templateUrl: "./Transport-popup.html",
    styleUrls: ["../../../../pages/Style.css", "../../../../common/popupLists/pStyle.css"],
})
export class TransportPopupComponent {
    @Output('okClicked') okClicked = new EventEmitter();
    @ViewChild("Transporter") Transporter: ElementRef;
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    isActive: boolean = false;
    TransportObj: any = <any>{};
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    userProfile: any;
    constructor(private fb: FormBuilder, private masterService: MasterRepo,
        private loadingService: SpinnerService, private _trnMainService: TransactionService,
        private authservice: AuthService) {
        this.TransportObj.MODE = "paid";
        this.gridPopupSettings = this.masterService.getGenericGridPopUpSettings('Transporter');
        if(_trnMainService.TrnMainObj.TransporterEway==null)
        {
            this._trnMainService.TrnMainObj.TransporterEway=<any>{};
        }
        this.userProfile = this.authservice.getUserProfile();
    }

    show() {
        this.isActive = true;
        this._trnMainService.TrnMainObj.TransporterEway.TOTALWEIGHT=this._trnMainService.TrnMainObj.TOTALWEIGHT;
    }

    hide() {
        this.isActive = false;
        this._trnMainService.TrnMainObj.TransporterEway=<any>{};
    }
    ok() {
        this._trnMainService.TrnMainObj.TransporterEway.COMPANYID = this.userProfile.CompanyInfo.COMPANYID
        this.isActive = false;
    }
    onEnterTransporter() {
        this.loadingService.show("Getting data, please wait...");
        this.masterService.CHECKTRANSPORT().subscribe(res => {
            ////console.log("resa", res)
            if (res.status == 'ok') {
                this.loadingService.hide();
                if (res.result.length > 1) {
                    this.genericGrid.show()
                }
                else {
                    var a = res.result[0];
                    this._trnMainService.TrnMainObj.TransporterEway.TRANSPORTER = a.NAME;
                }
            }
        })
    }
    onItemDoubleClick(event) {

        this._trnMainService.TrnMainObj.TransporterEway.TRANSPORTER = event.NAME;
    }


}


