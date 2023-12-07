import { MdDialog } from "@angular/material";
import { SelectItem } from "primeng/primeng";
import { GroupParty } from "./PLedger.service";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  AcListTree,
  TAcList
} from "../../../../common/interfaces/Account.interface";
import { AuthService } from "../../../../common/services/permission";
import { PLedgerservice } from "./PLedger.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { subscribeOn } from "rxjs/operator/subscribeOn";
import { TrnMain } from "../../../../common/interfaces";
import { relativeTimeRounding } from "moment";

@Component({
  selector: "PLedger",
  templateUrl: "PLedger.html",
  providers: [PLedgerservice, TransactionService],
  styleUrls: ["../../../Style.css", "../../../../common/popupLists/pStyle.css"]
})
export class PLedgerComponent {
  @Output("onClose") onClose = new EventEmitter();
  ACID: string;
  @Input() rootID: string;
  @Input() PType: string;
  @Input() mode: string;
  @Input() grp: string;
  @Output() SavePartyEmit = new EventEmitter();
  @Input() fromTree: number;
  
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
  private subcriptions: Array<Subscription> = [];
  initialTextReadOnly = false;
  ID: string = "";
  modeTitle: string;
  parentGroup: GroupParty;
  acGroups: any[] = [];
  actype: string = "";
  disableActype: boolean = false;
  lastParentID: string;
  userProfile: any;
  formObj: any = <any>{};
  Title: string = "";
  // PType: string;
  isGroup: number;
  PartyGrpList: any[] = [];
  ChannelList: any[] = [];
  GeoList: any[] = [];
  RouteList: any[] = [];
  BranchList: any[] = [];
  editModel: any = <any>{}
  geo: any;
  CardName: any[] = [];
  StateList: any[] = [];
  DistrictList:any[]=[];
  TrnMainObj: TrnMain = <TrnMain>{};
  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected MasterService: MasterRepo,
    private PartyService: PLedgerservice,
    router: Router,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MdDialog,
    private _authService: AuthService,
    private _trnMainService: TransactionService
  ) {
    this.router = router;
    this.TrnMainObj = this._trnMainService.TrnMainObj;
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
    //         console.log(error);
    //     }
    //     );

    
    
  }

  ngAfterViewInit() {
    this.HideACNAME=false;
    this.AfterView()
  }
  AfterView(){
    //console.log("CheckPtype", this.PType, this.isGroup);
    // if (this.PType == 'C' && (this.isGroup == false || this.isGroup == 'false')) {
    if (this.PType == "C" && this.isGroup == 0) {
      
      this.formObj.Name = "Customer Name";
      this.formObj.PSType = "Sales Type";
      this.formObj.PMode = "Payment Mode";
      this.form.patchValue({
        PType: "C",
        TYPE: "A"
      });
    } else if (this.PType == "C" && this.isGroup == 1) {
    
      this.formObj.Name = "Group Name";
      this.form.patchValue({ PType: "C", TYPE: "G" });
    }
    // else if (this.PType == 'V' && (this.isGroup == false || this.isGroup == 'false')) {
    else if (this.PType == "V" && this.isGroup == 0) {
      this.formObj.Name = "Supplier Name";
      this.formObj.PSType = "Purchase Type";
      this.formObj.PMode = "Purchase Mode";
      this.form.patchValue({ PType: "V", TYPE: "A" });
    } else if (this.PType == "V" && this.isGroup == 1) {
      this.form.patchValue({ PType: "V", TYPE: "G" });
    }

    // document.getElementById('id') = 'General';
    this.PartyService.getPartyGroupByPtype(this.PType).subscribe(res => {
      if (res.status == "ok") {
        this.PartyGrpList = res.result;
      }
    });
    this.PartyService.getDIV().subscribe(res => {
    
      this.BranchList = res;
    });
    this.PartyService.getHierachy().subscribe(res => {
      if (res.status == "ok") {
        this.GeoList = res.result.GEO;
        this.ChannelList = res.result.CHANNEL;
        this.RouteList = res.result.Route;
      }
    });
    this.MasterService.GETTRNTYPE().subscribe(res => {
      if (res.status == 'ok') {
        this.CardName = res.result;
      }

    })
    this.MasterService.getState().subscribe(res => {
      if (res.status == 'ok') {
        this.StateList = res.result;
      }
    })
    this.MasterService.getDistrict().subscribe(res => {
      if (res.status == 'ok') {
        this.DistrictList = res.result;
      }
    })
    this.userProfile = this._authService.getUserProfile();
  }

  ngOnInit() {
    this.form = this._fb.group({
      PARENT: [""],
      TITLE: [""],
      ACNAME: ["", Validators.required],
      SHORTNAME: [""],
      CUSTOMERID: [""],
      CATEGORY: [""],
      Currency: [""],
      PMODE: [""],
      CRLIMIT: [0],
      CRPERIOD: [0],
      PSTYPE: [""],
      DIV: [""],
      GSTTYPE: [""],
      MAILTYPE: [""],
      ISACTIVE: [1],
      ADDRESS: [""],
      TEMPADDRESS: [""],
      CITY: [""],
      STATE: [""],
      AREA: [""],
      LANDMARK: [""],
      PHONE: [""],
      MOBILE: ["", Validators.required],
      EMAIL: [""],
      POSTALCODE: [""],
      FAX: [""],
      VATNO: [""],
      ADHARNO: [""],
      GSTNO: [""],
      PRICELEVELCONFIG: [""],
      PRICELEVEL: [""],
      CTYPE: [""],
      ERPPLANTCODE: [""],
      ERPSTOCKLOCATIONCODE: [""],
      CBALANCE: [0],
      PType: [""],
      MAPID: [""],
      ACCODE: [""],
      ACID: [""],
      TYPE: [""],
      Channel: [""],
      SO: [""],
      GEO: [""],
      ROUTE: [""],
      RouteDays: [""],
      DISTRICT:[""],
      CONTACTPERSON:[""],
      CONTACTMOBILE:[""],
      CONTACTEMAIL:[""]
    });
    this.form.valueChanges.subscribe(data=>{
      this.MasterService.PLedgerObj=data;
    })

    this.onFormChanges();
    this.CrDisabled = 'enabled'

    if (!!this._activatedRoute.snapshot.params["mode"])
      this.mode = this._activatedRoute.snapshot.params["mode"];

    if (!!this._activatedRoute.snapshot.params["isGroup"])
      this.isGroup = this._activatedRoute.snapshot.params["isGroup"];

    if (!!this._activatedRoute.snapshot.params["ACID"])
      this.ACID = this._activatedRoute.snapshot.params["ACID"];

    if (!!this._activatedRoute.snapshot.params["PType"])
      this.PType = this._activatedRoute.snapshot.params["PType"];
    if (!!this._activatedRoute.snapshot.params["Title"])
      this.Title = this._activatedRoute.snapshot.params["Title"];

    if (!!this._activatedRoute.snapshot.params["returnUrl"])
      this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];

    this.getGroups();

    // this.MasterService.getAllAccount().subscribe(res => { this.ledgerAcList.push(<TAcList>res); });

    if (this.mode == "edit") {
      this.form.get("PARENT").disable();
      this.form.get("ACNAME").disable();
      this.form.get("SHORTNAME").disable();
      this.form.get("CUSTOMERID").disable();
      this.form.get("VATNO").disable();
      this.form.get("ACCODE").disable();
      this.form.get("CRLIMIT").disable();

      this.loadingService.show("Getting data, Please wait...");
      this.MasterService.getAllAccount(this.ACID).subscribe(
        data => {
          this.loadingService.hide();
          this.editModel = data.result;
          if(data.result2!=null || data.result2 !=undefined){
            this.SOTableList .push(data.result2)
          }
           
          this.setEditFromValue();
        },
        error => {
          this.loadingService.hide();
        }
      );
    } else {
      if (this.Title == "AddLedger") {
        this.modeTitle = "Add Party Ledger";
      } else if (this.Title == "AddGroup") {
        this.modeTitle = "Add Party Group";
      }
    }

  }
  HideACNAME=false;
