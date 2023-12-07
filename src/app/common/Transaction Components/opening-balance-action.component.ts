import { AdditionalCostService } from "../../pages/Purchases/components/AdditionalCost/addtionalCost.service";
import { TransactionService } from "./transaction.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  ElementRef
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
//import {TAcList} from '../../../../common/interfaces';
import { PartyOpeningDetail, TrnMain, VoucherTypeEnum } from "../interfaces/TrnMain";
import { FormGroup } from "@angular/forms";
import { MasterRepo } from "../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { SettingService } from "../services";
import { AuthService } from "../services/permission/authService.service";
import { MdDialog } from "@angular/material";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../services/alert/alert.service";
import { SpinnerService } from "../services/spinner/spinner.service";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../popupLists/file-uploader/file-uploader-popup.component";
import { ModalDirective } from "ng2-bootstrap";
import { TAcList } from "../interfaces";
import * as moment from 'moment';

@Component({
  selector: "opening-balance-action",
  templateUrl: "./opening-balance-action.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class OpeningBalanceActionComponent implements OnInit {
  @Input() isSales;
  transactionType: string; //for salesmode-entry options
  mode: string = "NEW";
  modeTitle: string = "";

  //TrnMainObj: TrnMain = <TrnMain>{};

  form: FormGroup;
  AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};

  @Output() onViewClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSaveClickedEmit: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;

  returnUrl: string;
  checkstatus = true;
  viewSubscription: Subscription = new Subscription();
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  showSecondaryButtons: boolean;
  gridPopupSettingsForHoldBill: GenericPopUpSettings = new GenericPopUpSettings();
  trialUrl: boolean = false;
  showUnApprove: boolean = false;
  activeUrlPage: string;
  userSetting: any;
  OpeningObj: any = <any>{};

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
  private divisionList = [];
  CostcenterList: any[] = [];
  isDisableDiv:any;
  CheckObjObj:any=<any>{};
  PhiscalYearList:any[]=[];
  costlists: any[] = [];

  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private setting: SettingService,
    public additionalCostService: AdditionalCostService,
    public authservice: AuthService,
    public dialog: MdDialog,
    private router: Router,
    private arouter: ActivatedRoute,
    private alertService: AlertService,
    private _hotkeysService: HotkeysService,
    private loadingService: SpinnerService,
  ) {
    //this.TrnMainObj = _trnMainService.TrnMainObj;
    this.masterService.ShowMore = false;
    this.AppSettings = this.setting.appSetting;
    this.userProfile = authservice.getUserProfile();
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType;
    this._trnMainService.TrnMainObj.BRANCH = this.userProfile.userBranch;
    this._trnMainService.TrnMainObj.DIVISION = this.userProfile.userDivision;
    this.showSecondaryButtons = false;
    this.userSetting = authservice.getSetting()
    this.masterService.refreshTransactionList();
    if (
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn
    ) {
      this.transactionType = "creditnote";
    }

    this.gridPopupSettings = this.masterService.getGenericGridPopUpSettings(
      this._trnMainService.TrnMainObj.VoucherPrefix
    );

    this.setHotKeyFunction();
    this.OpeningObj.actype= "%";
    if(this.userSetting.DIVISIONWISE_OPENING==1){
      var PhiscalObj = authservice.getPhiscalInfo();
      this.OpeningObj.div = PhiscalObj.Div;
    }else{
      this.OpeningObj.div = "%";
    }
    this.OpeningObj.CostCenter = "%";
    this.masterService.getAllDivisions().subscribe((res) => {
      this.divisionList.push(res)
    })
    this.masterService.getCostcenter().subscribe(res => {
      this.CostcenterList = res;
  })
  this.isDisableDiv = true;
    this.validate();
    this.masterService.getAllPhiscalYearExceptCurrent().subscribe(res=>{
      if(res.status=='ok'){
        // ////console.log("@@res",res)
        this.PhiscalYearList = res.result.result;
        this.OpeningObj.PhiscalID = this.PhiscalYearList && this.PhiscalYearList.length>0 && this.PhiscalYearList[0].PhiscalID;
       

        }
      });

    
  } catch (ex) {
  }
  




  onCancelClicked() {
    if (this.CheckMenuRights(this.activeUrlPage, "delete") == true) {
      let trntrn = this._trnMainService.TrnMainObj.TrntranList.filter(x => x.ACNAME != "" && x.ACNAME != null && x.ACNAME != undefined);
      if (trntrn.length == 0) {
        this.alertService.error("Please load Voucher to Cancel");
        return;
      }
      let data = <any>{};
      data.VoucherType = this._trnMainService.TrnMainObj.VoucherType;
      data.VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
      data.MODE = "CANCEL";
      data.VoucherPrefix = this._trnMainService.TrnMainObj.VoucherPrefix;
      if (confirm("Are you sure to cancel this voucher?")) {
        this.loadingService.show(`Cancelling Voucher ${data.VCHRNO}. Please Wait.`);
        this.masterService.cancelAccoutingVoucher(data).subscribe((res) => {
          this.loadingService.hide();
          if (res.status == "ok") {
            this.alertService.success(res.result);
            this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
          } else {
            this.alertService.error(res.result);
          }
        }, error => {
          this.loadingService.hide();
          this.alertService.error(error);
        })
      }
    }
  }




  onBackClicked() {
    this.router.navigate([this.returnUrl]);
  }


  CheckMenuRights(activePage, mode) {
    var Checkright = this.authservice.getMenuRight(activePage, mode)
    if (Checkright != null) {
      if (Checkright.right != true) {
        this.alertService.warning("You are not authorized to " + mode + " the " + activePage);
        return false;
      }
      else {
        return true;
      }
    }
  }


  @ViewChild('save') save: ElementRef;
  @ViewChild('view') view: ElementRef;
  @ViewChild('reset') reset: ElementRef;
  @ViewChild('back') back: ElementRef;
  setHotKeyFunction() {

    //for new 
    this._hotkeysService.add(
      new Hotkey(
        "f3",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          if (this.reset) {
            this.reset.nativeElement.click();
          }
          return false;
        }
      )
    );

    //for view 
    this._hotkeysService.add(
      new Hotkey(
        "f4",
        (event: KeyboardEvent): boolean => {

          event.preventDefault();
          if (this.view) {
            this.view.nativeElement.click();
          }
          return false;
        }
      )
    );

    //for Save 
    this._hotkeysService.add(
      new Hotkey(
        "f6",
        (event: KeyboardEvent): boolean => {
          if (this.save) {
            event.preventDefault();
            this.save.nativeElement.click();
          }
          return false;
        }
      )
    );

    //for Cancel 
    this._hotkeysService.add(
      new Hotkey(
        "f10",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          if (this.back) {
            this.back.nativeElement.click();
          }
          return false;
        }
      )
    );
  }

  ngOnInit() {


    this.activeUrlPage = this.arouter.snapshot.url[0].path
    ////console.log("activeUrlPage", this.activeUrlPage);

    this.returnUrl = "/pages/dashboard";
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Account opening Balance",
        sampleFileUrl: `/downloadledgerAcForOpeningBalance?optype=${this._trnMainService.TrnMainObj.VoucherPrefix}`,
        uploadEndpoints: `/importFileForTransaction/OB`,
        allowMultiple: false,
        acceptFormat: ".csv",
        note: `
      <P>You can supply Dr or Cr Balance in a csv format for quick importing</p>
      <ul>
         <li>Enter Dr or Cr balance Only </li>
         <li>Do not change the accounts name</li>
      </ul> 
      `,
        filename: `Accounts_${this.masterService.userProfile.CompanyInfo.COMPANYID}.csv`
      });
  }

  ngOnDestroy() {
    try {
      this.subscriptions.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  onCloseClicked() {
    this.router.navigate(["/pages/dashboard"]);
  }

  onViewClicked() {
    // this.onViewClickEmit.emit(null);
    // this._trnMainService.TrnMainObj.Mode="VIEW";
    this._trnMainService.buttonClickMode = "VIEW";
    this.genericGrid.show();
  }
  onEditClicked() {
    //this._trnMainService.TrnMainObj.Mode="EDIT";
    this._trnMainService.buttonClickMode = "EDIT";
    this.genericGrid.show();
  }
  print(printStr: string) {
    var ws;
    ws = new WebSocket("ws://127.0.0.1:1660");
    ws.addEventListener("message", ws_recv, false);
    ws.addEventListener("open", ws_open(printStr), false);
    function ws_open(text) {
      alert("Are you sure to print?");
      ws.onopen = () => ws.send(text);
      // ws.send(text);
    }

    function ws_recv() {
      alert("2 : success");
    }
  }

  onSaveClicked() {
    var data = JSON.stringify(this._trnMainService.TrnMainObj, undefined, 2);
    for(let i of this._trnMainService.TrnMainObj.TrntranList){
      if(i.acitem){
      if(i.acitem.ACNAME==null||i.acitem.ACNAME==''||i.acitem.ACNAME==undefined){
        alert("Ledger Account  is Required");
      return;
      }
    }
    if (
      i.acitem && 
      ((i.DRAMNT == 0 || i.DRAMNT == null) &&
        (i.CRAMNT == 0 || i.CRAMNT == null))
    ) {
      alert("Debit Amount or Credit Amount is Required ");
      i.PartyDetails=[];
      return;
    }
  }
    this.onSubmit();
  }

  transactionValidator(): boolean {
    if (!this._trnMainService.setDefaultValueInTransaction()) {
      return false;
    }
    return true;
  }

  onSubmit() {
    try {

      this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.CHALANNO
      if (this.userSetting.RefNoReqInvEntry == 1 && this.userSetting.PrefixForRefNoInvEntry == 0) {
        if (this._trnMainService.TrnMainObj.CHALANNO == '' ||
          this._trnMainService.TrnMainObj.CHALANNO == null ||
          this._trnMainService.TrnMainObj.CHALANNO == undefined
        ) {
          this.alertService.info("Refno cannot be empty");
          return;
        }

      }
      if (this.userSetting.PrefixForRefNoInvEntry == 1) {

        if (this._trnMainService.TrnMainObj.CHALANNO == '' ||
          this._trnMainService.TrnMainObj.CHALANNOPREFIX == '' ||
          this._trnMainService.TrnMainObj.CHALANNO == undefined ||
          this._trnMainService.TrnMainObj.CHALANNOPREFIX == undefined ||
          this._trnMainService.TrnMainObj.CHALANNOPREFIX === null ||
          this._trnMainService.TrnMainObj.CHALANNO === null
        ) {

          this.alertService.info("Refno/Prefix cannot be null");
          return;
        }

      }



      if (
        this._trnMainService.TrnMainObj.TrntranList[this._trnMainService.TrnMainObj.TrntranList.length - 1].AccountItem.ACID == null
      ) {
        this._trnMainService.TrnMainObj.TrntranList.splice(
          this._trnMainService.TrnMainObj.TrntranList.length - 1,
          1
        );
      }

      try {

        for (var t in this._trnMainService.TrnMainObj.TrntranList) {

          if (this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList !== undefined) {
            if (this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length > 0) {
              if (
                this._trnMainService.TrnMainObj.TrntranList[t].AccountItem.HASSUBLEDGER == 1 &&
                (this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList[
                  this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1
                ].SubledgerItem.ACID == null ||
                  this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList[
                    this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1
                  ].CRAMNT == null)
              ) {

                this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.splice(
                  this._trnMainService.TrnMainObj.TrntranList[t].SubledgerTranList.length - 1,
                  1
                );
              }
            }
          }
        }
      } catch (error) {

        alert(error)
      }


      ////console.log("does not  reach here");
      if (this._trnMainService.TrnMainObj.VoucherType == 22 || this._trnMainService.TrnMainObj.VoucherType == 23) {
        this._trnMainService.TrnMainObj.ProdList = [];
      }

      if (this._trnMainService.TrnMainObj.TrntranList.length == 0) {
        this.alertService.info("Enter at least one item to save.");
        this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
        return;
      }

      if(this._trnMainService.userSetting.enablepartyopeningdetails==1){
        for(let i of this._trnMainService.TrnMainObj.TrntranList){
          let variable=  i.PartyDetails && i.PartyDetails.length && i.PartyDetails.length>0 && i.PartyDetails.filter(a=>a.REFVNO==''||a.REFVNO==null)
        if(variable && variable.length && variable.length>0){
          this.alertService.info("Party Opening Details are required");
         this._trnMainService.disableSaveButton=true;
         return;
        }
      }
         }
      // if(this._trnMainService.TrnMainObj.CHALANNOPREFIX != "" || this._trnMainService.TrnMainObj.CHALANNOPREFIX !=null){
      //   this._trnMainService.TrnMainObj.CHALANNO = `${this._trnMainService.TrnMainObj.CHALANNOPREFIX}${this._trnMainService.TrnMainObj.CHALANNO}`
      // }

      this.loadingService.show("Saving data. Please wait...")
      let sub = this.masterService.getSingleObject({ TrnMainObj: this._trnMainService.TrnMainObj, TranTrnList: this._trnMainService.TrnMainObj.TrntranList }, '/saveopeningstock')
        //let sub = this.masterService.getSingleObject({ TrnMainObj: this._trnMainService.TrnMainObj, TranTrnList: this._trnMainService.TrnMainObj.TrntranList }, '/saveTransaction')

        .subscribe(data => {
          this.loadingService.hide();
          if (data.status == 'ok') {
            this.alertService.success("Successfully saved.")
            this._trnMainService.isAutoDetailShow=false;
            this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
            this._trnMainService.crTotal = 0;
            this._trnMainService.drTotal = 0;
            this._trnMainService.diffAmountItemForAccount = 0;
          }
          else {
            this.alertService.error(data.result._body)
          }
        },
          error => { this.loadingService.hide(); alert(error) },
          () => {
            this.loadingService.hide();
          }

        )


    } catch (e) {
    }
  }

  nullToZeroConverter(value) {
    if (value == undefined || value == null || value == "") {
      return 0;
    }
    return parseFloat(value);
  }

  onItemDoubleClick(event) {
    this.loadVoucher(event);
  }

  loadVoucher(selectedItem) {
    this._trnMainService.loadData(
      selectedItem.VCHRNO,
      selectedItem.DIVISION,
      selectedItem.PhiscalID
    );
    this._trnMainService.showPerformaApproveReject = false;
  }





  onNewClick() {
    this._trnMainService.isAutoDetailShow=false;
    this._trnMainService.initialFormLoad(
      this._trnMainService.TrnMainObj.VoucherType
    );
    this._trnMainService.showPerformaApproveReject = false;

    this._trnMainService.crTotal = 0;
    this._trnMainService.drTotal = 0;
    this._trnMainService.diffAmountItemForAccount = 0;
    this.masterService.ShowMore = false;
  }

  okClicked(value) {
    this._trnMainService.TrnMainObj.TenderList = value;
    let TB = this._trnMainService.TrnMainObj.TenderList[0];
    if (TB == null) {
      this.alertService.error("Tender Amount not detected");
      return;
    }
    this._trnMainService.TrnMainObj.TRNAC = TB.ACCOUNT;
    if (!this.transactionValidator()) return;
    this.onSubmit();
  }

  okAddNewClicked(value) {
    let CustObj = value;
    CustObj.PRICELEVEL = value.GEO;
    CustObj.TYPE = "A";
    CustObj.PARENT = "PA";
    CustObj.PType = "C";
    CustObj.COMPANYID = this._trnMainService.userProfile.CompanyInfo.COMPANYID;
  }

  isFormValid: boolean;
  formValidCheck = (): boolean => {
    if (this._trnMainService.Warehouse == undefined || this._trnMainService.Warehouse == '') {
      return false;
    }
    if (this._trnMainService.TrnMainObj.ProdList == undefined) {
      return false;
    }
    else {
      if (this._trnMainService.TrnMainObj.ProdList.length < 1) {
        return false;
      }
    }
    return true;
  }

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == "ControlLeft" || $event.code == "ControlRight") {
      $event.preventDefault();
      this.showSecondaryButtons = true;
    }
  }
  @HostListener("document : keyup", ["$event"])
  handleKeyUpboardEvent($event: KeyboardEvent) {
    if ($event.code == "ControlLeft" || $event.code == "ControlRight") {
      $event.preventDefault();
      this.showSecondaryButtons = false;
    }
  }
  isvalidate :boolean = false;
  changeDiv(value){
    if(this.CheckObjObj.Div == true){
      this.isDisableDiv = false;
   
    }
    else{
      this.isDisableDiv = true;
      this.OpeningObj.div = "%";
     
    }
  }
  changeCC(value){
    if(this.CheckObjObj.CostCenter == true){
      this.OpeningObj.CostCenter = "x";
   
    }
    else{
      this.OpeningObj.CostCenter = "%";
      
    }
  }
  validate(){
   ////console.log("PID",this.OpeningObj.PhiscalID)
   if(this.OpeningObj.PhiscalID!=''|| this.OpeningObj.PhiscalID!=null){
     
        this.isvalidate=true;
      
    }
    else{
      this.isvalidate=false;
    }
   
  }
  // downloadAccountsForOpeningBalance()
  // {
  //     this.masterService.downloadAccountsForOpeningBalance().subscribe(
  //         data => {
  //           this.loadingService.hide();
  //           this.downloadFile(data);
  //         },
  //         error => {
  //           this.loadingService.hide();
  //         }
  //       );
  // }
  // downloadFile(response: any) {
  //     const element = document.createElement("a");
  //     element.href = URL.createObjectURL(response.content);
  //     element.download = response.filename;
  //     document.body.appendChild(element);
  //     element.click();

  //   }
  importAcOpeningBalance() {
    this.fileUploadPopup.show();
  }



  fileUploadSuccess(uploadedResult) {

    if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
      return;
    }

    if (uploadedResult.status == "ok") {
      this.alertService.success("Opening Balance Imported Successfully");
      this.onNewClick();
    }
    else {
      this.alertService.error(uploadedResult.result._body);
    }
  }
  @ViewChild('ShowOpeningBalance') ShowOpeningBalance: ModalDirective;
  ClickOpeningBalance() {
    this.ShowOpeningBalance.show();


  }
  ShoWdateClose() {
    this.ShowOpeningBalance.hide()
  }

  LoadOpeningValue() {
    let fname = '';
    if(this.voucherType == 22) fname = 'AccountOpening';
    if(this.voucherType == 23) fname = 'PartyOpening';
    if(this.OpeningObj.PhiscalID==='' || this.OpeningObj.PhiscalID===null || this.OpeningObj.PhiscalID===undefined || this.OpeningObj.PhiscalID==false){
      alert("Please select Fiscal Id.");
      return;
    }

    this.masterService.getAllNEWCostCenter().subscribe(res => {
      if (res) {
        this.costlists = res.result;
      }
    }, error => {
      this.costlists = [];
    });
    this.masterService.LoadOpeningValue(this.OpeningObj,fname).subscribe(x => {
      if(x.status!='ok'){
        this.alertService.error(x.result);
        return;
      }
      if (x.result.length == 0) {
        this.ShowOpeningBalance.hide();
        this.alertService.info(`No data found!`);
        return;
      }
      this._trnMainService.TrnMainObj.TrntranList.splice(0);
      if (x.result) {
        for (let i of x.result) {
          var val: any = <any>{ AccountItem: <TAcList>{}, acitem: <TAcList>{} }
          // var AccountItem: TAcList = <TAcList>{};

          // val.AccountItem.ACNAME = i.customerName;
          val.AccountItem.ACID = i.ACID;
          val.AccountItem.ACNAME = i.ACNAME;
          val.acitem.ACID = i.ACID;
          val.acitem.ACNAME = i.ACNAME;
          val.CRAMNT = i.CRAMNT;
          // val.CostCenter = i.CostCenter;
          let a;
          a =  this.costlists.length>0 && this.costlists.filter(x => x.CCID == i.COSTCENTER);
          // //console.log("a",a)
          if(a.length && a.length>0){
            val.CostCenter = a.length>0 && a[0].COSTCENTERNAME;
          }
          val.ChequeNo = i.ChequeNo;
          val.guid = i.GUID;
          val.DRAMNT = i.DRAMNT;
          val.AccountItem.SL_ACNAME = i.SL_ACNAME;
          val.AccountItem.SL_ACID = i.SL_ACID;
          val.acitem.SL_ACNAME = i.SL_ACNAME;
          val.acitem.SL_ACID = i.SL_ACID;
          val.SL_ACNAME = i.SL_ACNAME;
          val.SL_ACID = i.SL_ACID;
          if(i.PartyDetails && i.PartyDetails.length && i.PartyDetails.length>0){
            val.ROWMODE = "new";
            this._trnMainService.isAutoDetailShow=true;
            var _partyop_details: PartyOpeningDetail[] = [];
            for (var x of i.PartyDetails) {
              var acs: PartyOpeningDetail = <PartyOpeningDetail>{
                VCHRNO: this._trnMainService.TrnMainObj.VCHRNO,
                DIVISION: this._trnMainService.TrnMainObj.DIVISION,
                REFVNO: x['VOUCHER NO'],
                ACID: i.ACID,
                REFDATE: x.DATE == null ? null : x.DATE.split("/").reverse().join("-"), // because dateformat from SP in dd/mm/yyyy
                AMOUNT: x['BILL AMOUNT'] == null ? 0 : parseFloat(x['BILL AMOUNT'].replace(/,/g, "")),
                CLRAMOUNT: x['PAID AMOUNT'] == null ? 0 : parseFloat(x['PAID AMOUNT'].replace(/,/g, "")),
                DUEAMT: x['DUE AMOUNT'] == null ? 0 : parseFloat(x['DUE AMOUNT'].replace(/,/g, "")),
                DUEDATE: x['DUE DATE'] == null ? null : x['DUE DATE'].split("/").reverse().join("-"), // because dateformat from SP in dd/mm/yyyy
                PHISCALID: this._trnMainService.TrnMainObj.PhiscalID,
                REF_BSDATE: x.MITI,
                DUE_BSDATE: x['DUE DATE'] == null ? null : this.changeDueDate(x['DUE DATE'].split("/").reverse().join("-"), 'AD')
              };
              if (x['VOUCHER NO']) {
                _partyop_details.push(acs);
              }
              val.PartyDetails = _partyop_details;
            }
          }
      
          // if (this.voucherType == VoucherTypeEnum.PartyOpeningBalance ) {
          //   var today_Date = new Date().toJSON().split('T')[0];
          //   if (i.ACID != null) {
          //       this.masterService.OpeningDetails(
          //       today_Date,
          //       i.ACID,
          //       this.OpeningObj.div,
          //       this.OpeningObj.PhiscalID
          //     ).subscribe( (data: any) => {
          //       if (data.status == "ok") {
          //         console.log("@@i.ACID", i.ACID)
          //         console.log("@@data.result", data.result)
          //         var _partyop_details: PartyOpeningDetail[] = [];
          //         if (data.result) {
          //           for (var x of data.result) {
          //             var acs: PartyOpeningDetail = <PartyOpeningDetail>{
          //               VCHRNO: this._trnMainService.TrnMainObj.VCHRNO,
          //               DIVISION: this._trnMainService.TrnMainObj.DIVISION,
          //               REFVNO: x['VOUCHER NO'],
          //               ACID: i.ACID,
          //               REFDATE: x.DATE == null ? null : moment(x.DATE).format("YYYY-MM-DD"),
          //               AMOUNT: x['BILL AMOUNT'] == null ? 0 : parseFloat(x['BILL AMOUNT'].replace(/,/g, "")),
          //               CLRAMOUNT: x['PAID AMOUNT'] == null ? 0 : parseFloat(x['PAID AMOUNT'].replace(/,/g, "")),
          //               DUEAMT: x['DUE AMOUNT'] == null ? 0 : parseFloat(x['DUE AMOUNT'].replace(/,/g, "")),
          //               DUEDATE: x['DUE DATE'] == null ? null : moment(x['DUE DATE']).format("YYYY-MM-DD"),
          //               PHISCALID: this._trnMainService.TrnMainObj.PhiscalID,
          //               REF_BSDATE: x.MITI,
          //               DUE_BSDATE: x['DUE DATE'] == null ? null : this.changeDueDate(moment(x['DUE DATE']).format("YYYY-MM-DD"), 'AD')
          //             };
          //             if (x['VOUCHER NO'] && i.ACNAME==x.PNAME) {
          //               _partyop_details.push(acs);
          //             }
          //           }
          //         }
          //         val.PartyDetails = _partyop_details;
          //       }
          //     }
          //     );
          //   }
          // }
          this._trnMainService.TrnMainObj.TrntranList.push(val);
          // console.log("@@1-TrntranList",this._trnMainService.TrnMainObj.TrntranList)
        }
      }
      this.ShowOpeningBalance.hide()
      this._trnMainService.TrnMainObj.SelectedPhiscalID = this.OpeningObj.PhiscalID
      this._trnMainService.calculateCrDrTotal();
    })
  }

  changeDueDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      return (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;
    }
  }
}
