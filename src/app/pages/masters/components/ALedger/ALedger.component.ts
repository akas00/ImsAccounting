import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { MessageDialog } from "./../../../modaldialogs/messageDialog/messageDialog.component";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from "ng2-bootstrap";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  AcListTree,
  TAcList
} from "../../../../common/interfaces/Account.interface";
import { AuthService } from "../../../../common/services/permission";

import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PLedgerservice } from "../PLedger/PLedger.service";
import { AccountGroupPopUpComponent } from "../../../../common/popupLists/AGroupPopup/account-group-popup-grid.component";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { ForAccountGroupPopUpComponent } from "../../../../common/popupLists/AGroupPopup/ForAccountLedger.component";
import { PLedgerComponent } from "../PLedger/PLedger.component";

@Component({
  selector: "ALedger",
  templateUrl: "ALedger.html",
  providers: [PLedgerservice, TransactionService],
  styleUrls: ["../../../Style.css", "../../../../common/popupLists/pStyle.css"]
})
export class ALedgerComponent {
  @ViewChild("acPopupGrid") acPopupGrid: ForAccountGroupPopUpComponent;
  @Output("onClose") onClose = new EventEmitter();
  ACID: string;
  @Input() rootID: string;
  @Input() mode: string;
  @Input() grp: string;
  @Output() SavePartyEmit = new EventEmitter();
  @ViewChild("showParty") sParty: ElementRef;
  @ViewChild("PLedgerChild") PLedgerChild: PLedgerComponent;
  showAssets = 0;
  PARENTNAME = new FormControl('')
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
  DialogMessage: string = "Saving data please wait ...";
  private subcriptions: Array<Subscription> = [];
  initialTextReadOnly = false;
  ID: string = "";
  modeTitle: string;
  // parentGroup: GroupParty;
  acGroups: any[] = [];
  Prefix: any;
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  actype: string = "";
  disableActype: boolean = false;
  lastParentID: string;
  userProfile: any;
  formObj: any = <any>{};
  Title: string = "";
  PType: string;
  isGroup: number;
  AccCurrentSelectedGroup: any;
  editItem: any;
  isSubGrpEmpty = true;
  MainGrpList:any[]=[];
  AllGrpList:any[]=[];
  isActive: boolean = false;
  Acctitle:any;
  BankPartyVerification:any=<any>{}
  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    private MasterService: MasterRepo,
    router: Router,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MdDialog,
    private _authService: AuthService,
    private _Ledgerservice: PLedgerservice,
  ) {
    this.router = router;
    this.userProfile = this._authService.getUserProfile();
    this.showAssets = 0;
    
    this._Ledgerservice.getAllMainGroup().subscribe(res => {
      ////console.log("reachedaaa",res)
      if (res.status == "ok") {
          this.MainGrpList=res.result;
      }
  });

  }
  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.acPopupGrid.show("a");
    // }, 4000);
    this.acPopupGrid.show(this.AccCurrentSelectedGroup);
  }
  ngOnInit() {
    this.form = this._fb.group({
      PARENT: [""],
      ACCODE: [""],
      ACNAME: [""],
      ISACTIVE: [1],
      HASSUBLEDGER: [0],
      ACTYPE: [""],
      DIV: [""],
      MAPID: [""],
      TYPE: [""],
      ACID: [""],
      MainGroup: [""],

    });
    this.onFormChanges();
    if (!!this._activatedRoute.snapshot.params["mode"])
      this.mode = this._activatedRoute.snapshot.params["mode"];

    if (!!this._activatedRoute.snapshot.params["isGroup"])
      this.isGroup = this._activatedRoute.snapshot.params["isGroup"];

    if (!!this._activatedRoute.snapshot.params["PType"])
      this.PType = this._activatedRoute.snapshot.params["PType"];

    this.form.patchValue({
      TYPE: this.PType

    })

    if (!!this._activatedRoute.snapshot.params["Title"])
      this.Title = this._activatedRoute.snapshot.params["Title"];

    if (!!this._activatedRoute.snapshot.params["ACID"])
      this.ACID = this._activatedRoute.snapshot.params["ACID"];

    if (!!this._activatedRoute.snapshot.params["returnUrl"])
      this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
    if (!!this._activatedRoute.snapshot.params["PType"])
      this.PType = this._activatedRoute.snapshot.params["PType"];

    this.form.patchValue({
      TYPE: this.PType

    })

    if (this.mode == "edit") {
      //this.form.get("PARENT").disable();
      //  this.form.get("ACCODE").disable();
      //this.form.get("ACNAME").disable();
      //this.form.get("HASSUBLEDGER").disable();
      // this.form.get("ACTYPE").disable();
      // this.form.get("DIV").disable();
      // this.form.get("MAPID").disable();

      this.loadingService.show("Getting data, Please wait...");
      this.MasterService.getAllAccount(this.ACID).subscribe(
        data => {
          this.loadingService.hide();
          this.editItem = data.result;
          this.PARENTNAME.patchValue(data.result.GROUPNAME)
          this.form.patchValue({
            HASSUBLEDGER: data.result.HASSUBLEDGER,
            PARENT: data.result.PARENT,
            ACCODE: data.result.ACCODE,
            ACNAME: data.result.ACNAME,
            ISACTIVE: data.result.ISACTIVE,
            DIV: data.result.DIV,
            MAPID: data.result.MAPID,
            ACID: data.result.ACID
          });
          this.Prefix = data.result.ACID.substring(0, 2);

        },
        error => {
          this.loadingService.hide();
          this.alertService.error(error);
        }
      );
    } else {
      if (this.Title == "AddLedger") {
        this.modeTitle = "Add Account Ledger";
      } else if (this.Title == "AddGroup") {
        this.modeTitle = "Add Account Group";
      }
    }
  }

  onAcGroupPopupTab() {

    // this.acPopupGrid.show(this.AccCurrentSelectedGroup);
  }
  AdditionalInfo:number=0;
  showPLedgerInfo:number=0;
  showBank:number=0
  onItemDoubleClick(event) {
    this.AdditionalInfo=0;
    this.showBank=0;
    this.showPLedgerInfo=0
    this.isSubGrpEmpty=false;
    this.AccCurrentSelectedGroup = event;

    ////console.log("selected group" + JSON.stringify(this.AccCurrentSelectedGroup));

    //  if(this.AccCurrentSelectedGroup.PARENT.substring(0,2) == "BS"){
    //    return this.showAssets = true;
    //  }

    if (this.AccCurrentSelectedGroup.ACID.substring(0, 2) == "AT")
      this.showAssets = 1;
    else
      this.showAssets = 0;
    let hasSubLedger =
      this.isGroup == 1
        ? this.AccCurrentSelectedGroup.HASSUBLEDGER
          ? 1
          : 0
        : 0;
    this.form.patchValue({
      HASSUBLEDGER: hasSubLedger,
      PARENT: this.AccCurrentSelectedGroup.ACNAME,
    });
    ////console.log("CheckSelectedGroup",this.AccCurrentSelectedGroup)
    
    // this.acPopupGrid.hide()
    var subPrefix=this.AccCurrentSelectedGroup.ACID.substring(0,2);
    this.Prefix=subPrefix;
    // if(this.AccCurrentSelectedGroup.ACID=='B'){
      // this.childModal.show();
    // }
    this.form.patchValue({
      MAPID:'',
      Ptype:''
    })
    this.PARENTNAME.patchValue(this.AccCurrentSelectedGroup.ACNAME)
    this.BankPartyVerification.Bank=0;
    this.BankPartyVerification.Customer=0;
    this.BankPartyVerification.Supplier=0;
    if (this.AccCurrentSelectedGroup.ACID=='ATG0003' || this.AccCurrentSelectedGroup.MAPID == 'B') {
      this.AdditionalInfo=1;
      // this.showPLedgerInfo=1
      this.showBank=1;
      this.showAssets = 1
      this.form.patchValue({
        MAPID:'B'
      })
      this.BankPartyVerification.Bank='saveBank'
    }
    else  if (this.AccCurrentSelectedGroup.ACID=='ATG0003' || this.AccCurrentSelectedGroup.MAPID == 'C') {
      this.showAssets = 1
      this.form.patchValue({
        MAPID:'C'
      })
      
    }
    else{
      this.showAssets = 0
      this.form.patchValue({
        MAPID:''
      })
   
    }
    this.PLedgerChild.BindValue('Q');
    if(this.AccCurrentSelectedGroup.ACID=='LBG38' || this.AccCurrentSelectedGroup.PType=='C'){
      //Sundry creditor
            this.AdditionalInfo=1;
      this.showPLedgerInfo=1;
      this.PLedgerChild.BindValue('C');
      this.MasterService.PType = 'C';
      this.form.patchValue({
        Ptype:'C'
      })
      this.BankPartyVerification.Customer=1
    }
    if(this.AccCurrentSelectedGroup.ACID=='AT01001' || this.AccCurrentSelectedGroup.PType=='V'){
      //sundry deptors
      this.AdditionalInfo=1;
      this.showPLedgerInfo=1;
      this.PTypeForParty='V'
      this.PLedgerChild.BindValue('V');
      this.MasterService.PType = 'V'
      this.form.patchValue({
        Ptype:'V'
      })
      this.BankPartyVerification.Supplier=1
    }
    
  }
  PTypeForParty:any;
  // @ViewChild('lgModal') childModal: ModalDirective;
  hide(){
    this.isActive = false;
  }
  onFormChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.dirty)
        this.preventNavigationService.preventNavigation(true);
    });
  }

  majorgroupChange() {
    this.filter(this.form.get("majorparent").value);
  }

  filter(majorparent) {
    this.MasterService.getpartyListTree().subscribe(data => {
      var f = data.filter(x => x.ACID == majorparent)[0];
      if (f != null) {
        this.acParentList = f.children;
      }
    });
  }
  SumbitSave() {
    if (this.form.value.VATNO) {
      var pno = parseFloat(this.form.value.VATNO);
      if(this.userProfile.userSetting.isOverSeas == 0){
      if (pno.toString().length != 9) {
        this.alertService.error("PAN No is not correct");
        this.acPopupGrid.show(this.AccCurrentSelectedGroup);
        return;
      }
    }
    }
    try {
      // this.form.value.MAPID = "N";
      let saveModel = Object.assign(<TAcList>{}, this.form.value);
      ////console.log("SAVEOBJ",this.form.value)
      if(this.isSubGrpEmpty==false)
      {
        if (this.AccCurrentSelectedGroup.HASSUBLEDGER == 1 && this.isGroup == 0) {
          saveModel.MCAT = 'SL'
        }
        if (this.mode == "edit") {
          //this.editItem.ISACTIVE = saveModel.ISACTIVE
          //saveModel = this.editItem; 
  
          // ////console.log("editItem"+this.editItem);
          //////console.log("Edit Account" + JSON.stringify(saveModel));
  
        } else {
          saveModel.PARENT = this.AccCurrentSelectedGroup.ACID;
        }
      }
      else{
        saveModel.PARENT=this.Prefix;
      }
     
      ////console.log("SAVEOBJ1",saveModel)
      if (saveModel.HASSUBLEDGER == 1 && this.isGroup == 1) {
        saveModel.MCAT = 'SG'
      }
     
      saveModel.DIV = this.userProfile.userDivision;
      //saveModel.MAPID = "N";
      
      this.loadingService.show("Saving Data please wait...");
      let sub = this.MasterService.saveAccountLedgerOnly(
        this.mode,
        saveModel,
        null,
        this.BankPartyVerification,
        this.MasterService.BankObj,
        this.MasterService.PLedgerObj,
        0,
       null
      ).subscribe(
        data => {
          this.loadingService.hide();
          if (data.status == "ok") {
            ////console.log("PARTYDATA@@@@", data);
            this.alertService.success("Data Saved Successfully");
            this.preventNavigationService.preventNavigation(false);
            setTimeout(() => {
              this.onClose.emit(true);
              this.router.navigate([this.returnUrl]);
            }, 1000);
          } else {
            
            //alert(data.result);
            //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
            if (
              data.result._body ==
              "The ConnectionString property has not been initialized."
            ) {
              this.router.navigate(["/login", this.router.url]);
              return;
            }
            //Some other issues need to check
            this.alertService.error(
              "Error in Saving Data:" + data.result._body
            );
            this.acPopupGrid.show(this.AccCurrentSelectedGroup);
          }
        },
        error => {
          this.loadingService.hide();
          this.alertService.error(error);
       
        }
      );
      this.subcriptions.push(sub);
    } catch (e) {
      this.alertService.error(e);
    }
  }

  cancel() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }

  changePtype(value) {
    this.form.get("Ptype").patchValue(value);
  }

  NotActive() { }

  closePartyPopup() {
    this.sParty.nativeElement.style.display = "none";
  }
  SelectMainGrp() {
    this.AdditionalInfo=0;
    this.showPLedgerInfo=0;
    this.showBank=0
    this.isSubGrpEmpty=true;
   
    this.AllGrpList=[]
    this.form.patchValue({
      HASSUBLEDGER:'',
      PARENTNAME:''
    })
    this.acPopupGrid.GetDataFromPrefix(this.Prefix)
    // this.acPopupGrid.show(this.AccCurrentSelectedGroup)

  }
  doubleClick($event) {
    this.onItemDoubleClick($event);
    
  }
  selectedRowIndex: number = 0;
  singleClick(index) {
    this.selectedRowIndex = index;
  }
  // closeParty(){
  //   // this.childModal.hide()
  //   this.acPopupGrid.show(this.AccCurrentSelectedGroup)
  // }
}
