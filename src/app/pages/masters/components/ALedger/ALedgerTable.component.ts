import { Component } from '@angular/core';
import 'style-loader!./smartTables.scss';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";

import { PLedgerservice } from '../PLedger/PLedger.service';


@Component({
    selector: 'ALedgerTable',
    templateUrl: './ALedgerTable.html',
    styleUrls: ["../../../modal-style.css"],
    providers: [PLedgerservice],
})
export class ALedgerTableComponent {
    //  @Input() PType: string;
    PType: string;
    partyName: string;
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
        columns: {
            ACNAME: {
                title: 'NAME',
                type: 'string'
            },
            ACCODE: {
                title: 'ACCODE',
                type: 'string'
            },
            TYPE: {
                title: 'Type',
                type: 'string',
                valuePrepareFunction: (value) => {
                    switch (value) {
                        case "A":
                            return 'Asset';
                        case "G":
                            return 'Group';
                        default:
                            return ''


                    }
                },
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'All',
                        list: [
                            { value: 'A', title: 'Asset' },
                            { value: 'G', title: 'Group' },
                        ]
                    }
                }
            },
            ACTYPE: {
                title: 'AC Type',
                type: 'string',
                valuePrepareFunction: (value) => {
                    switch (value) {
                        case "AT":
                            return 'Asset';
                        case "LB":
                            return 'Liability';
                        case "DI":
                            return 'Direct Income';
                        case "DE":
                            return 'Direct Expense';
                        case "II":
                            return 'Indirect Income';
                        case "IE":
                            return 'Indirect Expense';
                        default:
                            return ''


                    }
                },
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'All',
                        list: [
                            { value: 'AT', title: 'Asset' },
                            { value: 'LB', title: 'Liability' },
                            { value: 'DI', title: 'Direcct Income' },
                            { value: 'DE', title: 'Direct Expense' },
                            { value: 'II', title: 'Indirect Income' },
                            { value: 'IE', title: 'Indirect Expense' },
                        ]
                    }
                }
            },
            HASSUBLEDGER: {
                title: 'Has Subledger',
                type: 'string',
                valuePrepareFunction: (value) => { return value == 1 ? 'Yes' : value == 0 ? 'No' : ''; },
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'All',
                        list: [
                            { value: 1, title: 'Yes' },
                            { value: 0, title: 'No' },
                        ]
                    }
                }
            },
            ISACTIVE: {
                title: 'STATUS',
                type: 'string',
                valuePrepareFunction: (value) => { return value == true ? 'Active' : value == false ? 'InActive' : ''; },
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'All',
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
    MainGrpList:any[]=[];
    constructor(private _Ledgerservice: PLedgerservice, private router: Router, public dialog: MdDialog) {
        try {
            ////console.log("Ptype", this.PType)
            if (this.PType == 'C') this.partyName = 'New Customer';
            else if (this.PType == 'V') this.partyName = 'New Supplier';

            let data: Array<any> = [];
            this._Ledgerservice.getAllAccount().subscribe(res => {
                if (res.status == "ok") {
                    data = res.result;
                    this.source.load(data);
                    ////console.log("PledgerTable", data)
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

            this.router.navigate(["./pages/masters/AccountLedger/Account", { mode: "add", isGroup: 0, Title: 'Create Account', returnUrl: this.router.url }]);

        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    onGrpAddClick() {
        try {
            this.router.navigate(["./pages/masters/AccountLedger/Account", { mode: "add", isGroup: 1, PType: 'G', Title: 'Create Account Group', returnUrl: this.router.url }]);

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
            this.router.navigate(["./pages/masters/AccountLedger/Account", { mode: "view", isGroup: 1, PType: 'G', Title: 'Create Account Group', returnUrl: this.router.url }]);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    onEditClick(event): void {
        try {
            this.router.navigate(["./pages/masters/AccountLedger/Account",
                {
                    mode: "edit",
                    isGroup: event.data.TYPE == "G" ? 1 : 0,
                    PType: event.data.TYPE,
                    ACID: event.data.ACID,
                    Title: event.data.TYPE == "G" ? 'Edit Account Group' : 'Edit Account',
                    returnUrl: this.router.url
            }]);            
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