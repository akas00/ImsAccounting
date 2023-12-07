import { Component } from '@angular/core';

//import { SmartTablesService } from './smartTables.service';
import { LocalDataSource } from 'ng2-smart-table';

import 'style-loader!./smartTables.scss';

import { SchemeSettingService } from './scheme-setting.service';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Product } from "../../../../common/interfaces/ProductItem";
import { Router } from '@angular/router';
@Component({
  selector: 'scheme-setting-list',
  templateUrl: './scheme-setting-list.template.html',
  providers: [SchemeSettingService],
})
export class SchemeSettingListComponent {
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
      MCODE: {
        title: 'MCode',
        type: 'string'
      },
      DESCA: {
        title: 'Product Category',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private masterService: MasterRepo, private _schemeSettingService: SchemeSettingService, private _router: Router) {
    let data: Array<Product> = [];
    //console.log({ salesTerminal: masterService })
    this.masterService.getSchemeList()
      .subscribe(res => {
        data.push(<Product>res);
        this.source.load(data);
      }, error => {
        this.masterService.resolveError(error, "scheme-setting-list - getSchemeList")
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
    this._router.navigate(["pages/configuration/scheme-setting/addScheme", { returnUrl: this._router.url }])
  }

  onEditClick(event): void {
    this._router.navigate(["pages/configuration/scheme-setting/addScheme", { MCode: event.data.MCODE, returnUrl: this._router.url }])
  }
}