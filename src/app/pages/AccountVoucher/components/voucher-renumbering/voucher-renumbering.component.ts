import { AuthService } from './../../../../common/services/permission/authService.service';
import { PAGES_MENU } from './../../../pages.menu';
import { Component, ViewChild, ElementRef, PLATFORM_ID, Inject } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
@Component({
    selector: 'voucher-renumbering',
    templateUrl: './voucher-renumbering.component.html',
    styleUrls: ["../../../Style.css", './voucher-renumbering.component.css']

})

export class VoucherRenumberingComponent {
    form: FormGroup;
    renumberingObj: Renumbering = <Renumbering>{};
    voucherLists: any[] = [];
    // accoutingVouchersList =
    // [{name:"Journal Voucher"},{name:"Contra Voucher"},{name:"Payment Voucher"},{name:"Receipt Voucher"},{name:"Debit Note -AC Base"},{name:"Credit Note - AC Base"},{name:"Bill Tracking Amendment"},{name:"Additional Cost"},{name:"Capital Purchase Voucher"},{name:"Payment Collection"}];
    //
    accoutMenus:[]=[];
    userProfile: any = <any>{};
    selectedMenu:any;
    PhiscalObj: any = <any>{};
    constructor(
        public masterService: MasterRepo,
        private spinnerService: SpinnerService,
        private alertSerivces: AlertService,
        private _transactionService: TransactionService,
        private fb: FormBuilder,
        private authService: AuthService,
        private loadingService: SpinnerService
        
    ) { 

        this.userProfile = authService.getUserProfile();
        this.PhiscalObj = authService.getPhiscalInfo();
    }

    ngOnInit() {
        this.form = this.fb.group({
            FROMDATE: [''],
            TODATE: [''],
            FORM: [''],
            DIVISION: [''],
            PHISCALID: [''],
        })
        // ////console.log("CheckMenu",this.userProfile.menuRights.menu)
        //console.log(PAGES_MENU,"pagessss")
       let aa=PAGES_MENU.filter(x=>x.path=="pages")[0];
    //    ////console.log("aa",aa);
       let aaa=aa.children.filter(x=>x.path=="account")[0];
    //    ////console.log("aaa",aaa);
    //    let aaaa=aaa.children.filter(x=>x.path=="acvouchers")[0];
    //    ////console.log("aaaa",aaaa);
    //    this.accoutMenus=aaaa.children;
    //    ////console.log("aaaaa",aaaa.children);

        // for(let a of PAGES_MENU)
        // {
        //     this.list1 = a;
        // }
        // this.list2 = this.list1.children;
        // //console.log(this.list2,"lsit2")
        // this.list3 = this.list2[1];
        // //console.log(this.list3,"list3")
        
        



    }

    onSearch() {
        this.loadingService.show("Searching...")
        this.form.patchValue({
            DIVISION :  this.PhiscalObj.Div,
            PHISCALID : this.PhiscalObj.PhiscalID
        }) 
        //console.log("CheckVlaue",this.form.value)
        let searchObj = Object.assign(this.renumberingObj, this.form.value);
        this.masterService.getDateRangeValue(searchObj).subscribe(x=>{
            this.voucherLists = x;
            this.loadingService.hide()
        });
    }
    FormName(values){
      
    }
    SaveRenum(){
        if (confirm("Are you sure you want to changes all the listed below Vouchers? It cannot revert once accepted.")) {
            this.SaveConfirm();
        }
    }
    SaveConfirm(){
       
        // ket bodyData = {data:this.}
        // this.masterService.saveRenumering()
        if(!this.voucherLists)
        {
            this.alertSerivces.warning("Please load the renumering list first!");
        }
        this.renumberingObj.VList = this.voucherLists;
        // //console.log("CheckeVoucherList",this.voucherLists)
        this.renumberingObj.DIVISION =  this.PhiscalObj.Div,
        this.renumberingObj.PHISCALID = this.PhiscalObj.PhiscalID
        let bodyData = {data: this.renumberingObj}  
        this.loadingService.show('saving data please wait...')  
        this.masterService.saveRenumering(bodyData).subscribe(x=>{
            if(x.status == "ok"){
                this.alertSerivces.info("Voucher Renumering saved successfully!")
                this.voucherLists = [];
                this.renumberingObj.VList = [];
                this.renumberingObj.FORM = '';
                this.renumberingObj.TODATE = '';
                this.renumberingObj.FROMDATE = '';
                this.loadingService.hide();
            }
            else{
                this.loadingService.hide();
                this.alertSerivces.error(x.result);
            }
        }, error =>{
            this.alertSerivces.error("Error in savin data. Please try again!");
        })
    }
}

export interface Renumbering {
    FROMDATE: string;
    TODATE: string;
    FORM: string;
    VList : RenumeringList[];
    DIVISION:string;
    PHISCALID : string;
} 
export interface RenumeringList{
    VCHRNO : string;
    TRNDATE : Date;
    BSDATE : string
    NETAMNT : number;
    TRNMODE : string
    PHISCALID : string;
    DIVSION: string;
}
