import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { CommonService } from './../../../../common/services/common.service';
import { MembershipService } from './membership.service';
import { TMember, SalesPerson, Scheme } from './membership.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Occupation } from "../../../../common/interfaces/occupation.interface";
import { Designation } from "../../../../common/interfaces/designation.interface";
import { MemberScheme } from "../../../../common/interfaces/member-scheme.interface";
import { Salesman } from "../../../../common/interfaces/commonInterface.interface";

@Component({
    selector: 'membership',
    templateUrl: "./membership.template.html",
    // styleUrls: ["./../../../../../assets/css/styles.css"],
    providers: [CommonService, MembershipService],
    styles: [`
            .margin{
                margin-bottom: 10px;
            }
            .padding{
                padding-right: 0px;
            }
            th{
                font-weight: bold;
            }
            tbody:hover{
                background-color: #F8F8F8;
            }
            .member-photo{
                display: block;
                margin-left: auto;
                margin-right: auto;
                height: 250px;
                width: 200px;
                margin-bottom: 10px;
                background-color: #F0F3F4
            }
            .family-margin{
                margin-right: 15px;
            }
            .modal-dialog.modal-sm{
                top: 45%;
                margin-top: 0px;
            }
    `],
    
})

export class MembershipComponent {
    viewMode = false;
    public tMember: TMember = <TMember>{};
    public uuid: string;
    private url: string;
    private years: number;
    private year: number;
    private month: string;
    private day: string;
    private durationValue: number;
    private validDate: string;
    private bsDOB: string;
    private bsWAD: string;
    public schemeList: MemberScheme[] = [];
    public designationList: Designation[] = [];
    public occupationList: Occupation[] = [];
    public salesPersonList: Salesman[] = [];

