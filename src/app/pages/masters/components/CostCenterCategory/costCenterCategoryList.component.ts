import { Component } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { AuthService } from "../../../../common/services/permission";
import { Router } from "@angular/router";
import { CostCenterCategory } from "../../../../common/interfaces";
import { LocalDataSource } from "ng2-smart-table";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { TransitionCheckState } from "@angular/material";

@Component({
    selector: 'CostCenterCategoryListSelector',
    templateUrl: './costCenterCategoryList.component.html',
    providers: [],
    styleUrls: ["../../../modal-style.css", "./costCenterCategory.component.scss"]
  })
  export class CostCenterCategoryListComponent {
    source: LocalDataSource = new LocalDataSource();
    filter:any;
    constructor(private masterService: MasterRepo, private _authService: AuthService,private router: Router,private alertService: AlertService){

   this.getAllCostCenterGroupList()



    }

    // }

    AddCostCategoryCenter() {
      try {
        if(this.masterService.validateMasterCreation("create") == false){
          return;
        }
       this.router.navigate(["./pages/account/AccountLedger/cost-center-category/add-cost-category-center", { mode: "add", returnUrl: this.router.url }])
  
       
     
      } catch (ex) {
        //console.log(ex);
        alert(ex);
      }
    }

    onEditClick(event): void {
      try {
        if(this.masterService.validateMasterCreation("edit") == false){
          return;
        }
        this.router.navigate(["./pages/account/AccountLedger/cost-center-category/add-cost-category-center", { COSTCENTERGROUPNAME: event.COSTCENTERGROUPNAME,DIVISION:event.DIVISION, mode: "edit", returnUrl: this.router.url }]);
        // if (this._authService.checkMenuRight("cost-center", "add") == true) {
        //   this.router.navigate(["./pages/account/AccountLedger/cost-center/add-cost-center", { costcenterName: event.COSTCENTERNAME, mode: "edit", returnUrl: this.router.url }]);
        // } else {
        //   this.messageSubject.next("You are not authorized to Edit.");
        //   this.openAuthDialog();
        // } 
  
      } catch (ex) {
        //console.log(ex);
        alert(ex);
      }
    }
    onViewClick(event){
      this.router.navigate(["./pages/account/AccountLedger/cost-center-category/add-cost-category-center", { COSTCENTERGROUPNAME: event.COSTCENTERGROUPNAME,DIVISION:event.DIVISION, mode: "view", returnUrl: this.router.url }]);
    }
    onDeleteClick(event){
      try {
        try {
          if(this.masterService.validateMasterCreation("delete") == false){
            return;
          }
          this.masterService.deleteCostCenterGroup(event.ccgid).subscribe(
              (response) =>{
                   if(response.status == 'ok'){
                      this.alertService.info(response.result);
                      this.getAllCostCenterGroupList()
                   }
              },error =>{
                console.log(error)
                  this.alertService.info(error._body);
              }
          )
            } catch (ex) {
              //console.log(ex);
              alert(ex);
            }
    
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
    }

   
  
      getAllCostCenterGroupList(){
        try {
          let data: Array<CostCenterCategory> = [];
       
          this.masterService.getAllCostCenterGroupList()
            .subscribe((res:any) => {
              console.log("cost getAllCostCenterGroupList",res)
              data=res;
              this.source.load(data);
        
            }, error => {
              this.alertService.info(error.result._body);
              //console.log(error);
            }
    
            );
    
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }
  
      }
   
  }