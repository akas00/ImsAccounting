import { Component } from "@angular/core";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { MasterRepo } from "../../../../../common/repositories";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ChalanMasterService } from "../chalan-master.service";

@Component({
    selector:'add-chalan',
    templateUrl: './add-chalan-master.html',
    providers: [ChalanMasterService],
})

export class AddChalanComponent{
    form: FormGroup;
    voucherTypeList:any[] = [];
    chalanMasterObj:any = <any>{};
    returnUrl :string;
    mode:string = 'New';
    modeTitle: string = '';
    
    constructor(   private alertService: AlertService,
        private loadingService: SpinnerService,
        protected masterService: MasterRepo,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        public _chalanSeries: ChalanMasterService,
        private fb: FormBuilder){
            this.getVoucherTypeList()    
            
            try {
                this.router = router;
                if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                    this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
                }
                if (!!this._activatedRoute.snapshot.params['VName']) {
                    let VName: string = "";
                    VName = this._activatedRoute.snapshot.params['VName'];
    
                    this._chalanSeries.getChalanByVname(VName)
                        .subscribe(data => {
                            if (data.status == 'ok') {
                                this.chalanMasterObj.VName=data.result?data.result[0].VName: '',
                                this.chalanMasterObj.VType=data.result?data.result[0].VType: '',
                                
                                this.mode = 'edit';
                                this.modeTitle = "Edit Chalan";
    
                            }
                            else {
                                this.mode = '';
                                this.modeTitle = "Edit -Error in Chalan";
                            }
                        }, error => {
                            this.mode = '';
                        }
                        )
                }
                else {
                    this.mode = "New";
                    this.modeTitle = "Add Chalan";
    
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
            this.returnUrl = "pages/account/AccountLedger/chalan-master"
            this.router.navigate([this.returnUrl]);
        }

        onSave(){
            ////console.log("mdmd",this.mode,this.chalanMasterObj);
            this.loadingService.show("Data is Saving ..")
            this._chalanSeries.saveChalaMaster(this.mode, this.chalanMasterObj).subscribe(
                (response) =>{
                     if(response.status == 'ok'){
                        this.loadingService.hide();
                        this.alertService.info(response.result);
                        this.router.navigate([this.returnUrl]);
                    }else{
                        this.loadingService.hide();
                     }
                },error =>{
                    this.loadingService.hide();
                }
            )
        }
}