    // private maleNo: number;
    // private femaleNo: number;
    // private boyNo: number;
    // private girlNo: number;
    // private babyNo: number;
    // private totalNo: number;
    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Saving data please wait ...";
    mode: string = "add";
    modeTitle: string = '';
    initialTextReadOnly: boolean = false;
    private returnUrl: string;
    rategroup: Array<any> = [];
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];

    constructor(private masterService: MasterRepo, private _commonService: CommonService, private _membershipService: MembershipService, private _activatedRoute: ActivatedRoute, private _router: Router, private _fb: FormBuilder) {
        if (!!this._activatedRoute.snapshot.params['mode']) {
                    this.mode=this._activatedRoute.snapshot.params['mode'];
        }   
    }

    ngOnInit() {
        try {
            this.masterService.getOccupationList().subscribe(res => { this.occupationList.push(<Occupation>res); });
            this.masterService.getDesignationList().subscribe(res => { this.designationList.push(<Designation>res); });
            this.masterService.getMemberSchemeList().subscribe(res => { this.schemeList.push(<MemberScheme>res); });
            this.masterService.getSalesmanList().subscribe(res => { this.salesPersonList.push(<Salesman>res); });

            let self = this;
            this.form = this._fb.group({
                MEMID: ['', Validators.required],
                FNAME: ['', Validators.required],
                DOB: ['', Validators.required],
                bsDOB: [''],
                WAD: [''],
                bsWAD: [''],
                OCP: [''],
                OFFICE: [''],
                DEG: [''],
                T_STREET: ['', Validators.required],
                TEL_O: [''],
                TEL_R: [''],
                MOBILE: ['', Validators.required],
                EMAIL: [''],
                SALESMANID: [''],
                REFERENCEBY: [''],
                REG_DATE: ['', Validators.required],
                DURATION: [''],
                VALIDITY: ['', Validators.required],
                SCHEMEID: [''],
                FAX: [''],
                POBOX: [''],
                BARCODE: [''],
                PANNo: [''],
                PHOTO: ['']
            });

            if (!!this._activatedRoute.snapshot.params['mode']) {
                if (this._activatedRoute.snapshot.params['mode'] == "view") {
                    this.viewMode = true;
                    this.form.get('MEMID').disable();
                    this.form.get('FNAME').disable();
                    this.form.get('DOB').disable();
                    this.form.get('bsDOB').disable();
                    this.form.get('WAD').disable();
                    this.form.get('bsWAD').disable();
                    this.form.get('OCP').disable();
                    this.form.get('OFFICE').disable();
                    this.form.get('DEG').disable();
                    this.form.get('T_STREET').disable();
                    this.form.get('TEL_O').disable();
                    this.form.get('TEL_R').disable();
                    this.form.get('MOBILE').disable();
                    this.form.get('EMAIL').disable();
                    this.form.get('SALESMANID').disable();
                    this.form.get('REFERENCEBY').disable();
                    this.form.get('REG_DATE').disable();
                    this.form.get('DURATION').disable();
                    this.form.get('VALIDITY').disable();
                    this.form.get('SCHEMEID').disable();
                    this.form.get('FAX').disable();
                    this.form.get('POBOX').disable();
                    this.form.get('BARCODE').disable();
                    this.form.get('PANNo').disable();
                    this.form.get('PHOTO').disable();
                }
            }

            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['memberId']) {
                let memberId = this._activatedRoute.snapshot.params['memberId'];
                this._membershipService.getMembership(memberId)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            this.form.patchValue({
                                MEMID: data.result.MEMID,
                                FNAME: data.result.FNAME,
                                DOB: ((data.result.DOB == null) ? "" : data.result.DOB.substring(0, 10)),
                                WAD: ((data.result.WAD == null) ? "" : data.result.WAD.substring(0, 10)),
                                OCP: data.result.OCP,
                                OFFICE: data.result.OFFICE,
                                DEG: data.result.DEG,
                                T_STREET: data.result.T_STREET,
                                TEL_O: data.result.TEL_O,
                                TEL_R: data.result.TEL_R,
                                MOBILE: data.result.MOBILE,
                                EMAIL: data.result.EMAIL,
                                SALESMANID: data.result.SALESMANID,
                                REFERENCEBY: data.result.REFERENCEBY,
                                REG_DATE: ((data.result.REG_DATE == null) ? "" : data.result.REG_DATE.substring(0, 10)),
                                DURATION: data.result.DURATION,
                                VALIDITY: ((data.result.VALIDITY == null) ? "" : data.result.VALIDITY.substring(0, 10)),
                                SCHEMEID: data.result.SCHEMEID,
                                FAX: data.result.FAX,
                                POBOX: data.result.POBOX,
                                BARCODE: data.result.BARCODE,
                                PANNo: data.result.PANNo,
                            });
                            // this.form.get('MEMID').disable();
                            if (this._activatedRoute.snapshot.params['mode'] == null) {
                                self.modeTitle = "Edit Customer Information";
                            } else if (this._activatedRoute.snapshot.params['mode'] == "view") {
                                self.modeTitle = "View Customer Information";
                            }

                            self.mode = 'edit';
                            self.initialTextReadOnly = true;
                            if (this.form.get("DOB").value != "") {
                                this.changeDOB(this.form.get("DOB").value, "AD");
                            }
                            if (this.form.get("WAD").value != "") {
                                this.changeWAD(this.form.get("WAD").value, "AD");
                            }

                            this.duration(this.form.get("DURATION").value);
                            this.registrationDate(this.form.get("REG_DATE").value);
                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit - Error in Customer Information";
                            this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 - Error in Customer Information";
                        this.masterService.resolveError(error, "membership - getMembership");

                    }
                    )
            }
            else {
                this.mode = "add";
                this.modeTitle = "Add Customer Information";
                this.initialTextReadOnly = false;

            }


            //this.model.id = this.returnUrl;
            //console.log(this.tMember.MEMID);

            let v = self.tMember;

            //console.log(v.MEMID);
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

    editDisabled() {
        try {
            if (this.mode == "edit") {
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
        try {
            //validate before Saving
            this.DialogMessage = "Saving Data please wait..."
            this.childModal.show();
            this.save();
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

    save() {
        try {
            if (this.form.get("DURATION").value == "") {
                this.form.get("DURATION").setValue(null);
            }
            if (this.form.get("DOB").value == "") {
                this.form.get("DOB").setValue(null);
            }
            if (this.form.get("WAD").value == "") {
                this.form.get("WAD").setValue(null);
            }
            if (this.form.get("REG_DATE").value == "") {
                this.form.get("REG_DATE").setValue(null);
            }
            if (this.form.get("VALIDITY").value == "") {
                this.form.get("VALIDITY").setValue(null);
            }

            //console.log(this.tMember);

            ////console.log("submit call");
            let membership = <TMember>{}
            membership.MEMID = this.form.value.MEMID,
                membership.FNAME = this.form.value.FNAME,
                membership.DOB = this.form.value.DOB,
                membership.WAD = this.form.value.WAD,
                membership.OCP = this.form.value.OCP,
                membership.OFFICE = this.form.value.OFFICE,
                membership.DEG = this.form.value.DEG,
                membership.T_STREET = this.form.value.T_STREET,
                membership.TEL_O = this.form.value.TEL_O,
                membership.TEL_R = this.form.value.TEL_R,
                membership.MOBILE = this.form.value.MOBILE,
                membership.EMAIL = this.form.value.EMAIL,
                membership.SALESMANID = this.form.value.SALESMANID,
                membership.REFERENCEBY = this.form.value.REFERENCEBY,
                membership.REG_DATE = this.form.value.REG_DATE,
                membership.DURATION = this.form.value.DURATION,
                membership.VALIDITY = this.form.value.VALIDITY,
                membership.SCHEMEID = this.form.value.SCHEMEID,
                membership.FAX = this.form.value.FAX,
                membership.POBOX = this.form.value.POBOX,
                membership.BARCODE = this.form.value.BARCODE,
                membership.PANNo = this.form.value.PANNo,
                //console.log({ tosubmit: membership });

            let sub = this.masterService.saveMembership(this.mode, membership)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.DialogMessage = "Data Saved Successfully"
                        setTimeout(() => {
                            this.childModal.hide();

                            this._router.navigate([this.returnUrl]);
                        }, 1000)


                    }
                    else {

                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            this._router.navigate(['/login', this._router.url])
                            return;
                        }

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

    ngOnDestroy() {
        try {
            this.subcriptions.forEach(subs => {
                subs.unsubscribe();

            });
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    back() {
        try {
            this._router.navigate([this.returnUrl]);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    changeImage(event) {
        try {
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();

                reader.onload = (event) => {
                   // this.url = event.target.result;
                }

                reader.readAsDataURL(event.target.files[0]);
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    generateID() {
        try {
            //  var shortid = require('shortid');
            //  this.uuid = shortid.generate();
            this.form.get("MEMID").setValue(this.uuid);
            // this.uuid = UUID.UUID();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    duration(value) {
        try {
            this.years = parseInt(value);
            if (value != null) {
                this.validDate = (this.year + this.years) + "-" + (this.month) + "-" + (this.day);
            }
            this.durationValue = value;
            if (this.validDate != "NaN-" + (this.month) + "-" + (this.day))
                this.form.get("VALIDITY").setValue(this.validDate);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    registrationDate(value) {
        try {
            var res = value.split("-")
            this.year = parseInt(res[0]);
            this.month = res[1];
            this.day = res[2];

            if (this.form.get("REG_DATE").value != '') {
                this.form.get("VALIDITY").setValue(this.validDate);
                this.duration(this.durationValue);
            }

            ////console.log("year: " + this.year)
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    changeDOB(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.form.get('bsDOB').setValue(bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get('DOB').setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            // alert(ex);
        }
    }
    clickDOB(value) {
        try {
            if (value != null && value != 0) {
                var adbs = require("ad-bs-converter");
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get('DOB').setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            // alert(ex);
        }
    }

    changeWAD(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.form.get('bsWAD').setValue(bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get('WAD').setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            // alert(ex);
        }
    }
    clickWAD(value) {
        try {
            if (value != null && value != 0) {
                var adbs = require("ad-bs-converter");
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get('WAD').setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            // alert(ex);
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

    // male(value){
    //     if(value == null || value == ""){
    //         this.maleNo = 0;
    //     }else{
    //         this.maleNo = parseInt(value);
    //     }
    //     this.total();
    // }
    // female(value){
    //     if(value == null || value == ""){
    //         this.femaleNo = 0;
    //     }else{
    //         this.femaleNo = parseInt(value);
    //     }
    //     this.total();
    // }
    // boy(value){
    //     if(value == null || value == ""){
    //         this.boyNo = 0;
    //     }else{
    //         this.boyNo = parseInt(value);
    //     }
    //     this.total();
    // }
    // girl(value){
    //     if(value == null || value == ""){
    //         this.girlNo = 0;
    //     }else{
    //         this.girlNo = parseInt(value);
    //     }
    //     this.total();
    // }
    // baby(value){
    //     if(value == null || value == ""){
    //         this.babyNo = 0;
    //     }else{
    //         this.babyNo = parseInt(value);
    //     }
    //     this.total();
    // }
    // total(){
    //     this.totalNo = ((this.maleNo != null)? this.maleNo : 0 ) + ((this.femaleNo != null)? this.femaleNo : 0 )+ ((this.boyNo != null)? this.boyNo : 0 ) + ((this.girlNo != null)? this.girlNo : 0 ) + ((this.babyNo != null)? this.babyNo : 0 );
    // }
}