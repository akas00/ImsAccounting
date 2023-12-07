import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { AcListTree, TAcList } from "../../../../common/interfaces/Account.interface";
import { TreeViewAcService } from './accountLedger.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
@Component(
    {
        selector: 'addGrpSelector',
        templateUrl: 'addsubgrps.component.html',

        providers: [TreeViewAcService],

    }
)
export class addGrpComponent {
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
    viewMode = false;
    AddACGrpForm: FormGroup;
    modeTitle: string = '';
    initialTextReadOnly = false;


    constructor(protected masterService: MasterRepo, protected AccountService: TreeViewAcService, router: Router, private _activatedRoute: ActivatedRoute, private fb: FormBuilder) {
        this.router = router;
        
        if (!!_activatedRoute.snapshot.params['returnUrl']) {
            this.returnUrl = _activatedRoute.snapshot.params['returnUrl'];

        }
        
    }
    // salesman:Salesman=<Salesman>{};
    ngOnInit() {
this.AddACGrpForm = this.fb.group({
            ACNAME: ['', Validators.required],
            majorparent: [''],
            hasSub: [''],
            Ptype: ['']
        });
        if (this._activatedRoute.snapshot.params['SeletectedData']) {
            let selectedAcid = this._activatedRoute.snapshot.params['SeletectedData'];
            ////console.log("selectedAcid")
            this.masterService.getAllAccount(selectedAcid)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.AddACGrpForm.get('ACNAME').setValue(data.result.ACNAME);
                        //console.log(data);
                        this.mode = 'edit';
                        this.initialTextReadOnly = true;


                    }
                }
                )
        }
        this.masterService.getacListTree()
            .subscribe(data => {
                let p = data.filter(x => x.PARENTID == 'BS' || 'PL' || 'TD');
                this.ParentAcList = p;
                if (!!this._activatedRoute.snapshot.params['Par']) {
                    this.majorparent = this._activatedRoute.snapshot.params['Par'];
                    ////console.log("Get");
                    //console.log(this.majorparent);
                    this.AddACGrpForm.controls['majorparent'].patchValue(this.majorparent);
                }

            });
        //getting parent and majorgroup for new product group insert
        if (!!this._activatedRoute.snapshot.params['SI']) {
            var selectedID = this._activatedRoute.snapshot.params['SI'];
            if (selectedID == "null") {
                this.ledgerAcObj.PARENT = 'PA';
                return;
            }
        }
    }

    onSave() {

        this.DialogMessage = "Saving Data please wait..."
        this.childModal.show();
        this.SumbitSave();
    }
    mode: string = "add";
    result: any;
    SumbitSave() {
        try {
            ////console.log("submit call");

            let ag = <TAcList>{}
            ag.TYPE = "G";
            ag.PARENT = this.AddACGrpForm.value.majorparent
            ag.ACNAME = this.AddACGrpForm.value.ACNAME;
            ag.PType = this.AddACGrpForm.value.Ptype;
            ag.HASSUBLEDGER = this.AddACGrpForm.value.hasSub;
            //console.log({ ag: ag });
            let sub = this.masterService.saveAccount(this.mode, ag)
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
        this.router.navigate(["./pages/masters/AccountLedger"]);
    }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    changehassubEvent(value) {
        if (this.AddACGrpForm == null) { return; }
        this.AddACGrpForm.get('hasSub').patchValue(value);
    }
    changePtype(value) {
        this.AddACGrpForm.get('Ptype').patchValue(value);
    }


}