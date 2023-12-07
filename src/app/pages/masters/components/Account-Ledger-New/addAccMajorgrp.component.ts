import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { TAcList, AcListTree } from "../../../../common/interfaces/Account.interface";
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { TreeViewAccService } from './AccLedger.service';
@Component(
    {
        selector: 'addAccMajorgrpSelector',
        templateUrl: 'addAccMajorgrp.component.html',
        providers: [TreeViewAccService],

    }
)
export class addAccMajorGrpComponent {
    router: Router;
    ledgerAcObj: TAcList = <TAcList>{};
    acListtree: AcListTree = <AcListTree>{};
    private returnUrl: string;
    DialogMessage: string = "Saving Data please wait ..."
    private subcriptions: Array<Subscription> = [];
    @ViewChild('childModal') childModal: ModalDirective;
    Addform: FormGroup;
    viewMode = true;
    modeTitle:string='';
    initialTextReadOnly:false;
    ngOnInit() {
        // try {
        //     let self = this;
        //     if (!!this._activatedRoute.snapshot.params['returnUrl']) {
        //         this.ledgerAcObj.PARENT = 'PA';
        //     }
            
        // } catch (ex) {
        //     //console.log(ex);
        //     alert(ex);
        // }
        // this.Addform = this._fb.group({
        //     ACNAME: ['', Validators.required],
        //     PType:[''],
        // })

    }
    constructor(protected service: TreeViewAccService, router: Router, private _activatedRoute: ActivatedRoute, protected MasterService: MasterRepo, private _fb: FormBuilder) {
        // this.router = router;
        // if (!!_activatedRoute.snapshot.params['returnUrl']) {
        //     this.acListtree.ACID = _activatedRoute.snapshot.params['returnUrl'];
        // }

    }
    
    cancel() {
        this.router.navigate(["./pages/masters/PartyLedger"]);
    }

    onSave() {

        this.DialogMessage = "Saving Data please wait..."
        this.childModal.show();
        this.SumbitSave();
    }
    mode: string = "add";
    value:any;
    SumbitSave() {
        ////console.log("Submit call")
        try {
            let am = <TAcList>{}
            am.ACNAME = this.Addform.value.ACNAME;
            am.TYPE = "G";
            am.PARENT="PA";
            //console.log({ AddMajor: am });
            let sub = this.MasterService.saveAccount(this.mode, am)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.DialogMessage = "Data Saved Successfully"
                        setTimeout(() => {
                            this.childModal.hide();

                            this.router.navigate(["pages/account/AccountLedger/AccountMaster"])
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
    // ptypeRadioChangeEvent(value)
    // {
    //    this.Addform.controls['PType'].setValue(value);

    //     //console.log({value:value});
    // }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

}
