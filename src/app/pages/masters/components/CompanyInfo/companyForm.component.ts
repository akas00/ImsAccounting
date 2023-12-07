import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Company } from "../../../../common/interfaces/CompanyInfo.interface";
import { CompanyService } from './company.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { MessageDialog } from './../../../modaldialogs/messageDialog/messageDialog.component';

@Component(
    {
        selector: 'CompanyFormSelector',
        templateUrl: './companyForm.component.html',

        providers: [CompanyService],
        styleUrls: ["../../../modal-style.css"],
    }
)
export class CompanyFormComponent {

    company: Company = <Company>{};
    router: Router;
    modeTitle: string = "Add Company Information";
    dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
    StateList: any[] = [];
    // salesman:Salesman=<Salesman>{};
    constructor(private masterService: MasterRepo, protected service: CompanyService, router: Router, private _activatedRoute: ActivatedRoute, private fb: FormBuilder,public dialog: MdDialog) {
        try {
            this.router = router;
            this.masterService.getState().subscribe(res => {
                ////console.log("RES",res)
                if (res.status == 'ok') {
                  this.StateList = res.result;
                }
              })
            if (!!_activatedRoute.snapshot.params['companyinfo']) {
                this.company.INITIAL = _activatedRoute.snapshot.params['companyinfo'];
                
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    cancel() {
        try {
            this.router.navigate(["./pages/masters/CompanyInfo"]);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    ngOnInit() {
        try {
            this.form = this.fb.group({
                INITIAL: ['',Validators.compose([Validators.required, Validators.maxLength(3), Validators.minLength(3)])],
                NAME: ['', Validators.required],
                ADDRESS: [''],
                BRANCHID:['',Validators.compose([Validators.required, Validators.maxLength(3), Validators.minLength(3)])],
                TELA: [''],
                TELB: [''],
                VAT: ['',Validators.required],
                EMAIL: [''],
                FBDATE: ['',Validators.required],
                FEDATE: ['',Validators.required],
                FBDATE_BS: [''],
                FEDATE_BS: [''],
                ISBRANCH: [''],
                PhiscalID: ['',Validators.required],
                ORGTYPE:['',Validators.required],
                STATE:['',Validators.required],
                GSTNO:[''],
                POSTALCODE:[''],
                PLACE:[''],
                ADDRESS2:['']
                
            });
            this.masterService.loadCompany().subscribe((data: Company) => {
                try {
                    //console.log({loadCompanyList:data});
                    this.form.patchValue({
                        INITIAL: data.INITIAL,
                        NAME: data.NAME,
                        ADDRESS: data.ADDRESS,
                        TELA: data.TELA,
                        TELB: data.TELB,
                        VAT: data.VAT,
                        EMAIL: data.EMAIL,
                        FBDATE: data.FBDATE?data.FBDATE.toString().substring(0, 10):"",
                        FEDATE: data.FEDATE?data.FEDATE.toString().substring(0, 10):"",
                        FBDATE_BS: data.FBDATE_BS,
                        FEDATE_BS: data.FEDATE_BS,
                        ISBRANCH: data.ISBRANCH,
                        PhiscalID: data.PhiscalID
                    })
                }
                catch (ex) {
                    //console.log({ companyLoad: ex });
                }
            })
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    private returnUrl: string;
    private subcriptions: Array<Subscription> = [];
    trnMode: string = "";
    form: FormGroup;

    DialogMessage: string = "Saving data please wait ...";
    @ViewChild('childModal') childModal: ModalDirective;
   
    mode: string = "add";
    onSaveClicked() {
        try {
              this.dialogMessageSubject.next("Saving Data please wait...");
        var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })
        if (this.form.value.VAT) {
            //console.log({ billtotel: parseFloat(this.form.value.VAT) })
            var pno = parseFloat(this.form.value.VAT);
            if (pno.toString().length != 9) {
                alert("PAN No is not correct");
                dialogRef.close();
                return;
            }
        }
            ////console.log("submit call");
            let comp = <Company>{}
            comp.INITIAL = this.form.value.INITIAL,
            comp.NAME = this.form.value.NAME;
            comp.ADDRESS = this.form.value.ADDRESS;
            comp.TELA = this.form.value.TELA;
            comp.TELB = this.form.value.TELB;
            comp.VAT = this.form.value.VAT;
            comp.FBDATE=this.form.value.FBDATE;
            comp.FEDATE=this.form.value.FEDATE;
            comp.PhiscalID=this.form.value.PhiscalID;
            comp.BRANCHID=this.form.value.BRANCHID;
            comp.ORG_TYPE=this.form.value.ORGTYPE;
            comp.STATE=this.form.value.STATE;
            comp.GSTNO=this.form.value.GSTNO;
            comp.POSTALCODE=this.form.value.POSTALCODE;
            comp.ADDRESS2=this.form.value.ADDRESS2;
            comp.PLACE=this.form.value.PLACE;
            
            let sub = this.masterService.saveCompany(this.mode, comp)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        dialogRef.close();
                        
                        //Displaying dialog message for save with timer of 1 secs
                        
                        //this.form.reset();
                       


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
}