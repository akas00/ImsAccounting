import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { AcListTree, TAcList } from "../../../../common/interfaces/Account.interface";
import { TreeViewPartyervice } from './partyledger.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
@Component(
    {
        selector: 'addAccGrpSelector',
        templateUrl: 'addAccgrp.component.html',
    }
)
export class AddAccLedgerGrpComponent {
    majorParentAcList: any[];
    ParentAcList: any[];
    majorparent: any;
    PARENTACNAME: string;
    acListtree: AcListTree = <AcListTree>{};
    ledgerAcObj: TAcList = <TAcList>{};
    form: FormGroup;
    private returnUrl: string;
    @ViewChild('childModal') childModal: ModalDirective;
    private subcriptions: Array<Subscription> = [];
    DialogMessage: string = "Saving data please wait ..."
    router: Router;
    // salesman:Salesman=<Salesman>{};
    ngOnInit() {
        // this.form = this.fb.group({
        //     majorparent: [''],
        //     ACNAME: ['', Validators.required],
        //     hasSub:[''],
        // })
        // this.MasterService.getpartyListTree()
        //     .subscribe(data => {
        //         let p = data.filter(x => x.PARENTID == 'PA');
        //         this.ParentAcList = p;
        //         if (!!this._activatedRoute.snapshot.params['Par']) {
        //             this.majorparent = this._activatedRoute.snapshot.params['Par'];
        //             this.form.get('majorparent').patchValue(this.majorparent);
        //             ////console.log("Get");
        //             //console.log(this.majorparent);
        //         }

        //     });

        // let self = this;
        // if (!!this._activatedRoute.snapshot.params['ACID']) {
        //     let ACID = this._activatedRoute.snapshot.params['ACID'];
        // }


    }

    constructor(protected MasterService: MasterRepo, router: Router, private _activatedRoute: ActivatedRoute, private fb: FormBuilder) {
        // this.router = router;


    }
    
changehassubEvent(value)
    {
        if(this.form==null)return;
       this.form.get('hasSub').patchValue(value);

        ////console.log("value:"+value);
    }

    onSave() {

        this.DialogMessage = "Saving Data please wait..."
        this.childModal.show();
        this.SumbitSave();
    }
    mode: string = "add";
    SumbitSave() {
        try {
            let ap = <TAcList>{}
            ap.ACNAME = this.form.value.ACNAME;
            ap.TYPE = "G";
            ap.PARENT = this.form.value.majorparent;
            ap.HASSUBLEDGER=this.form.value.hasSub;
            //console.log({AddPartyGroup:ap})
            let sub = this.MasterService.saveAccount(this.mode, ap)
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
            alert(e);
        }
    }
    cancel() {
        this.router.navigate(["pages/account/AccountLedger/AccountMaster"]);
    }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }


}