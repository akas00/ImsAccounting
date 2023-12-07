import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { LedgerDialog } from '../../../../common/interfaces/LedgerDialog.interface';
import { ReportService, IReportMenu, IReport, IreportOption } from '../reports/report.service';
@Component(
    {
        selector: 'DebitorsReportOptionsAndDueAging',
        template: `
	 
    <div class="col-md-7" style="width:54%;margin-left:-15px" >
                        <fieldset class="scheduler-border" style="height: 155px; width:100%; margin-left:-1px; margin-top:15px;">
                            <legend class="scheduler-border" style="font-size: 12px;width:120px">Report Option</legend>

                            <div class="checkbox">
                               <label style="font-size:12px"> <input type="checkbox" (change)="checkboxChangeEvent('ShowOpeningBLOnly',$event.target.checked)" [disabled]="Disable_ShowOpeningBLOnly" [checked]="ShowOpeningBLOnly"> Show Opening B&frasl;L Only</label>
                            </div>
                            <div *ngIf="reportname=='debitors'" class="checkbox" style="margin-left:50px;">
                                 <label style="font-size:12px"> <input type="checkbox" (change)="checkboxChangeEvent('ShowOpeningStatusAlso',$event.target.checked)"  [disabled]="Disable_ShowOpeningStatusAlso" [checked]="ShowOpeningStatusAlso"> Show Opening Deborts Status Also</label>
                            </div>
                           
                            <div class="checkbox">
                                 <label style="font-size:12px"> <input type="checkbox" (change)="checkboxChangeEvent('ExcludeNegativeBalance',$event.target.checked)"  [disabled]="Disable_ExcludeNegativeBalance" [checked]="ExcludeNegativeBalance">Exclude Negative Balance</label>
                            </div>
                             <div class="checkbox">
     <label style="font-size:12px"> <input type="checkbox" (change)="checkboxChangeEvent('ShowNegativeBalanceOnly',$event.target.checked)"   [disabled]="Disable_ShowNegativeBalanceOnly" [checked]="ShowNegativeBalanceOnly">Show Negative Balance Only</label>
                            </div>
                            <div class="checkbox">
                                 <label style="font-size:12px"> <input type="checkbox" (change)="checkboxChangeEvent('ShowZeroBalanceAlso',$event.target.checked)"   [disabled]="Disable_ShowZeroBalanceAlso" [checked]="ShowZeroBalanceAlso">Show Zero Balance Debitors Only</label>
                                <label style="width:250px;font-size:12px">  <input style="margin-left:15%" type="checkbox" (change)="checkboxChangeEvent('ShowDebitorsContactDetailAlso',$event.target.checked)"  [disabled]="Disable_ShowDebitorsContactDetailAlso" [checked]="ShowDebitorsContactDetailAlso">Show Contact Details Also</label>
                            </div>
                            
                        </fieldset>
                    </div>
   <div class="col-md-3" >
                        <fieldset class="scheduler-border" style="margin-left: -15px; height: 60px; width:250px; margin-top:15px;">
                            <legend *ngIf="reportname=='debitors'" class="scheduler-border" style="font-size: 12px;width:180px"><input type="checkbox"  (change)="checkboxChangeEvent('ShowDebitorsDueAgeing',$event.target.checked)" [disabled]="Disable_ShowDebitorsDueAgeing" [checked]="ShowDebitorsDueAgeing">Show Debitors Due Ageing</legend>
                            <legend *ngIf="reportname=='creditors'" class="scheduler-border" style="font-size: 12px;width:180px"><input type="checkbox"  (change)="checkboxChangeEvent('ShowDebitorsDueAgeing',$event.target.checked)" [disabled]="Disable_ShowDebitorsDueAgeing" [checked]="ShowDebitorsDueAgeing">Show Creditors Due Ageing</legend>
                            <div class="form-group row" style="margin-left:25px; width:200px;" [formGroup]="form">
                                <input  type="text" style="width:35px" formControlName="D1">
                                <input  type="text" style="width:35px" formControlName="D2">
                                <input  type="text" style="width:35px" formControlName="D3">
                                <input  type="text" style="width:35px" formControlName="D4">

                            </div>

                        </fieldset>
                         <div class="checkbox">
                               <label style="font-size:12px"> <input type="checkbox" (change)="checkboxChangeEvent('DontShowAgeingOfOpeningBL',$event.target.checked)" [disabled]="Disable_DontShowAgeingOfOpeningBL" [checked]="DontShowAgeingOfOpeningBL">Don't Show Ageing of Opening B/L</label>
                            </div>
                    </div>

  
`,

    }
)
export class DebitorsReportOptionsAndDueAgingComponent {
    @Input() reportname;
    @Input() form: FormGroup;
    ShowOpeningBLOnly: boolean;
    ShowOpeningStatusAlso: boolean;
    ShowDebitorsContactDetailAlso: boolean;
    ExcludeNegativeBalance: boolean;
    ShowNegativeBalanceOnly: boolean;
    ShowZeroBalanceAlso: boolean;
    ShowDebitorsDueAgeing: boolean;
    DontShowAgeingOfOpeningBL: boolean;