BindValue(value,isGroup=0){
  this.PType=value;
  this.isGroup=isGroup;
  this.HideACNAME=true;
  this.AfterView();
  return
  // this.HideACNAME=false;
  // this.form.patchValue({
  //   PType: '',
  //   TYPE: '',
  //   PARENT:''
  // });
  // this.isGroup=isGroup
  // if (value == "C" && this.isGroup == 0) {
  //   this.HideACNAME=true;
  //   this.formObj.Name = "Customer Name";
  //   this.formObj.PSType = "Sales Type";
  //   this.formObj.PMode = "Payment Mode";
  //   this.form.patchValue({
  //     PType: "C",
  //     TYPE: "A",
  //     PARENT:'PA'
  //   });
  // } else if (value == "C" && this.isGroup == 1) {
  //   this.formObj.Name = "Group Name";
  //   this.form.patchValue({ PType: "C", TYPE: "G",PARENT:'PA' });
  // }
  // // else if (this.PType == 'V' && (this.isGroup == false || this.isGroup == 'false')) {
  // if (value == "V" && this.isGroup == 0) {
  //   //console.log("reached supllier")
  //   this.HideACNAME=true;
  //   this.formObj.Name = "Supplier Name";
  //   this.formObj.PSType = "Purchase Type";
  //   this.formObj.PMode = "Purchase Mode";
  //   this.form.patchValue({ PType: "V", TYPE: "A",PARENT:'PA' });
  // } else if (this.PType == "V" && this.isGroup == 1) {
  //   this.form.patchValue({ PType: "V", TYPE: "G",PARENT:'PA' });
  // }
}

  setEditFromValue(data=null) {
    if(data!=null && data !=undefined && data !=""){
      this.editModel=data
    }
    this.form.patchValue({
      PARENT: this.editModel.PARENT,
      TITLE: this.editModel.TITLE,
      ACNAME: this.editModel.ACNAME,
      SHORTNAME: this.editModel.shortname,
      CUSTOMERID: this.editModel.customerID,
      CATEGORY: this.editModel.CATEGORY,
      Currency: this.editModel.Currency,
      PMODE: this.editModel.PMODE,
      CRLIMIT: this.editModel.CRLIMIT,
      CRPERIOD: this.editModel.CRPERIOD,
      PSTYPE: this.editModel.PSTYPE,
      DIV: this.editModel.DIV,
      GSTTYPE: this.editModel.GSTTYPE,
      MAILTYPE: this.editModel.MAILTYPE,
      ISACTIVE: this.editModel.ISACTIVE,
      ADDRESS: this.editModel.ADDRESS,
      TEMPADDRESS: this.editModel.TEMPADDRESS,
      CITY: this.editModel.CITY,
      STATE: this.editModel.STATE,
      AREA: this.editModel.AREA,
      LANDMARK: this.editModel.LANDMARK,
      PHONE: this.editModel.PHONE,
      MOBILE: this.editModel.MOBILE,
      EMAIL: this.editModel.EMAIL,
      POSTALCODE: this.editModel.POSTALCODE,
      FAX: this.editModel.FAX,
      VATNO: this.editModel.VATNO,
      ADHARNO: this.editModel.ADHARNO,
      GSTNO: this.editModel.GSTNO,
      PRICELEVELCONFIG: this.editModel.PRICELEVELCONFIG,
      PRICELEVEL: this.editModel.PRICELEVEL,
      CTYPE: this.editModel.CTYPE,
      ERPPLANTCODE: this.editModel.ERPPLANTCODE,
      CBALANCE: this.editModel.CBALANCE,
      PType: this.editModel.PType,
      MAPID: this.editModel.MAPID,
      ACCODE: this.editModel.ACCODE,
      ACID: this.editModel.ACID,
      TYPE: this.editModel.TYPE,
      isAutoGSTApplicable : this.editModel.isAutoGSTApplicable,
      isRCMApplicable : this.editModel.isRCMApplicable,
      isReverseChargeApplicable : this.editModel.isReverseChargeApplicable

    });
    this.geo = this.editModel.GEO;
  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(() => {
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
    let gsttype=this.form.get("GSTTYPE").value;
    if(gsttype=="Regular" || gsttype=="Composite")
    {
      if(this.form.get("GSTNO").value==null || this.form.get("GSTNO").value=="")
      {
        this.alertService.error("Please insert the GST NO.");
        return;
      }
    }
    //console.log("gstsss",gsttype);
    if (this.PType == 'C') {
      if (this.form.get("CUSTOMERID").value == "" || this.form.get("CUSTOMERID").value == null) { this.alertService.warning("Customer-ID is required!"); return }
    }
    if (this.PType == 'V') {
      if (this.form.get('ERPPLANTCODE').value == "" || this.form.get('ERPPLANTCODE').value == null) { this.alertService.warning("ERPPLANTCODE is required!"); return }
    }
    if (this.form.value.MOBILE.length != 10) {
      this.alertService.warning("Mobile number is invalid! Please enter atleast 10 digit number. ");
      return
    }

    if (this.form.value.VATNO) {
      // console.log({ billtotel: parseFloat(this.form.value.VATNO) });
      var pno = parseFloat(this.form.value.VATNO);
      // if (pno.toString().length != 9) {
      //   this.alertService.error("PAN No is not correct");
      //   return;
      // }
    }
    try {
      let al = <TAcList>{};

      this.form.value.MAPID = "N";

      if (this.mode == "edit") {
        al.ACID = this.ACID;
      }
      let saveModel = this.form.value;
      if (this.PType == 'C') {
        saveModel.PType = "C"
      }
      else {
        saveModel.PType = "V"
      }
      saveModel.GEO = this.geo;
      saveModel.PRICELEVEL = this.geo;
      saveModel.TYPE = "A"
     if(this.mode!="edit"){
      saveModel.PARENT = "PA";
     }
      saveModel.ACNAME = this.form.controls['ACNAME'].value;
      saveModel.SHORTNAME = this.form.controls['SHORTNAME'].value;
      saveModel.ACCODE = saveModel.CUSTOMERID = this.form.controls['CUSTOMERID'].value;
      saveModel.VATNO = this.form.controls['VATNO'].value;
      saveModel.LEVELS = 10;
      // saveModel.ACCODE = this.form.controls['ACCODE'].value;
      saveModel.CRLIMIT = this.form.controls['CRLIMIT'].value;

      this.loadingService.show("Saving Data please wait...");
      let sub = this.MasterService.saveAccount(
        this.mode,
        saveModel,
        this.SOTableList
      ).subscribe(
        data => {
          this.loadingService.hide();
          if (data.status == "ok") {
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
      console.log(ex);
      this.alertService.error(ex);
    }
  }

  changePtype(value) {
    this.form.get("Ptype").patchValue(value);
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
      console.log({
        onGrpChangeEvent: event,
        eventIndex: i,
        selected: selected
      });
      let opt: SelectItem[] = [];
      var ind = i;

      if (event) {
        if (this.acGroups.length > ind + 1) {
          this.acGroups.splice(ind + 1, this.acGroups.length - 1);
        }
        // console.log({ GroupchageEvent: event, value: event.value.ACNAME });
        this.lastParentID = event.value.ACID;
        this.PartyService.getChildrenGroups(event.value.ACID)
          .flatMap(data => data)
          .subscribe(
            data => {
              // console.log({ children: data });
              if (data.TYPE == "G")
                opt.push({ label: data.ACNAME, value: data });
            },
            Error => console.log({ groupchangeError: Error }),
            () => {
              if (opt.length > 0) {
                this.acGroups.push({
                  group: event.value.ACNAME,
                  value: event.value,
                  options: opt
                });
              }

              //this.groupListSubject.next(subjectData);
              // console.log({ negroup2: { group: event.value.ACNAME, value: event.value, options: opt }, subjectData2: subjectData });
            }
          );
      }
    } catch (ex) {
      console.log({ onGroupChange: ex });
    }
  }
  getGroups() {
    //console.log("Has SUB is false");
    this.actype = "";
    this.disableActype = false;
    this.acGroups = [];
    this.getMainGroup();
    if (!this.ACID) return;
    console.log({ acid: this.ACID });
    this.PartyService.getParentGroups(this.ACID)
      .flatMap(data => data)
      .subscribe(
        data => {
          try {
            data.SELECTEDGROUPAC = data.CHILDLIST.find(
              itm => itm.ACID == data.SELECTEDGROUP
            );
            this.parentGroup = data.SELECTEDGROUPAC;
            console.log({
              selectedGroup: data.SELECTEDGROUP,
              selectedGroupAC: data.SELECTEDGROUPAC
            });
            // if (data.SELECTEDGROUPAC.HASSUBLEDGER == 1 && this.hasSubLedger == 0) {
            //     this.hasSubLedger = 1;
            //     this.changehassubEvent(true);
            //     this.disableHassubledger = true;
            //     //console.log("Disable AHS SUB")
            // }
            let opt: SelectItem[] = [];
            data.CHILDLIST.forEach(child => {
              opt.push({ label: child.ACNAME, value: child });
            });
            this.acGroups.push({
              group: data.ACNAME,
              value: data,
              options: opt
            });
          } catch (ex) {
            console.log({ getParentGroups: ex });
          }
        },
        error => {
          console.log({ getgroupError: error });
        },
        () => {
          if (this.acGroups.length > 1) {
            let selectedGroup = this.acGroups[0].options.find(
              itm => itm.value.ACID == this.acGroups[1].value.ACID
            );
            if (selectedGroup) {
              this.acGroups[0].value.SELECTEDGROUPAC = selectedGroup.value;
            }
            // console.log({ selectedGroupValue: selectedGroup.value });
            // if (selectedGroup.value.Ptype) {
            //     alert("REACHED")
            //     this.actype = selectedGroup.value.Ptype
            //     this.changePtype(selectedGroup.value.Ptype);
            //     this.disableActype == true;
            // }
            // console.log({groupTofind:this.acGroups[1],options:this.acGroups[0].options,selected:this.acGroups[0].value.SELECTEDGROUPAC,selected2:this.acGroups[1].value.SELECTEDGROUPAC})
          }
        }
      );

    return;
  }

  getMainGroup() {
    let opt: SelectItem[] = [];
    this.PartyService.getTopGroups()
      .flatMap(data => data)
      .subscribe(data => {
        opt.push({ label: data.ACNAME, value: data });
      });
    this.acGroups.push({
      group: "Main Group",
      value: { ACNAME: "MAIN GROUP", ACID: null, PARENT: null },
      options: opt
    });
  }

  clickedNotActive(value) {
    if (this.form == null) {
      return;
    }
    this.form.get("isNotActive").patchValue(value);
  }
  NotActive() { }
  partyList: any[] = [];
  solist: any[] = [];
  SOTableList: any[] = [];
  RCODE: any;
  RouteClick(value) {
    this.RCODE = value;
    // //console.log("RouteClick", value)
    this.PartyService.getSOFromRoute(value).subscribe(res => {
      // //console.log("RES", res)
      // if (res.status == "ok") {
      //   this.solist = res.result;
      // }
    });
  }

  SOChange(value) {
    let soName = this.solist.filter(x => x.CODE == value)[0];

    //console.log("Changed", soName);

    this.form.patchValue({
      SO: soName ? soName.CODE : ""
    });
  }

  RouteAdd() {
    let a: any = <any>{};
    var formValue = this.form.value;
    var route = this.RouteList.filter(x => x.RouteCode == formValue.ROUTE)[0];
    let soName = this.solist.filter(x => x.CODE == formValue.SO)[0];

    if (soName == undefined || soName == null) {
      this.alertService.info("All fields are required.");
      return;
    }

    a.SONAME = soName ? soName.NAME : "";
    a.RouteName = route ? route.RouteName : "";
    a.SOCODE = soName ? soName.CODE : "";
    a.PCL = soName ? soName.PCL : "";
    this.SOTableList.push(a);

    this.form.patchValue({
      ROUTE: "",
      SO: "",
      SONAME: "",
      RouteDays: ""
    });
  }

  deleteSOList(index: number) {
    this.SOTableList.splice(index, 1);
  }

  CrDisabled: string;
  Crvalue: string
  ChangePMODE(value) {
    this.Crvalue = value;
    if (value == "credit" || value == "cashandcredit") {
      this.CrDisabled = 'enable';
    }
    else {
      this.CrDisabled = 'disabled';
      this.form.patchValue({
        CRLIMIT: 0,
        CRPERIOD: 0
      })
    }
  }
  CreditDisabled() {
    try {
      if (this.Crvalue == "credit" || this.Crvalue == 'cashandcredit') {
        this.CrDisabled = 'enable';
        return "white";
      } else {
        this.CrDisabled = 'disabled';
        return "#EBEBE4";

      }
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  changePriceLevel() {
    alert("Changes on Pricelevel will affects the Category also!")

  }

}
