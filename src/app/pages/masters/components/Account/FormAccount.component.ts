import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { AccountServices } from './account.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TAcList } from "../../../../common/interfaces/Account.interface";
@Component(
    {
        selector: 'debitSelector',
        templateUrl: './FormAccount.component.html',

        providers: [AccountServices],
        styleUrls: ["../../../modal-style.css"],
    }
)
export class FormAccountComponent {
    taclist: TAcList = <TAcList>{};
    router: Router;


    constructor(protected masterService: MasterRepo, private _commonService: AccountServices, router: Router) { this.router = router; }
    ngOnInit() {
    }
    private returnUrl: string;
    private subcriptions: Array<Subscription> = [];
    trnMode: string = "";
    form: FormGroup;

    DialogMessage: string = "Saving data please wait ...";
    @ViewChild('childModal') childModal: ModalDirective;
    onSave() {
        try {
            //validate before Saving
            this.DialogMessage = "Saving Data please wait..."
            this.childModal.show();
            this.onSaveClicked();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    mode: string = "add";
    onSaveClicked() {
        try {
            ////console.log("submit call");
            let alst = <TAcList>{}
            alst.ACNAME = this.form.value.ACNAME,
                alst.ACCODE = this.form.value.ACCODE;
            let sub = this.masterService.saveUnit(this.mode, this.taclist)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        //Displaying dialog message for save with timer of 1 secs
                        this.DialogMessage = "Data Saved Successfully"
                        setTimeout(() => {
                            this.childModal.hide();
                            this.router.navigate([this.returnUrl]);
                        }, 1000)


                    }
                    else {
                        //alert(data.result);
                        //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            this.router.navigate(['/login', this.router.url])
                            return;
                        }
                        //Some other issues need to check
                        this.DialogMessage = "Error in Saving Data:" + data.result._body;
                        //console.log(data.result._body);
                        setTimeout(() => {
                            this.childModal.hide();
                        }, 3000)
                    }
                },
                error => { alert(error) }
                );
            this.subcriptions.push(sub);
        }
        catch (e) {
            this.childModal.hide()
            alert(e);
        }



    }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        try {
            this.loginModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    cancelClick() {
        try {
            this.router.navigate(["./pages/masters/ACList"]);
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
}