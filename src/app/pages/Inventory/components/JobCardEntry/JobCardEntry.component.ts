import { AppSettings } from '../../../../common/services/AppSettings';
import { IDivision } from './../../../../common/interfaces/commonInterface.interface';
import { Subscriber } from 'rxjs/Subscriber';
import { Subject } from 'rxjs/Subject';
import { SettingService } from './../../../../common/services/setting.service';
import { TransactionService } from './../../../../common/Transaction Components/transaction.service';
import { PREFIX } from './../../../../common/interfaces/Prefix.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Item } from './../../../../common/interfaces/ProductItem';
import { Observable } from 'rxjs/Observable';
import { TrnMain, Warehouse, VoucherTypeEnum } from './../../../../common/interfaces/TrnMain';
import { AuthService } from './../../../../common/services/permission/authService.service';
import { MasterRepo } from './../../../../common/repositories/masterRepo.service';

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

//import { SmartTablesService } from './smartTables.service';
import { ModalDirective } from 'ng2-bootstrap';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";

import { ActivatedRoute, Router } from '@angular/router';
import { JobCardService } from './jobcard.service';

@Component({
    selector: 'JobCardEntry',
    templateUrl: './JobCardEntry.html',
    styleUrls: ["./../../../Style.css", "./../../../../common/Transaction Components/halfcolumn.css"],
    providers: [JobCardService],
})

export class JobCardEntryComponent {
    DialogMessage: string = "Saving";
    @ViewChild('childModal') childModal: ModalDirective;
    form: FormGroup;
    results: Observable<Item[]>;
    subscriptions: Subscription[] = [];
    selectedItem: any = <any>{};
    voucherType: VoucherTypeEnum = VoucherTypeEnum.StockSettlement;
    prefix: PREFIX = <PREFIX>{};
    mode: string;
    private subcriptions: Array<Subscription> = [];
    Initial: string = "";
    dataList: any[] = [];
    dataObj: any;
    InvList: any;
    private returnUrl: string;
    VehicleList: any[] = [];
    JcardMainList: any[] = [];
    machanicList: any[] = [];
    fom: FormGroup;
    JcardProdList: any[] = [];
    customerList: any[] = [];
    IMENOList: any[] = [];
    SupervisorList: any[] = [];
    userProfile: any;
    busy: Subscription;
    divisionList: IDivision[] = [];
    private division: string;
    modeTitle: string;
    AppSettings;
    constructor(private _JCService: JobCardService, private setting: SettingService, private _trnMainService: TransactionService, private masterService: MasterRepo, private _activatedRoute: ActivatedRoute, private router: Router, private _fb: FormBuilder, private authService: AuthService) {
        this.userProfile = this.authService.getUserProfile();
        // this._trnMainService.pageHeading = "JOB CARD";
        this.AppSettings = this.setting.appSetting;
        // this.form.patchValue({JOBTYPE:"PaidUp"})
        this._JCService.getJobCardMain()
            .subscribe(data => {
                //console.log({ SettlementData: data })
                this.JcardMainList.push(data);
            })

        this._JCService.getAllMACHANIC()
            .subscribe(data => {
                // //console.log({SettlementData:data})
                this.machanicList.push(data);
            })
        this._JCService.getCustomerList()
            .subscribe(data => {
                this.customerList.push(data);
            })
        this._JCService.getAllSuperVisorName()
            .subscribe(data => {
                this.SupervisorList.push(data);

            })


    }

