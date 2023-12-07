import { TransactionService } from "./transaction.service";
import { Component, OnInit } from "@angular/core";
import { MasterRepo } from "../repositories/masterRepo.service";
import { HotkeysService, Hotkey } from "angular2-hotkeys";

@Component({
  selector: "voucher-sidebar-billdetail",
  templateUrl: "./voucher-sidebar-billdetail.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"] 
})
export class VoucherSidebarBillDetailComponent implements OnInit { 

  hideShow : boolean = false; 
     
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private _hotkeysService: HotkeysService
  ) {  
  }  

  ngOnInit(){
     //for new 
     this._hotkeysService.add(
      new Hotkey(
        "f10",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          this.hideShow = !this.hideShow;
          return false;
        }
      )
    );
  }
}
