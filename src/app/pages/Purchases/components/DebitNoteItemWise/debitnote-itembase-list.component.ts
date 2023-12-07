import { Component, Injector } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource, ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from "@angular/router";
import 'style-loader!./smartTables.scss';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { AppComponentBase } from '../../../../app-component-base';
import { PurchaseInvoiceService } from './purchaseinvoices.service';



@Component({
  selector: "debitnote-itembase-list",
  templateUrl: "./debitnote-itembase-list.component.html",
  //styleUrls: ["app/assets/css/styles.css"],
  providers: [PurchaseInvoiceService],
  styleUrls: ["../../../modal-style.css"],
})

export class DebitNoteItemBaseListComponent extends AppComponentBase {
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
    pager: {
      display: true,
      perPage: 10
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
  sub: Subscription;
  PhiscalObj: any = <any>{};

  constructor(private masterService: MasterRepo,
    private authService: AuthService,
    public injector: Injector,
    private router: Router, public dialog: MdDialog) {
    super(injector);
    try {
      this.PhiscalObj = authService.getPhiscalInfo();
      var PID = this.PhiscalObj.PhiscalID;
      PID = PID.replace("/", "ZZ");
      let apiUrl = `${this.apiUrl}/getTrnMainPagedList/DN/${PID}`;
      this.source =  this.source = new ServerDataSource(this._http, 
        { 
          endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        }); 

      // let data: Array<any> = [];
      // ////console.log("calling service")
      // this.sub = this.masterService.getTrnMainList("DN")
      //   .subscribe(res => {
      //     ////console.log({ purchaseData: res })
      //     data.push(<any>res);

      //     this.source.load(data);
      //   }, error => {
      //     //console.log({ error: error });
      //     this.masterService.resolveError(error, "debitnote-itembase - getTrnMainList");
      //   });
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }

  }
  setMode() { }
  onAddClick() {
    try {
      // if (this._authService.checkMenuRight("debitnoteitembase", "add") == true) {
      this.router.navigate(["/pages/transaction/inventory/purchases/debitnoteitembase/add-debitnote-itembase", { pf: 'DN', mode: "add", returnUrl: this.router.url }]);
      // } else {
      //   this.messageSubject.next("You are not authorized to add debit note item wise.")
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      // if (this._authService.checkMenuRight("debitnoteitembase", "edit") == true) {
      this.router.navigate(["/pages/transaction/inventory/purchases/debitnoteitembase/add-debitnote-itembase", { pf: 'DN', vchr: event.data.VCHRNO, div: event.data.DIVISION, fid: event.data.PhiscalId, mode: "edit", returnUrl: this.router.url }]);
      // } else {
      //   this.messageSubject.next("You are not authorized to edit debit note item wise.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      // if (this._authService.checkMenuRight("debitnoteitembase", "view") == true) {
      this.router.navigate(["/pages/transaction/inventory/purchases/debitnoteitembase/add-debitnote-itembase", { pf: 'DN', vchr: event.data.VCHRNO, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view", returnUrl: this.router.url }])
      // } else {
      //   this.messageSubject.next("You are not authorized to view debit note item wise.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });

  }
}