    ngOnInit() {
        this.form = this._fb.group({
            RegNo: ['', Validators.required],
            ChasisNo: [''],
            EngineNo: [''],
            Brand: [''],
            Model: [''],
            CustomerName: ['', Validators.required],
            Address: [''],
            Phone: [''],
            MobileNo: [''],
            selectedProd: [''],
            JOBTYPE: ['', Validators.required],
            KMREADING: [''],
            REMARKS: [''],
            LASTKMREADING: [''],
            LASTSERVICEDATE: [''],
            SALEDATE: [''],
            SALEMITI: [''],
            DELDATE: [''],
            DELMITI: [''],
            JobDescription: [''],
            DeliveryTime: [''],
            MACNAME: [''],
            SUPNAME: [''],
            TwelveHrClock: [''],
            JOBNO: [''],
            CHALANNO: [''],
            TRNDATE: [''],
            BSDATE: [''],
            TRN_DATE: [''],
            BS_DATE: [''],
            DIVISION: [''],
            BearName: ['']

        });
        // let Div=this.setting.appSetting.DefaultDivision
        // this._JCService.getJobNo(Div).subscribe(res => {
        //         ////console.log("res%",res)
        //         // let TMain = <TrnMain>res.result;
        //         // this.form.patchValue({JOBNO:res})
        //         // this.form.get('CHALANNO').setValue(TMain.CHALANNO);

        // });
        if (this.form.value.DIVISION == '' || this.form.value.DIVISION == null) {
            this.form.patchValue({ DIVISION: this.setting.appSetting.DefaultDivision })
        }
        var sub1 = this.masterService.getCurrentDate().subscribe(date => {
            ////console.log("DATA*", date);
            this.form.patchValue({
                DELDATE: date.Date.substring(0, 10),
                TRNDATE: date.Date.substring(0, 10),
                TRN_DATE: date.Date.substring(0, 10),
            })
            this.changeEntryDate(date.Date.substring(0, 10), "AD");
            this.changeTrnDateDate(date.Date.substring(0, 10), "AD");
            this.changeTrn_Date(date.Date.substring(0, 10), "AD");
        }, error => {
            //console.log({ errorGetCurrentDate: error });
            this.masterService.resolveError(error, "voucher-date - getCurrentDate");
        });
        if (!!this._activatedRoute.snapshot.params['mode']) {
            this.mode = this._activatedRoute.snapshot.params['mode'];
        }
        var mode: string;
        if (!!this._activatedRoute.snapshot.params['vchr']) {
            this.modeTitle = "EDIT JOB-CARD"
            this._trnMainService.TrnMainObj.Mode = 'EDIT'
            let vchr = this._activatedRoute.snapshot.params['vchr'];

            this._JCService.getJobCardFromID(vchr).subscribe(data => {
                if (data) {
                    if (data.status == "ok") {
                        ////console.log("ConsumptionD@T@", data)
                        this.dataObj = data.Result
                        this.dataList = data.Result2;
                        this.busy = this._JCService.getVehileRegList()
                            .subscribe(data => {
                                this.VehicleList = data;
                                var value = this.VehicleList.filter(a => a.REGNO == this.dataObj.VREGNO)[0]
                                this.itemChanged(value)
                                //  ////console.log("vehicleList", data)
                            });
                        this.form.patchValue({
                            RegNo: this.dataObj.VREGNO,
                            KMREADING: this.dataObj.KMREADING,
                            REMARKS: this.dataObj.REMARKS,
                            JOBTYPE: this.dataObj.JOBTYPE,
                            DELDATE: this.dataObj.DELDATE.substring(0, 10),
                            DELMITI: this.dataObj.DELMITI,
                            DeliveryTime: this.dataObj.DELTIME.substring(0, this.dataObj.DELTIME.length - 2),
                            TwelveHrClock: this.dataObj.DELTIME.substring(this.dataObj.DELTIME.length - 2),
                            MACNAME: this.dataObj.MACNAME,
                            SUPNAME: this.dataObj.SUPNAME,
                            // DateOfSALEAD:this.dataObj.PURDATE.substring(0,10),
                            // DateOfSALEBS:this.dataObj.PURMITI
                        });
                        // this.form.patchValue({ DeliveryTime: this.dataObj.DELTIME.substring(8, 13) })
                        let DescList: any[] = [];
                        let JDList = [];


                        for (let i of this.dataList) {
                            this._JCService.getJobDesciption()
                                .subscribe(data => {
                                    JDList = data;
                                }
                                , error => { //console.log(error) },
                                () => {

                                    for (let d of JDList) {
                                        if (d.JOBID == i.JOBID) {
                                            DescList.push(d);
                                            this.JcardProdList = [];
                                            this.JcardProdList = DescList;
                                        }
                                    }
                                });

                        }
                    }
                    //}
                }
            })

        }
        else {
            this.form.patchValue({ JOBTYPE: "PaidUp", TwelveHrClock: "pm" })
            this.modeTitle = "ADD JOB-CARD"
        }

    }
    CustName() {
        this.form.patchValue({ BearName: this.form.value.CustomerName })
    }
    // prefixChanged(pref: any) {
    //     try {
    //         //console.log({ prefix: pref })
    //         this._trnMainService.prefix = pref;
    //         this.prefix = pref;
    //         // if (this.TrnMainObj.Mode == 'NEW') {
    //             var tMain = <TrnMain>{ VoucherPrefix: pref.VNAME };
    //             if (this.TrnMainObj.DIVISION == '' || this.TrnMainObj.DIVISION == null) {
    //                 tMain.DIVISION = this.setting.appSetting.DefaultDivision;
    //             }

    //             this.masterService.getVoucherNo(tMain).subscribe(res => {
    //                 if (res.status == "ok") {
    //                     let TMain = <TrnMain>res.result;
    //                     this.TrnMainObj.VCHRNO = TMain.VCHRNO.substr(2, TMain.VCHRNO.length - 2);
    //                     this.TrnMainObj.CHALANNO = TMain.CHALANNO;
    //                 }
    //                 else {
    //                     alert("Failed to retrieve VoucherNo")
    //                     //console.log(res);
    //                 }
    //             });
    //         // }
    //     } catch (ex) {
    //         //console.log(ex);
    //         alert(ex);
    //     }
    // }

    /*dropdown on textType
    Start */
    search(event) {
        if (event.query == '') {
            this.results = this.dropListItem('a');
            return;
        }
        this.results = this.dropListItem(event.query);
    }
    AllVehicleList: any[] = [];
    dropListItem = (keyword: any): Observable<Array<any>> => {
        try {
            return new Observable((observer: Subscriber<Array<any>>) => {
                let sub11 = this._JCService.getVehileRegList()
                    //.map(m=>{return m.filter(i=>i.PTYPE==0)})
                    .map(fList => {
                        ////console.log({droplistitem:'before to upper'});
                        this.VehicleList = [];
                        this.VehicleList = fList
                        return fList.filter((data: any) =>

                            data.REGNO == null ? '' : data.REGNO.toUpperCase().indexOf(keyword.toUpperCase()) > -1)
                    })
                    .map(res => res.slice(0, 20))
                    .subscribe(data => {
                        observer.next(data);
                    }, Error => {
                        //console.log({ droplisterror: Error });
                        this.masterService.resolveError(Error, "VehicleRegNo - getREGNO");
                        this.masterService._itemListObservable$ = null;
                        observer.complete();
                    },
                    () => { observer.complete(); }
                    )
                this.subscriptions.push(sub11);
            });
        }
        catch (ex) {
            //console.log({ droplistError: ex });
        }
    }
    allItems: any[] = [];
    handleDropdownClick() {
        let resultDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
        this.results = resultDataSubject.asObservable();

        this._JCService.getVehileRegList()
            //.map(m=>{return m.filter(i=>i.PTYPE==0)})
            .subscribe(data => {
                this.allItems = data;
                resultDataSubject.next(this.allItems)
            }, error => this.masterService.resolveError(Error, 'VehicleRegNo-handledropdown')
            );


    }
    custID: any;
    VREGNO: any;
    JCMAIN: any = <any>{};
    itemChanged(value) {
        if (value) {
            this.VREGNO = value.REGNO;
            let cusObj: any;
            this.custID = value.CUSTID ? value.CUSTID : 0;
            cusObj = this.customerList.filter(b => b.CUSTID == value.CUSTID)[0]
            if (cusObj == null) {
                cusObj = <any>{};
            }
            if (value != null)
                this.JCMAIN = this.JcardMainList.filter(a => a.VREGNO == this.VREGNO)[0];
            if (this.JCMAIN == null) {
                this.JCMAIN = <any>{};
            }
            this.form.patchValue({
                EngineNo: value.REGNO,
                ChasisNo: value.CHASISNO,
                Brand: value.BRAND,
                Model: value.MODEL,
                SALEDATE: value.PURDATE ? value.PURDATE : null,
                SALEMITI: value.PURMITI ? value.PURMITI : null,
                CustomerName: cusObj.CUSTNAME,
                MobileNo: cusObj.CUSTMOB,
                Address: cusObj.CUSTADD,
                Phone: cusObj.CUSTPHONE,
                LASTSERVICEDATE: this.JCMAIN.TRNDATE,
                LASTKMREADING: this.JCMAIN.KMREADING,
                BearName: cusObj.CUSTNAME

            })
        }
    }
    onIFocus(event) {
        if (event.target.value == "") {
            return
        }
        else {

            this.search({ query: event.target.value });
        }
    }


    /*END*/
    removeStart() {
        this.form.patchValue({ DeliveryTime: '', });
    }
    onAddClick() {
        this.JcardProdList.push(this.jobDescObj)
        this.jobDescObj = <any>{}
        this.form.patchValue({ JobDescription: '' });
        // ////console.log("DA@@@", this.JcardProdList)
    }
    jobDescObj: any = <any>{};
    JobDescription(value) {
        if (value) {
            this.jobDescObj = value;

        }
    }
    /****************************************** */
    clickEntryDate(value) {
        try {
            if (value != null && value != 0) {
                var adbs = require("ad-bs-converter");
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("DELDATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    changeEntryDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.form.get("DELMITI").setValue(bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("DELDATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    /****************************************** */
    clickTrnDateDate(value) {
        try {
            if (value != null && value != 0) {
                var adbs = require("ad-bs-converter");
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRNDATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    changeTrnDateDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.form.get("BSDATE").setValue(bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRNDATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    /****************************************** */
    clickTrn_Date(value) {
        try {
            if (value != null && value != 0) {
                var adbs = require("ad-bs-converter");
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRN_DATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    changeTrn_Date(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.form.get("BS_DATE").setValue(bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRN_DATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    /****************************************** */

    /*JOOOOOOOOB dropdown on textType
    Start */
    Jobsearch(event) {
        if (event.query == '') {
            this.results = this.JobdropListItem('s');
            return;
        }
        this.results = this.JobdropListItem(event.query);
    }

    JobdropListItem = (keyword: any): Observable<Array<any>> => {
        try {
            return new Observable((observer: Subscriber<Array<any>>) => {
                let sub11 = this._JCService.getJobDesciption()
                    //.map(m=>{return m.filter(i=>i.PTYPE==0)})
                    .map(fList => {
                        ////console.log({droplistitem:'before to upper'});
                        this.VehicleList = fList
                        return fList.filter((data: any) =>

                            data.DESCRIPTION == null ? '' : data.DESCRIPTION.toUpperCase().indexOf(keyword.toUpperCase()) > -1)
                    })
                    .map(res => res.slice(0, 20))
                    .subscribe(data => {
                        observer.next(data);
                    }, Error => {
                        //console.log({ droplisterror: Error });
                        this.masterService.resolveError(Error, "Product Insert - getProductItemList");
                        this.masterService._itemListObservable$ = null;
                        observer.complete();
                    },
                    () => { observer.complete(); }
                    )
                this.subscriptions.push(sub11);
            });
        }
        catch (ex) {
            //console.log({ droplistError: ex });
        }
    }


    JobonIFocus(event) {
        if (event.target.value == "") {
            return
        }
        else {

            this.search({ query: event.target.value });
        }
    }


    /*END*/
    // prefixChanged(pref: any) {
    //     try {
    //         //console.log({ prefix: pref })
    //         this._trnMainService.prefix = pref;
    //         this.prefix = pref;
    //         if (this.TrnMainObj.Mode == 'NEW') {
    //             var tMain = <TrnMain>{ VoucherPrefix: pref.VNAME };
    //             if (this.TrnMainObj.DIVISION == '' || this.TrnMainObj.DIVISION == null) {
    //                 tMain.DIVISION = this.setting.appSetting.DefaultDivision;
    //             }

    //             this.masterService.getVoucherNo(tMain).subscribe(res => {
    //                 if (res.status == "ok") {
    //                     let TMain = <TrnMain>res.result;
    //                     this.TrnMainObj.VCHRNO = TMain.VCHRNO.substr(2, TMain.VCHRNO.length - 2);
    //                     this.TrnMainObj.CHALANNO = TMain.CHALANNO;
    //                 }
    //                 else {
    //                     alert("Failed to retrieve VoucherNo")
    //                     //console.log(res);
    //                 }
    //             });
    //         }
    //     } catch (ex) {
    //         //console.log(ex);
    //         alert(ex);
    //     }
    // }
    // // tree start
    // menucodeChanged(value: string) {
    // }
    timeChange(value) {
        if (value > 12.59) {
            this.form.patchValue({ DeliveryTime: "12.59" });
        }
    }
    TableRowDoubleClickEvent(Desc: any, index) {
        if (this.mode != "view") {
            let descObj:any
            descObj = this.JcardProdList.filter(i => i.DESCRIPTION = Desc)[0]
            this.JcardProdList.splice(index, 1);
            for (let i of this.JcardProdList) {
                this.form.patchValue({ JobDescription: descObj })
            }
        }
    }

    JobMainObj: any = <any>{};
    JobProdList: any[] = [];
    onSave() {
        this.JobMainObj.DIV = this.userProfile.userDivision
        this.JobMainObj.TRNDATE = this.form.value.TRNDATE;
        this.JobMainObj.BSDATE = this.form.value.BSDATE;
        this.JobMainObj.VREGNO = this.VREGNO;
        // this.JobMainObj.KMREADING = this.JCMAIN.KMREADING;
        this.JobMainObj.KMREADING = this.form.value.KMREADING ? this.form.value.KMREADING : 0;
        this.JobMainObj.DELDATE = this.form.value.DELDATE;
        this.JobMainObj.DELMITI = this.form.value.DELMITI;
        this.JobMainObj.NAME = this.form.value.CustomerName;
        this.JobMainObj.ADDRESS = this.form.value.Address;
        this.JobMainObj.TEL_H = this.form.value.Phone;
        this.JobMainObj.MOBILE = this.form.value.MobileNo;
        this.JobMainObj.JOBTYPE = this.form.value.JOBTYPE
        this.JobMainObj.MACNAME = this.form.value.MACNAME;
        this.JobMainObj.SUPNAME = this.form.value.SUPNAME;
        this.JobMainObj.STATUS = 0;
        this.JobMainObj.TRNUSER = this.userProfile.username;
        // JobMainObj.EDITTIME=edittime
        // JobMainObj.EDITUSER=editUSER
        this.JobMainObj.REFNO = null;
        this.JobMainObj.APPAMNT = 0.00;
        this.JobMainObj.PROBLEM = null;
        this.JobMainObj.SPUSEDLIST = null;
        this.JobMainObj.REDATE = null;
        this.JobMainObj.RDMITI = null;
        this.JobMainObj.DISPATCHNO = 0;
        this.JobMainObj.REMARKS = this.form.value.REMARKS;
        this.JobMainObj.DELTIME = this.form.value.DeliveryTime + this.form.value.TwelveHrClock;
        this.JobMainObj.CUSTID = this.custID;
        if (this.mode == 'edit') {
            this.JobMainObj.EDITUSER = this.userProfile.username;
            this.JobMainObj.JOBNO = this.dataObj.JOBNO;
            this.JobMainObj.RDDATE = this.dataObj.TRNDATE;
            this.JobMainObj.RDMITI = this.dataObj.BSDATE;
        }
        for (let i of this.JcardProdList) {

            let Joblst: any = <any>{};
            Joblst.DIV = this.userProfile.userDivision
            Joblst.JOBID = i.JOBID;
            Joblst.SN = 1;
            Joblst.JOBSERIAL = 1;
            this.JobProdList.push(Joblst);
        }
        //console.log(this.JobMainObj, this.JobProdList)

        // this.mode = "add";
        this.onsubmit();

    }
    onsubmit() {
        try {
            this.DialogMessage = "Saving.... Please Wait!"
            this.childModal.show();

            let sub = this._JCService.saveJobCard(this.mode, this.JobProdList, this.JobMainObj)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        setTimeout(() => {
                            this.childModal.hide();
                        }, 1000)
                        // this.router.navigate([this.returnUrl]);
                        ////console.log("Output", data)
                    }
                },
                error => { alert(error) }
                );
            this.subcriptions.push(sub);
        }
        catch (e) {
            //this.childModal.hide()
            alert(e);
        }
    }

}