import { MasterRepo } from './../../../../common/repositories/masterRepo.service';

import { Component } from '@angular/core';
import { AdditionalCostService } from "./addtionalCost.service";
import { IMPORT_DETAILS_PROD, TrnMain } from "../../../../common/interfaces/TrnMain";
import { FormBuilder, FormControl, FormArray, Validators, FormGroup } from "@angular/forms";
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { AlertService } from '../../../../common/services/alert/alert.service';

@Component({
  selector: 'ImportDocumentDetailsComponent',
  templateUrl: 'ImportDocumentDetail.component.html',
  styleUrls: ["../../../modal-style.css", "../../../Style.css", "../../../../common/Transaction Components/halfcolumn.css"],
  providers: []

})
export class ImportDocumentDetailsComponent {
  TrnMainObj: TrnMain
  form: FormGroup;
  header: any[] = [];
  importrowindex: number = 0;
  constructor(public _addionalcostService: AdditionalCostService,
    private fb: FormBuilder, private masterService: MasterRepo,
    public _additionalCostService: AdditionalCostService,
    private _transactionService: TransactionService,
    private alertService: AlertService) {

  }
  ngAfterViewInit() {

  }
  addRow() {
    try {
      var newRow = <IMPORT_DETAILS_PROD>{};
      this._addionalcostService.IMPORTDETAILS.prodList.push(newRow);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  activeIndex: number;
  ClickTableRow(index) {
    //console.log("ClickRowIndex", index);
    this.activeIndex = index;
  }
  rowClick(index) {

    this.importrowindex = index;
  }
  onChangeNonTaxable() {

    this.onChange();
  }
  onChangeVAT() {
    this.onChange();
  }
  onChangeTaxable() {

    this.onChange();
  }
  onChange() {
    this.RecalculateImportDetails();
    this.RecalculateProdValue();
  }
  RecalculateProdValue() {

    this._addionalcostService.IMPORTDETAILS.prodList[this.activeIndex].NETAMOUNT
      = this._addionalcostService.IMPORTDETAILS.prodList[this.activeIndex].TAXABLE
      + this._addionalcostService.IMPORTDETAILS.prodList[this.activeIndex].NONTAXABLE
      + this._addionalcostService.IMPORTDETAILS.prodList[this.activeIndex].VAT
  }
  nextRow() {
    this.addRow();
    this.masterService.focusAnyControl('importNetmant' + this.activeIndex + 1)
  }
  RecalculateImportDetails() {
    try {
      if (this._addionalcostService.IMPORTDETAILS && this._addionalcostService.IMPORTDETAILS.prodList.length) {

        this._addionalcostService.IMPORTDETAILS.TOTALQTY = 0
        this._addionalcostService.IMPORTDETAILS.TOTALTAXABLE = 0;
        this._addionalcostService.IMPORTDETAILS.TOTALNONTAXABLE = 0
        this._addionalcostService.IMPORTDETAILS.TOTALVAT = 0;
        this._addionalcostService.IMPORTDETAILS.NETAMOUNT = 0;
        this._addionalcostService.IMPORTDETAILS.prodList.forEach(x => {
          //   x.NETAMOUNT = this._trnMainService.nullToZeroConverter(x.NONTAXABLE) + this._trnMainService.nullToZeroConverter(x.TAXABLE) + this._trnMainService.nullToZeroConverter(x.VAT);
          this._addionalcostService.IMPORTDETAILS.TOTALQTY = this._transactionService.nullToZeroConverter(this._addionalcostService.IMPORTDETAILS.TOTALQTY) + this._transactionService.nullToZeroConverter(x.QUANTITY);
          this._addionalcostService.IMPORTDETAILS.TOTALTAXABLE = this._transactionService.nullToZeroConverter(this._addionalcostService.IMPORTDETAILS.TOTALTAXABLE) + this._transactionService.nullToZeroConverter(x.TAXABLE);
          this._addionalcostService.IMPORTDETAILS.TOTALNONTAXABLE = this._transactionService.nullToZeroConverter(this._addionalcostService.IMPORTDETAILS.TOTALNONTAXABLE) + this._transactionService.nullToZeroConverter(x.NONTAXABLE);
          this._addionalcostService.IMPORTDETAILS.TOTALVAT = this._transactionService.nullToZeroConverter(this._addionalcostService.IMPORTDETAILS.TOTALVAT) + this._transactionService.nullToZeroConverter(x.VAT);
          this._addionalcostService.IMPORTDETAILS.NETAMOUNT = this._transactionService.nullToZeroConverter(this._addionalcostService.IMPORTDETAILS.NETAMOUNT) + this._transactionService.nullToZeroConverter(x.NETAMOUNT);
        })
      }

    } catch (error) {
      this.alertService.error('Error in import details calculation: ' + error);
    }

  }
  ChangeDocumentNo() {
    this.masterService.importDocumentDetailsObj.PPNO = this._addionalcostService.IMPORTDETAILS.DOCUMENTNO;
  }
  ChangeLCNo() {
    this.masterService.importDocumentDetailsObj.LCNO = this._addionalcostService.IMPORTDETAILS.LCNUM;
  }
}