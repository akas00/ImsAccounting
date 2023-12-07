import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router, ActivatedRoute } from "@angular/router";
import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'dispatch-list',
  templateUrl: './dispatch-list.component.html',
  providers: [AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class DispatchListComponent {
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
      PhiscalID: {
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
  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  busy:Subscription;
  masterDObject:any=<any>{};
  path:string;
  loadingList:any[]=[];
  constructor(private _authService: AuthService, private router: Router, private masterService: MasterRepo, public dialog: MdDialog,private arouter: ActivatedRoute) {
    try {
      this.path= this.arouter.snapshot.url[0].path;
      let data: Array<any> = [];
      ////console.log("calling service")
      this.busy= this.masterService.getTrnMainList("DL")
        .subscribe(res => {
         // //console.log({ purchaseData: res })
          data.push(<any>res);
        }, error => {
          this.masterService.resolveError(error, "dispatch-list - getTrnMainList");
        },
        ()=>{
             this.formChooser(data);
          this.source.load(this.loadingList);
        });



    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  formChooser(dlList){
    switch (this.path) {
      case "productionout":
        this.masterDObject={formtitle:"Production Out",buttonname:"Add Production Out"};
        this.loadingList=dlList.filter(d=>d.TRNMODE=="productionout");
        break;
    case "dispatch":
        this.masterDObject={formtitle:"Dispatch Out",buttonname:"Add Dispatch"};
         this.loadingList=dlList.filter(d=>d.TRNMODE=="dispatch");
        break;
      default:
        break;
    } 
  }
  setMode() { }
  onAddClick() {
    try {
      this.router.navigate(["/pages/inventory/dispatch/add-dispatch", { mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onEditClick(event): void {
    try {
      this.router.navigate(["/pages/inventory/dispatch/add-dispatch", { vchr: event.data.VCHRNO, returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit" }]);
      
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate(["/pages/inventory/dispatch/add-dispatch", { vchr: event.data.VCHRNO, mode: "view", returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID }])
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

  onDeleteConfirm(event): void { }
}