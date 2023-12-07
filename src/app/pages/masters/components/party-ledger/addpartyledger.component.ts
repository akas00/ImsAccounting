import { style } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { MessageDialog } from './../../../modaldialogs/messageDialog/messageDialog.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectItem } from 'primeng/primeng';
// import { GroupParty } from './partyLedger.service';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, HostListener, SimpleChange, SimpleChanges } from '@angular/core';
import { GroupParty, TreeViewPartyervice } from './partyledger.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AcListTree, TAcList, PartyAdditional, SelectedDivisions, SalesTarget } from "../../../../common/interfaces/Account.interface";
import { AuthService } from '../../../../common/services/permission';
import { runInThisContext } from 'vm';
import { Division } from '../../../../common/interfaces';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

@Component(
    {
        selector: 'addPartyLedgerSelector',
        templateUrl: 'addpartyledger.component.html',
        //  [(ngModel)]="PARENTACNAME"
        // [(ngModel)]="RootName"
        providers: [TreeViewPartyervice],
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
export class AddPartyLedgerComponent {
    @Output('onClose') onClose = new EventEmitter();
    @Input('acid') ACID: string;
    @Input('parent') Parent: string;
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
    @Input() parentPartyID:string;
    @Input() parentIdOnEdit:string;
    @Input() mainGroupID:string;
    @ViewChild('DeletePar') DeletePar: ModalDirective;
    BankList:any[]=[];


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
    showDivSelectionTable: boolean;
    enableDivisionMapping: boolean;
    divisionList: any[] = [];
    SelectedDivisionList: SelectedDivisions[] = [];
    DivListForSave: DivList[] = [];
    bankObj:BankCustomerInfo = <BankCustomerInfo>{}
    bankArray:BankDetails[] =[]
    bank:boolean = false;
    DistrictListbyState: any[] = [];
    ISCUSTOMER:boolean;
    PartyCat_List: any[] = [];
    AdditionalBankList:AdditionalBankList[] =[];
    Is_OverseasParty:number;

    @ViewChild("genericGridBankList") genericGridBankList: GenericPopUpComponent;
  gridBankPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("genericGridAdditionalBankList") genericGridAdditionalBankList: GenericPopUpComponent;
  gridAdditionalBankPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("genericGridACListParty") genericGridACListParty: GenericPopUpComponent;
    gridACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @ViewChild("genericGridContract") genericGridContract: GenericPopUpComponent;
    gridPopupSettingsForContractPrice: GenericPopUpSettings = new GenericPopUpSettings();

   
    @ViewChild("genericGridSalesman") genericGridSalesman: GenericPopUpComponent;
    gridPopupSettingsForSalesmanList: GenericPopUpSettings = new GenericPopUpSettings();

    constructor(protected MasterService: MasterRepo,
         private PartyService: TreeViewPartyervice,
         router: Router, private _activatedRoute: ActivatedRoute,
        private _fb: FormBuilder, public dialog: MdDialog, 
        private _authService: AuthService,  
        private alertSerivces: AlertService,
        public spinnerservice: SpinnerService) {
        this.router = router;

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
        this.userProfile = this._authService.getUserProfile();
        this.userSetting = this._authService.getSetting();
        this.Is_OverseasParty=0;
        ////console.log("userSetting", this.userSetting)
        this.PartyService.getHierachy().subscribe(res => {
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

        this.division = [];
        this.MasterService.getAllDivisions()
            .subscribe(res => {
                this.division.push(<Division>res);
            }, error => {
                this.MasterService.resolveError(error, "divisions - getDivisions");
            });
           
    }
    userSetting: any;





    ngOnInit() {

        this.PartyService.addGroupSubject.subscribe((res) => {
            //console.log('common');
        })

        this.MasterService.userSetting.DIVISIONWISEACLISTING == 1 ?
            this.enableDivisionMapping = true :
            this.enableDivisionMapping = false;


        this.form = this._fb.group({
            majorparent: [''],
            parentid: [''],
            ACNAME: ['', Validators.required],
            Ptype: [''],
            MAPID: [''],
            ADDRESS: ['', Validators.required],
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
            CCONTACT_A: [''],
            CCONTACT_B: [''],
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
            BANKACCOUNTNUMBER: [''],
            BANKCODE:[''],
            BANKNAME:[''],
            ISBRANCH: [''],
            BAISHAKH: [0],
            JESTHA: [0],
            ASHAD: [0],
            SHARWAN: [0],
            BHADRA: [0],
            ASHWIN: [0],
            KARTIK: [0],
            MANGSHIR: [0],
            PAUSH: [0],
            MAGH: [0],
            FALGUN: [0],
            CHAITRA: [0],
            TARGET_AMOUNT: [0],
            DISTRICT: [''],
            ADDITIONALBANKACCOUNTNUMBER: [''],
            ADDITIONALBANKCODE:[''],
            ADDITIONALBANKNAME:[''],
            PCompany:[''],
            PCompanyName:[''],
            IS_OVERSEAS_PARTY: [0],
            SALESMANID: [''],
            SALESMAN:[''],
        })
        if(this.userSetting.Country == 1){
            this.form.get('GEO').setValue('');
        }
        this.form.get('ShareAllDiv').disable();
        this.form.get('ShareSelectiveDiv').disable();


        if(this.mode == "add"){
            this.getPartyList(this.ACID);

        }



        if (this.userSetting.AUTOSUPCODE == 1) {
            this.disableACCodeIfAutoSuponeisOne();
        }

        this.CheckCompanyAndValidate();
        this.getGroups();
        //console.log("ACID on ad party", this.ACID);

        if(this.ACID == 'PAG01'){
            this.form.get('Ptype').setValue('V');
            this.ISCUSTOMER=false;
            if(this.userSetting.Country == 1){
                if(this.mode == "add"){
                this.PartyService.getHierachy().subscribe(res => {
                    if (res.status == "ok") {
                        this.GeoList = res.result.GEO;
                        this.PartyCat_List =  this.GeoList.filter(x=>x.PTYPE == 'V');
                            this.form.get('GEO').setValue('111111-1');
                    }
                });
            }
            }
        }else{
            this.form.get('Ptype').setValue('C');
            this.ISCUSTOMER=true;
            if(this.userSetting.Country == 1){
                if(this.mode == "add"){
                this.PartyService.getHierachy().subscribe(res => {
                    if (res.status == "ok") {
                        this.GeoList = res.result.GEO;
                        this.PartyCat_List =  this.GeoList.filter(x=>x.PTYPE == 'C');
                            this.form.get('GEO').setValue('123456-7');
                    }
                });
            }
            }
        }

        if (this.userSetting.CREATE_CPROFILE_AS_MEMBER == 1 && this.form.value.Ptype == 'C') {
            this.form.get('createMember').setValue(false);
        }
        // this.MasterService.getAllAccount().subscribe(res => { this.ledgerAcList.push(<TAcList>res); });
        this.MasterService.getpartyListTree()
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
                    this.MasterService.getAllAccount(this.ACID)
                        .subscribe(data => {
                            if (data.status == 'ok') {
                                this.parentValueForEditMode = data.result.PARENT;
                                this.form.get('ACNAME').setValue(data.result.ACNAME);
                                this.form.get('ADDRESS').setValue(data.result.ADDRESS);
                                this.form.get('PHONE').setValue(data.result.PHONE);
                                this.form.get('FAX').setValue(data.result.FAX);
                                this.form.get('EMAIL').setValue(data.result.EMAIL);
                                this.form.get('VATNO').setValue(data.result.VATNO);
                                this.form.get('ACCODE').setValue(data.result.ACCODE);
                                this.form.get('CRLIMIT').setValue(data.result.CRLIMIT);
                                this.form.get('Ptype').setValue(data.result.PType);
                                this.form.get("SALESMANID").setValue(data.result.SALESMANID);
                                this.form.get("SALESMAN").setValue(data.result.SALESMAN);
                                if(data.result.PType=='C'){
                                    this.ISCUSTOMER=true;
                                    if(this.userSetting.Country == 1){
                                        this.PartyCat_List =  this.GeoList.filter(x=>x.PTYPE == 'C')
                                    }
                                }else{
                                    this.ISCUSTOMER=false;
                                    if(this.userSetting.Country == 1){
                                        this.PartyCat_List =  this.GeoList.filter(x=>x.PTYPE == 'V')
                                    }
                                }
                                this.form.get('Mobile').setValue(data.result.MOBILE);
                                this.form.get('GEO').setValue(data.result.GEO);
                                this.form.get('COMMON').setValue(data.result.COMMON);
                                this.form.get('CITY').setValue(data.result.CITY);
                                this.form.get('ISBRANCH').setValue(data.result.ISBRANCH);

                                this.form.get('CRPERIOD').setValue(data.result.CRPERIOD);
                                this.form.get('STATE').setValue(data.result.STATE);
                                this.form.get('ISACTIVE').setValue(data.result.ISACTIVE);
                                this.form.get('DIV').setValue(data.result.DIV);
                                this.form.get('ISCOMMONAC').setValue(data.result.ISCOMMONAC);
                                this.form.get('BANKNAME').setValue(data.result.BANKNAME);
                                this.form.get('BANKCODE').setValue(data.result.BANKCODE);
                                this.form.get('BANKACCOUNTNUMBER').setValue(data.result.BANKACCOUNTNUMBER);
                                this.displayDistrictOnEdit(data.result.STATE);
                                this.form.get('DISTRICT').setValue(data.result.DISTRICT);
                                if(this.userSetting.ENABLEPARENTCOMPANY == 1){
                                this.form.get('PCompany').setValue(data.result.PCompany);
                                this.form.get('PCompanyName').setValue(data.result.PCompanyName);
                                this.form.get('IS_OVERSEAS_PARTY').setValue(data.result.IS_OVERSEAS_PARTY);

                                this.form.get("SALESMANID").setValue(data.result.SALESMANID);
                                this.form.get("SALESMAN").setValue(data.result.SALESMAN);
                                this.Is_OverseasParty=data.result.IS_OVERSEAS_PARTY;
                                }


                                if(data.result2 && data.result2!=null){
                                    this.form.get('CNAME').setValue(data.result2.CNAME);
                                    this.form.get('ONAME').setValue(data.result2.ONAME);
                                    this.form.get('OCONTACT').setValue(data.result2.OCONTACT);
                                    this.form.get('ODESIGNATION').setValue(data.result2.ODESIGNATION);
                                    this.form.get('CONTACTNAME').setValue(data.result2.CONTACTNAME);
                                    this.form.get('CCONTACT_A').setValue(data.result2.CCONTACT_A);
                                    this.form.get('CCONTACT_B').setValue(data.result2.CCONTACT_B);
                                    this.form.get('CDESIGNATION').setValue(data.result2.CDESIGNATION);
                                    this.form.get('RELATEDSPERSON_A').setValue(data.result2.RELATEDSPERSON_A);
                                    this.form.get('RELATEDSPERSON_B').setValue(data.result2.RELATEDSPERSON_B);
                                    this.form.get('NOTES').setValue(data.result2.NOTES);
                                }
                                this.form.get('NOTES').setValue(data.result.ISCOMMONAC);                       
                                this.form.get('INITIAL').setValue(data.result.INITIAL);
                                if (data.result.INITIAL == null || data.result.INITIAL == "") {
                                    this.form.get('IsInitialValue').setValue(0);
                                    this.form.get('INITIAL').disable();
                                } else {
                                    this.form.get('IsInitialValue').setValue(1);
                                    this.form.get('INITIAL').enable();
                                }
                                if(data.result.CTYPE == 'Member Also'){
                                    this.form.get('createMember').setValue(1);
                                }
                                else{
                                    this.form.get('createMember').setValue(0);
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
                                if(data.result4 && data.result4!=null){
                                    this.form.get('BAISHAKH').setValue(data.result4.BAISHAKH);
                                    this.form.get('JESTHA').setValue(data.result4.JESTHA);
                                    this.form.get('ASHAD').setValue(data.result4.ASHAD);
                                    this.form.get('SHARWAN').setValue(data.result4.SHARWAN);
                                    this.form.get('BHADRA').setValue(data.result4.BHADRA);
                                    this.form.get('ASHWIN').setValue(data.result4.ASHWIN);
                                    this.form.get('KARTIK').setValue(data.result4.KARTIK);
                                    this.form.get('MANGSHIR').setValue(data.result4.MANGSHIR);
                                    this.form.get('PAUSH').setValue(data.result4.PAUSH);
                                    this.form.get('MAGH').setValue(data.result4.MAGH);
                                    this.form.get('FALGUN').setValue(data.result4.FALGUN);
                                    this.form.get('CHAITRA').setValue(data.result4.CHAITRA);
                                    this.form.get('TARGET_AMOUNT').setValue(data.result4.TARGET_AMOUNT);
                                }

                                if(data.result5.length >0){
                                    this.AdditionalBankList=data.result5;   
                                    if (data.result.BANKNAME && data.result.BANKACCOUNTNUMBER && data.result.BANKCODE) {
                                        let index = data.result5.length && data.result5.findIndex(x=>x.BANKCODE==data.result.BANKCODE);
                                        this.AdditionalBankList.splice(index,1);
                                    }        
                                }
                            }

                        },

                        );
                }

            });

            if(this.mode == 'edit' || this.mode == 'view'){
                //console.log("edit mode", this.parentIdOnEdit);
                this.getPartyList(this.parentIdOnEdit);
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
            this.form.get('CCONTACT_A').disable();
            this.form.get('CCONTACT_B').disable();
            this.form.get('CDESIGNATION').disable();
            this.form.get('RELATEDSPERSON_A').disable();
            this.form.get('RELATEDSPERSON_B').disable();
            this.form.get('NOTES').disable();
            this.form.get('COMMON').disable();
            this.form.get('INITIAL').disable();
            this.form.get('IsInitialValue').disable();
            this.form.get('ISBRANCH').disable();
            this.form.get('BANKNAME').disable();
            this.form.get('BANKACCOUNTNUMBER').disable();
            this.form.get('DISTRICT').disable();

            this.form.get('BAISHAKH').disable();
            this.form.get('JESTHA').disable();
            this.form.get('ASHAD').disable();
            this.form.get('SHARWAN').disable();
            this.form.get('BHADRA').disable();
            this.form.get('ASHWIN').disable();
            this.form.get('KARTIK').disable();
            this.form.get('MANGSHIR').disable();
            this.form.get('PAUSH').disable();
            this.form.get('MAGH').disable();
            this.form.get('FALGUN').disable();
            this.form.get('CHAITRA').disable();
            this.form.get('TARGET_AMOUNT').disable();

            this.form.get('ADDITIONALBANKNAME').disable();
            this.form.get('ADDITIONALBANKACCOUNTNUMBER').disable();
            this.form.get('PCompanyName').disable();
            this.form.get('IS_OVERSEAS_PARTY').disable();

            this.form.get("SALESMAN").disable();
            this.form.get("SALESMANID").disable();
        }

        ////console.log("parentname", this.Parent)


        if (this.Title == "AddLedger") {
            this.modeTitle = "Add New Party A/C";
        }
        else if (this.Title == "AddGroup") {
            this.modeTitle = "Add New Party Group";
        }

        if (this.mode == 'edit') {
            this.modeTitle = "Edit Party A/C";
        }

        if (this.mode == 'view') {
            this.modeTitle = "View Party A/C";
        }
        

    }

    contractPricePopup(){
        this.getContractPriceList();
        this.genericGridContract.show();
    }
    getContractPriceList(){
        this.gridPopupSettingsForContractPrice = {
          title: "Contract Price List",
          apiEndpoints: `/getContractPricePagedList`,
          defaultFilterIndex: 0,
        //   useDefinefilterValue: null,
          columns: [
            {
              key: "CMID",
              title: "Price ID",
              hidden: false,
              noSearch: false
            },
            {
              key: "PRICENAME",
              title: "Price Name",
              hidden: false,
              noSearch: false
            }
        
          ]
        }
      }

      onSalesmanEnter(event: Event){
        this.getSalesmanList();
        this.genericGridSalesman.show();
      }

      getSalesmanList(){
        this.gridPopupSettingsForSalesmanList = {
            title: "Salesman List",
            apiEndpoints: `/getSalesmanPagedList`,
            defaultFilterIndex: 0,
            // useDefinefilterValue: null,
            columns: [
              {
                key: "SALESMANID",
                title: "SALESMAN ID",
                hidden: false,
                noSearch: false
              },
              {
                key: "NAME",
                title: "NAME",
                hidden: false,
                noSearch: false
              },
              {
                key: "TELNO",
                title: "MOBILE",
                hidden: false,
                noSearch: false
              }
            ]
          }
      }

      onSalesmanSelect(value: any){
        console.log("salesman details", value);
        this.form.get('SALESMAN').setValue(value.NAME);
        this.form.get('SALESMANID').setValue(value.SALESMANID);
        this.form.updateValueAndValidity();
      }

    ngOnChanges(changes:SimpleChanges) {
                //console.log("on party change", this.parentPartyID)
        if(!this.form){
            this.resetForm();
        }

        if(changes.ACID){
            //console.log("from tree", this.ACID)
            this.getParentName(this.mode);
        }

        if(changes.parentPartyID){
            if(this.parentPartyID != undefined && this.parentPartyID != ""){
                //console.log("group changed", this.parentPartyID);
                if(this.mode == 'add'){
                this.ACID = this.parentPartyID;
                }
                this.MasterService.SelectedGroup = this.parentPartyID;
                this.getParentNameInGroupSelect( this.parentPartyID,"add");
            }
            
        }

        if(changes.mainGroupID){
            //console.log("main group changed", this.mainGroupID);
            if(this.mainGroupID != undefined && this.mainGroupID != ""){
                if(this.parentPartyID == 'PAG01'){
                    if(this.form){
                    this.form.get('Ptype').setValue('V');
                    }
                    this.ISCUSTOMER = false;
                    if(this.userSetting.Country == 1){
                        this.PartyCat_List =  this.GeoList.filter(x=>x.PTYPE == 'V')
                    }
                }else{
                    if(this.form){
                    this.form.get('Ptype').setValue('C');
                    }
                    this.ISCUSTOMER = true;
                    if(this.userSetting.Country == 1){
                        this.PartyCat_List =  this.GeoList.filter(x=>x.PTYPE == 'C')
                    }
                }
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
                if(this.form){
                this.form.get('parentid').setValue(parentName.ACNAME);
                this.form.get('parentid').disable();
                }
            }
        )
    }

    getParentNameInGroupSelect(PARENTACID,mode){
        this.MasterService.getParentNamebyID(PARENTACID,mode).subscribe(
            (res) =>{
                var parentName = res[0];
                if(this.form){
                this.form.get('parentid').setValue(parentName.ACNAME);
                this.form.get('parentid').disable();
                }
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
        this.MasterService.getpartyListTree().subscribe(data => {
            var f = data.filter(x => x.ACID == majorparent)[0];
            if (f != null) { this.acParentList = f.children; }
        });
    }
    SumbitSave() {
        if (this.MasterService.validateMasterCreation("save") == false) {
            return;
        }

        // this.ISCUSTOMER=false;
        // console.log("@@value",  this.ISCUSTOMER);
        
        if((this.ACID == null || this.ACID == undefined) && ( this.form.controls.parentid.value == "" || this.form.controls.parentid.value == null || this.form.controls.parentid.value == undefined)){
            this.alertSerivces.warning("Please select parent group before save!");
            return;

        }

        if(this.form.value.IsInitialValue == true && this.userSetting.ENABLEINTERCOMPANYPARTY ==1){
            if(this.form.value.INITIAL.length > 3 || this.form.value.INITIAL.length < 3){
                alert("Inter Company ID should be 3 characters only!")
                return
            }
        }
        else{
            this.form.value.INITIAL = '';
        }
        //console.log("BANKACCOUNTNUMBER",this.form.value.BANKNAME,this.form.value.BANKACCOUNTNUMBER)
        if (this.form.value.BANKNAME) {
            if (this.form.value.BANKACCOUNTNUMBER == "" || this.form.value.BANKACCOUNTNUMBER === null || this.form.value.BANKACCOUNTNUMBER === undefined) {
                this.alertSerivces.info("Please Enter Bank Account Number.");
                return;
            }

            let additionalbankdetailsObj:AdditionalBankList=<AdditionalBankList>{};
            additionalbankdetailsObj.BANKCODE = this.form.value.BANKCODE;
            additionalbankdetailsObj.BANKNAME = this.form.value.BANKNAME;
            additionalbankdetailsObj.BANKACCOUNTNUMBER = this.form.value.BANKACCOUNTNUMBER;
            this.AdditionalBankList.push(additionalbankdetailsObj);
        }
        
        this.dialogMessageSubject.next("Saving Data please wait...");
        var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })
        if (this.form.value.VATNO) {
            //console.log({ billtotel: parseFloat(this.form.value.VATNO) })
            var pno = parseFloat(this.form.value.VATNO);
            if(this.userSetting.isOverSeas == 0 || this.Is_OverseasParty==0)
            {
            if (pno.toString().length != 9) {
                alert("VAT No is not correct");
                dialogRef.close(); 
                return;
            }
        }
        }
        try {
            // if (!this.parentGroup) throw new Error("Parent is missing");

            let al = <TAcList>{};
            let partyAdditionalInfo = <PartyAdditional>{};
            let SalesTargetData = <SalesTarget>{};
            if (this.Title == 'AddLedger' || this.mode == 'edit' && this.grp == 'A') {
                al.TYPE = "A"
                al.CRLIMIT = this.form.value.CRLIMIT;
            }
            else {
                al.CRLIMIT = 0;
                al.TYPE = "G"
            }
            if (this.mode != 'edit') {
                al.PARENT = this.ACID;

            }
            al.ACNAME = this.form.value.ACNAME,


                al.MAPID = "N",
                al.ADDRESS = this.form.value.ADDRESS,
                al.PHONE = this.form.value.PHONE,
                al.FAX = this.form.value.FAX,
                al.EMAIL = this.form.value.EMAIL,
                al.VATNO = this.form.value.VATNO,

                al.ACCODE = this.form.value.ACCODE,
                al.PType = this.form.value.Ptype,
                al.ISACTIVE = this.form.value.isNotActive;
            al.ACID = this.ACID;
            al.BANKACCOUNTNUMBER = this.form.value.BANKACCOUNTNUMBER;
            al.BANKNAME = this.form.value.BANKNAME;
            al.BANKCODE = this.form.value.BANKCODE;
            al.DIV = this.ChangedDiv;
            if (al.DIV == '' || al.DIV == null) {
                al.DIV = this.userProfile.userDivision;
            }

            if (this.mode == 'edit') {
                //console.log("in EDIT MODE, acid", this.ACID,"parent",this.parentValueForEditMode )
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
            al.CITY = this.form.value.CITY;
            al.STATE = this.form.value.STATE;
            al.COMMON = this.form.value.COMMON;
            al.ISACTIVE = this.form.value.ISACTIVE;
            al.GEO = this.form.value.GEO;
            al.CRPERIOD = this.form.value.CRPERIOD;
            al.MOBILE = this.form.value.Mobile;
            al.CATEGORY = this.form.value.GEO;
            al.ISCOMMONAC = this.form.value.ISCOMMONAC;
            al.ISBRANCH = this.form.value.ISBRANCH;
            al.DISTRICT = this.form.value.DISTRICT;
            this.form.value.createMember == 1?al.CTYPE = 'Member Also' :  al.CTYPE = "";
            al.IS_OVERSEAS_PARTY = this.form.value.IS_OVERSEAS_PARTY;
               
            
            if (al.CITY != null) {
                let checkAreaID = this.areaList.filter(x => x.AREANAME.toUpperCase() == this.form.value.CITY.toUpperCase());
                // ////console.log("@@checkAreaID",checkAreaID);
                al.AREA_ID = checkAreaID[0] ? checkAreaID[0].AREAID : null;
            }
            al.INITIAL = this.form.value.INITIAL;
            // al.ISCOMMONAC = this.form.value.Sha
            al.PCL = 'pc002';
            al.PCompany=this.form.value.PCompany;
            al.PCompanyName=this.form.value.PCompanyName;


            // al.COMMON = this.form.value.common;
            partyAdditionalInfo.CNAME = this.form.value.CNAME;
            partyAdditionalInfo.ONAME = this.form.value.ONAME;
            partyAdditionalInfo.OCONTACT = this.form.value.OCONTACT;
            partyAdditionalInfo.ODESIGNATION = this.form.value.ODESIGNATION;
            partyAdditionalInfo.CONTACTNAME = this.form.value.CONTACTNAME;
            partyAdditionalInfo.CCONTACT_A = this.form.value.CCONTACT_A;
            partyAdditionalInfo.CCONTACT_B = this.form.value.CCONTACT_B;
            partyAdditionalInfo.CDESIGNATION = this.form.value.CDESIGNATION;
            partyAdditionalInfo.RELATEDSPERSON_A = this.form.value.RELATEDSPERSON_A;
            partyAdditionalInfo.RELATEDSPERSON_B = this.form.value.RELATEDSPERSON_B;
            partyAdditionalInfo.NOTES = this.form.value.NOTES;

            SalesTargetData.BAISHAKH= this.form.value.BAISHAKH;
            SalesTargetData.JESTHA= this.form.value.JESTHA;
            SalesTargetData.ASHAD= this.form.value.ASHAD;
            SalesTargetData.SHARWAN= this.form.value.SHARWAN;
            SalesTargetData.BHADRA= this.form.value.BHADRA;
            SalesTargetData.ASHWIN= this.form.value.ASHWIN;
            SalesTargetData.KARTIK= this.form.value.KARTIK;
            SalesTargetData.MANGSHIR= this.form.value.MANGSHIR;
            SalesTargetData.PAUSH= this.form.value.PAUSH;
            SalesTargetData.MAGH= this.form.value.MAGH;
            SalesTargetData.FALGUN= this.form.value.FALGUN;
            SalesTargetData.CHAITRA= this.form.value.CHAITRA;
            SalesTargetData.TARGET_AMOUNT= this.form.value.TARGET_AMOUNT;

            let AdditionalBankObj : AdditionalBankObj=<AdditionalBankObj>{};
            AdditionalBankObj.AdditionalBankList = this.AdditionalBankList;

            // //console.log('saveValue',al)
            this.createMember = this.form.value.createMember;
            // this.selectedSharedDiv = thi
            // ////console.log("@@createMember",this.createMember)
            if (this.Title == "AddGroup") {
                this.createMember = false;
            }
            if (al.PType == 'V'  && al.VATNO == '') {
               
                    alert("Please Enter VATNO First!")
                    dialogRef.close();
                    return;
                
            }
            if (al.PType == 'V') {
                this.createMember = false;
            }
            if(this.userSetting.Country == 1){


                if (al.PType == 'V' && al.VATNO == '' && this.grp == 'A' && (this.Is_OverseasParty == 0 && this.userSetting.VATNOTCOMPULSORY==0)) {
                alert("Please Enter VATNO First!");
                dialogRef.close();
                return;
            }
            }
            if (this.userSetting.CREATE_CPROFILE_AS_MEMBER == 1 && this.createMember == true && al.PType == 'C') {
                if (al.MOBILE == '' || al.MOBILE == null || al.MOBILE === undefined) {
                    alert("Please Enter Mobile No. First!");
                    dialogRef.close();
                    return;
                }
            }

            if (!(al.MOBILE == '' || al.MOBILE == null || al.MOBILE === undefined)) {
                if (al.MOBILE.length != 10) {
                    alert("Mobile No. should be ten digit length!");
                    dialogRef.close();
                    return;
                }
            }

            if(this.userSetting.ENABLESALES_TARGET == 1 && this.ISCUSTOMER==true && this.form.value.Ptype == 'C' && this.grp == 'A'){
                if(this.calculateMonthBalance() == false){
                    dialogRef.close();
                    return;
                }

                if(this.calculateTotalMonthBalance() == false){
                    dialogRef.close();
                    return;
                }
            }

            if (this.userSetting.ENABLEPARENTCOMPANY == 1) {
                if(this.form.value.PCompany === "" || this.form.value.PCompany === null || this.form.value.PCompany === undefined){
                    dialogRef.close();
                    this.alertSerivces.info("Please select parent company!!");
                    return;
                }
            }

            al.enableDivSelectionTable=this.showDivSelectionTable;

            let divisionObj = <SelectedDivisions>{};
            divisionObj.DIV = this.form.value.MultipleDivision;

            let DObj : DObj=<DObj>{};
            if (this.showDivSelectionTable == true) {
                al.ISCOMMONAC = 0;
                this.DivListForSave = [];
             for(let i of this.division){
                 ////console.log("@@division",this.division)
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
              
            //   //console.log("PARENT BEFORE SAVE", al.PARENT,al.PARENT.slice(al.PARENT.length -3) )
              if(this.Title != "AddGroup"){
                if( al.PARENT.slice(al.PARENT.length -3) != 'PAG'){
                	al.PARENT = this.MasterService.SelectedGroup;
                }
              }
            

            //console.log("AL", al);
            let sub = this.MasterService.saveAccount(this.mode, al, this.createMember, partyAdditionalInfo,DObj,SalesTargetData,AdditionalBankObj)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        //Displaying dialog message for save with timer of 1 secs
                        //console.log('PARTYDATA@@@@', data)
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
                            //console.log("save party emit",selNode);
                            this.SavePartyEmit.emit(selNode);
                        }
                        //console.log("GROUP SAVE");
                        this.PartyService.loadTableListSubject.next(al);
                        for(let i of this.PartyService.partyList){
                            if(i.ACID == al.PARENT){
                                i.children.push(al);
                            }
                        }
                        
                        this.dialogMessageSubject.next("Data Saved Successfully")
                        setTimeout(() => {
                            //console.log("data saved success");
                            dialogRef.close();
                            this.onClose.emit(this.ACID);
                            this.router.navigate(["pages/account/AccountLedger/PartyTree"])

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
        let acid= this.mode == 'add'? this.ACID : this.parentIdOnEdit;
        this.onClose.emit(true);
        this.PartyService.subTitle = " ";
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

        if (value == 'V') {  
            this.form.get('createMember').disable;    
            if(this.userSetting.Country == 1){
                this.PartyCat_List =  this.GeoList.filter(x=>x.PTYPE == 'V');
                if(this.mode == "add"){
                    this.form.get('GEO').setValue('111111-1');
                }
            }
        } else {
            this.form.get('createMember').enable;
            this.ISCUSTOMER=true;
            if(this.userSetting.Country == 1){
                this.PartyCat_List =  this.GeoList.filter(x=>x.PTYPE == 'C');
                if(this.mode == "add"){
                    this.form.get('GEO').setValue('123456-7');
                }
            }
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

                this.PartyService.getChildrenGroups(event.value.ACID)
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
        this.PartyService.getParentGroups(this.ACID)
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
        this.PartyService.getTopGroups()
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

    add(){
        this.bank = true;
        // //console.log("form ko value", this.form.controls.BankName.value)
        let bankobj = <BankDetails>{}
        bankobj.BankName = this.form.get("BankName").value;
        bankobj.BranchName= this.form.get("BranchName").value;
        bankobj.AccountNumber = this.form.get("AccountNumber").value;
       
        this.bankArray.push(bankobj);
        // //console.log("sabai value of table",bankobj);

    }

    SaveBankdetail(){
        // let bodyData =  this.bankObj} 
        this.bankObj.CUSTOMERNAME = this.form.get("cusName").value;
        this.bankObj.ADDRESS = this.form.get("Address").value; 
        this.bankObj.VATNO = this.form.get("VatNo").value;  
        this.bankObj.BankDetails = this.bankArray;
        this.MasterService.saveBankDetail(this.bankObj).subscribe(res=>{
            //console.log("result aayo",res)
            if(res.status == "ok"){

               
                this.alertSerivces.info("Saved successfully!")
            
            }
            else{
                this.alertSerivces.error(res.result);
            }
        }, error =>{
            this.alertSerivces.error("Error in savin data. Please try again!");
        })
      
    }

    showBankPopup(){
        this.gridBankPopupSettings = {
          title: "Bank List",
          apiEndpoints: `/getBankPagedList/`,
          defaultFilterIndex: 1,
          columns: [
            {
              key: "BANKCODE",
              title: "Bank Code",
              hidden: false,
              noSearch: false
            },
            {
              key: "BANKNAME",
              title: "Bank Name",
              hidden: false,
              noSearch: false
            }
          ]
        };
        this.genericGridBankList.show();
      }
      onBankSelect(value){
        //console.log("ValueCheck",value)
        this.form.get('BANKCODE').patchValue(value.BANKCODE);
        this.form.get('BANKNAME').patchValue(value.BANKNAME);
      }

      onAddBankSelect(value){
        this.form.get('ADDITIONALBANKCODE').patchValue(value.BANKCODE);
        this.form.get('ADDITIONALBANKNAME').patchValue(value.BANKNAME);
      }

      showAddBankPopup(){
        this.gridAdditionalBankPopupSettings = {
            title: "Bank List",
            apiEndpoints: `/getBankPagedList/`,
            defaultFilterIndex: 1,
            columns: [
              {
                key: "BANKCODE",
                title: "Bank Code",
                hidden: false,
                noSearch: false
              },
              {
                key: "BANKNAME",
                title: "Bank Name",
                hidden: false,
                noSearch: false
              }
            ]
          };
          this.genericGridAdditionalBankList.show();
      }

      onCLickAddBank(){
          if(this.form.value.ADDITIONALBANKCODE==='' || this.form.value.ADDITIONALBANKCODE===null || this.form.value.ADDITIONALBANKCODE===undefined ||
          this.form.value.ADDITIONALBANKNAME==='' || this.form.value.ADDITIONALBANKNAME===null || this.form.value.ADDITIONALBANKNAME===undefined ||
          this.form.value.ADDITIONALBANKACCOUNTNUMBER==='' || this.form.value.ADDITIONALBANKACCOUNTNUMBER===null || this.form.value.ADDITIONALBANKACCOUNTNUMBER===undefined){
              return;
          }
          let additionalbankdetailsObj:AdditionalBankList=<AdditionalBankList>{};
          additionalbankdetailsObj.BANKCODE = this.form.value.ADDITIONALBANKCODE;
          additionalbankdetailsObj.BANKNAME = this.form.value.ADDITIONALBANKNAME;
          additionalbankdetailsObj.BANKACCOUNTNUMBER = this.form.value.ADDITIONALBANKACCOUNTNUMBER;
        this.AdditionalBankList.push(additionalbankdetailsObj);
        this.form.get('ADDITIONALBANKCODE').setValue('');
        this.form.get('ADDITIONALBANKNAME').setValue('');
        this.form.get('ADDITIONALBANKACCOUNTNUMBER').setValue('');
      }

      getPartyList(parentACID){
        //console.log("get party list", this.ACID);
        if(parentACID){
            this.PartyService.getPartyHeirarchy(parentACID).subscribe(
                res=>{
                    //console.log("result hai", res);
                    let itemGroup = res[0];
                    //console.log("MAIN GROUP LSIR", this.MasterService.mainGroupList);
                    this.MasterService.groupSelectObj.MGROUP = itemGroup.L1;
                    //console.log("main group id", this.MasterService.groupSelectObj.MGROUP);
                    this.PartyService.getSubPartyList(this.MasterService.groupSelectObj.MGROUP).subscribe((res)=>{
                        if(res.length > 0){
                            this.MasterService.subPartyAList = res;
                            this.MasterService.groupSelectObj.SUBGROUP_A = itemGroup.L2;
                            //console.log("SUBGROUP A LIST", this.MasterService.subPartyAList);
                            this.MasterService.disableSubPartyA = false
                            this.PartyService.getSubPartyList(this.MasterService.groupSelectObj.SUBGROUP_A).subscribe((res)=>{
                                if(res.length> 0){
                                    this.MasterService.subPartyBList = res;
                                    this.MasterService.groupSelectObj.SUBGROUP_B = itemGroup.L3;
                                    this.MasterService.disableSubPartyB = false
                                    this.PartyService.getSubPartyList(this.MasterService.groupSelectObj.SUBGROUP_B).subscribe((res)=>{
                                        if(res.length > 0){
                                            this.MasterService.subPartyCList = res;
                                            this.MasterService.groupSelectObj.SUBGROUP_C = itemGroup.L4;
                                            this.MasterService.disableSubPartyC = false;

                                        }else{
                                            this.MasterService.disableSubPartyC = true;
                                        }
                                    });

                                }else{
                                    this.MasterService.disableSubPartyB = true;
                                }
                            });
                        }else{
                            this.MasterService.disableSubPartyA = true;
                        }
                    })
                }
            )
        }
      }

      DeleteParty(){
          //console.log("current party acid", this.ACID);
          this.DeletePar.show();
      }

      DeleteYes(){
          
          this.DeletePar.hide();
          this.spinnerservice.show("Deleting Party, please wait...");
          this.MasterService.deleteAccount(this.ACID).subscribe(data =>{
              if(data.status == "ok"){
                  this.alertSerivces.success("Party deleted !");
                  this.spinnerservice.hide();
                  this.onClose.emit(this.parentIdOnEdit);
                  this.router.navigate(["pages/account/AccountLedger/PartyTree"])
              }else{
                  this.spinnerservice.hide();
                  this.alertSerivces.error("Error in deleting data: "+data.result._body);
              }
          })
      }

      DeleteNo(){
          this.DeletePar.hide();
      }

      checkDuplicateVAT(event){
        //console.log("chec duplicte vat", event, this.MasterService.userSetting.EnableDuplicateVATforParty);
        if(this.MasterService.userSetting.EnableDuplicateVATforParty === 1){
            this.PartyService.checkduplicateVATNO(event.target.value).subscribe((res:any)=>{
                //console.log("result checkduplicate", res);
                if(res == 'DUPLICATE'){
                    if(confirm("VAT no. already exists. Do you want to continue with the same VAT no. ?")){
    
                    }else{
                        this.form.get('VATNO').patchValue("");
                    }
                }
            });
        }
       
      }

      onStateChange(event) {
        this.DistrictListbyState = this.DistrictList.filter(x => x.State == event.target.value)
      }
    
      displayDistrictOnEdit(StateCode: any) {
        this.DistrictListbyState = this.DistrictList.filter(x => x.State == StateCode)
      }

      calculateMonthBalance(){
          let BAISAKH = this.form.value.BAISHAKH;
          let JESTHA = this.form.value.JESTHA;
          let ASHAD = this.form.value.ASHAD;
          let SHARWAN = this.form.value.SHARWAN;
          let BHADRA = this.form.value.BHADRA;
          let ASHWIN = this.form.value.ASHWIN;
          let KARTIK = this.form.value.KARTIK;
          let MANGSHIR = this.form.value.MANGSHIR;
          let PAUSH = this.form.value.PAUSH;
          let MAGH = this.form.value.MAGH;
          let FALGUN = this.form.value.FALGUN;
          let CHAITRA = this.form.value.CHAITRA;

          if ((BAISAKH + JESTHA + ASHAD + SHARWAN + BHADRA + ASHWIN + KARTIK + MANGSHIR + PAUSH + MAGH + FALGUN + CHAITRA) > 100) {
              this.alertSerivces.info("Monthly balance exceed 100% !!");
              return false;
          }
      }
     
      calculateTotalMonthBalance(){
        let BAISAKH = this.form.value.BAISHAKH;
        let JESTHA = this.form.value.JESTHA;
        let ASHAD = this.form.value.ASHAD;
        let SHARWAN = this.form.value.SHARWAN;
        let BHADRA = this.form.value.BHADRA;
        let ASHWIN = this.form.value.ASHWIN;
        let KARTIK = this.form.value.KARTIK;
        let MANGSHIR = this.form.value.MANGSHIR;
        let PAUSH = this.form.value.PAUSH;
        let MAGH = this.form.value.MAGH;
        let FALGUN = this.form.value.FALGUN;
        let CHAITRA = this.form.value.CHAITRA;

        if ((BAISAKH + JESTHA + ASHAD + SHARWAN + BHADRA + ASHWIN + KARTIK + MANGSHIR + PAUSH + MAGH + FALGUN + CHAITRA) < 100) {
          this.alertSerivces.info("Monthly balance should be 100% !!");
          return false;
      }
    }

    RemoveBankFromList(index){
        this.AdditionalBankList.splice(index,1);
    }

    showParentAccountList(){
    this.gridACListPartyPopupSettings = {
        title: "Accounts",
        apiEndpoints: `/getAccountPagedListByMapId/Details/PartyOpeningBalance/`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: "ACCODE",
            title: "AC CODE",
            hidden: false,
            noSearch: false
          },
          {
            key: "ACNAME",
            title: "A/C NAME",
            hidden: false,
            noSearch: false
          }
        ]
      };
      this.genericGridACListParty.show();
    }

    onAddParentCompanySelect(value){
        this.form.get('PCompany').patchValue(value.ACID);
        this.form.get('PCompanyName').patchValue(value.ACNAME);
      }

      changeIsOverseasParty(value){
        if(value==true){
            this.Is_OverseasParty=1;
        }else{
            this.Is_OverseasParty=0;
        }
      }

      resetForm(){
        
        this.form = this._fb.group({
            majorparent: [''],
            parentid: [''],
            ACNAME: ['', Validators.required],
            Ptype: [''],
            MAPID: [''],
            ADDRESS: ['', Validators.required],
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
            CCONTACT_A: [''],
            CCONTACT_B: [''],
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
            BANKACCOUNTNUMBER: [''],
            BANKCODE:[''],
            BANKNAME:[''],
            ISBRANCH: [''],
            BAISHAKH: [0],
            JESTHA: [0],
            ASHAD: [0],
            SHARWAN: [0],
            BHADRA: [0],
            ASHWIN: [0],
            KARTIK: [0],
            MANGSHIR: [0],
            PAUSH: [0],
            MAGH: [0],
            FALGUN: [0],
            CHAITRA: [0],
            TARGET_AMOUNT: [0],
            DISTRICT: [''],
            ADDITIONALBANKACCOUNTNUMBER: [''],
            ADDITIONALBANKCODE:[''],
            ADDITIONALBANKNAME:[''],
            PCompany:[''],
            PCompanyName:[''],
            IS_OVERSEAS_PARTY: [0]
        })
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

export interface BankCustomerInfo{
    CUSID:string;
    CUSTOMERNAME: string;
    ADDRESS:string;
    VATNO:number;
    BankDetails:BankDetails[]; 
}

export interface BankDetails{
    CUSID:string;
    BankName: string;
    BranchName: string;
    AccountNumber:number;

}

export class AdditionalBankObj {
    AdditionalBankList: AdditionalBankList[]
}
export class AdditionalBankList {
    BANKCODE: string;
    BANKNAME: string;
    BANKACCOUNTNUMBER:any;
}
