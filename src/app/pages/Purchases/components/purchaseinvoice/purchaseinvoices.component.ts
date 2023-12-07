import { Component, Injector } from '@angular/core';
import { LoginDialog } from "./../../../modaldialogs/logindialog/logindialog.component";
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource, ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from "@angular/router";
import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { PurchaseInvoiceService } from './purchaseinvoices.service';
import {MdDialog, MdDialogRef} from '@angular/material';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { Subscription } from "rxjs/Subscription";
import { AppComponentBase } from '../../../../app-component-base';
@Component({
  selector: 'purchaseinvoices',
  templateUrl: './purchaseinvoices.component.html',
  providers: [PurchaseInvoiceService],
  styleUrls: ["../../../modal-style.css"],
})
export class PurchaseInvoices extends AppComponentBase{
  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    view: {
      viewButtonContent: 'View',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '',
      confirmDelete: true
    },
    pager:{
      display:true,
      perPage:10
    },
    columns: {
      VCHRNO: {
        title: 'Voucher No.',
        type: 'string'
      },
      DIVISION: {
        title: 'Division',
        type: 'string'
      },
      TRNAC: {
        title: 'Trn. A/c',
        type: 'string'
      },
      PhiscalId: {
        title: 'Fiscal Year',
        type: 'string'
      },
      TRNDATE: {
        title: 'Date',
        type: 'string'
      },
      BSDATE: {
        title: 'Miti',
        type: 'string'
      }
    }
  };
  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  sub:Subscription;
  PhiscalObj: any = <any>{};

  constructor(private PIService: PurchaseInvoiceService, 
    public dialog: MdDialog, 
    private authService: AuthService, 
    public injector : Injector,
    private router: Router, private masterRepService: MasterRepo) {
      super(injector);
    try {
      this.PhiscalObj = authService.getPhiscalInfo();
      var PID = this.PhiscalObj.PhiscalID;
      PID = PID.replace("/", "ZZ");
      let apiUrl = `${this.apiUrl}/getTrnMainPagedList/PI/${PID}`;
      this.source =  this.source = new ServerDataSource(this._http, 
        { 
          endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        }); 

      // let data: Array<any> = [];
      // this.sub= this.masterRepService.getTrnMainList("PI")
      //   .subscribe(res => {
      //     data.push(<any>res);

      //     this.source.load(data);
      //   }, error => {
      //     //console.log({ error: error });
      //     this.masterRepService.resolveError(error, "purchaseinvoices - getTrnMainList");
      //   });
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  setMode() { }
  onAddClick() {
    try {
      this.router.navigate(["/pages/transaction/inventory/purchases/purchaseinvoice/add-purchase-invoice", { mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onEditClick(event): void {
    try {
      this.router.navigate(["/pages/transaction/inventory/purchases/purchaseinvoice/add-purchase-invoice", { vchr: event.data.VCHRNO, returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit" }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate(["/pages/transaction/inventory/purchases/purchaseinvoice/add-purchase-invoice", { vchr: event.data.VCHRNO, mode: "view", returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  
  openAuthDialog() {
      var message = {header: "Information", message: this.message$};
      this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

  onDeleteConfirm(event): void { }
}