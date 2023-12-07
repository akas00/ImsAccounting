import { Component } from "@angular/core";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { MasterRepo } from "../../../../../common/repositories";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SubLedgerMasterService } from "../subledger-master.service";

@Component({
    selector:'add-subledger',
    templateUrl: './add-subledger-master.component.html',
    providers: [SubLedgerMasterService],
})

export class AddSubLedgerComponent{
    form: FormGroup;
    voucherTypeList:any[] = [];
    subLedgerMasterObj:any = <any>{};
    returnUrl :string;
    mode:string = 'New';
    ACID:string;
    
    constructor(   private alertService: AlertService,
        private loadingService: SpinnerService,
        protected masterService: MasterRepo,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        public _subLedgerMaster: SubLedgerMasterService,
        private fb: FormBuilder){
            // this.getVoucherTypeList()     
            try {
                this.router = router;
                if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                    this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
                }
                if (!!this._activatedRoute.snapshot.params['ACID']) {
                    let ACID: string = ""; let mode:string =""
                    ACID = this._activatedRoute.snapshot.params['ACID'];
                    mode = this._activatedRoute.snapshot.params['mode'];
                    this.mode=mode;
    ////console.log("@@this.mode",this.mode)
                    this._subLedgerMaster.getSubLedgerbyID(ACID)
                        .subscribe(data => {
                            if (data.status == 'ok') {
                                this.subLedgerMasterObj.SL_ACNAME=data.result?data.result[0].SL_ACNAME:"";
                                // this.mode = 'edit';
                                this.ACID = data.result?data.result[0].SL_ACID:"";    
                            }
                            else {
                                this.mode = '';
                            }
                        }, error => {
                            this.mode = '';
                            // this.modeTitle = "Edit2 -Error in CostCenter";
                            this.masterService.resolveError(error, "costCenterForm - getCostCenter");
                        }
                        )
                }
                else {
                    this.mode = "add";
                }    
            } catch (ex) {
                //console.log(ex);
                alert(ex);
            }       
        }





        getVoucherTypeList(){
            this.masterService.getAllVoucherList().subscribe(
                (res)=>{
                  if(res.status == 'ok'){
                    this.voucherTypeList = res.result;
                  }                                   
                }
            )
        }

        cancel(){
            this.returnUrl = "pages/account/AccountLedger/subledger-master"
            this.router.navigate([this.returnUrl]);
        }

        onSave(){
            ////console.log("mdmd",this.mode,this.subLedgerMasterObj);
            if(this.subLedgerMasterObj.SL_ACNAME === "" || this.subLedgerMasterObj.SL_ACNAME === null || this.subLedgerMasterObj.SL_ACNAME === undefined){
                this.alertService.info("Please Enter Sub Ledger Name");
                return;
            }
            if(this.subLedgerMasterObj.SL_ACNAME.trim() === ""){
                this.alertService.info("Please Enter Sub Ledger Name");
                return;
            }
            if(this.mode == "edit"){
                this.subLedgerMasterObj.SL_ACID=this.ACID;
            }
            this.loadingService.show("Data is Saving ..")
            this.masterService.saveSubLedgerMaster(this.mode, this.subLedgerMasterObj).subscribe(
                (response) =>{
                     if(response.status == 'ok'){
                        this.loadingService.hide();
                        // this.alertService.info(response.result);
                        this.alertService.info("Data Saved Successfully");
                        setTimeout(() => {
                            this.alertService.hide()
                          }, 1000);
                        this.cancel();
                     }else{
                        this.loadingService.hide();
                        this.alertService.info(response.result._body);
                     }
                },error =>{
                    this.loadingService.hide();
                }
            )
        }

        onDelete(){
            this.subLedgerMasterObj.SL_ACID=this.ACID;
            this.masterService.deleteSubLedgerMaster(this.mode, this.subLedgerMasterObj).subscribe(
                (response) =>{
                     if(response.status == 'ok'){
                        this.loadingService.hide();
                        this.alertService.info(response.result);
                        this.cancel();
                     }else{
                        // this.alertService.info(response.result);
                        this.alertService.info('Selected SubLedger is Already Used In Transaction');
                     
                     }
                },error =>{
                    this.loadingService.hide();
                    this.alertService.info(error.result._body);
                }
            )
        }
}