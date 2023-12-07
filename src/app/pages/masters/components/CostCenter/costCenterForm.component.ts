import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { CostCenter } from "../../../../common/interfaces/TrnMain";
import { CommonService } from "../../../../common/services/common.service";
import { AddCostCenterService } from './addCostCenter.service';
import { IDivision } from '../../../../common/interfaces/commoninterface.interface';
import { CostCenterService } from './costCenter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
@Component(
    {

        selector: 'CostCenterFormSelector',
        templateUrl: './costCenterForm.component.html',
        providers: [AddCostCenterService, CommonService, CostCenterService, MasterRepo],
        styleUrls: ["../../../modal-style.css"],

    }
)
export class CostCenterFormComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') childModal: ModalDirective;

    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    modeTitle: string = '';
    costCenter: CostCenter = <CostCenter>{};
    costCenterList: CostCenter[] = [];

    division: IDivision = <IDivision>{};
    //divisionList: IDivision[] = [];
    @ViewChild("genericCostCenter") genericCostCenter: GenericPopUpComponent;
    gridPopupSettingsForCostCenterList: GenericPopUpSettings = new GenericPopUpSettings();
    initialTextReadOnly: boolean = false;
    private returnUrl: string;
    rategroup: Array<any> = [];
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];


    private hideparent = true;
    private hideAddNewbttn = true;
    cc = true;
    router: Router;
    CCID: any;

    ngOnInit() {

        try {
            let self = this;
            this.hideparent = false;
            this.form = this.fb.group({
                // PARENT: [''],
                DIVISION:[''],
                CostCenterName: [''],
                PARENT: [''],
                NewParent: [''],
                ccgid:[''],
                COSTCENTERGROUPNAME:['']
            });
         //   this.masterService.getDivisions().subscribe(res => { this.divisionList.push(<IDivision>res); });
            this.masterService.getCostCenter().subscribe(res => { this.costCenterList.push(<CostCenter>res); });
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }

    }
    constructor(public masterService: MasterRepo, protected service: AddCostCenterService, protected ccService: CostCenterService, router: Router, private _activatedRoute: ActivatedRoute, private _commonservice: CommonService, private fb: FormBuilder) {
        try {
            this.router = router;
            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['costcenterName']) {
                let CostCenterName: string = "";
                CostCenterName = this._activatedRoute.snapshot.params['costcenterName'];

                let _ccid: string = "";
                _ccid = this._activatedRoute.snapshot.params['CCID'];
                this.service.getCostCenter(CostCenterName)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            if(data.result){
                                this.form.setValue({
                                    CostCenterName: data.result.COSTCENTERNAME || '',
                                    DIVISION: data.result.DIVISION || '',
                                    PARENT: data.result.PARENT || '',
                                    NewParent: '',
                                    ccgid:data.result.ccgid,
                                    COSTCENTERGROUPNAME:data.result.costcentergroupname
                                    
                                });
                            }

                            this.CCID = _ccid;
                            this.mode = this._activatedRoute.snapshot.params['mode'];
                            if(this.mode=='view'){
                                this.modeTitle = "View CostCenter";
                                this.form.get('CostCenterName').disable();
                                this.form.get('COSTCENTERGROUPNAME').disable();
                            }else{
                                this.modeTitle = "Edit CostCenter";
                                this.form.get('CostCenterName').enable();
                                this.form.get('COSTCENTERGROUPNAME').enable();
                            }
                            this.initialTextReadOnly = true;
                            ////console.log("@@this.CCID",data.result);

                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit -Error in CostCenter";
                            this.form.get('CostCenterName').enable();
                            this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in CostCenter";
                        this.form.get('CostCenterName').enable();
                        this.masterService.resolveError(error, "costCenterForm - getCostCenter");
                    }
                    )
            }
            else {
                this.mode = "add";
                this.modeTitle = "Add CostCenter";
                // this.form.get('CostCenterName').enable();
                this.initialTextReadOnly = false;

            }


            //console.log(this.costCenter.CostCenterName);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    cancel() {
        try {
            this.router.navigate([this.returnUrl]);
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    AddNewParent() {
        try {
            this.hideparent = true;
            this.hideAddNewbttn = false;
            this.cc = false;
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }


    SaveNewParent() {
        try {
            var v = this.form.get('NewParent').value;
            //new added code by bipin for displaying newly added parent in dropdown 
            this.form.patchValue({
                PARENT : v,
                NewParent : v
            })
            //
            this.costCenterList.push(<CostCenter>{ CostCenterName: v, Parent: '', TYPE: 'G', DIVISION: '' });
            this.cc = true;
            this.hideparent = false;
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    CalcelNewPArent() {
        try {
            this.hideparent = false;
            this.hideAddNewbttn = true;
            this.cc = true;
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
    onSave() {
        //validate before Saving
        try {
            this.DialogMessage = "Saving Data please wait..."
            this.childModal.show();
            this.onsubmit();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    onsubmit() {
        try {
            ////console.log("submit call");
            let costCenter = <CostCenter>{}
            if(this.form.value.CostCenterName==null || this.form.value.CostCenterName==''){
                this.DialogMessage = "Cost Center Name cannot be empty";
                return;
            }
            if(this.form.value.CostCenterName.trim()==""){
                this.DialogMessage = "Cost Center Name cannot be empty";
                return;
              }
            if(this.masterService.userSetting.EnableCompulsoryCostCategory==1){
            if((this.form.value.COSTCENTERGROUPNAME==null || this.form.value.COSTCENTERGROUPNAME=='')){
                this.DialogMessage = "Cost Center Group Name cannot be empty";
                return;
            }
        }
        else{
                this.form.patchValue({
                    COSTCENTERGROUPNAME:'Default',
                    ccgid:0
                })
            }
            
            costCenter.CostCenterName = this.form.value.CostCenterName;
            costCenter.DIVISION = this.form.value.DIVISION;
            costCenter.Parent = this.form.value.PARENT;
            costCenter.TYPE = "A";
            costCenter.ccgid=this.form.value.ccgid
            if(this.mode == "edit"){
                costCenter.CCID = this.CCID;
            }
            //console.log({ tosubmit: costCenter });
            //alert(ret.result)
            //calling observable of saveDivision
            let sub = this.masterService.saveCostCenter(this.mode, costCenter)
                .subscribe(data => {
                    // alert("returnStatus "+ data.status);
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
                        this.DialogMessage = "!!!Error in Saving Data:" + data.result._body;
                        //this.DialogMessage = "Error in Sabing Data:" +data.result;
                        //console.log(data.result._body);
                        setTimeout(() => {
                            this.childModal.hide();
                        }, 3000)

                        // this.DialogMessage = "Successfully Saved!!";
                        // //console.log(data.result._body);
                        // setTimeout(() => {
                        //     this.childModal.hide();
                            
                        //     this.router.navigate([this.returnUrl]);
                        // }, 1000)

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
    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        try {
            this.loginModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    hideChildModal() {
        this.childModal.hide();
    }
    CostCenterEnterClicked() {
        this.gridPopupSettingsForCostCenterList ={
        title: "Cost Center Category",
        apiEndpoints: `/getCostCenterGroupPagedList`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'ccgid',
            title: 'ID',
            hidden: false,
            noSearch: false
          },
          {
            key: 'COSTCENTERGROUPNAME',
            title: 'Cost Center Category Name',
            hidden: false,
            noSearch: false
          },
        ]
      }; 
        this.genericCostCenter.show();
    }

    dblClickCostCenterSelect(account) {

        this.form.patchValue({
            COSTCENTERGROUPNAME:account.COSTCENTERGROUPNAME,
            ccgid:account.ccgid
        })
    }
    preventInput($event) {
        $event.preventDefault();
        return false;
      }
}









