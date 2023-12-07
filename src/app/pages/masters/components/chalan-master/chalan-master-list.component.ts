import { Component, Injector } from "@angular/core";
import { AppComponentBase } from "../../../../app-component-base";
import {  LocalDataSource } from "ng2-smart-table";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { MdDialog } from "@angular/material";
import 'style-loader!./smartTables.scss';
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { MasterRepo } from "../../../../common/repositories";

@Component({
    selector:'chalan-master-list',
    templateUrl: 'chalan-master-list.html',
    styleUrls: ["../../../Style.css","../../../modal-style.css","./chalan-master-list.component.css"]
})
export class ChalanMaserListComponent extends AppComponentBase {


    settings = {
        mode: 'external',
        add: {
          addButtonContent: '',
          createButtonContent: '<i class="ion-checkmark"></i>',
          cancelButtonContent: '<i class="ion-close"></i>',
        },
        // view: {
        //   viewButtonContent: 'View',
        //   saveButtonContent: '<i class="ion-checkmark"></i>',
        //   cancelButtonContent: '<i class="ion-close"></i>',
        // },
        edit: {
          editButtonContent: '<button type="button" class="btn btn-info">Edit</button>',
          saveButtonContent: '<i class="ion-checkmark"></i>',
          cancelButtonContent: '<i class="ion-close"></i>',
        },
        delete: {
          deleteButtonContent: ' ',
          confirmDelete: true
        },
        pager:{
          display:true,
          perPage:10
        },
        columns: {
        VName: {
            title: 'voucher Name',
            type: 'string'
          }, 
          Series: {
            title: 'Series',
            type: 'string'
          },
          VType: {
            title: 'Prefix',
            type: 'string'
    
          },
        //   Status: {
        //     title: 'Status',
        //     type: 'string',
        //     valuePrepareFunction: (value) => { return value==1?'Active':'InActive'; },
        //     filter: {
        //       type: 'list',
        //         config: {
        //           selectText: 'Show all',
        //             list: [
        //               { value: 1, title: 'Active' },
        //               { value: 0, title: 'InActive' },
        //             ]
        //           }
        //         }
        //   }
          
        }
      };
      source: LocalDataSource = new LocalDataSource();
      messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
      message$: Observable<string> = this.messageSubject.asObservable();
      filter: any;

      constructor(
        //private _authService: AuthService, 
        private router: Router, 
        public dialog: MdDialog,
        public injector : Injector,
        public masterService:MasterRepo
        ) {
          super(injector);
        try { 
       
         
            this.masterService.getAllVoucherList().subscribe(
              (res) =>{
                let data = [];
                data = res.result;
                this.source.load(data);
                // ////console.log("chalan list",this.source);
              }
            )
    
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }
      }
      newChalan(): void {
        if(this.masterService.validateMasterCreation("create") == false){
          return;
        }
        try {
         
            this.router.navigate(["./pages/account/AccountLedger/chalan-master/add-chalan", { mode: "add", returnUrl: this.router.url }])
     
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }
      }
      onEditClick(event): void {
        if(this.masterService.validateMasterCreation("edit") == false){
          return;
        }
        try {
        this.router.navigate(["./pages/account/AccountLedger/chalan-master/add-chalan", { VName: event.VName, mode: "edit", returnUrl: this.router.url }]);
          
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }
      }
    
      onViewClick(event): void {
        try {
         // this.router.navigate(["pages/masters/Branch", { name: event.data.BRANCHID, mode: "view", returnUrl: this.router.url }]);
          if (this._authService.checkMenuRight("BranchList", "view") == true) {
            this.router.navigate(["./pages/masters/Branch", { mode: "view", returnUrl: this.router.url }])
          } else {
            this.messageSubject.next("You are not authorized to View new company.");
            this.openAuthDialog();
          }
        
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }
      }
      onDeleteClick(chalan){
        if(this.masterService.validateMasterCreation("delete") == false){
          return;
        }
      }
      onDeleteConfirm(event): void {
        
        if (window.confirm('Are you sure you want to delete?')) {
          event.confirm.resolve();
        } else {
          event.confirm.reject();
        }
      }
    
      openAuthDialog() {
        var message = { header: "Information", message: this.message$ };
        this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
      }
}