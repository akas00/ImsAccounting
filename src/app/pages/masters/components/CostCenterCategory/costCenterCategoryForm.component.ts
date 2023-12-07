import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonService } from "../../../../common/services/common.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCostCenterCategoryService } from './costCenterCategory.service';
import { ModalDirective } from 'ng2-bootstrap';
import { CostCenterCategory } from '../../../../common/interfaces/TrnMain';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../common/services/permission/authService.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
@Component(
    {

        selector: 'CostCenterCategoryFormSelector',
        templateUrl: './costCenterCategoryForm.component.html',
        providers: [ CommonService, MasterRepo],
        styleUrls: ["../../../modal-style.css", "./costCenterCategory.component.scss"],

    }
)
export class CostCentercategoryFormComponent  {
    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    costCenterCategory: CostCenterCategory = <CostCenterCategory>{};
    costCenterCategoryList: CostCenterCategory[] = [];
    form: FormGroup;
    router: Router;
    private returnUrl: string;
    userProfile: any = <any>{};
    private subcriptions: Array<Subscription> = [];
    ccgid:number;

    constructor(public masterService: MasterRepo,  private authService: AuthService,   router: Router, private _commonservice: CommonService,private _activatedRoute: ActivatedRoute, private fb: FormBuilder,
        private alertService: AlertService
        ) {
        this.userProfile = authService.getUserProfile();
        this.router = router;
        if (!!this._activatedRoute.snapshot.params['returnUrl']) {
            this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];

                    let CostCenterCategoryName: string = "";
                    if(this._activatedRoute.snapshot.params['COSTCENTERGROUPNAME']){
                    CostCenterCategoryName = this._activatedRoute.snapshot.params['COSTCENTERGROUPNAME'];
        
                    this.masterService.getCostCenterGroup(CostCenterCategoryName)
                        .subscribe(data => {
                            if (data.status == 'ok') {
                                this.form.setValue({
                                    COSTCENTERGROUPNAME: data.result.COSTCENTERGROUPNAME || '',
                                    DIVISION:data.result.DIVISIOLN ||'',
                                    TYPE: data.result.TYPE || '',
                                    COMPANYID: data.result.COMPANYID || '',
                                    //ccgid:data.result.ccgid,
                                    
                                });
                                this.mode = this._activatedRoute.snapshot.params['mode'];
                                if(this.mode=='view'){
                                    this.form.get('COSTCENTERGROUPNAME').disable();
                                   // this.form.get('COSTCENTERGROUPNAME').disable();
                                }else{
                                    this.form.get('COSTCENTERGROUPNAME').enable();
                                   // this.form.get('COSTCENTERGROUPNAME').enable();
                                }
                                this.ccgid = data.result.ccgid;
                            }
                        
                }, error => {
                    this.mode = '';
                  //  this.modeTitle = "Edit2 -Error in CostCenter";
                        this.form.get('COSTCENTERGROUPNAME').enable();

                   
                    this.masterService.resolveError(error, "costCenterCategoryForm - getCostCenterCategory");
                }

                )
            }
            }
            else {
                this.mode = "add";
                // this.modeTitle = "Add CostCenter";
             this.form.get('COSTCENTERGROUPNAME').enable();
                // this.initialTextReadOnly = false;

            }
        }

        ngOnInit() {

            try {
             
                
                this.form = this.fb.group({
                 
                    COSTCENTERGROUPNAME:   [''],
                    DIVISION: ['', Validators.required],
                    TYPE:[''],
                    COMPANYID:[''],
                   
                   
                });

                this.form.patchValue({
                            DIVISION:this.userProfile.division,
                            TYPE:'A',
                            COMPANYID:this.userProfile.CompanyInfo.ACID
            
                        })
             //   this.masterService.getDivisions().subscribe(res => { this.divisionList.push(<IDivision>res); });
                // this.masterService.getCostCenter().subscribe(res => { this.costCenterList.push(<CostCenter>res); });
            } catch (ex) {
                //console.log(ex);
                alert(ex);
            }
    
        }
    
     

    onSave() {
        //validate before Saving
        try {
           // this.DialogMessage = "Saving Data please wait..."
            // this.childModal.show();
            this.onsubmit();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    onsubmit() {
        try {
            
            console.log("submit call", this.form.value.DIVISION);
            let costCenterCategory = <CostCenterCategory>{}

            if(this.form.value.COSTCENTERGROUPNAME==null || this.form.value.COSTCENTERGROUPNAME==''){
                this.alertService.info("Cost Center Group Name cannot be empty");
                return;
            }
            if(this.form.value.COSTCENTERGROUPNAME.trim()==""){
                this.alertService.info("Cost Center Group Name cannot be empty");
                return;
              }
            costCenterCategory.COSTCENTERGROUPNAME = this.form.value.COSTCENTERGROUPNAME;
            costCenterCategory.DIVISION = this.form.value.DIVISION;
            costCenterCategory.TYPE = "A";
           
            costCenterCategory.COMPANYID = this.form.value.COMPANYID;
       
            if(this.mode == "edit"){
                costCenterCategory.ccgid = this.ccgid;
            }
            let sub = this.masterService.saveCostCenterCategory(this.mode, costCenterCategory)
                .subscribe((data:any) => {
                    // alert("returnStatus "+ data);
                    console.log("data",data)
                    if (data.status == 'ok') {
                        //Displaying dialog message for save with timer of 1 secs
                       // this.DialogMessage = "Data Saved Successfully"
                       this.alertService.info("Data Saved Successfully");
                        setTimeout(() => {
                            // this.childModal.hide();

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
                        //this.DialogMessage = "!!!Error in Saving Data:" + data.result._body;
                        alert("!!!Error in Saving Data:" + data.result._body)
                      
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

}