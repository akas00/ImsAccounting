import { Component, Injector } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'
//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource, ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { IDivision } from '../../../../common/interfaces'
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { DivisionService } from './company.service';
import { AppComponentBase } from '../../../../app-component-base';


@Component({
  selector: 'divisions',
  templateUrl: './company.component.html',
  providers: [DivisionService],
  styleUrls: ["../../../modal-style.css"],
})
export class Divisions extends AppComponentBase{

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    // view: {
    //   viewButtonContent: 'View',
    //   saveButtonContent: '<i class="ion-checkmark"></i>',
    //   cancelButtonContent: '<i class="ion-close"></i>',
    // },
    edit: {
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    pager:{
      display:true,
      perPage:10
    },
    columns: {
      INITIAL: {
        title: 'NAME',
        type: 'string'
      },
      NAME: {
        title: 'ADDRESS',
        type: 'string'
      },
       ID: {
        title: 'DIVISION',
        type: 'string'
      },
      DESCRIPTION: {
        title: 'TYPE',
        type: 'string'
      }
    }
  };

  source : ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  
  constructor(public injector : Injector, private masterService: MasterRepo, 
    // private _authService: AuthService, 
    private divService: DivisionService, private router: Router, public dialog: MdDialog) {
    super(injector)
    try {
      let apiUrl = `${this.apiUrl}/getDivisionPagedlist`;
      this.source =  this.source = new ServerDataSource(this._http, 
        { endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        });
      // let data: Array<IDivision> = [];
      // //console.log({ divisions: masterService })
      // this.masterService.getAllDivisions()
      //   .subscribe(res => {
      //     data.push(<IDivision>res);
          
      //     this.source.load(data);
      //     ////console.log("divison",this.source);
      //   }, error => {
      //     this.masterService.resolveError(error, "divisions - getDivisions");
      //   }

      //   );
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  setMode() {
    try {
      this.divService.create();
      //this.settings.mode='inline';
      //console.log(this.settings.mode);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  onAddClick(event): void {
    try {
      this.router.navigate(["./pages/masters/company", { mode: "add", returnUrl: this.router.url }]);

    //  if (this._authService.checkMenuRight("category", "add") == true) {
    //   this.router.navigate(["./pages/masters/company", { mode: "add", returnUrl: this.router.url }])
    // } else {
    //   this.messageSubject.next("You are not authorized to Add Companies.");
    //   this.openAuthDialog();
    // } 

    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  onDeleteConfirm(event): void {
    try {
      if (window.confirm('Are you sure you want to delete?')) {
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
     // this.router.navigate(["./pages/masters/company", { initial: event.data.INITIAL, mode: "view", returnUrl: this.router.url }]);
      
      if (this._authService.checkMenuRight("category", "view") == true) {
        this.router.navigate(["./pages/masters/company", { initial: event.data.INITIAL, mode: "view", returnUrl: this.router.url }]);
      } else {
        this.messageSubject.next("You are not authorized to View Companies.");
        this.openAuthDialog();
      } 

    
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onEditClick(event): void {
    try {
      //this.router.navigate(["./pages/masters/company", { initial: event.data.INITIAL, name: event.data.NAME, mode: "edit", returnUrl: this.router.url }]);
      
      if (this._authService.checkMenuRight("category", "edit") == true) {
        this.router.navigate(["./pages/masters/company", { initial: event.data.INITIAL, name: event.data.NAME,  mode: "edit", returnUrl: this.router.url }]);
      } else {
        this.messageSubject.next("You are not authorized to Edit.");
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
    /*public actions: Array<PageAction> = [];
    private router: Router;
    constructor(router: Router) {
        super();
        let self: Divisions = this;
        self.router = router;
        self.model = new DivisionsModel(self.i18nHelper);
        //self.registerEvent(self.model.event)
        self.loadDivisions();
        this.model.addPageAction(new PageAction("btnAddDivision", "masters.divisions.addDivisionAction", () => self.onAddNewDivisionClicked()));

    }

    onAddNewDivisionClicked() {
        this.router.navigate([route.division.addDivision.name]);
    }

    onEditDivisionClicked(event: any) {
        this.router.navigate([route.division.editDivision.name, { id: event.item.initial }]);
    }

    onDeleteDivisionClicked(event: any) {
        let self: Divisions = this;
        divisionsService.delete(event.item.id).then(function () {
            self.loadDivisions();
        });

    }
    private loadDivisions() {
        let self: Divisions = this;
        divisionsService.getDivision().then(function (items: Array<any>) {

            self.model.importDivisions(items);
        });
    }
}*/