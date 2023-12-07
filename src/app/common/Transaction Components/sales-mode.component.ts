import { Component, OnInit, Input } from '@angular/core';
import { TransactionService } from './transaction.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MasterRepo } from "../repositories/masterRepo.service";
import { SettingService } from './../services'

@Component({
    selector: "sales-mode",
    template: `
        <form [formGroup]="salesModeForm">
           <label *ngIf="transactionType !='creditnote' && salesTypes.indexOf('dispatch') > -1" style="vertical-align: text-top; margin-left:5px;"> <input  type="radio" formControlName="SalesMode" value="delivery" style="height:13px; margin-top:3px;" (change)="radioTrnModeChange($event.target.value)">Dispatch</label>
           <label *ngIf="transactionType !='creditnote' && salesTypes.indexOf('warrenty') > -1" style="vertical-align: text-top; margin-left:5px;"> <input  type="radio" formControlName="SalesMode" value="warrenty" style="height:13px; margin-left:15px;" (change)="radioTrnModeChange($event.target.value)">Warranty</label>
            <label *ngIf="transactionType !='creditnote' &&_trnMainService.salesMode=='warrenty'">UpTo Date</label>
            <input *ngIf="transactionType !='creditnote' &&_trnMainService.salesMode=='warrenty'" type="date" formControlName="warrentyUpToDate" (change)="ToDateChange()">
            <label *ngIf="transactionType !='creditnote' && salesTypes.indexOf('outofwarrenty') > -1" style="vertical-align: text-top; margin-left:5px;"><input  type="radio" formControlName="SalesMode" value="outofwarrenty" style="height:13px; margin-left:15px;" (change)="radioTrnModeChange($event.target.value)">Out of Warranty</label>
         
        </form>
    `,
})
// <label style="vertical-align: text-top; margin-left:5px;"> <input type="radio" formControlName="SalesMode" value="counter" style="height:13px; margin-left:15px;" (change)="radioTrnModeChange($event.target.value)"> Counter</label> ------> this Counter were above </form> tags
export class SalesModeComponent {
    @Input('transactionType')transactionType:string=''
    salesTypes:any[]=[];
    salesModeForm: FormGroup;

    constructor(public _trnMainService: TransactionService, private _fb: FormBuilder, public masterService: MasterRepo,private setting: SettingService) {
       if(setting.appSetting.SALESTYPE!=null){
        this.salesTypes=setting.appSetting.SALESTYPE.split(",");
       }
    }

    ngOnInit() {
        
        this.salesModeForm = this._fb.group({
            SalesMode: ['', Validators.required],
            warrentyUpToDate: ['']
        });
        var sub1 = this.masterService.getCurrentDate().subscribe(date => {
            this.salesModeForm.get('warrentyUpToDate').setValue(date.Date.substring(0, 10));
            this._trnMainService.warrentyUpToDate = this.salesModeForm.get("warrentyUpToDate").value;
        }, error => {
            alert(error);
            this.masterService.resolveError(error, "sales mode component getCurrentDate");
        });
        this.salesModeForm.patchValue({ SalesMode: 'counter' });
        this._trnMainService.salesMode = "counter";
        if (this._trnMainService.TrnMainObj.Mode == "VIEW") {
            this.salesModeForm.get('SalesMode').disable();
        }

        this.salesModeForm.valueChanges.subscribe(form => {
            this._trnMainService.salesMode = form.SalesMode;
        });

        if (this._trnMainService.TrnMainObj.Mode == "EDIT" || this._trnMainService.TrnMainObj.Mode == "VIEW") {

        }
        
    }
    ToDateChange() {
        this._trnMainService.warrentyUpToDate = this.salesModeForm.get("warrentyUpToDate").value;
    }

    radioTrnModeChange(value) {
        
        this._trnMainService.salesMode = this.salesModeForm.get('SalesMode').value;
        if (this._trnMainService.salesMode == 'outofwarrenty') {
            this._trnMainService.PMode = 'c';
            this._trnMainService.buttonHeading='Reference No';
            this._trnMainService.prodDisableSubject.next(true);
        }
        else if(this._trnMainService.salesMode=='warrenty'){
            this._trnMainService.buttonHeading="Calculate";
            this._trnMainService.PMode = 'p';
            this._trnMainService.prodDisableSubject.next(true);
        }
        else if(this._trnMainService.salesMode=='delivery'){
            this._trnMainService.buttonHeading="Reference No";
            this._trnMainService.PMode = 'p';
            this._trnMainService.prodDisableSubject.next(true);
        }
        else  {
            this._trnMainService.PMode = 'p';
            this._trnMainService.buttonHeading='Reference No';
            this._trnMainService.prodDisableSubject.next(false);
        }

        

    }
}