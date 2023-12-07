import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'

//import { SmartTablesService } from './smartTables.service';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
// import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { CompanyService } from './company.service'
import { Company } from "../../../../common/interfaces/CompanyInfo.interface";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
@Component({
  selector: 'companyListSelector',
  templateUrl: './companyList.component.html',
  providers: [CompanyService, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class CompanyListComponent {
  router: Router;

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
      editButtonContent: '<button type="button" class="btn btn-info">Edit</button>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    columns: {
      INITIAL: {
        title: 'ID',
        type: 'string'
      },
      NAME: {
        title: 'Name',
        type: 'string'
      },
      Address: {
        title: 'Address',
        type: 'string'
      },
      TelA: {
        title: 'Tel A',
        type: 'string'
      },
      TelB: {
        title: 'Tel B',
        type: 'string'
      },
      VAT: {
        title: 'VAT',
        type: 'string'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(protected service: CompanyService, private _authService: AuthService, router: Router, public dialog: MdDialog) {
    try {
      this.router = router;

      this.service.getData().then((data) => {
        this.source.load(data);
      });
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }

  }

  AddCompany() {
    try {
      if (this._authService.checkMenuRight("company-info", "add") == true) {
        this.router.navigate(["./pages/masters/company-info/add-company-info", { mode: "add", returnUrl: this.router.url }]);
      } else {
        this.messageSubject.next("You are not authorized to add company information.");
        this.openAuthDialog();
      }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  OnEditClick(event): void {
    try {
      if (this._authService.checkMenuRight("company-info", "edit") == true) {
        this.router.navigate(["./pages/masters/company-info/add-company-info", { companyinfo: event.data.INITIAL, mode: "edit", returnUrl: this.router.url }]);
      } else {
        this.messageSubject.next("You are not authorized to edit company information.");
        this.openAuthDialog();
      }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  onViewClick(event): void {
    try {
      if (this._authService.checkMenuRight("company-info", "view") == true) {
        this.router.navigate(["./pages/masters/company-info/add-company-info", { companyinfo: event.data.INITIAL, mode: "view", returnUrl: this.router.url }])
      } else {
        this.messageSubject.next("You are not authorized to view company information.");
        this.openAuthDialog();
      }
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
