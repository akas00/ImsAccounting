import {
    Component, Output, EventEmitter, ViewChild, ElementRef
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MasterRepo } from "../../../../common/repositories";
import { VoucherMasterActionComponent } from "../../../../common/Transaction Components/voucher-master-action.component";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { TenderObj, TBillTender, TrnMain } from "../../../../common/interfaces";
import { HotkeysService, Hotkey } from "angular2-hotkeys";



@Component({
    selector: "generic-popup-Tender",
    templateUrl: "./generic-popup-Tender.html",
    styleUrls: ["../../../../pages/Style.css", "../../../../common/popupLists/pStyle.css"],
})
export class GenericPopUpTenderComponent {
    @Output('okClicked') okClicked = new EventEmitter();
    // @ViewChild("CASHAMT_Native") CASHAMT_Native : ElementRef;
    // @ViewChild("CARDAMT_Native") CARDAMT_Native : ElementRef;
    // @ViewChild("CHEQUEAMT_Native") CHEQUEAMT_Native : ElementRef;
    // @ViewChild("COUPONAMT_Native") COUPONAMT_Native : ElementRef;
    // @ViewChild("WALLETAMT_Native") WALLETAMT_Native : ElementRef;
    BillTenderList: TBillTender[] = [];
    TendersaveList: TenderObj[] = [];
    CardName: any[] = [];
    walletList: any[] = [];
    couponList: any[] = [];
    cardList: any[] = [];
    isActive: boolean = false;
    PaymentMode: string;
    calculateTenderAmt: number;
    TrnmainObj: TrnMain = <TrnMain>{};
    tenderObj: TenderObj = <TenderObj>{};
    form: FormGroup;

    constructor(private fb: FormBuilder, public masterService: MasterRepo, public _trnMainService: TransactionService,
        private _hotkeysService: HotkeysService) {

        this.masterService.TenderTypes().subscribe(res => {
            if (res.status == 'ok') {
                // alert("reached")

                this.walletList = res.result.Wallet;
                this.couponList = res.result.Coupon;
                this.cardList = res.result.Card;
                // ////console.log("CheckNameee", res, this.walletList, this.couponList, this.cardList)

            }
        });
        this.form = this.fb.group({
            CASH: [0],
            CREDIT: [0],
            CHEQUE: [0],
            WALLET: [0],
            CARD: [0],
            COUPON: [0],
            CASHAMT: [0],
            CARDAMT: [0],
            CARDNO: [''],
            CARDNAME: [''],
            APPROVALCODE: [''],
            CARDHOLDERNAME: [''],
            CREDITAMT: [0],
            CHEQUEAMT: [0],
            CHEQUENO: [''],
            DATE: [''],
            BANK: [''],
            TOTAL: [0],
            OUTSTANDING: [''],
            ADVANCE: [0],
            TENDERAMT: [''],
            BALANCE: [0],
            LOYALTYAMT: [0],
            COUPONNAME: [''],
            COUPONAMT: [0],
            WALLETAMT: [0],
            WALLETTYPE: [''],
            WALLETCARDNO: [''],


        });
        this.mixmode = false;
        this.masterService.masterGetmethod("/gettransactionmodes").subscribe(
            res => {
                if (res.status == "ok") {
                    this._trnMainService.paymentmodelist = res.result;
                    this.Cash();
                } else {
                    ////console.log("error on getting paymentmode " + res.result);
                }
            },
            error => {
                ////console.log("error on getting paymentmode ", error);
            }
        );
    }
    ngOnInit() {
        this.setHotKeyFunction();
    }

    show() {
        this.isActive = true;
        this.TrnmainObj = this._trnMainService.TrnMainObj;
        this.form.patchValue({
            TOTAL: this.TrnmainObj.NETAMNT,
            BALANCE: this.TrnmainObj.NETAMNT,
            // LOYALTYAMT: this.TrnmainObj.NETAMNT
        })
        // ////console.log("NETAMT",this._trnMainService.TrnMainObj.NETAMNT,this.NETAMT)
    }

