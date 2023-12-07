import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { AppComponentBase } from "../../../../app-component-base";
import {  LocalDataSource } from "ng2-smart-table";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { MdDialog } from "@angular/material";
import 'style-loader!./smartTables.scss';
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { MasterRepo } from "../../../../common/repositories";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { AuthService } from "../../../../common/services/permission/authService.service";

@Component({
    selector:'sub-master-list',
    templateUrl: 'subledger-master-list.component.html',
    styleUrls: ["../../../Style.css","../../../modal-style.css","./subledger-master-list.component.css"]
})
export class SubLedgerMasterListComponent extends AppComponentBase implements OnInit {
  FormName : ExportLedgerFilterDto = <ExportLedgerFilterDto>{};
  userSetting:any;

    settings = {
        mode: 'external',
        add: {
          addButtonContent: '',
          createButtonContent: '<i class="ion-checkmark"></i>',
          cancelButtonContent: '<i class="ion-close"></i>',
        },
        view: {
          viewButtonContent: '<button type="button" class="btn btn-info">View</button>',
          saveButtonContent: '<i class="ion-checkmark"></i>',
          cancelButtonContent: '<i class="ion-close"></i>',
        },
        edit: {
          editButtonContent: '<button type="button" class="btn btn-info">Edit</button>',
          saveButtonContent: '<i class="ion-checkmark"></i>',
          cancelButtonContent: '<i class="ion-close"></i>',
        },
        delete: {
          deleteButtonContent: '<button type="button" class="btn btn-info">Delete</button>',
          confirmDelete: true
        },
        pager:{
          display:true,
          perPage:10
        },
        columns: {
        SL_ACID: {
            title: 'ACID',
            type: 'string'
          }, 
          SL_ACNAME: {
            title: 'ACNAME',
            type: 'string'
          },        
        }
      };
      source: LocalDataSource = new LocalDataSource();
      messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
      message$: Observable<string> = this.messageSubject.asObservable();
      subLedgerList:any[] = [];
      filter:any;
      @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
      fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
    
    
      constructor(
        public _authService: AuthService, 
        private router: Router, 
        public dialog: MdDialog,
        public injector : Injector,
        public masterService:MasterRepo,
        ) {
          super(injector);
        try { 
       
         
            this.masterService.getAllSubLedger().subscribe(
              (res) =>{
                let data = [];
                this.subLedgerList = res.result;
                ////console.log("sub ledger list",this.subLedgerList);
                data = res.result;
                this.source.load(data);
              }
            )
    
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }

        this.userSetting = this._authService.getSetting();
      }
      newSubLedger(): void {
        try {
          if(this.masterService.validateMasterCreation("create") == false){
            return;
          }
            this.router.navigate(["./pages/account/AccountLedger/subledger-master/add-subledger", { mode: "add", returnUrl: this.router.url }])
     
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }
      }
      onEditClick(subledger): void {
        try {
          if(this.masterService.validateMasterCreation("edit") == false){
            return;
          }
        this.router.navigate(["./pages/account/AccountLedger/subledger-master/add-subledger", { ACID: subledger.SL_ACID, mode: "edit", returnUrl: this.router.url }]);
          
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }
      }
    
      onViewClick(subledger): void {
        try {
            try {
                this.router.navigate(["./pages/account/AccountLedger/subledger-master/add-subledger", { ACID: subledger.SL_ACID, mode: "view", returnUrl: this.router.url }]);
                } catch (ex) {
                  //console.log(ex);
                  alert(ex);
                }
        
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }
      }

        
      onDeleteClick(subledger): void {
        try {
            try {
              if(this.masterService.validateMasterCreation("delete") == false){
                return;
              }
                this.router.navigate(["./pages/account/AccountLedger/subledger-master/add-subledger", { ACID: subledger.SL_ACID, mode: "delete", returnUrl: this.router.url }]);
                } catch (ex) {
                  //console.log(ex);
                  alert(ex);
                }
        
        } catch (ex) {
          //console.log(ex);
          alert(ex);
        }
      }

      onDeleteConfirm(event): void {
          ////console.log("@@abcd")
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

      ExportSubledger(){
        this.FormName.data = "Subledger";
        let filterObjData = {data: this.FormName,filtername : "AllSubledgerList"}
        this.masterService.getExcelFile('/getAllLegerList',filterObjData).subscribe(
          data => {
            this.masterService.downloadFile(data);
          },
          error => {
          }
        )
      }

      
  ExcelUploadPartyLedger(){
    this.fileUploadPopup.show();
  }
  ngOnInit() {

    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Sub Ledger Excel Upload",
        sampleFileUrl: `/downloadSampleFile/SUBLEDGER`,
        uploadEndpoints: `/masterImport/SUBLEDGER`,
        allowMultiple: false,
        acceptFormat: ".xlsx",
        filename: `SUBLEDGER`,
        // note : ''
      });

  }

  fileUploadSuccess(uploadedResult) {
    if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
      return;
    }
  }
}

export interface  ExportLedgerFilterDto{
  data: string;
  filtername: string;
}