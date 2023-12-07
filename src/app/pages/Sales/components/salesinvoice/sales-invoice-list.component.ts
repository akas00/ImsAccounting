import { Component, Injector } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource, ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from "@angular/router";
import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { CookieService } from 'angular2-cookie/core';
import { Subscription } from "rxjs/Subscription";
import { VoucherTypeEnum } from '../../../../common/interfaces/TrnMain';
import { AppComponentBase } from '../../../../app-component-base';

@Component({
  selector: 'sales-invoice-list',
  templateUrl: './sales-invoice-list.component.html',
  providers: [],
  styleUrls: ["../../../modal-style.css"],
})
export class SalesInvoiceListComponent  extends AppComponentBase{
  childModal: any;
  DialogMessage: string;
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
      }
    }
  };
  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  sub:Subscription;
  trnMainList:any[]=[];
  PhiscalObj: any = <any>{};

  constructor(
    private authService: AuthService, 
    public injector : Injector,
    private router: Router, private masterService: MasterRepo,
    public dialog: MdDialog, private _cookieService: CookieService) {
      super(injector);
      try {
        this.PhiscalObj = authService.getPhiscalInfo();
        var PID = this.PhiscalObj.PhiscalID;
        PID = PID.replace("/", "ZZ");
        let apiUrl = `${this.apiUrl}/getTrnMainPagedList/TI/${PID}`;
        this.source =  this.source = new ServerDataSource(this._http, 
          { 
            endPoint: apiUrl, 
            dataKey : "data", 
            pagerPageKey : "currentPage",
            pagerLimitKey : "maxResultCount"
          }); 
    //   let data: Array<any> = [];
    //  this.sub= this.masterService.getTrnMainList("TI")
    //     .subscribe(res => {
    //       data.push(<any>res);
    //       this.source.load(data);
    //     }, error => {
    //       this.masterService.resolveError(error, "salesinvoices - getTrnMainList");
    //     });
    } catch (ex) {
      //console.log(ex);
      alert(ex);

    }
  }
  setMode() { }
  onAddClick(event) {
    try {
      // if (this._authService.checkMenuRight("salesinvoice", "add") == true) {

        // this.router.navigate(["/pages/sales/salesinvoice/add-sales-invoice", { mode: "add", returnUrl: this.router.url }]);
        this.router.navigate(["/pages/transaction/inventory/sales/salesinvoice/add-sales-invoice", { mode: "add", returnUrl: this.router.url,pmode:"p" ,vt:VoucherTypeEnum.TaxInvoice}]); 
        return;
        // var cookie = this._cookieService.get("imsposcookie");
        // let Allow = false;
        // let message = "Please Wait....";
        // if (cookie != null) {
        //   var J = JSON.parse(cookie);
        //   this.masterService.getSingleObject({ VATNo: J.VATNo, TerminalNo: J.TerminalNo, ComputerId: J.ComputerId }, '/getClientTerminal')
        //     .subscribe(data => {
        //       if (data.status == 'ok') {
        //         ////console.log("subscrib1");
        //         if (data.result == null) { ////console.log("subscrib2"); message = "Please Register this Terminal. Thank you..."; Allow = false; }
        //         else {
        //           if (data.result.Allow == 1) {
        //             ////console.log("subscrib3");
        //             Allow = true;
        //           }
        //           else {
        //             ////console.log("subscrib4");
        //             message = "This Terminal is not authorize For this function";
        //             Allow = false;
        //           }
        //         }
        //       }
        //       else {
        //         ////console.log("subscrib5");
        //         Allow = false;
        //         alert(data.result);
        //       }
        //       ////console.log("subscrib6");
        //       if (Allow == true) { this.router.navigate(["/pages/sales/salesinvoice/add-sales-invoice", { mode: "add", returnUrl: this.router.url,pmode:"p" }]); }
        //       else {
        //       this.DialogMessage = message;
        //         this.messageSubject.next(this.DialogMessage);
        //         this.openAuthDialog();
        //         // this.childModal.show();
        //       }
        //     }
        //     )
        // }
        // else {
        //   this.DialogMessage = "Please create a Terminal Cookie.Thank you...";
        //   this.messageSubject.next(this.DialogMessage);
        //   this.openAuthDialog();
        // }


      // } else {
      //   this.messageSubject.next("You are not authorized to add sales invoice.");
      //   this.openAuthDialog();
      // }


    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      // if (this._authService.checkMenuRight("salesinvoice", "edit") == true) {
        this.router.navigate(["/pages/transaction/inventory/sales/salesinvoice/add-sales-invoice", { vchr: event.data.VCHRNO, returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit",pmode:"p" }]);
      // } else {
      //   this.messageSubject.next("You are not authorized to edit sales invoice.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      // if (this._authService.checkMenuRight("salesinvoice", "view") == true) {
        this.router.navigate(["/pages/transaction/inventory/sales/salesinvoice/add-sales-invoice", { vchr: event.data.VCHRNO, returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID,vt:VoucherTypeEnum.TaxInvoice,mode: "view",pmode:"p"  }])
      // } else {
      //   this.messageSubject.next("You are not authorized to view sales invoice.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onDeleteConfirm(event): void { }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }
  onAddDirectSalesClick(event){
    try{
//  if (this._authService.checkMenuRight("salesinvoice", "add") == true) {
   this.router.navigate(["/pages/transaction/inventory/sales/salesinvoice/add-sales-invoice", { mode: "add", returnUrl: this.router.url,pmode:"c" }]);
//  }
//  else {
//         this.messageSubject.next("You are not authorized to add sales invoice.");
//         this.openAuthDialog();
//       }
       } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
}
