import { style } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { MessageDialog } from '../../../modaldialogs/messageDialog/messageDialog.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectItem } from 'primeng/primeng';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, HostListener, SimpleChanges } from '@angular/core';
import { TreeViewPartyervice } from './partyledger.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup,  FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AcListTree, TAcList, PartyAdditional, SelectedDivisions } from "../../../../common/interfaces/Account.interface";
import { AuthService } from '../../../../common/services/permission';
import { Division } from '../../../../common/interfaces';
import { GroupParty, TreeViewAccService } from './AccLedger.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { TheadTitlesRowComponent } from 'ng2-smart-table/src/ng2-smart-table/components/thead/rows';

@Component(
    {
        selector: 'addAccLedgerSelector',
        templateUrl: 'addAccledger.component.html',
        //  [(ngModel)]="PARENTACNAME"
        // [(ngModel)]="RootName"
        providers: [TreeViewAccService],
        styles: [`input:disabled, select:disabled, textarea:disabled {
    cursor: not-allowed !important;
    color: black !important;
    background-color: #EBEBE4 !important;
}

button:disabled{
cursor: not-allowed !important;
}`]

    }
)
export class AddAccLedgerComponent {
    @Output('onClose') onClose = new EventEmitter();
    @Input('acid') ACID: string;
    // @Input('parent') Parent: string;
    Parent: any = <any>{}
    @Input('PARENTID') PARENTID: any;
    @Input('partyParentName') partyParentName: any;
    @Input() rootID: string;
    @Input() Title: string = '';
    @Input() mode: string;
    @Input() grp: string;
    @ViewChild('childModal') childModal: ModalDirective;
    @Output() SavePartyEmit = new EventEmitter();
    @Output() EditPartyEmit = new EventEmitter();
    @ViewChild('ACNAME') acnameField: ElementRef;
    @Input() parentGroupID:string;
    @Input() parentIdOnEdit:string;
    @Input() selectedNode: any;
    @Input() nodes: any[];
    @Input() overdraft:string;
    @Input() isBank:boolean;
    @ViewChild('DeleteAcc') DeleteAcc: ModalDirective;

    @ViewChild("genericGridBankList") genericGridBankList: GenericPopUpComponent;
    gridBankPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();



    // @Output("getParentNameEmit") getParentNameEmit = new EventEmitter();

    // @Output("getParentNameEmit") getParentNameEmit: EventEmitter<any> = new EventEmitter();


    selectednode: any;
    parentid: any;
    majorparent: any;
    majorParentAcList: any[] = [];
    acParentList: any[] = [];
    PARENTACNAME: string;
    RootName: string;
    acListtree: AcListTree = <AcListTree>{};
    ledgerAcObj: TAcList = <TAcList>{};
    ledgerAcList: TAcList[];
    private returnUrl: string;
    router: Router;
    form: FormGroup;
    viewMode = false;
    DialogMessage: string = "Saving data please wait ..."
    private subcriptions: Array<Subscription> = [];
    initialTextReadOnly = false;
    ID: string = '';
    modeTitle: string;
    parentGroup: GroupParty;
    acGroups: any[] = [];
    dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
    actype: string = '';
    disableActype: boolean = false;
    lastParentID: string;
    userProfile: any;
    GeoList: any[] = [];
    DistrictList: any[] = [];
    areaList: any[] = [];
    parentValueForEditMode: string;
    division: any[] = [];
    createMember: any;
    showDivSelectionTable: boolean = false;
    enableDivisionMapping: boolean;
    divisionList: any[] = [];
    SelectedDivisionList: SelectedDivisions[] = [];
    DivListForSave: DivList[] = [];
    accLevel: number;
    accMapId: string;
    accACTYPE: string;
    TDSType_List:any[] = [];


    constructor(protected MasterService: MasterRepo,
         private AccountService: TreeViewAccService,
          router: Router,
           private _activatedRoute: ActivatedRoute,
            private _fb: FormBuilder,
             public dialog: MdDialog,
              private _authService: AuthService,
               public spinnerservice:SpinnerService,
               public alertservice: AlertService) {
        this.router = router;
        this.userProfile = this._authService.getUserProfile();
        this.userSetting = this._authService.getSetting()
        this.division = [];
        this.MasterService.getAllDivisions()
            .subscribe(res => {
                this.division.push(<Division>res);
            }, error => {
                this.MasterService.resolveError(error, "divisions - getDivisions");
            });

            this.MasterService.getTDSTypeList().subscribe( res =>{
                    this.TDSType_List = res.result;
            })
    }
    userSetting: any;


