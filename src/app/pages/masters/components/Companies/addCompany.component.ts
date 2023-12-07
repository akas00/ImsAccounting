import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AddDivisionService } from './addCompany.service';
import { IDivision } from "../../../../common/interfaces/commonInterface.interface";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { GlobalState } from '../../../../global.state';
import { MasterRepo } from '../../../../common/repositories';
import { AuthService } from "../../../../common/services/permission/authService.service";
@Component({
    selector: 'add-division',
    templateUrl: './addCompany.component.html',
    providers: [AddDivisionService],
    styles: [`
        input{
            color: black;
        }
        .modal-dialog.modal-sm{
            top: 45%;
            margin-top: 0px;
        }
    `],
})

export class AddDivision implements OnInit, OnDestroy {
    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    viewMode = false;
    modeTitle: string = '';
    division: IDivision = <IDivision>{};
    initialTextReadOnly: boolean = false;
    model = {
        id: '',
        initial: '',
        description: '',
        rategroupId: 0
    }
    private returnUrl: string;
    rategroup: Array<any> = [];
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];
    constructor(private addDivisionService: AddDivisionService, private _authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder, public masterService: MasterRepo, private state: GlobalState) {

    }
    ngOnInit() {
        try { 
            let self = this;
            this.form = this.fb.group({
                ID: [''],
                INITIAL: ['', Validators.compose([Validators.required, Validators.maxLength(3), Validators.minLength(3)])],
                NAME: ['', Validators.required],
                RATEGROUPID: [''],
                BRANCHID: [''],
                BRANCHNAME: [''],
                PCL: ['']
            });
            //let initialControl: FormControl;
            if (!!this.activatedRoute.snapshot.params['mode']) {
                if (this.activatedRoute.snapshot.params['mode'] == "view") {
                    this.viewMode = true;
                    this.form.get('RATEGROUPID').disable();
                    this.form.get('INITIAL').disable();
                    this.form.get('ID').disable();
                    this.form.get('NAME').disable();
                    this.form.get('BRANCHID').disable();
                    this.form.get('BRANCHNAME').disable();
                    this.form.get('PCL').disable();
                }
            }

            if (!!this.activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this.activatedRoute.snapshot.params['returnUrl'];


            }
            if (!!this.activatedRoute.snapshot.params['initial']) {
                let initial = this.activatedRoute.snapshot.params['initial'];

                this.addDivisionService.getDivision(initial)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            this.form.setValue({
                                ID: data.result.ID || '',
                                INITIAL: data.result.INITIAL,
                                NAME: data.result.NAME,
                                RATEGROUPID: data.result.RATEGROUPID || 0 
                            });
                            if (this.activatedRoute.snapshot.params['mode'] == null) {
                                self.modeTitle = "Edit Division";
                                // if (this._authService.checkMenuRight("divisions", "edit") == false) {
                                //     this.router.navigate(['pages/masters/divisions/']);
                                // }
                            } else if (this.activatedRoute.snapshot.params['mode'] == "view") {
                                self.modeTitle = "View Division";
                                // if (this._authService.checkMenuRight("divisions", "view") == false) {
                                //     this.router.navigate(['pages/masters/divisions/']);
                                // }
                            }
                            self.mode = 'edit';
                            self.initialTextReadOnly = true;

                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit -Error in Division";
                            this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in Division";
                        this.masterService.resolveError(error, "addDivision - getDivision");
                    }
                )
            }
            else {
                this.mode = "add";
                this.modeTitle = "Add Division";
                this.initialTextReadOnly = false;
                // if (this._authService.checkMenuRight("divisions", "add") == false) {
                //     this.router.navigate(['pages/masters/divisions/']);
                // }
            }


            //this.model.id = this.returnUrl;
            ////console.log(this.division.INITIAL);

            let v = self.division;

            ////console.log(v.INITIAL);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }

    }

    disabled() {
        try {
            if (this.viewMode == true) {
                return "#EBEBE4";
            } else {
                return "";
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    changeToArray(data) {
        try {
            //console.log(data);
            if (data) {
                let retData: Array<any> = [];
                retData.concat([], data);
                return retData;
            }
            return [];
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    onSave() {
        //validate before Saving
        try {
            this.DialogMessage = "Saving Data please wait..."
            this.childModal.show();
            console.error();
            var Branch = this.form.value.BRANCHID
            var BRANCHNAME = this.form.value.BRANCHNAME;
            if(Branch!=null){
                if(Branch.maxLength>3){
                    this.DialogMessage = "Max Char for BranchID is only 3."
                        setTimeout(() => {
                            this.childModal.hide();

                           }, 2000)
                        return;
                }
                else if(Branch.minLength<3){
                    this.DialogMessage = "Min Char for BranchID is 3."
                        setTimeout(() => {
                            this.childModal.hide();

                           }, 200)
                        return;
                }
                
            }
            if(Branch == null || BRANCHNAME == null){
                if(BRANCHNAME!=null){
                    this.DialogMessage = "BranchID and Branch name are dependent. Cannot be save data."
                        setTimeout(() => {
                            this.childModal.hide();

                           }, 1000)
                    return;
                }
                else if(Branch !=null){
                    this.DialogMessage = "BranchID and Branch name are dependent. Cannot be save data."
                        setTimeout(() => {
                            this.childModal.hide();
                         }, 1000)
                        return; 
                }
            }
            
            this.onsubmit();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
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
    onsubmit() {
        try {
            ////console.log("submit call");
            let division = <IDivision>{}
            division.INITIAL = this.form.value.INITIAL;
            division.NAME = this.form.value.NAME;
            division.RATEGROUPID = this.form.value.RATEGROUPID;
            division.ID = this.form.value.ID;
            division.BRANCH = this.form.value.BRANCHID;
            division.BRANCHNAME = this.form.value.BRANCHNAME;
            //console.log({ tosubmit: division });
            // let ret =this.addDivisionService.saveDivision(division);
            //alert(ret.result)
            //calling observable of saveDivision
            let sub = this.masterService.saveDivision(this.mode, division)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        //Displaying dialog message for save with timer of 1 secs
                        this.DialogMessage = "Data Saved Successfully"
                        setTimeout(() => {
                            this.childModal.hide();

                            this.router.navigate([this.returnUrl]);
                            ////console.log("Return Branch Data",data.result)
                        }, 1000)


                    }
                    else {
                        //alert(data.result);
                        //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            this.router.navigate(['/login', this.router.url])
                            return;
                        }
                        else if (data.result == "Duplicate_Initial") {
                            this.DialogMessage = "Can't save! Dublicate Initial."
                            //console.log(data.result._body);
                            setTimeout(() => {
                                this.childModal.hide();
                            }, 1000)
                        }
                        else if (data.result == "Duplicate_BranchId") {
                            this.DialogMessage = "Can't save! Dublicate BranchId."
                            //console.log(data.result._body);
                            setTimeout(() => {
                                this.childModal.hide();
                            }, 1000)
                        }
                        else {


                            //Some other issues need to check
                            this.DialogMessage = "Error in Saving Data:" + data.result._body;
                            ////console.log("Error in Company form!",data.result._body);
                            setTimeout(() => {
                                this.childModal.hide();
                            }, 3000)
                        }
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
    onCancel() {
        try {
            //console.log(this.returnUrl)
            this.router.navigate([this.returnUrl]);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    ngOnDestroy() {
        try {
            //if(this.subitSubscription)
            //  this.subitSubscription.unsubscribe();
            this.subcriptions.forEach(subs => {
                subs.unsubscribe();

            });
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
}