    hide() {

        this.isActive = false;
        this.ValueInitilize();
    }
    validateSelectedPaymentModes(value) {
        // ////console.log("value", value, this.TenderSaveObj)
        if (value == "Cash") {
            return true;
        }
        else if (value == "Card") {
            if (this.TenderSaveObj.CARDNO == "" || this.TenderSaveObj.CARDAMT == 0 || this.TenderSaveObj.CARDHOLDERNAME == "" || this.TenderSaveObj.CARDNAME == "") {
                alert("Please fill required card nformation.")
                return false;
            }
            else
                return true;
        }
        else if (value == "Coupon") {
            if (this.TenderSaveObj.COUPONNAME == "") {
                alert("Please fill required coupon Information.")
                return false;
            }
            else
                return true;
        }
        else if (value == "Wallet") {
            if (this.TenderSaveObj.WALLETCARDNO == "" || this.TenderSaveObj.WALLETTYPE == "") {
                alert("Please fill required wallet Information.")
                return false;
            }
            else
                return true;
        }
        else if (value == "Cheque") {
            if (this.TenderSaveObj.CHEQUENO == "" && this.TenderSaveObj.BANK == "") {
                alert("Please fill required cheque Information.")
                return false;
            }
            else
                return true;
        }
    }
    TenderSaveObj: TenderObj = <TenderObj>{}
    // var TenderSaveObj = Object.assign(<TenderObj>{}, this.form.value);
    OK() {
        if (this.calculateTenderAmt > this.TrnmainObj.NETAMNT) {
            alert("Tender amount is Greater than NetAmount!")
            return;
        }
        else if (this.calculateTenderAmt < this.TrnmainObj.NETAMNT) {
            alert("Tender amount is Less than NetAmount!")
            return;
        }

        else {
            this.BillTenderList = [];

            this.TenderSaveObj = this.form.value;
            var amount = 0;
            if (this.TenderSaveObj.CASHAMT > 0) {

                this.tenderObj.TRNMODE = "Cash";
                var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                if (Validate == false) return;
                if (this.TenderSaveObj.CASHAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                    this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                }
                else {
                    this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;

                }

                amount = this.TenderSaveObj.CASHAMT;
                this.tenderObj.ACID = this.PaymentModeAcidObj.CashID;

                this.AddTender(this.tenderObj, amount);
            }
            if (this.TenderSaveObj.CARDAMT > 0) {
                this.tenderObj.TRNMODE = "Card";
                var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                if (Validate == false) return;
                if (this.TenderSaveObj.CARDAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                    this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                }
                else {
                    this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;
                }

                this.tenderObj.REMARKS = this.TenderSaveObj.CARDNAME;
                amount = this.TenderSaveObj.CARDAMT;
                this.tenderObj.ACID = this.PaymentModeAcidObj.CardID;
                this.AddTender(this.tenderObj, amount);

            }
            // -------------------**  Credit might needed on DB and SD ** -----------------
            // if (TenderSaveObj.CREDITAMT > 0) {
            //     this.tenderObj.TRNMODE = "Credit"
            //     amount = TenderSaveObj.CREDITAMT
            //     this.AddTender(this.tenderObj, amount);
            // }
            if (this.TenderSaveObj.CHEQUEAMT > 0) {
                this.tenderObj.TRNMODE = "Cheque";
                var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                if (Validate == false) return;
                if (this.TenderSaveObj.CHEQUEAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                    this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                }
                else {
                    this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;

                }
                this._trnMainService.TrnMainObj.CHEQUENO = this.TenderSaveObj.CHEQUENO;
                this._trnMainService.TrnMainObj.CHEQUEDATE = this.TenderSaveObj.DATE;
                amount = this.TenderSaveObj.CHEQUEAMT;
                this.tenderObj.REMARKS = this.TenderSaveObj.BANK;
                // this.tenderObj.ACID= this.PaymentModeAcidObj.ChequeID;
                this.AddTender(this.tenderObj, amount);
            }
            if (this.TenderSaveObj.COUPONAMT > 0) {
                this.tenderObj.TRNMODE = "Coupon";
                var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                if (Validate == false) return;
                if (this.TenderSaveObj.COUPONAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                    this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                }
                else {
                    this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;

                }
                amount = this.TenderSaveObj.COUPONAMT;
                this.tenderObj.REMARKS = this.TenderSaveObj.COUPONNAME;
                this.tenderObj.ACID = this.PaymentModeAcidObj.CouponID;
                this.AddTender(this.tenderObj, amount);
            }
            if (this.TenderSaveObj.WALLETAMT > 0) {
                this.tenderObj.TRNMODE = "Wallet";
                var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                if (Validate == false) return;
                if (this.TenderSaveObj.WALLETAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                    this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                }
                else {
                    this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;

                }
                this.tenderObj.ACID = this.PaymentModeAcidObj.WalletID;
                amount = this.TenderSaveObj.WALLETAMT;
                this.tenderObj.REMARKS = this.TenderSaveObj.WALLETTYPE;


                this.AddTender(this.tenderObj, amount);
            }
            this.okClicked.emit(this.BillTenderList);
            this.ValueInitilize()

        }

    }
    getTRNACFromTender() {

    }

