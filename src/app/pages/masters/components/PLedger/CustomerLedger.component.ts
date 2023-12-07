import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories';

@Component(
    {
        selector: 'CustomerLedger',
        templateUrl:`<pLedgerTable></pLedgerTable>`,
        styleUrls: ["../../../Style.css"],

    }
)
export class CustomerLedgerComponent {
    // Ptype: string
    constructor(private MasterService: MasterRepo) {
        // this.Ptype="C"
        this.MasterService.PType = 'C';
    }








}