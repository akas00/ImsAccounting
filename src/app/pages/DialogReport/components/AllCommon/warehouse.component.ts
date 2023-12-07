import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { Warehouse } from "../../../../common/interfaces/TrnMain";
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
@Component(
    {

        selector: 'warehouse',
        template: `
                  <div class="form-group row">
    <label  class="col-sm-2 form-control-label" >Warehouse:</label>
   <div class="col-sm-6">
       <select class="form-control"  id="warehouse" name="warehouse" style="width:320px;">
            <option *ngFor="let wl of warehouseList" [ngValue]="wl.INITIAL">{{wl.NAME}}<option>
        </select>
     
    </div> </div>
    
 `,
        providers: [MasterRepo],

    }
)
export class WarehouseCompoentRep {
    warehouse: Warehouse = <Warehouse>{};
    warehouseList: Warehouse[] = [];

    ngOnInit() {
        try {
            this.MasterService.getDivisions().subscribe(res => { this.warehouseList.push(<any>res); });
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    constructor(protected MasterService: MasterRepo) { }



}









