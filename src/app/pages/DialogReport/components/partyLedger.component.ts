import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { CommonService } from "../../../../common/services/common.service";
import { Subscription } from "rxjs/Subscription";
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import {MasterRepo} from "../../../common/repositories/masterRepo.service";
import {TAcList} from "../../../common/interfaces/Account.interface";
@Component(
    {
        
        selector: 'PartyLedger',
        templateUrl: './partyLedger.component.html',
        providers: [MasterRepo],

    }
)
export class PartyLedgerComponentRep{
    aclist:TAcList=<TAcList>{};


  ngOnInit() {
        
 }
   constructor() {}
  
 
   }