    Init(){

        
        // this.service.getNewValues(selectL)
        //     .subscribe(data => {
        //         if (data.status == 'ok') {

        //             this.ledgerAcObj.PARENT = data.result.parent.ACID;
        //             this.PARENTACNAME = data.result.parent.ACNAME;
        //             this.ledgerAcObj.PType = data.result.parent.PType;
        //         }

        //     }
        //     , error => {
        //         this.router.navigate([this.returnUrl]);
        //         //console.log(error);
        //     }
        //     );
        
        ////console.log("userSetting", this.userSetting)
        this.AccountService.getHierachy().subscribe(res => {
            if (res.status == "ok") {
                this.GeoList = res.result.GEO;

            }
        });
        this.MasterService.getDistrict().subscribe(res => {
            if (res.status == 'ok') {
                this.DistrictList = res.result;
            }
        })

        this.MasterService.getAreaDetail().subscribe(res => {
            if (res.status == 'ok') {
                this.areaList = res.result;
            }
        })

       
    }


    ngOnInit() {

       
        this.form = this._fb.group({
            majorparent: [''],
            parentid: [''],
            ACNAME: ['', Validators.required],
            Ptype: [''],
            MAPID: [''],
            ADDRESS: [''],
            PHONE: [''],
            FAX: [''],
            EMAIL: [''],

            ACCODE: [''],

            isNotActive: [''],

            CITY: [''],
            STATE: [''],
            COMMON: [0],
            ISACTIVE: [1],
            VATNO: [''],
            CRPERIOD: [0],
            CRLIMIT: [0],
            GEO: ['111111-1'],
            CNAME: [''],
            ONAME: [''],
            OCONTACT: [''],
            ODESIGNATION: [''],
            CONTACTNAME: [''],
            CONTACT_A: [''],
            CONTACT_B: [''],
            CDESIGNATION: [''],
            RELATEDSPERSON_A: [''],
            RELATEDSPERSON_B: [''],
            NOTES: [''],
            Mobile: [''],
            INITIAL: [''],
            IsInitialValue: [0],
            createMember: [''],
            DIV: [this.userProfile.userDivision],
            ShareAccount: [''],
            ShareSelectiveDiv: [''],
            ShareAllDiv: [''],
            enableDivSelectionTable: [0],
            cusName:[''],
            ISCOMMONAC : [0],
            HASSUBLEDGER: [0],
            ACTYPE : [''],
            TDS_TYPE: ['']
            // BANKACCOUNTNUMBER : ['']
        })
        this.AccountService.addGroupSubject.subscribe((res) => {
            //console.log('common');
        })
        this.Init();
        this.MasterService.userSetting.DIVISIONWISEACLISTING == 1 ?
            this.enableDivisionMapping = true :
            this.enableDivisionMapping = false;


        this.form.get('ShareAllDiv').disable();
        this.form.get('ShareSelectiveDiv').disable();

        if(this.mode == "add"){
            // //console.log("WHEN ADD", this.selectedNode)
            this.getGroupList(this.ACID);
            this.getRootParent(this.selectedNode,this.nodes);
            this.accLevel = this.selectedNode.LEVELS + 1;
            this.accMapId = this.selectedNode.MAPID;


        }

        


        if (this.userSetting.AUTOSUPCODE == 1) {
            this.disableACCodeIfAutoSuponeisOne();
        }

        this.CheckCompanyAndValidate();
        this.getGroups();
      
        // this.MasterService.getAllAccount().subscribe(res => { this.ledgerAcList.push(<TAcList>res); });
        this.MasterService.getAccountListTree()
            .subscribe(data => {
                let l = data.filter(x => x.PARENTID == 'PAG');
                this.majorParentAcList = l;
                if (!!this._activatedRoute.snapshot.params['Par']) {
                    this.majorparent = this._activatedRoute.snapshot.params['Par'];
                    this.form.get('majorparent').setValue(this.majorparent);
                    this.majorgroupChange();
                }

                if (this.mode == 'edit' || this.mode == 'view') {
                    this.mode == 'edit' ? this.modeTitle = "Edit Party A/C" : this.modeTitle = "View Party Ledger"
                    this.getParentName(this.mode);
                    this.form.get('ACTYPE').disable();
                    this.MasterService.getAllAccount(this.ACID)
                        .subscribe(data => {
                            if (data.status == 'ok') {
                                //console.log("")
                                this.parentValueForEditMode = data.result.PARENT;
                                this.form.get('ACNAME').setValue(data.result.ACNAME);
                                this.form.get('HASSUBLEDGER').setValue(data.result.HASSUBLEDGER);
                               
                                this.form.get('ACCODE').setValue(data.result.ACCODE);
                                // this.form.get('ACCODE').setValue(data.result.ACID);
                               
                                this.form.get('COMMON').setValue(data.result.COMMON);
                               

                              
                                this.form.get('ISACTIVE').setValue(data.result.ISACTIVE);
                                this.form.get('DIV').setValue(data.result.DIV);
                                this.form.get('ISCOMMONAC').setValue(data.result.ISCOMMONAC);
                                this.form.get('ACTYPE').setValue(data.result.ACTYPE);
                                // this.form.get('BANKACCOUNTNUMBER').setValue(data.result.BANKACCOUNTNUMBER);
                                this.form.get('TDS_TYPE').setValue(data.result.TDS_TYPE);
                              
                                                    
                                this.form.get('INITIAL').setValue(data.result.INITIAL);
                                if (data.result.INITIAL == null || data.result.INITIAL == "") {
                                    this.form.get('IsInitialValue').setValue(0);
                                    this.form.get('INITIAL').disable();
                                } else {
                                    this.form.get('IsInitialValue').setValue(1);
                                    this.form.get('INITIAL').enable();
                                }
                                
                                if(data.result3.length >0){
                                    this.form.get('ShareAccount').setValue(1);
                                    this.enableShareOptions(1);
                                    if(this.division.length == data.result3.length){
                                        this.form.get('ShareAllDiv').setValue('2');
                                        this.enableDivSelectionTable(2);
                                    }else{
                                        this.form.get('ShareSelectiveDiv').setValue('1');
                                        this.enableDivSelectionTable(1);
                                    }
                                    this.changeDivision(this.MasterService.userProfile.CompanyInfo.INITIAL);
                                    this.division.forEach(x => {
                                        data.result3.forEach(div=>{
                                        x.INITIAL == div.DIV ? x.isCheck = true : '';
                                        })
                                    })                                                                 
                                }

                                // this.getGroupList();
                            }

                        },

                        );
                }

            });

            if(this.mode == 'edit' || this.mode == 'view'){
                //console.log("edit mode", this.parentIdOnEdit);
                this.getGroupList(this.parentIdOnEdit);
            }

        if (this.mode == 'view') {
            this.form.get('ACNAME').disable();
            this.form.get('ADDRESS').disable();
            this.form.get('PHONE').disable();
            this.form.get('FAX').disable();
            this.form.get('EMAIL').disable();
            this.form.get('VATNO').disable();
            this.form.get('ACCODE').disable();
            this.form.get('CRLIMIT').disable();
            this.form.get('Ptype').disable();
            this.form.get('HASSUBLEDGER').disable();

            this.form.get('Mobile').disable();
            this.form.get('CITY').disable();
            this.form.get('CRPERIOD').disable();
            this.form.get('STATE').disable();
            this.form.get('ISACTIVE').disable();
            this.form.get('CNAME').disable();
            this.form.get('ONAME').disable();
            this.form.get('OCONTACT').disable();
            this.form.get('GEO').disable();
            this.form.get('ODESIGNATION').disable();
            this.form.get('CONTACTNAME').disable();
            this.form.get('CONTACT_A').disable();
            this.form.get('CONTACT_B').disable();
            this.form.get('CDESIGNATION').disable();
            this.form.get('RELATEDSPERSON_A').disable();
            this.form.get('RELATEDSPERSON_B').disable();
            this.form.get('NOTES').disable();
            this.form.get('COMMON').disable();
            this.form.get('INITIAL').disable();
            this.form.get('IsInitialValue').disable();
            this.form.get('ACTYPE').disable();
            this.form.get('TDS_TYPE').disable();
            // this.form.get('BANKACCOUNTNUMBER').disable();
            // this.MasterService.disableGroupSelection = true;


        }

        ////console.log("parentname", this.Parent)


        if (this.Title == "AddLedger") {
            this.modeTitle = "Add New A/C";
        }
        else if (this.Title == "AddGroup") {
            this.modeTitle = "Add New Group";
        }

        if (this.mode == 'edit') {
            this.modeTitle = "Edit A/C";
        }

        if (this.mode == 'view') {
            this.modeTitle = "View A/C";
        }
        

    }


