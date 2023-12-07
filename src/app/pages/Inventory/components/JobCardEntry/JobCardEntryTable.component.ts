import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { Component } from '@angular/core';

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';

import { Router } from '@angular/router';
import { JobCardService } from './jobcard.service';

@Component({
  selector: 'JobCardEntryTable',
  templateUrl: './JobCardEntryTable.html',
  providers: [JobCardService],
  
})
export class JobCardEntryTableComponent {
  query: string = '';

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      VREGNO: {
        title: 'Vehicle No',
        type: 'number'
      },
      BRAND: {
        title: 'BRAND',
        type: 'date'
      },
      MODEL: {
        title: 'MODEL',
        type: 'string'
      },
      NAME: {
        title: 'Customer Name',
        type: 'number'
      },
      ADDRESS: {
        title: 'Address',
        type: 'number'
      },
      DELDATE: {
        title: 'Delivery Date',
        type: 'number'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private _JCService: JobCardService,private _router: Router) {
    let data: Array<any> = [];
   
    this._JCService.getTableList()
      .subscribe(res => {
        data.push(<any>res);
       ////console.log("DATA",res)
      }, error => {
        this._JCService.resolveError(error, "JobCard - GetJobCardList")
      },()=>{
        this.source.load(data);
      }

      );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onAddClick() {
    this._router.navigate(["pages/inventory/JobCardEntry", { mode: "add",returnUrl: this._router.url }])
  }

  onEditClick(event): void {
    this._router.navigate(["pages/inventory/JobCardEntry", { vchr: event.data.JOBNO,mode: "edit", returnUrl: this._router.url}])
  }
}