    AddTender(TenderObj, Amount) {
        let BillObj: TBillTender = <TBillTender>{}
        ////console.log("tendercheck",TenderObj);
        BillObj.TRNMODE = TenderObj.TRNMODE;
        BillObj.VCHRNO = this.TrnmainObj.VCHRNO;
        BillObj.DIVISION = this.TrnmainObj.DIVISION;
        BillObj.REMARKS = TenderObj.REMARKS, TenderObj.CARDNO;
        BillObj.AMOUNT = Amount;
        BillObj.ACCOUNT = TenderObj.ACID;
        BillObj.CARDNO = TenderObj.CARDNO;
        BillObj.APPROVALCODE = TenderObj.ApprovalCode;
        BillObj.CARDHOLDERNAME = TenderObj.CARDHOLDERNAME;
        this.BillTenderList.push(BillObj);
        // //console.log('CheckTender', this.BillTenderList)
    }

    changeCardAmt(value) {

        this.form.patchValue({
            CARD: this._trnMainService.nullToZeroConverter(value),
        })
        // this.calculateTenderAmt = this._trnMainService.nullToZeroConverter(this.calculateTenderAmt)+ this._trnMainService.nullToZeroConverter(this.form.value.CARD);
        this.addAllAmount();
        this.validateTenderAmt();
        // ////console.log("cardvalue", value, this.calculateTenderAmt);

    }
    changeChequeAmt(value) {
        this.form.patchValue({
            CHEQUE: this._trnMainService.nullToZeroConverter(value),
        })
        this.addAllAmount();
        //this.calculateTenderAmt =this._trnMainService.nullToZeroConverter(this.calculateTenderAmt)+ this._trnMainService.nullToZeroConverter(this.form.value.CHEQUE);
        this.validateTenderAmt();
    }

    changeCashAmt(value) {
        this.form.patchValue({
            CASH: this._trnMainService.nullToZeroConverter(value),
        })
        this.addAllAmount();
        // this.calculateTenderAmt =this._trnMainService.nullToZeroConverter(this.calculateTenderAmt)+ this._trnMainService.nullToZeroConverter(this.form.value.CASH);
        this.validateTenderAmt();
    }

    changeCreditAmt(value) {
        this.form.patchValue({
            CREDIT: this._trnMainService.nullToZeroConverter(value),

        })
        this.addAllAmount();
        // this.calculateTenderAmt =this._trnMainService.nullToZeroConverter(this.calculateTenderAmt)+ this._trnMainService.nullToZeroConverter(this.form.value.CREDIT);
        this.validateTenderAmt();
    }

    changeCouponAmt(value) {
        this.form.patchValue({
            COUPON: this._trnMainService.nullToZeroConverter(value),

        })
        this.addAllAmount();
        // this.calculateTenderAmt =this._trnMainService.nullToZeroConverter(this.calculateTenderAmt)+ this._trnMainService.nullToZeroConverter(this.form.value.COUPON);
        this.validateTenderAmt();
    }

    changeWalletAmt(value) {
        this.form.patchValue({
            WALLET: this._trnMainService.nullToZeroConverter(value),

        })
        this.addAllAmount();
        // this.calculateTenderAmt =this._trnMainService.nullToZeroConverter(this.calculateTenderAmt)+ this._trnMainService.nullToZeroConverter(this.form.value.WALLET);
        this.validateTenderAmt();
    }

