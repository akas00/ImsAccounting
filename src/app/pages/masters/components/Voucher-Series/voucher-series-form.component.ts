import { Component } from '@angular/core';
import { AuthService } from '../../../../common/services/permission/authService.service';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
 
@Component({
  selector: 'add-voucher-series',
  templateUrl: './voucher-series-form.component.html',
  providers: [ AuthService],
  styleUrls: ["../../../modal-style.css", "./voucher-series-form.component.css"]
})
export class VoucherSeriesFormComponent {
  voucherTypeList: any[] = [];
  
  voucherObj: VoucherObj = <VoucherObj>{}
  returnUrl: string;
  mode:string = "New";
  modeTitle:string = '';
  VoucherId:string;

 
  constructor(private masterService: MasterRepo,
    private loadingService: SpinnerService,
     private _authService: AuthService,
      private router: Router , 
      private alertService: AlertService, 
      private loader: SpinnerService,
      private _activatedRoute: ActivatedRoute) {
    this.getVoucherTypeList();

    try{
      if(!! this._activatedRoute.snapshot.params['returnUrl']){
        this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
      }
      if(!!this._activatedRoute.snapshot.params['VseriesID']){
        let vseriesID: string = "";
        vseriesID = this._activatedRoute.snapshot.params['VseriesID'];

        this.masterService.getVoucherSeriesByName(vseriesID)
        .subscribe(data=>{
          ////console.log("edit voucher", data);
          if(data.status == 'ok'){
            this.voucherObj.vType = data.result[0].VOUCHER_ID;
            this.voucherObj.seriesName = data.result[0].VSERIES_NAME;
            this.voucherObj.seriesPrefix = data.result[0].VSERIES_ID;
            this.mode = 'edit';
            this.modeTitle = "Edit Voucher"
          }
          else{
            this.mode = '';
            this.modeTitle = "Edit-Error in Voucher"
          }
        }, error =>{
          this.mode = '';
        });

      }else{
        this.mode="New";
        this.modeTitle="Add Voucher"
      }
    }catch(ex){
      alert(ex);
    }


    
  }

  getVoucherTypeList(){
    this.masterService.getVoucherTypeList().subscribe((res:any)=>{
      if(res.status == "ok"){
        this.voucherTypeList = res.result.result? res.result.result :[];
        ////console.log("voucher type list", this.voucherTypeList);

      }else{
        this.voucherTypeList = []
      }
    },err=>{
      this.voucherTypeList = [];
    });
  }

  cancel(){
    this.router.navigate(["pages/account/AccountLedger/voucher-series-master"]);
  }

save(){
  ////console.log("voucher onj after save", this.voucherObj);
  if(this.voucherObj.seriesName==''||this.voucherObj.seriesName==undefined||this.voucherObj.seriesName==null){
    alert("Series Name cannot be  empty")
    return;
  }
  if(this.voucherObj.seriesPrefix==''||this.voucherObj.seriesPrefix==undefined||this.voucherObj.seriesPrefix==null){
    alert("Prefix cannot be empty")
  return;
  }
  if(this.voucherObj.seriesPrefix.trim()==""){
    alert("Prefix cannot be  empty")
    return;
  }

  if(this.voucherObj.seriesName.trim()==""){
    alert("Series Name cannot be  empty")
    return;
  }
  if(this.voucherObj.seriesPrefix.length>2){
    alert("Only two letters can be entered in prefix")
  return;
  } 

  if(this.voucherObj.vType==''||this.voucherObj.vType==undefined||this.voucherObj.vType==null){
    alert("Voucher Type cannot be empty")
    return;
  }
  this.loader.show("Saving data. Please wait...");
  this.masterService.saveVoucherSeries(this.mode, this.voucherObj).subscribe(
    (res:any)=>{
      if(res.status == "ok"){
        this.loader.hide();
        this.alertService.success("Data Saved Successfully !");
        setTimeout(() => {
          this.loader.hide();
          this.router.navigate([this.returnUrl]);
      }, 1000)
      }else{
        this.loader.hide();
        this.alertService.error("Data cannot be saved.")
      }
    }, err =>{
        this.loader.hide();
        this.alertService.error(err);
    }
  );

}

onDelete(){
  this.loadingService.show("Data is Saving ..")
  this.voucherObj.seriesName=this.VoucherId;
  this.masterService.deleteVoucherSeriesMaster(this.mode, this.voucherObj).subscribe(
      (response) =>{
           if(response.status == 'ok'){
              this.loadingService.hide();
              this.alertService.info(response.result);
              this.cancel();
           }else{
              this.loadingService.hide();
           }
      },error =>{
          this.loadingService.hide();
          this.alertService.info(error.result._body);
      }
  )
}

  
  
}

export  interface VoucherObj{
  vType: string,
  seriesName: string,
  seriesPrefix: string

}

