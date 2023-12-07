import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories';

@Component(
    {
        selector: 'SupplierLedger',
        template:`<pLedgerTable></pLedgerTable>`,
        styleUrls: ["../../../Style.css"],

    }
)
export class SupplierLedgerComponent {
    // Ptype: string
    constructor(private MasterService: MasterRepo) {
        // this.Ptype="V"
        this.MasterService.PType = 'V';
    }

 


  
  

   
}