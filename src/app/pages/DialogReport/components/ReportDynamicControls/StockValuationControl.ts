import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { ReportService, IReportMenu, IReport, IreportOption } from '../reports/report.service';
@Component(
    {
        selector: 'stockvaluationcontrol',
        template: `
	 
    <div class="col-md-7" style="width:54%;margin-left:-15px" >
      <fieldset class="scheduler-border">
                        <legend class="scheduler-border" style="font-size: 12px;width:initial;font-weight:bold">{{p.description}}</legend>
                        <div class="row">
                            <div style="margin-left:20px;float:left;font-size:12px">
                              <label style="font-size:12px">  <input type="radio" name="amradio"  value="1"  (change)="autoManualChange('auto')">Auto</label>
                              <label style="font-size:12px">  <input type="radio" name="amradio" value="0"  (change)="autoManualChange('manual')">Manual</label>
                            </div>
                        </div>
                        
                    </fieldset>
                         <div class="form-group row" style="margin-left:25px; width:200px;" [formGroup]="form">
                         <div class="row">
                          <label style="font-size:12px">Opening :</label>
                                <input  type="text" style="width:35px" formControlName="D1">
                                </div>
                                <div class="row">
                                <label style="font-size:12px">Closing :</label>
                                <input  type="text" style="width:35px" formControlName="D2">
                                </div>
                                <div class="row">
                              <label style="font-size:12px"> <input type="checkbox" (change)="cbStockValuation($event.target.checked)" [disabled]="Disable_ShowOpeningBLOnly" [checked]="ShowOpeningBLOnly"> Do Stock Valuation</label>
 <button style="height: 40px;width:80px;" title="Calculate"  data-dismiss="modal" (click)="CalculateStockValuation()">Calculate</button>
                            </div>
</div>
                           
                   
                    </div>

  
`,

    }
)
export class StockValuationControl {
    @Input() reportname;
    @Input() form: FormGroup;
   
    constructor(private reportService: ReportService, private fb: FormBuilder) { }

    ngOnInit() {

    }
    ngAfterViewInit() {
      
    }
    autoManualChange(name){

    }
    CalculateStockValuation(){}
}









