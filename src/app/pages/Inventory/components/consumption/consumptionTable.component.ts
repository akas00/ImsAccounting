import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { Component } from '@angular/core';

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';

import { Router } from '@angular/router';

@Component({
  selector: 'ComsumptionService',
  templateUrl: './consumptionTable.html',
 
})
export class consumptionTableComponent {
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
      physicalstock: {
        title: 'Physical Stock',
        type: 'number'
      },
      KANDBWASTAGE: {
        title: 'Variance',
        type: 'number'
      },
      Warehouse: {
        title: 'Warehouse',
        type: 'string'
      },
      LastStockCountDate: {
        title: 'Last Stock Date',
        type: 'date'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private masterRepo: MasterRepo,private _router: Router) {
    let data: Array<any> = [];
   
    this.masterRepo.getAllConsumption()
      .subscribe(res => {
        data.push(<any>res);
       
      }, error => {
        this.masterRepo.resolveError(error, "scheme-setting-list - getSchemeList")
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
    this._router.navigate(["pages/inventory/ConsumptionEntry", { mode: "add",returnUrl: this._router.url }])
  }

  onEditClick(event): void {
    this._router.navigate(["pages/inventory/ConsumptionEntry", { initial: event.data.VchrNo,mode: "edit", returnUrl: this._router.url }])
  }
}