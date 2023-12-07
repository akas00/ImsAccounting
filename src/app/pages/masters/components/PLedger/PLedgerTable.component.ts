import { Component } from '@angular/core';
import 'style-loader!./smartTables.scss';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { PLedgerservice } from './PLedger.service';


@Component({
    selector: 'pLedgerTable',
    templateUrl: './PLedgerTable.html',
    styleUrls: ["../../../modal-style.css"],
})
export class pLedgerTableComponent {
    PType: string;
    partyName: string;
    settings = {
        mode: 'external',
        add: {
            addButtonContent: '',
            createButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        edit: {
            editButtonContent: 'Edit',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        delete: {
            deleteButtonContent: ' ',
            confirmDelete: true
        },
        columns: {
            ACNAME: {
                title: 'NAME',
                type: 'string'
            },
            shortname: {
                title: 'Short Name',
                type: 'string'
            },
            ACCODE: {
                title: 'SAPCODE',
                type: 'string'
            },
            Address: {
                title: 'ADDRESS',
                type: 'string'
            },
            GSTNO: {
                title: 'GST No',
                type: 'string'
            },
            
            ISACTIVE: {
                title: 'STATUS',
                type: 'string',
                valuePrepareFunction: (value) => { return value == true ? 'Active' : 'InActive'; },
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'Show all',
                        list: [
                            { value: true, title: 'Active' },
                            { value: false, title: 'InActive' },
                        ]
                    }
                }
            }
        }
    };

    source: LocalDataSource = new LocalDataSource();
    messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
    message$: Observable<string> = this.messageSubject.asObservable();

    constructor(private _Ledgerservice: PLedgerservice, private router: Router, public dialog: MdDialog, private masterService: MasterRepo) {
        try {

            this.PType = this.masterService.PType;
            //  ////console.log("Ptype",this.PType)
            if (this.PType == 'C') this.partyName = 'New Customer';
            else if (this.PType == 'V') this.partyName = 'New Supplier';

            let data: Array<any> = [];
            this._Ledgerservice.getPartyItemByPtype(this.PType).subscribe(res => {
                if (res.status == "ok") {
                    data = res.result;
                    this.source.load(data);
                    //  ////console.log("PledgerTable",data)
                }
            });





        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    setMode() {
        try {

        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    onAddClick(): void {
        try {
            if (this.PType == 'C')
                this.router.navigate(["./pages/masters/PartyLedger/Customer", { mode: "add", isGroup: 0, PType: 'C', Title: 'Create Customer', returnUrl: this.router.url }]);
            else if (this.PType == 'V')
                this.router.navigate(["./pages/masters/PartyLedger/Supplier", { mode: "add", isGroup: 0, PType: 'V', Title: 'Create Supplier', returnUrl: this.router.url }]);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    onGrpAddClick() {
        try {
            if (this.PType == 'C')
                this.router.navigate(["./pages/masters/PartyLedger/Customer", { mode: "add", isGroup: 1, PType: 'C', Title: 'Create Customer Group', returnUrl: this.router.url }]);
            else if (this.PType == 'V')
                this.router.navigate(["./pages/masters/PartyLedger/Supplier", { mode: "add", isGroup: 1, PType: 'V', Title: 'Create Supplier Group', returnUrl: this.router.url }]);
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

    onViewClick(): void {
        try {
            // this.router.navigate(["./pages/masters/company", { initial: event.data.INITIAL, mode: "view", returnUrl: this.router.url }]);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    onEditClick(event) {
        try {
            let acid = event.data.ACID
            if (this.PType == 'C')
                this.router.navigate(["./pages/masters/PartyLedger/Customer", { mode: "edit", ACID: acid, isGroup: 0, PType: 'C', Title: 'Edit Customer', returnUrl: this.router.url }]);
            else if (this.PType == 'V')
                this.router.navigate(["./pages/masters/PartyLedger/Supplier", { mode: "edit", ACID: acid, isGroup: 0, PType: 'V', Title: 'Edit Supplier', returnUrl: this.router.url }]);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    // onEditClick(event): void {
    //     try {
    //         this.router.navigate(["./pages/masters/Customer/CustomerList", { initial: event.data.INITIAL, name: event.data.NAME, mode: "edit", returnUrl: this.router.url }]);

    //     } catch (ex) {
    //         //console.log(ex);
    //         alert(ex);
    //     }
    // }

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