    validateTenderAmt() {
        // if (this.calculateTenderAmt > this.TrnmainObj.NETAMNT) {
        //     alert("Tender amount is Greater than NetAmount!")

        // }
        this.form.patchValue({
            TENDERAMT: this.calculateTenderAmt,
        })
        this.BalanceAmt();
    }
    BalanceAmt() {
        this.form.patchValue({
            BALANCE: this.form.value.TOTAL - this.form.value.TENDERAMT
        })
    }
    // this.CASHAMT_Native.nativeElement.focus() 
    Cash() { this.PaymentMode = "cash"; this.onpaymentmodechange('Cash'); }
    Card() { this.PaymentMode = "card"; this.onpaymentmodechange('Card') }
    Cheque() { this.PaymentMode = "cheque"; this.onpaymentmodechange('Cheque'); }
    Coupon() { this.PaymentMode = "coupon"; this.onpaymentmodechange('Coupon'); }
    Wallet() { this.PaymentMode = "wallet"; this.onpaymentmodechange('Wallet'); }
    EnterAmt() {
        this.CheckMixModeEnter()
        switch (this.PaymentMode) {

            case "cash":
                if (this.mixmode == true) {
                    this.form.patchValue({
                        CASHAMT: this.TrnmainObj.NETAMNT - this.form.value.TENDERAMT
                    })
                }
                else {
                    this.form.patchValue({
                        CASHAMT: this.TrnmainObj.NETAMNT
                    })
                }

                return;
            case "card":
                if (this.mixmode == true) {
                    this.form.patchValue({
                        CARDAMT: this.TrnmainObj.NETAMNT - this.form.value.TENDERAMT
                    })
                }
                else {
                    this.form.patchValue({
                        CARDAMT: this.TrnmainObj.NETAMNT

                    })
                }

                return;
            case "cheque":
                if (this.mixmode == true) {
                    this.form.patchValue({
                        CHEQUEAMT: this.TrnmainObj.NETAMNT - this.form.value.TENDERAMT
                    })
                }
                else {
                    this.form.patchValue({
                        CHEQUEAMT: this.TrnmainObj.NETAMNT
                    })
                }


                return;
            case "coupon":
                if (this.mixmode == true) {
                    this.form.patchValue({
                        COUPONAMT: this.TrnmainObj.NETAMNT - this.form.value.TENDERAMT
                    })
                }
                else {
                    this.form.patchValue({
                        COUPONAMT: this.TrnmainObj.NETAMNT
                    })
                }

                return;
            case "wallet":
                if (this.mixmode == true) {
                    this.form.patchValue({
                        WALLETAMT: this.TrnmainObj.NETAMNT - this.form.value.TENDERAMT
                    })
                }
                else {
                    this.form.patchValue({
                        WALLETAMT: this.TrnmainObj.NETAMNT
                    })
                }

                return;
        }

        this.BalanceAmt();
    }
    mixmode = false;
    CheckMixModeEnter() {
        if (this.form.value.TENDERAMT == this.form.value.NetAmount)
            return;
        this.form.value.NetAmount != this.form.value.TENDERAMT ? this.mixmode = true : this.mixmode = false;

    }
    ValueInitilize() {
        this.form.patchValue({
            CASH: 0,
            CREDIT: 0,
            CHEQUE: 0,
            WALLET: 0,
            CARD: 0,
            COUPON: 0,
            CASHAMT: 0,
            CARDAMT: 0,
            CARDNO: '',
            CARDNAME: '',
            APPROVALCODE: '',
            CARDHOLDERNAME: '',
            CREDITAMT: 0,
            CHEQUEAMT: 0,
            CHEQUENO: '',
            DATE: '',
            BANK: '',
            TOTAL: 0,
            OUTSTANDING: '',
            ADVANCE: '',
            TENDERAMT: 0,
            BALANCE: 0,
            LOYALTYAMT: 0,
            COUPONNAME: 0,
            COUPONAMT: 0,
            WALLETAMT: 0,
            WALLETTYPE: '',
            WALLETCARDNO: ''
        })
    }


