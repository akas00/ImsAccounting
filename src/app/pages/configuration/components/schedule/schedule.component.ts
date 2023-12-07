import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ScheduleService } from './schedule.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Schedule } from "../../../../common/interfaces/Schedule.interface";
@Component(
    {
        selector: 'schedule',
        templateUrl: './schedule.component.html',
        styleUrls: ["../../../modal-style.css"],
        providers: [ScheduleService],
    }
)
export class scheduleComponent {
    DialogMessage: string = "Saving";
    @ViewChild('childModal') childModal: ModalDirective;
    date1: Date; //start date bind
    date2: Date; //end date bind
    selectedValues: string[] = [];
    schedule: Schedule = <Schedule>{};
    private subcriptions: Array<Subscription> = [];
    form: FormGroup;
    dayselect: any;
    daySun: boolean;
    dayMon: any;
    dayTue: any;
    dayWed: any;
    dayThu: any;
    dayFri: any;
    daySat: any;
    private returnUrl: string;
    modeTitle: string = '';
    id: any;
    invalidDates: Array<Date>;
    viewMode = false;
    constructor(protected masterService: MasterRepo, private fb: FormBuilder, private _activatedRoute: ActivatedRoute, private service: ScheduleService, private router: Router) {
        this.modeTitle = "Schedule";
    }

    ngOnInit() {
        try {
            let self = this;
            this.form = this.fb.group({
                disid: [''],
                discountname: ['', Validators.required],
                startdate: ['', Validators.required],
                enddate: ['', Validators.required],
                starttime: ['', Validators.required],
                endtime: ['', Validators.required],
                sun: [''],
                mon: [''],
                tue: [''],
                wed: [''],
                thu: [''],
                fri: [''],
                sat: [''],
            });
            if (!!this._activatedRoute.snapshot.params['mode']) {
                if (this._activatedRoute.snapshot.params['mode'] == "view") {
                    this.viewMode = true;
                    this.form.get('discountname').disable();
                    this.form.get('startdate').disable();
                    this.form.get('enddate').disable();
                   this.form.get('starttime').disable();
                    this.form.get('sun').disable();
                    this.form.get('mon').disable();
                    this.form.get('tue').disable();
                    this.form.get('wed').disable();
                    this.form.get('thu').disable();
                    this.form.get('fri').disable();
                    this.form.get('sat').disable();
                   }
            }
            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['initial']) {
                let Initial: string = "";
                Initial = this._activatedRoute.snapshot.params['initial'];
                this.id = Initial;
                this.service.getEditSchedule(Initial)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            ////console.log("DA@T@", data);
                            let today = new Date();
                            let sDate = new Date(data.result.DateStart);
                            let eDate = new Date(data.result.DateEnd)
                            ////console.log("date", data.result.DayOfWeek.split(","));
                            var dayweek: any[];
                            let dw: any;
                            dayweek = data.result.DayOfWeek.split(",")
                            if (dayweek.indexOf("SU") > -1 == true) {
                                this.form.patchValue({ sun: true })
                            }
                            if (dayweek.indexOf("MO") > -1 == true) {
                                this.form.patchValue({ mon: true })
                            }
                            if (dayweek.indexOf("TU") > -1 == true) {
                                this.form.patchValue({ tue: true })
                            }
                            if (dayweek.indexOf("WE") > -1 == true) {
                                this.form.patchValue({ wed: true })
                            }
                            if (dayweek.indexOf("TH") > -1 == true) {
                                this.form.patchValue({ thu: true })
                            }
                            if (dayweek.indexOf("FR") > -1 == true) {
                                this.form.patchValue({ fri: true })
                            }
                            if (dayweek.indexOf("SA") > -1 == true) {
                                this.form.patchValue({ sat: true })
                            }

                            ////console.log("!@@", dw);
                            this.date1=sDate;
                            this.date2=eDate;
                            this.form.patchValue({
                                discountname: data.result.DiscountName,
                                startdate: sDate,
                                enddate: eDate,
                                starttime: data.result.TimeStart.substring(12, 16),
                                endtime: data.result.TimeEnd.substring(12, 16),


                            });

                            if (this._activatedRoute.snapshot.params['mode'] == "edit") {
                                this.modeTitle = "Edit Schedule";
                            } else if (this._activatedRoute.snapshot.params['mode'] == "view") {
                                this.modeTitle = "View Schedule";
                            }
                            this.mode = 'edit';
                            // this.initialTextReadOnly = true;

                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit -Error in Schedule";
                            // this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in Schedule";
                        this.masterService.resolveError(error, "Schedule - getSchedule");
                    }
                    )
            }
            else {
                this.mode = "add";
                this.modeTitle = "Add Schedule";
                // this.initialTextReadOnly = false;

            }


            //this.model.id = this.returnUrl;
            // //console.log(this.warehouse);

            // this.MasterService.getDivisions().subscribe(res=>{this.divisionList.push(<IDivision>res);});
            // this.MasterService.getCostCenter().subscribe(res=>{this.costCenterList.push(<CostCenter>res);});
            //  this.divisionList=this._commonservice.getDivisionList();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    onSave() {
        try {
            this.onSaveClicked();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    mode: string = "add";
    onSaveClicked() {
        try {

            let d = this.getdaysList();
            let sched = <Schedule>{}
            if (this.mode == 'edit') {
                alert("this.id" + this.id)
                sched.DisId = this.id
                // sched.DisId=this.form.value.disid;
            }
            sched.DiscountName = this.form.value.discountname,
                sched.DateStart = this.form.value.startdate;
            sched.DateEnd = this.form.value.enddate;
            sched.DayOfWeeK = d;
            sched.TimeStart = this.form.value.starttime;
            sched.TimeEnd = this.form.value.endtime;
            ////console.log("SCHED @#$", sched)
            this.DialogMessage = "Saving.... Please Wait!"
            this.childModal.show();
            let sub = this.masterService.saveschedule(this.mode, sched)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        if (data.result == 'NameFound') {
                            this.DialogMessage = "Cannot save duplicate name."
                            this.childModal.show();
                            setTimeout(() => {
                                this.childModal.hide();
                            }, 3000)
                            this.form.patchValue({ discountname: "", })
                        }
                        else {
                            setTimeout(() => {
                                this.childModal.hide();
                                this.router.navigate([this.returnUrl]);
                            }, 2000)
                        }


                    }
                    else {
                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            // this.router.navigate(['/login', this.router.url])
                            return;
                        }

                    }
                },
                error => { alert(error) }
                );
            this.subcriptions.push(sub);
        }
        catch (e) {
            // this.childModal.hide()
            alert(e);
        }



    }

    setDate() {

        this.date1 = this.form.value.startdate
    }
    endDate() {

        this.date2 = this.form.value.enddate
    }
    removeStart() {
        this.form.patchValue({ starttime: '', });
    }
    removeEnd() {
        this.form.patchValue({ endtime: '' });
    }
    onClickBack() {
        this.router.navigate(["pages/configuration/scheduleTable"]);
    }
    getdaysList() {
        ////console.log("getDays", this.form.value);
        let days = "";
        if (this.form.value.sun == true) { days = "SU,"; }
        if (this.form.value.mon == true) { days += "MO,"; }
        if (this.form.value.tue == true) { days += "TU,"; }
        if (this.form.value.wed == true) { days += "WE,"; }
        if (this.form.value.thu == true) { days += "Th,"; }
        if (this.form.value.fri == true) { days += "FR,"; }
        if (this.form.value.sat == true) { days += "SA,"; }

        return days;
    }
}