    Disable_ShowOpeningBLOnly: boolean;
    Disable_ShowOpeningStatusAlso: boolean = true;
    Disable_ShowDebitorsContactDetailAlso: boolean;
    Disable_ExcludeNegativeBalance: boolean;
    Disable_ShowNegativeBalanceOnly: boolean;
    Disable_ShowZeroBalanceAlso: boolean;
    Disable_ShowDebitorsDueAgeing: boolean;
    Disable_DontShowAgeingOfOpeningBL: boolean = true;
    constructor(private reportService: ReportService, private fb: FormBuilder) { }

    ngOnInit() {

    }
    ngAfterViewInit() {
        this.form.controls['D1'].setValue(30);
        this.form.controls['D2'].setValue(60);
        this.form.controls['D3'].setValue(90);
        this.form.controls['D4'].setValue(120);
    }
    checkboxChangeEvent(checkbox, value) {
        if (checkbox == "ShowOpeningBLOnly") {
            this.ShowOpeningBLOnly = value;
            this.ShowOpeningStatusAlso = false;
            this.Disable_ShowOpeningStatusAlso = (value == true ? false : true);
        }
        else if (checkbox == "ShowOpeningStatusAlso") {
            this.ShowOpeningStatusAlso = value;
            this.ExcludeNegativeBalance = false;
            this.ShowNegativeBalanceOnly = false;
            this.Disable_ExcludeNegativeBalance = value;
            this.Disable_ShowNegativeBalanceOnly = value;

        }
        else if (checkbox == "ShowDebitorsContactDetailAlso") {
            this.ShowDebitorsContactDetailAlso = value;

        }
        else if (checkbox == "ExcludeNegativeBalance") {
            this.ExcludeNegativeBalance = value;
            this.ShowNegativeBalanceOnly = false;
            this.ShowZeroBalanceAlso = false;
            this.Disable_ShowNegativeBalanceOnly = value;
            this.Disable_ShowZeroBalanceAlso = value;


        }
        else if (checkbox == "ShowNegativeBalanceOnly") {
            this.ShowNegativeBalanceOnly = value;
            this.ShowZeroBalanceAlso = false;
            this.ExcludeNegativeBalance = false;
            this.Disable_ExcludeNegativeBalance = value;
            this.Disable_ShowZeroBalanceAlso = value;
        }
        else if (checkbox == "ShowZeroBalanceAlso") {
            this.ShowZeroBalanceAlso = value;
            this.ShowNegativeBalanceOnly = false;
            this.ExcludeNegativeBalance = false;
            this.Disable_ExcludeNegativeBalance = value;
            this.Disable_ShowNegativeBalanceOnly = value;

        }
        else if (checkbox == "ShowDebitorsDueAgeing") {
            this.ShowDebitorsDueAgeing = value;
            this.ShowOpeningBLOnly = false;
            this.ShowOpeningStatusAlso = false;
            this.ShowDebitorsContactDetailAlso = false;
            this.DontShowAgeingOfOpeningBL = false;
            this.Disable_ShowOpeningBLOnly = value;
            this.Disable_ShowOpeningStatusAlso = value;
            this.Disable_ShowDebitorsContactDetailAlso = value;
            this.Disable_DontShowAgeingOfOpeningBL = (value == true ? false : true);


        }
        else if (checkbox == "DontShowAgeingOfOpeningBL") {
            this.DontShowAgeingOfOpeningBL = value;

        }
        this.form.controls['OPENINGONLY'].setValue(this.ShowOpeningBLOnly == true ? 1 : 0);
        if (this.reportname == 'debitors') {
            if (this.ShowDebitorsDueAgeing == false) {
                this.form.controls['FLAG'].setValue(this.ShowOpeningStatusAlso == true ? 2 : 1);
            }
            else {
                this.form.controls['FLAG'].setValue(0);
            }
        }
        if (this.reportname == 'creditors') {
            this.form.controls['FLAG'].setValue(1);
        }
        this.form.controls['SHOWDETAIL'].setValue(this.ShowDebitorsContactDetailAlso == true ? 1 : 0);
        this.form.controls['EXCLUDENEGATIVE'].setValue(this.ExcludeNegativeBalance == true ? 1 : 0);
        this.form.controls['SHOWAGEINGREPORT'].setValue(this.ShowDebitorsDueAgeing == true ? 1 : 0);
        this.form.controls['AGEINGOFPARTYOPENING'].setValue(this.DontShowAgeingOfOpeningBL == true ? 1 : 0);
    }
    checkBoxChangeEffect() {

    }
}









