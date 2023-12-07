import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
//import {TAcList} from '../../../../common/interfaces';
import { TrnMain, CostCenter } from '../../../../common/interfaces/TrnMain';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { Warehouse } from '../../../../common/interfaces'
import { SettingService } from '../../../../common/services'


@Component({
    selector: "trnmain-stock-issue",
    styleUrls: ["../../../Style.css"],
    templateUrl: "./trnmain-stock-issue.component.html",
})

export class TrnMainStockIssueComponent {
    TrnMainForm: FormGroup;
    AppSettings;
    WarehouseList: Warehouse[] = [];
    CostCenterList: CostCenter[] = [];
    TrnMainObj: TrnMain = <TrnMain>{};

    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService,
        private _fb: FormBuilder, private setting: SettingService) {
        this.AppSettings = this.setting.appSetting;
        this.TrnMainObj = _trnMainService.TrnMainObj;
    }

    ngOnInit() {
        // this.masterService.getWarehouseList().subscribe(res => { this.WarehouseList.push(<Warehouse>res); }, error => { this.resolevError(error); });
        // this.masterService.getCostCenterList().subscribe(res => { this.CostCenterList.push(<CostCenter>res); }, error => { this.resolevError(error); });
        this.masterService.refreshTransactionList();
        this.TrnMainForm = this._fb.group({
            COSTCENTER: ['', Validators.required],
            BILLTO: ['', Validators.required],
            BILLTOADD: ['', Validators.required],
            REMARKS: [''],
        });

        if (this.TrnMainObj.Mode == "VIEW") {
            this.TrnMainForm.get('BILLTO').disable();
            this.TrnMainForm.get('BILLTOADD').disable();
            this.TrnMainForm.get('COSTCENTER').disable();
            this.TrnMainForm.get('REMARKS').disable();
        }

        this.TrnMainForm.valueChanges.subscribe(form => {
            this._trnMainService.TrnMainObj.BILLTO = form.BILLTO;
            this._trnMainService.TrnMainObj.BILLTOADD = form.BILLTOADD;
            this._trnMainService.TrnMainObj.COSTCENTER = form.COSTCENTER;
            this._trnMainService.TrnMainObj.REMARKS = form.REMARKS;
           // //console.log(this._trnMainService.TrnMainObj);
        });

        if (this.TrnMainObj.Mode == "EDIT" || this.TrnMainObj.Mode == "VIEW") {
            this._trnMainService.loadDataObservable.subscribe(data => {
                try {
                    this.TrnMainForm.patchValue({
                        COSTCENTER: data.COSTCENTER,
                        BILLTO: data.BILLTO,
                        BILLTOADD: data.BILLTOADD,
                        REMARKS: data.REMARKS,
                    })
                } catch (e) {
                    //console.log({ errorOnLoad: e });
                }
            });
        }

    }


    // private resolevError(error: Error) {
    //     if (error.message == 'The ConnectionString property has not been initialized.') {
    //         this.router.navigate(["/login", { returnUrl: this.router.url }]);
    //     }
    //     else {
    //         alert(error.message);
    //     }
    // }

}
