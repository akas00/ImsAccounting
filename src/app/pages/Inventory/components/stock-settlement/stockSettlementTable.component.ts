import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { Component, Injector } from '@angular/core';

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource, ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';

import { Router } from '@angular/router';
import { TrnMain } from '../../../../common/interfaces/TrnMain';
import { AppComponentBase } from '../../../../app-component-base';
import { AuthService } from '../../../../common/services/permission/authService.service';

@Component({
  selector: 'StockSettlementTable',
  templateUrl: './stockSettlementTable.html',
 
})
export class StockSettlementTableComponent extends AppComponentBase{
  query: string = '';

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
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
      saveButtonContent: '',
      cancelButtonContent: '',
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
        title: 'Voucher No',
        type: 'string'
      },
      TRNDATE: {
        title: 'Entry Date',
        type: 'Date'
      },
      TRN_DATE: {
        title: 'Transaction Date',
        type: 'Date'
      },
      DIVISION: {
        title: 'Division',
        type: 'string'
      }
    }
  };

  source: ServerDataSource;
  PhiscalObj: any = <any>{};

  constructor(private masterService: MasterRepo, public injector : Injector, private _router: Router,
    private authService: AuthService) {
    super(injector);
    try {
      this.PhiscalObj = authService.getPhiscalInfo();
      var PID = this.PhiscalObj.PhiscalID;
      PID = PID.replace("/", "ZZ");
      let apiUrl = `${this.apiUrl}/getTrnMainPagedList/DM/${PID}`;
      this.source =  this.source = new ServerDataSource(this._http, 
        { 
          endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        }); 

      //let data: Array<TrnMain> = []; 
      // //this.service.getJournalList()
      // this.masterService.getTrnMainList('DM')
      //   .subscribe(res => {
      //     data.push(<TrnMain>res);
      //    // //console.log({ getTrnmain: res });
      //   }, error => {
      //     this.masterService.resolveError(error, "stock settlement-list - getTrnMainList");
      //   },
      //   () => {
      //     this.source.load(data);
      //     //console.log({ getTrnMainList: 'comlete', data: data })
      //   }

      //   );
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onAddClick() {
    this._router.navigate(["pages/transaction/inventory/StockSettlementEntry", { mode: "NEW",returnUrl: this._router.url }])
  }

  onEditClick(event): void {
    this._router.navigate(["pages/transaction/inventory/StockSettlementEntry", { vchr: event.data.VCHRNO,mode: "EDIT", returnUrl: this._router.url,div: event.data.DIVISION, phiscal: event.data.PHISCALID}])
  }
  onViewClick(event): void {
    try {
      // if (this._authService.checkMenuRight("stock-issue", "view") == true) {
        this._router.navigate(["pages/transaction/inventory/StockSettlementEntry", { vt: 9, vchr: event.data.VCHRNO, returnUrl: this._router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view" }])
      // } else {
      //   this.messageSubject.next("You are not authorized to view stock issue.");
      //   this.openAuthDialog();
      // }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
}}