    PaymentModeAcidObj: any = <any>{};
    pushPaymentACID(value, selectedMode) {
        // ////console.log("AAA", selectedMode)
        if (selectedMode == null) {
            return;
        }
        if (value == 'Cash') {
            this.PaymentModeAcidObj.CashID = selectedMode.ACID
        }
        if (value == 'Card') {
            this.PaymentModeAcidObj.CardID = selectedMode.ACID
        }
        if (value == 'Cheque') {
            this.PaymentModeAcidObj.ChequeID = selectedMode.ACID
        }
        if (value == 'Coupon') {
            this.PaymentModeAcidObj.CouponID = selectedMode.ACID
        }
        if (value == 'Wallet') {
            this.PaymentModeAcidObj.WalletID = selectedMode.ACID
        }
    }
    onpaymentmodechange(value) {
        // ////console.log("paymentcheck", this._trnMainService.userProfile.CompanyInfo.ORG_TYPE, this._trnMainService.paymentmodelist);
        this._trnMainService.paymentAccountList = [];
        if (
            this._trnMainService.paymentmodelist == null ||
            this._trnMainService.paymentmodelist.length == 0
        ) {
            alert("Payment Modes not found");
            return;
        }

        var selectedmode = this._trnMainService.paymentmodelist.filter(
            x =>
                (x.MODE == null ? "" : x.MODE).toUpperCase() ==
                // this._trnMainService.TrnMainObj.TRNMODE.toUpperCase()
                value.toUpperCase()
        )[0];
        // ////console.log("CheckaSelectedMode", selectedmode)
        if (selectedmode == null) {
            ////console.log("Selected Mode not found...");
            return;
        }
        this.pushPaymentACID(value, selectedmode);
        let modetype = selectedmode.MODETYPE;

        if (selectedmode.ACID != null && selectedmode.ACID != "") {
            this._trnMainService.TrnMainObj.TRNAC = selectedmode.ACID;
        } else {
            this._trnMainService.TrnMainObj.TRNAC = null;
        }

        if (modetype != null && modetype.toUpperCase() == "LIST") {
            this.masterService
                .masterGetmethod(
                    "/getpaymentmodelist/" + value
                )
                .subscribe(
                    res => {
                        if (res.status == "ok") {
                            this._trnMainService.paymentAccountList = JSON.parse(res.result);
                            //////console.log("accountlist",this.AccountList);
                        } else {
                            ////console.log("error on getting paymentmode " + res.result);
                        }
                    },
                    error => {
                        ////console.log("error on getting paymentmode ", error);
                    }
                );
        }
    }
    addAllAmount() {
        this.calculateTenderAmt =
            this._trnMainService.nullToZeroConverter(this.form.value.COUPON) + this._trnMainService.nullToZeroConverter(this.form.value.WALLET) +
            this._trnMainService.nullToZeroConverter(this.form.value.CASH) + this._trnMainService.nullToZeroConverter(this.form.value.CHEQUE) + this._trnMainService.nullToZeroConverter(this.form.value.CARD);
    }

    setHotKeyFunction() {
        this._hotkeysService.add(
            new Hotkey(
                "a",
                (event: KeyboardEvent): boolean => {
                    event.preventDefault();
                    this.Cash();
                    return false;
                }
            )
        );

        this._hotkeysService.add(
            new Hotkey(
                "s",
                (event: KeyboardEvent): boolean => {
                    event.preventDefault();
                    this.Card()
                    return false;
                }
            )
        );
       
        this._hotkeysService.add(
            new Hotkey(
                "f",
                (event: KeyboardEvent): boolean => {
                    event.preventDefault();
                    this.Coupon()
                    return false;
                }
            )
        );
        this._hotkeysService.add(
            new Hotkey(
                "g",
                (event: KeyboardEvent): boolean => {
                    event.preventDefault();
                    this.Wallet()
                    return false;
                }
            )
        );
        this._hotkeysService.add(
            new Hotkey(
                "o",
                (event: KeyboardEvent): boolean => {
                    event.preventDefault();
                    this.OK()
                    return false;
                }
            )
        );
        this._hotkeysService.add(
            new Hotkey(
                "c",
                (event: KeyboardEvent): boolean => {
                    event.preventDefault();
                    this.hide()
                    return false;
                }
            )
        );
    }

}