    ngOnChanges(changes:SimpleChanges) {
        //console.log("ng on changes", this.parentGroupID, this.ACID);
        if(changes.ACID){
            //console.log("from tree", this.ACID)
        this.getParentName(this.mode);
        // this.getRootParent(this.selectedNode,this.nodes);
        }

        if(changes.parentGroupID){
            if(this.parentGroupID != undefined && this.parentGroupID != ""){
                //console.log("group changed", this.parentGroupID);
               if(this.parentGroupID == 'AG013'){
                   this.overdraft = 'OD'
               }else{
                   this.overdraft = ''
               }

               if(this.parentGroupID == 'AG006'){
                this.isBank = true;
               }else{
                this.isBank = false;
               }

               if(this.mode == 'add'){
                this.ACID = this.parentGroupID;
                }
                this.MasterService.SelectedGroup = this.parentGroupID;
                this.getParentNameInGroupSelect( this.parentGroupID,"add");
                this.AccountService.getSelectNodeObj(this.parentGroupID).subscribe(res=>{
                    let actype = res[0].ACTYPE;
                    this.accACTYPE = res[0].ACTYPE;
                    this.accLevel = res[0].LEVELS + 1;
                    this.accMapId = res[0].MAPID;
                    this.form.get('ACTYPE').setValue(actype);
                });
            }
            
        }
    }


    ngAfterViewInit() {
        this.acnameField.nativeElement.focus();
    }

    getParentName(mode) {

        this.MasterService.getParentNamebyID(this.ACID, mode).subscribe(
            (res) => {
                ////console.log("result1231231231312", res);
                var parentName = res[0];
                this.form.get('parentid').setValue(parentName.ACNAME);
                this.form.get('parentid').disable();
            }
        )
    }

