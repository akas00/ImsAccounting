import { TransactionService } from "./transaction.service";
import { Component } from '@angular/core';
import { MasterRepo } from './../repositories/masterRepo.service';

@Component({
  selector: "inv-params",
  styleUrls: ["../../pages/Style.css"],
  templateUrl: "./InventoryParameters.html",
})

export class InventoryParametersComponent {
  warehouseList: any = []
  constructor(public masterService: MasterRepo, private _trnMainService: TransactionService) {
    this.masterService.getWarehouseList().subscribe((res) => {

      this.warehouseList.push(res)
    })
  }

  ngOnInit() {
  }
  SettlementChange() {
  }
  FromWarehouseFieldDisabled(): boolean {
    if (this._trnMainService.TrnMainObj.ProdList != null) {
      if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
        return true;
      }
    }
    return false;
  }
}
