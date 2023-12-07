import { Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup,FormArray, FormControl, Validators} from '@angular/forms';
  import { PagedListingComponentBase } from "../../../paged-list-component-base";
  import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
  import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { ActivatedRoute } from "@angular/router";
import { result } from 'lodash';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { AuthService } from '../../../../common/services/permission/authService.service';


@Component({
    selector: "manualsync",
    templateUrl: "./manual-sync.component.html",
    styleUrls: ["../../../modal-style.css"]
})

export class ManualSyncComponent{
    form: FormGroup;
    submitted = false;
    showSyncPopup:boolean;
    synclist: Array<any> = [
        {name:'Product',value:'product'},
        {name:'Party',value:'party'},
        {name:'Purchase',value:'purchase'},
        {name:'Sales',value:'sales'},
        {name:'Inventory',value:'inventory'},
       

    ]
    userSetting: any;


    constructor(public masterService: MasterRepo,
        public _trnMainService: TransactionService,
        private fb: FormBuilder,
        private alertService: AlertService,
        private loadingService: SpinnerService,
        private authService: AuthService,){
        this.showSyncPopup=true;
        // this.SyncPopup.show();
        this.masterService.getLastSyncDate().subscribe((res:any)=>{
          if(res.status == "ok"){
            //console.log("@@res.result",res.result)
            if(res.result){
              for(let i of res.result){
                if(i.TABLENAME == 'TRNMAIN_DOWNLOAD'){
                  this.synclist.push({name:'Sales',value:'sales',lastsyndate:i.DATE})
                }
                if(i.TABLENAME == 'PURMAIN_DOWNLOAD'){
                  this.synclist.push({name:'Purchase',value:'PURCHASE',lastsyndate:i.DATE})
                }
                if(i.TABLENAME == 'INVMAIN_DOWNLOAD'){
                  this.synclist.push({name:'Inventory',value:'inventory',lastsyndate:i.DATE})
                }
                if(i.TABLENAME == 'ACC_DOWNLOAD'){
                  this.synclist.push({name:'Account',value:'ACCMAIN',lastsyndate:i.DATE})
                }
              }
            }
  
          }
         
        })
        // ////console.log("@@synclist",this.synclist)
        this.userSetting = authService.getSetting();

    }
    ngOnInit(){
        this.form= this.fb.group({
            syncArray: this.fb.array([])
        })
    }

    onCheckboxChange(e) {
        const syncArray: FormArray = this.form.get('syncArray') as FormArray;
      
        if (e.target.checked) {
          syncArray.push(new FormControl(e.target.value));
        } else {
          let i: number = 0;
          syncArray.controls.forEach((item: FormControl) => {
            if (item.value == e.target.value) {
              syncArray.removeAt(i);
              return;
            }
            i++;
          });
        }
      }

    onSubmit(){
      try{
        this.submitted = true;
        this.loadingService.show("Syncing data, please wait...");
        let bodyData = this.form.value.syncArray;
        ////console.log("@submitted", this.form.value.syncArray);

        if(this.form.invalid){
            return;
        }
        
        
        this.masterService.masterPostmethod("/AccountSyncService",bodyData).subscribe(
            data => {
              ////console.log("data result", data);
              this.loadingService.hide();
              if(data.status == "ok"){
                this.alertService.success(data.result)
                this.form.value.syncArray = [];
                this.closeModal();
              }
              else{
                this.alertService.error(data.result)
                this.closeModal();
              }
            },
            error=>{
                ////console.log("error",error);
                this.loadingService.hide();
                this.alertService.error(error);
            }
        );
      }catch(e){
        this.alertService.error(e);
        this.closeModal();
      }
    }

    closeDialog() {
        this.showSyncPopup=false;
      }

      closeModal() {
        this.showSyncPopup = false;
      }
    
}