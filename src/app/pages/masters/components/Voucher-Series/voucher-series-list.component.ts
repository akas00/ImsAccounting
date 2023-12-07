import { Component } from '@angular/core';
import {AuthService} from "../../../../common/services/permission/authService.service"


import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'voucher-series-list',
  templateUrl: './voucher-series-list.component.html',
  providers: [ AuthService],
  styleUrls: ["../../../modal-style.css", "./voucher-series-list.component.css"]
})
export class VoucherSeriesListComponent {
  voucherSeriesList:any[] = [];
  filter:any;
  userSetting:any;
 
  constructor(private masterService: MasterRepo, private _authService: AuthService, private router: Router, ) {
   this.masterService.getAllVoucherSeriesList().subscribe(
     (res)=>{
       ////console.log("voucher series", res);
       if (res.status === "ok"){
         this.voucherSeriesList = res.result? res.result:[];
       }else{
         this.voucherSeriesList = [];
       }
     }, err =>{
       this.voucherSeriesList = [];
     }
   );
   this.userSetting = this._authService.getSetting();
  }

  AddVoucher(){
    try {
      if(this.masterService.validateMasterCreation("create") == false){
        return;
      }
        this.router.navigate(["./pages/account/AccountLedger/voucher-series-master/add-voucher-series", { mode: "add", returnUrl: this.router.url }])
      
       } catch (ex) {
         //console.log(ex);
         alert(ex);
       }
  }


  onEditClick(voucher):void {
    try{
      if(this.masterService.validateMasterCreation("edit") == false){
        return;
      }
      this.router.navigate(["./pages/account/AccountLedger/voucher-series-master/add-voucher-series",{VseriesID: voucher.VSERIES_ID, mode: "edit", returnUrl:this.router.url}])
    } catch(ex){
      alert(ex);
    }
  }
  // onDeleteClick(voucher){
  //   if(this.masterService.validateMasterCreation("delete") == false){
  //     return;
  //   }
  // }

  onDeleteClick(voucher): void {
    // if(confirm("Are you sure you want to delete this item ?")){

      try {
        try {
          if(this.masterService.validateMasterCreation("delete") == false){
            return;
          }
            this.router.navigate(["./pages/account/AccountLedger/voucher-series-master/add-voucher-series", {VseriesID: voucher.VSERIES_ID, mode: "delete", returnUrl:this.router.url}]);
            } catch (ex) {
              console.log(ex);
              alert(ex);
            }
    
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
    
  // }

  }

  
  
}