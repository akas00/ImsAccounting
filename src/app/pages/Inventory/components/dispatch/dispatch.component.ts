import { Component, OnDestroy } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { SettingService } from "../../../../common/services/setting.service";

@Component({
    selector: "dispatch",
    templateUrl: "./dispatch.component.html",
    providers: [TransactionService],
    styleUrls: ["../../../modal-style.css"]
})

export class DispatchComponent {
    private returnUrl: string;
    private subcriptions: Array<Subscription> = [];
    TrnMainObj: TrnMain = <TrnMain>{};
    voucherType: VoucherTypeEnum = VoucherTypeEnum.Delivery;
    prefix: PREFIX = <PREFIX>{};

    constructor(public masterService: MasterRepo, private _trnMainService: TransactionService, private router: Router, private arouter: ActivatedRoute,private _hotkeysService: HotkeysService,private setting:SettingService) {
      if (!!this.arouter.snapshot.params['returnUrl']) {
            this.returnUrl = this.arouter.snapshot.params['returnUrl'];
        }
        this.formChooser();
        this.TrnMainObj = _trnMainService.TrnMainObj;
        this.TrnMainObj.VoucherPrefix = 'DL';
        this.TrnMainObj.VoucherType = VoucherTypeEnum.Delivery;
      
        this.voucherType = VoucherTypeEnum.Delivery;
        this._hotkeysService.add(new Hotkey ('alt+s',(event:KeyboardEvent):boolean=>{
            this.onSaveClicked();
            return true;
        }));
        this.masterService.ShowMore=false;
        
    }
    formChooser(){
        switch (this.returnUrl) {
            case "/pages/inventory/productionout":
                  this._trnMainService.pageHeading = "Production Out";
                  this.TrnMainObj.TRNMODE="productionout";
                break;
         case "/pages/inventory/dispatch":
                  this._trnMainService.pageHeading = "Dispatch Out";
                  this.TrnMainObj.TRNMODE="dispatch"
                break;
            default:
                break;
        }
    }

    ngOnInit() {
        
        var mode: string;
        if (!!this.arouter.snapshot.params['mode']) {
            mode = this.arouter.snapshot.params['mode'];
            this.TrnMainObj.Mode = mode == 'add' ? 'NEW' : mode.toUpperCase();
        }

        let division: string;
        let phiscalid: string;

        if (!!this.arouter.snapshot.params['div']) {
            division = this.arouter.snapshot.params['div'];
        }

        if (!!this.arouter.snapshot.params['phiscal']) {
            phiscalid = this.arouter.snapshot.params['phiscal'];
        }

        if (!!this.arouter.snapshot.params['vchr']) {
            let VCHR = this.arouter.snapshot.params['vchr'];

            this._trnMainService.loadData(VCHR, division, phiscalid);
            this._trnMainService.loadDataObservable.subscribe(data => {
                this.TrnMainObj = data;
                this.TrnMainObj.Mode = mode == 'add' ? 'NEW' : mode.toUpperCase();
            })
        }
    }

    onSaveClicked() {
       // //console.log({ trnMainSave: this._trnMainService.TrnMainObj })
        var data = JSON.stringify(this._trnMainService.TrnMainObj, undefined, 2);
         this.formChooser();
      //  //console.log(data);
        this.TrnMainObj.MWAREHOUSE = this._trnMainService.Warehouse;
        if (this.formValidCheck() == false) {
            alert("Form Entered is not correct. Please check again");
            return;
        }
        // this.DialogMessage = "Saving Data please wait..."
        // this.childModal.show();
        this.onsubmit();

    }

    prefixChanged(pref: any) {
        try {
            //console.log({ prefix: pref })
            this._trnMainService.prefix = pref;
            this.prefix = pref;
            if (this.TrnMainObj.Mode == 'NEW') {
                var tMain = <TrnMain>{ VoucherPrefix: pref.VNAME };
                if (this.TrnMainObj.DIVISION == '' || this.TrnMainObj.DIVISION == null) {
                    tMain.DIVISION = this.setting.appSetting.DefaultDivision;
                }
                this.masterService.getVoucherNo(tMain).subscribe(res => {
                    if (res.status == "ok") {
                        let TMain = <TrnMain>res.result;
                        this.TrnMainObj.VCHRNO = TMain.VCHRNO.substr(2, TMain.VCHRNO.length - 2);
                        this.TrnMainObj.CHALANNO = TMain.CHALANNO;
                    }
                    else {
                        alert("Failed to retrieve VoucherNo")
                        //console.log(res);
                    }
                });
            }
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }

    onsubmit() {
        try {


            this.TrnMainObj.ProdList.forEach(prod => prod.WAREHOUSE = this._trnMainService.Warehouse);
            this.TrnMainObj.VoucherPrefix = this.prefix.VNAME;
            // this.TrnMainObj.VoucherType = VoucherTypeEnum.Purchase;
            //console.log({ submit: this.TrnMainObj });

            let sub = this.masterService.saveTransaction(this.TrnMainObj.Mode, this.TrnMainObj)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.router.navigate([this.returnUrl]);
                    }
                },
                error => { alert(error) }
                );
            this.subcriptions.push(sub);
        }
        catch (e) {
            //this.childModal.hide()
            alert(e);
        }
    }


    onCancelClicked() {
        this.router.navigate([this.returnUrl]);
    }

    isFormValid: boolean;
    formValidCheck = (): boolean => {
        // //console.log({ warehouse: this.warehouse, prodlist: this.TrnMainObj.AdditionProdList, trnac: this.TrnMainObj.TRNAC });
        if (this._trnMainService.Warehouse == undefined || this._trnMainService.Warehouse == '') {
            return false;
        }
        if (this.TrnMainObj.ProdList == undefined) {
            return false;
        }
        else {
            if (this.TrnMainObj.ProdList.length < 1) {
                return false;
            }
        }
        if (this.TrnMainObj.TRNAC == undefined || this.TrnMainObj.TRNAC == '') {
            return false;
        }

        return true;
    }

}