    getParentNameInGroupSelect(PARENTACID,mode){
        this.MasterService.getParentNamebyID(PARENTACID,mode).subscribe(
            (res) =>{
                var parentName = res[0];
                this.form.get('parentid').setValue(parentName.ACNAME);
                this.form.get('parentid').disable();
            }
        )
    }

    disableACCodeIfAutoSuponeisOne() {
        //console.log('disable')
        this.form.get('ACCODE').disable();
    }
    validationRequired: true;
    CheckCompanyAndValidate() {

        if (this.userSetting.CompanyType == "B2B") {
            this.form.get('VATNO').setValidators([Validators.required]);
            this.form.get('VATNO').updateValueAndValidity;
            this.form.get('ACCODE').setValidators([Validators.required]);
            this.form.get('ACCODE').updateValueAndValidity;
            this.form.get('CRPERIOD').setValidators([Validators.required]);
            this.form.get('CRPERIOD').updateValueAndValidity;
            this.form.get('CRLIMIT').setValidators([Validators.required]);
            this.form.get('CRLIMIT').updateValueAndValidity;
            this.form.get('GEO').setValidators([Validators.required]);
            this.form.get('GEO').updateValueAndValidity;
        }
        if (this.userSetting.CompanyType == "B2C") {
            this.form.get('ACCODE').clearValidators
            this.form.get('ACCODE').updateValueAndValidity;
            this.form.get('VATNO').clearValidators;
            this.form.get('VATNO').updateValueAndValidity;
            this.form.get('CRPERIOD').clearValidators;
            this.form.get('CRPERIOD').updateValueAndValidity;
            this.form.get('CRLIMIT').clearValidators;
            this.form.get('CRLIMIT').updateValueAndValidity;
            this.form.get('GEO').clearValidators;
            this.form.get('GEO').updateValueAndValidity;
        }
    }
    majorgroupChange() {
        this.filter(this.form.get('majorparent').value);


    }

