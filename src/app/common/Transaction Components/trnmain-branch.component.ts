import { TransactionService } from "./transaction.service";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
//import {TAcList} from '../../../../common/interfaces';
import { TrnMain } from './../interfaces/TrnMain';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasterRepo } from './../repositories/masterRepo.service';
import { IDivision } from './../interfaces'
import { SettingService } from './../services'


@Component({
    selector: "trnmain-branch",
    styleUrls: ["../../pages/Style.css"],
    templateUrl: "./trnmain-branch.component.html",
})

export class TrnMainBranchComponent {
    TrnMainForm: FormGroup;
    AppSettings;
    TrnMainObj: TrnMain = <TrnMain>{};
    divisionList: IDivision[] = [];
    settlementList: any[] = [];
    constructor(public masterService: MasterRepo, private _trnMainService: TransactionService,
        private _fb: FormBuilder, private setting: SettingService) {
        this.AppSettings = this.setting.appSetting;
        this.TrnMainObj = _trnMainService.TrnMainObj;
        if (this.TrnMainObj.VoucherType == 9) {
            this.settlementList = [];
            this.masterService.getSettlementMode()
                .subscribe(data => {
                    this.settlementList.push(data);
                })
        }
    }

    ngOnInit() {
        this.masterService.refreshTransactionList();
        this.TrnMainForm = this._fb.group({
            COSTCENTER: ['', Validators.required],
            BILLTOADD: ['', Validators.required],
            WAREHOUSE: ['', Validators.required],
            REMARKS: [''],
            SettleMode: [''],
        });

        if (this.TrnMainObj.Mode == "VIEW") {
            this.TrnMainForm.get('BILLTOADD').disable();
            this.TrnMainForm.get('COSTCENTER').disable();
            this.TrnMainForm.get('WAREHOUSE').disable();
            this.TrnMainForm.get('REMARKS').disable();
            this.TrnMainForm.get('SettleMode').disable();
        }

        this.TrnMainForm.valueChanges.subscribe(form => {
            this._trnMainService.Warehouse = form.WAREHOUSE;
            this.TrnMainObj.BILLTOADD = form.BILLTOADD;
            this.TrnMainObj.COSTCENTER = form.COSTCENTER;
            this.TrnMainObj.REMARKS = form.REMARKS;

        });

        if (this.TrnMainObj.Mode == "EDIT" || this.TrnMainObj.Mode == "VIEW") {
            this._trnMainService.loadDataObservable.subscribe(data => {
                try {
                    var warehouse: string;
                    if (data.ProdList[0] != null) {
                        warehouse = data.ProdList[0].WAREHOUSE;
                    } else {
                        warehouse = null;
                    }
                    if (this.TrnMainObj.VoucherType == 9) {
                        this.settlementList = [];
                        this.masterService.getSettlementMode()
                            .subscribe(data => {
                                this.settlementList.push(data);
                            }, error => { alert(error) }, () => {
                                this.TrnMainForm.patchValue({ SettleMode: this.settlementList.filter(d => d.DESCRIPTION == data.TRNMODE)[0] });
                                this.SettlementChange();
                            })
                    }

                    this.TrnMainForm.patchValue({
                        COSTCENTER: data.COSTCENTER,
                        BILLTOADD: data.BILLTOADD,
                        REMARKS: data.REMARKS,
                        WAREHOUSE: warehouse,
                        // SettleMode:c,
                    })
                } catch (e) {
                    alert(e)
                }
            });
        }

    }

    changeBranch() {
        this.masterService.divisionList$.subscribe(data => {
            this.divisionList = data;
        });
        if (this.TrnMainForm.get('BILLTOADD').value == this.TrnMainObj.DIVISION) {
            var division = this.divisionList[this.divisionList.findIndex(d => d.INITIAL == this.TrnMainObj.DIVISION)].NAME;
            alert("(" + division + ") branch has already been selected in division above, please select a different branch.");
            this.TrnMainForm.patchValue({
                BILLTOADD: '',
            })
        }
    }

    SettlementChange() {
        this._trnMainService.SettlementNo = this.TrnMainForm.value.SettleMode.DECREASE;
        this._trnMainService.TrnMainObj.TRNMODE = this.TrnMainForm.value.SettleMode.DESCRIPTION;
    }

}
