import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { IDivision } from "../../../../common/interfaces/commonInterface.interface";
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
@Component(
    {

        selector: 'Division',
        template: ` 
            <div class="form-group row" style="margin-top: 25px;">
    <label  class="col-sm-2 form-control-label" >Division:</label>
   <div class="col-sm-5">
       <select class="form-control"  id="Division" name="division">
            <option *ngFor="let ac of divisionList" [ngValue]="ac.INITIAL">{{ac.NAME}}<option>
        </select>
     
    </div> 
  </div>
       
 `,
        providers: [MasterRepo],

    }
)
export class DivisionComponentRep {
    division: IDivision = <IDivision>{};
    divisionList: IDivision[] = [];

    ngOnInit() {
        try {
            this.MasterService.getDivisions().subscribe(res => { this.divisionList.push(<any>res); });
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    constructor(protected MasterService: MasterRepo) { }

}