    filter(majorparent) {
        this.MasterService.getAccountListTree().subscribe(data => {
            var f = data.filter(x => x.ACID == majorparent)[0];
            if (f != null) { this.acParentList = f.children; }
        });
    }
    BankPartyVerification:any=<any>{}
    SumbitSave() {
        if (this.MasterService.validateMasterCreation("save") == false) {
            return;
        }
        if(this.MasterService.userSetting.AUTOACCODE ==1 && this.form.value.ACCODE==""){
            this.alertservice.warning("Accode is mandatory");
            return;
        }
    
        if(this.ACID == 'AG01001' || this.ACID == 'AG01002'){
            this.alertservice.warning("Cannot save account under this Group");
            return;
        }

        if (this.form.value.TDS_TYPE) {
            var tdstype = parseFloat(this.form.value.TDS_TYPE);
            if (tdstype.toString().length < 2) {
                this.alertservice.warning("TDS Type should be minimum 2 character long.");
                return;
            }
            if (tdstype.toString().length > 50) {
                this.alertservice.warning("TDS Type should be maximum 50 character long.");
                return;
            }
        }
        this.dialogMessageSubject.next("Saving Data please wait...");
        var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })
       
        try {
            // if (!this.parentGroup) throw new Error("Parent is missing");
            //console.log("FORM VALUES", this.form.value);
            let al = <TAcList>{};
            let partyAdditionalInfo = <PartyAdditional>{};
            if (this.Title == 'AddLedger' || this.mode == 'edit' && this.grp == 'A') {
                al.TYPE = "A"
            }
            else {
               
                al.TYPE = "G"
            }
            if (this.mode != 'edit') {
                al.PARENT = this.ACID;

            }
            al.ACNAME = this.form.value.ACNAME,
            al.ISACTIVE = this.form.value.isNotActive;
            al.ACID = this.ACID;
            al.HASSUBLEDGER = this.form.value.HASSUBLEDGER;
            al.DIV = this.ChangedDiv;
            al.ACTYPE = this.accACTYPE?this.accACTYPE:this.form.controls.ACTYPE.value;
            al.LEVELS = this.accLevel;
            al.MAPID = this.accMapId;
            al.CRLIMIT = this.form.controls.CRLIMIT.value ? this.form.controls.CRLIMIT.value :0;
            if (al.DIV == '' || al.DIV == null) {
                al.DIV = this.userProfile.userDivision;
            }
            al.TDS_TYPE = this.form.value.TDS_TYPE;

            if (this.mode == 'edit') {
                al.ACID = this.ACID;
                al.PARENT = this.parentValueForEditMode;
                //console.log({ ACID: al.ACID });
                //console.log({ ID: this.ID });
            }
            if (this.form.value.ShareAccount) {
                al.ISCOMMONAC = 1;
            } else {
                al.ISCOMMONAC = 0;
            }
          
            al.COMMON = this.form.value.COMMON;
            al.ISACTIVE = this.form.value.ISACTIVE;
            al.ISCOMMONAC = this.form.value.ISCOMMONAC;
           
            al.INITIAL = this.form.value.INITIAL;
            al.enableDivSelectionTable=this.showDivSelectionTable;
            al.ACCODE = this.form.value.ACCODE;
            // al.BANKACCOUNTNUMBER = this.form.controls.BANKACCOUNTNUMBER.value;

            let divisionObj = <SelectedDivisions>{};
            divisionObj.DIV = this.form.value.MultipleDivision;
            // al.enableDivSelectionTable = false;
            let DObj : DObj=<DObj>{};
            if (this.showDivSelectionTable == true) {
                al.ISCOMMONAC = 0;
                this.DivListForSave = [];
             for(let i of this.division){
                //  //console.log("@@division",this.division)
                if(i.isCheck==true){
                  let dObj:DivList=<DivList>{};
                  dObj.ACID = i.ACID;
                  dObj.DIV = i.INITIAL;
                  this.DivListForSave.push(dObj);
                }
              }
            DObj.DivList = this.DivListForSave;
            }else{
                if( this.form.value.ShareAllDiv == 2 || this.form.value.ShareAllDiv == 1){
                  al.enableDivSelectionTable = true;
                  al.ISCOMMONAC = 1;
                  this.DivListForSave = [];
                  for(let i of this.division){
                       let dObj:DivList=<DivList>{};
                       dObj.ACID = i.ACID;
                       dObj.DIV = i.INITIAL;
                       this.DivListForSave.push(dObj);
                   }
                  
                 DObj.DivList = this.DivListForSave;
                }
               
              }
              if(this.Title != "AddGroup"){
                if( al.PARENT.slice(al.PARENT.length -3) != 'PAG'){
                    al.PARENT = this.MasterService.SelectedGroup;
                }
              }
             
            //   //console.log("CheckSaveObj",al,this.MasterService.SelectedGroup);
            //   return;
           
            let sub = this.MasterService.saveAccountLedgerOnly(
                this.mode, 
                al, 
                null,
        this.BankPartyVerification,
        this.MasterService.BankObj,
        this.MasterService.PLedgerObj,
        0,
       null,
       DObj
       )
                .subscribe(data => {
                    if (data.status == 'ok') {
                        //Displaying dialog message for save with timer of 1 secs
                        
                        var selNode = {}

                        if (this.grp == 'A') {
                            al.ACID = data.result.acid;
                            this.MasterService.PartialAccountList.push(al);
                            selNode = { type: 'A', value: al };
                            ////console.log("TYPE99", selNode)
                        }
                        else {
                            // alert("reached")
                            selNode = { type: 'G', lastparent: this.ACID, value: { ACID: data.result.ACID, ACNAME: data.result.ACNAME, PARENT: data.result.PARENT, PARENTID: data.result.PARENTID, children: [] } };
                        }
                        if (this.mode == 'edit') {
                            this.EditPartyEmit.emit();
                        } else {

                            this.SavePartyEmit.emit(selNode);
                        }
                        this.AccountService.loadTableListSubject.next(al);
                        for(let i of this.AccountService.partyList){
                            if(i.ACID == al.PARENT){
                                i.children.push(al);
                            }
                        }
                        
                        this.dialogMessageSubject.next("Data Saved Successfully")
                        setTimeout(() => {
                            dialogRef.close();
                            this.onClose.emit(this.ACID);
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
                        this.dialogMessageSubject.next("Error in Saving Data:" + data.result._body);
                        //console.log(data.result._body);
                        setTimeout(() => {
                            dialogRef.close();
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
        let acid = this.mode == 'add'? this.ACID : this.parentIdOnEdit;
        this.onClose.emit(acid);
        this.AccountService.subTitle = " ";
    }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    changePtype(value) {
        // this.form.get('Ptype').patchValue(value);
        ////console.log("@@value", value);
        if (value == 'V') {
            this.form.get('createMember').disable;
        } else {
            this.form.get('createMember').enable;
        }
    }
    public onGrpChange(event, i, selected) {
        try {
            if (selected) {
                // this.actype = selected.ACTYPE
                // this.changeACtype(selected.ACTYPE);
                // this.disableActype == true;
                //latest selected 
                this.parentGroup = selected;
            }


            //let newGroup: GroupAccounts = event.value;
            //console.log({ onGrpChangeEvent: event, eventIndex: i, selected: selected });
            let opt: SelectItem[] = [];
            var ind = i;

            if (event) {
                if (this.acGroups.length > ind + 1) {
                    this.acGroups.splice(ind + 1, this.acGroups.length - 1)
                }
                //console.log({ GroupchageEvent: event, value: event.value.ACNAME });
                this.lastParentID = event.value.ACID;

                this.AccountService.getChildrenGroups(event.value.ACID)
                    .flatMap(data => data)
                    .subscribe(data => {
                        //console.log({ children: data });
                        if (data.TYPE == 'G')
                            opt.push({ label: data.ACNAME, value: data });

                    }, Error => //console.log({ groupchangeError: Error })
                         () => {
                            if (opt.length > 0) {
                                this.acGroups.push({ group: event.value.ACNAME, value: event.value, options: opt });
                            }

                            //this.groupListSubject.next(subjectData);
                            // //console.log({ negroup2: { group: event.value.ACNAME, value: event.value, options: opt }, subjectData2: subjectData });
                        }
                    );
            }

        }
        catch (ex) {
            //console.log({ onGroupChange: ex })
        }

    }

    onChangeArea(event) {
        let userAreaName = event.target.value;
        let checkArea = [];
        if (userAreaName != null) {
            checkArea = this.areaList.filter(x => x.AREANAME.toUpperCase() == userAreaName.toUpperCase());
            if (checkArea.length == 0) {
                if (confirm("Do you want to add new Area")) {

                } else {
                    this.form.get('CITY').patchValue("");
                }
            }
        }

    }

    getGroups() {
        //FIRST GET THE MAIN GROUP
        // this.hasSubLedger = 0;
        // this.changehassubEvent(false);
        // this.disableHassubledger = false;
        // alert("reached")
        ////console.log("Has SUB is false")
        this.actype = '';
        this.disableActype = false;
        this.acGroups = [];
        this.getMainGroup();
        if (!this.ACID) return;
        //console.log({ acid: this.ACID });
        this.AccountService.getParentGroups(this.ACID)
            .flatMap(data => data)
            .subscribe(data => {
                try {
                    data.SELECTEDGROUPAC = data.CHILDLIST.find(itm => itm.ACID == data.SELECTEDGROUP);
                    this.parentGroup = data.SELECTEDGROUPAC;
                    //console.log({ selectedGroup: data.SELECTEDGROUP, selectedGroupAC: data.SELECTEDGROUPAC })
                    // this.parentid = data.SELECTEDGROUPAC.SELECTEDGROUPAC.ACNAME;

                    // if (data.SELECTEDGROUPAC.HASSUBLEDGER == 1 && this.hasSubLedger == 0) {
                    //     this.hasSubLedger = 1;
                    //     this.changehassubEvent(true);
                    //     this.disableHassubledger = true;
                    //     ////console.log("Disable AHS SUB")
                    // }
                    
                    let opt: SelectItem[] = [];
                    data.CHILDLIST.forEach(child => {
                        opt.push({ label: child.ACNAME, value: child });
                    });
                    this.acGroups.push({ group: data.ACNAME, value: data, options: opt });
                }
                catch (ex) {
                    //console.log({ getParentGroups: ex })
                }
            }, error => { //console.log({ getgroupError: error }) }
                () => {
                    if (this.acGroups.length > 1) {
                        let selectedGroup = this.acGroups[0].options.find(itm =>
                            itm.value.ACID == this.acGroups[1].value.ACID
                        )
                        if (selectedGroup) {
                            this.acGroups[0].value.SELECTEDGROUPAC = selectedGroup.value;
                        }
                        //console.log({ selectedGroupValue: selectedGroup.value });
                        // if (selectedGroup.value.Ptype) {
                        //     alert("REACHED")
                        //     this.actype = selectedGroup.value.Ptype
                        //     this.changePtype(selectedGroup.value.Ptype);
                        //     this.disableActype == true;
                        // }
                        // //console.log({groupTofind:this.acGroups[1],options:this.acGroups[0].options,selected:this.acGroups[0].value.SELECTEDGROUPAC,selected2:this.acGroups[1].value.SELECTEDGROUPAC})
                    }
                }});

        return;
    }
    getMainGroup() {
        let opt: SelectItem[] = [];
        this.AccountService.getTopGroups()
            .flatMap(data => data)
            .subscribe(data => {
                opt.push({ label: data.ACNAME, value: data })
            });
        this.acGroups.push({ group: 'Main Group', value: { ACNAME: 'MAIN GROUP', ACID: null, PARENT: null }, options: opt });
        ////console.log("CheckAcGroup", this.acGroups)
    }
    clickedNotActive(value) {
        if (this.form == null) { return }
        this.form.get('isNotActive').patchValue(value);
    }
    NotActive() {

    }

    enableInitial(value) {
        // ////console.log("@@value", value)
        if (value == 0) {
            this.form.get('INITIAL').disable();
        } else {
            this.form.get('INITIAL').enable();
        }
    }

    enableShareOptions(enableShareDiv) {
        // ////console.log("@@enableShareDiv", enableShareDiv)
        if (enableShareDiv == 1) {
            this.form.get('ShareSelectiveDiv').enable();
            this.form.get('ShareAllDiv').enable();

            // this.showDivSelectionTable = true;
            
        } else {
            this.form.get('ShareSelectiveDiv').disable();
            this.form.get('ShareAllDiv').disable();
            this.form.get('ShareSelectiveDiv').setValue(0);
            this.form.get('ShareAllDiv').setValue(0);

            this.showDivSelectionTable = false;
            
        }
        

    }

    enableDivSelectionTable(showTable) {
        // ////console.log("@@showTable", showTable)
        if (showTable == 1) {
            this.showDivSelectionTable = true;
            this.form.get('ShareAllDiv').setValue(0);
            this.enableDivision = true;
            this.division.forEach(x => {
                x.INITIAL == this.userProfile.CompanyInfo.INITIAL ? x.isCheck = true : '';
            }) 
                    } else {
            this.showDivSelectionTable = false;
            this.enableDivision = false
        }
    }

    ShareAllDiv(ShareAllDiv) {
        this.showDivSelectionTable = false;
        if (ShareAllDiv == 1) {
            this.form.get('ShareSelectiveDiv').setValue(0);
            this.form.get('ISCOMMONAC').setValue(1);
        }
        else{
            this.form.get('ISCOMMONAC').setValue(0);
        }
        this.form.get('enableDivSelectionTable').setValue(false);
    }
   

    keyPress(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode((event as KeyboardEvent).charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    @HostListener("document : keydown", ["$event"])
    handleKeyDownboardEvent($event: KeyboardEvent) {
        if ($event.code == "F3") {
            $event.preventDefault();
            this.cancel();
        }
    }
    check(e) {
        // //console.log('checkValue@!',this.division)
        this.form.value.MultipleDivision = e.target.value;
    }
    activeIndex: any;
    rowClick(i) {
        this.activeIndex = i;
    }
     ChangedDiv : string = '';
    changeDivision(e) {
        // //console.log("CheckValue@",e)
        this.ChangedDiv = e;
        this.division.forEach(x => {
            x.INITIAL == e ? x.isDefault = true : x.isDefault = false;

        })
        if(this.mode == "add"){
            this.division.forEach(x => {
                x.INITIAL == e ? x.isCheck = true : x.isCheck = false;
            })
        }else{
            this.division.forEach(x => {
                x.INITIAL == e ? x.isCheck = true : '';
            })
        }
        
    }
    enableDivision: Boolean;
    ClickShareAccount(value) {
        this.form.value.enableDivSelectionTable = false;
        if (this.form.value.ShareAccount == 1) {
            this.changeDivision(this.MasterService.userProfile.CompanyInfo.INITIAL)
            this.enableDivision = true;


        }
        else {
            this.form.get('ShareAllDiv').setValue(0);
            this.form.get('ShareSelectiveDiv').setValue(0);
            this.enableDivision = false;

        }
        this.form.get('enableDivSelectionTable').setValue(false);
       
    }

    getGroupList(parentACID){
        
        //console.log("get group list", this.ACID);

        if(parentACID){
            this.AccountService.getAccountHeirarchy(parentACID).subscribe(
                res=>{
                    //console.log("result hai", res);
                    let itemGroup = res[0];
                    //console.log("MAIN GROUP LSIR", this.MasterService.mainGroupList);
                    this.MasterService.groupSelectObj.MGROUP = itemGroup.L1;
                    //console.log("main group id", this.MasterService.groupSelectObj.MGROUP);
                    this.AccountService.getSubGroupList(this.MasterService.groupSelectObj.MGROUP).subscribe((res)=>{
                        if(res.length > 0){
                            this.MasterService.subGroupAList = res;
                            this.MasterService.groupSelectObj.SUBGROUP_A = itemGroup.L2;
                            //console.log("SUBGROUP A LIST", this.MasterService.subGroupAList);
                            this.MasterService.disableSubGroupA = false
                            this.AccountService.getSubGroupList(this.MasterService.groupSelectObj.SUBGROUP_A).subscribe((res)=>{
                                if(res.length> 0){
                                    this.MasterService.subGroupBList = res;
                                    this.MasterService.groupSelectObj.SUBGROUP_B = itemGroup.L3;
                                    this.MasterService.disableSubGroupB = false
                                    this.AccountService.getSubGroupList(this.MasterService.groupSelectObj.SUBGROUP_B).subscribe((res)=>{
                                        if(res.length > 0){
                                            this.MasterService.subGroupCList = res;
                                            this.MasterService.groupSelectObj.SUBGROUP_C = itemGroup.L4;
                                            this.MasterService.disableSubGroupC = false;

                                        }else{
                                            this.MasterService.disableSubGroupC = true;
                                        }
                                    });

                                }else{
                                    this.MasterService.disableSubGroupB = true;
                                }
                            });
                        }else{
                            this.MasterService.disableSubGroupA = true;
                        }
                    })
                }
            )
        }
    }

    UnderObj: any;
  nodeObj: any = <any>{}
  PrimaryGrpObj: any;
  isOnlyMainParent = 0
  root: string;
  isGroup: number;
  ViewMode: boolean;
    getRootParent(node, list) {
// return;
// console.log("ChewcekLog",node,list)
        //console.log("get Rooy parent", node,list);
        this.Parent.Under = '';
        // if (node.ACID == "CA") this.form.value.ACTYPE = "LB"; this.form.get('ACTYPE').setValue("LB");
        if (node.ACID == "CA")  this.form.get('ACTYPE').setValue("LB");
        // else this.form.value.ACTYPE = node.ACID;
        else this.form.get('ACTYPE').setValue(node.ACID);

    
    
        this.nodeObj = node;
        this.UnderObj = node.PARENT;
        if (node.PARENTID == 'BS' || node.PARENTID == 'PL' || node.PARENTID == 'TD') {
          this.PrimaryGrpObj = node; this.Parent.Primary = node.ACNAME;
          this.isOnlyMainParent = 1; this.UnderObj = node; return;
    
        }
        for (let t of list) {
    
          if (node.PARENTID != t.ACID) {
            this.loopingChild(node, t.children, t);
    
    
          }
          else { this.root = node.PARENTID; this.PrimaryGrpObj = node }
        }
        if(this.UnderObj){
            this.Parent.Under = this.UnderObj.ACNAME;
        }
       
        if (node.TYPE == "G") {
          this.UnderObj = node;
          this.isGroup == 1
          this.modeTitle = 'View Group'
          this.ViewMode = true;
        }
        else {
          this.modeTitle = 'View Account';
          this.ViewMode = true;
        }
        // this.Parent.Primary=this.PrimaryGrpObj.ACNAME;
        if (this.root == 'LB') {
          this.Parent.Primary = 'LIABILITES'
        //   this.form.value.ACTYPE = 'LB'
          this.form.get('ACTYPE').setValue('LB');

    
        }
        else if (this.root == 'AT') {
          this.Parent.Primary = 'ASSETS'
        //   this.form.value.ACTYPE = 'AT'
          this.form.get('ACTYPE').setValue('AT');

    
        }
        else if (this.root == 'DI') {
          this.Parent.Primary = 'DIRECT INCOME'
        //   this.form.value.ACTYPE = 'DI'
          this.form.get('ACTYPE').setValue('DI');

        }
        else if (this.root == 'DE') {
          this.Parent.Primary = 'DIRECT EXPENSES'
        //   this.form.value.ACTYPE = 'DE'
          this.form.get('ACTYPE').setValue('DE');

        }
        else if (this.root == 'IE') {
          this.Parent.Primary = 'INDIRECT EXPENSES'
        //   this.form.value.ACTYPE = 'IE'
          this.form.get('ACTYPE').setValue('IE');

        }
        else if (this.root == 'II') {
          this.Parent.Primary = 'INDIRECT INCOME'
        //   this.form.value.ACTYPE = 'II'
          this.form.get('ACTYPE').setValue('II');

        }
        else if (this.root == 'CA') {
          this.Parent.Primary = 'CAPITAL A/C'
        //   this.form.value.ACTYPE = 'LB'
          this.form.get('ACTYPE').setValue('LB');

        }
        this.form.get('ACTYPE').disable();
        this.accACTYPE = this.form.controls.ACTYPE.value;

    
        this.isOnlyMainParent = 0;
    
      }
      loopingChild(node, cList, root) {
        for (let c of cList) {
          if (c != node) { this.loopingChild(node, c.children, root); }
          else { this.root = root.ACID; this.PrimaryGrpObj = root }
        }
      }

      DeleteLedger(){
          //console.log("CURRENT ACCNT ACID", this.ACID);
         this.DeleteAcc.show();
      }

      DeleteYes(){
          //console.log("DELETE YES", this.ACID,this.parentIdOnEdit);
          this.DeleteAcc.hide();
          this.spinnerservice.show("Deleting account, please wait...");
          this.MasterService.deleteAccount(this.ACID).subscribe(data =>{
              if(data.status == "ok"){
                  this.alertservice.success("Account deleted successfully");
                  this.spinnerservice.hide();
                  this.onClose.emit(this.parentIdOnEdit);
                  this.router.navigate(["pages/account/AccountLedger/AccountMaster"])
              }else{
                  this.spinnerservice.hide();
                  this.alertservice.error("Error in  deleting data: "+data.result._body);
              }
          })
      }

      DeleteNo() {
          this.DeleteAcc.hide();
      }

      showBankPopup(){
        this.gridBankPopupSettings = {
            title: "Accounts",
            apiEndpoints: `/getBankPagedList/`,
            defaultFilterIndex: 1,
            columns: [
              {
                key: "BANKCODE",
                title: "Bank CODE",
                hidden: false,
                noSearch: false
              },
              {
                key: "BANKNAME",
                title: "Bank NAME",
                hidden: false,
                noSearch: false
              }
            ]
          };
          this.genericGridBankList.show();
      }

      onBankSelect(value){
    //console.log("ValueCheck",value)
    this.form.get('ACNAME').setValue(value.BANKNAME);
    this.form.get('ACCODE').setValue(value.BANKCODE);


      }

      onChangeTDSType(event){
        let user_tdstype= event.target.value;
         let check_TDSType = [];   
        if(user_tdstype !=null){
            check_TDSType = this.TDSType_List.filter (x=> x.TDS_TYPE.toUpperCase() == user_tdstype.toUpperCase());
            if(check_TDSType.length ==0){
               if(confirm("Do you want to add new TDS Type?")){
      
                }else{
      
                }
            }   
        }
      
      }
}


export class DObj {
    DivList: DivList[]
}
export class DivList {
    ACID: string;
    DIV: string;
    STAMP: number;
    ISACTIVE: number;
}
