import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MasterRepo } from '../../repositories';
import { TransactionService } from '../../Transaction Components/transaction.service';
import { BatchStock } from '../../interfaces';
import { resolve } from 'dns';

@Component(
    {
        selector: 'PItemList',
        templateUrl: './PopItems.html',
        styleUrls: ["../../../pages/Style.css", "../pStyle.css"],

    }
)
export class PoplistComponent {
    selectedRowIndex:number=0;
    summary:string;
    constructor(private masterService: MasterRepo,public _trnMainService: TransactionService) {
      
      
    }
    ngAfterViewInit(){
        // this.setFocus();
    }
    ngOnInit() {
        // this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'focus');
    }
    hide()
    {
       this.masterService.PlistTitle="";
    }
    doubleClick(item)
    {
        
        this.masterService
        .masterPostmethod("/getbatchWithAlternateUnitList", item)
        .subscribe(
            res => {
                if (res.status == "ok") {
                  
                   
                         let item=JSON.parse(res.result); 
                         let index=this._trnMainService.TrnMainObj.ProdList.findIndex(x=>x.MCODE==item.MCODE);
                       
                      if(index<0)
                      {
                        this._trnMainService.addRow();
                        this._trnMainService.assignValueToProdFromBarcode(item,this._trnMainService.TrnMainObj.ProdList.findIndex(x=>x.MCODE==null));
                      }
                      else
                      {
                        let alreadyExistingitem= this._trnMainService.TrnMainObj.ProdList[index];
                        this._trnMainService.TrnMainObj.ProdList[index].Quantity+=1;
                        this._trnMainService.RealQuantitySet(index, alreadyExistingitem.CONFACTOR);
                        this._trnMainService.CalculateNormalNew(index);
                        this._trnMainService.ReCalculateBill();
                      }
                      this._trnMainService.BarcodeFromScan="";
                      this.masterService.PlistTitle="";
                      document.getElementById("itembarcode").focus();
                    }
    
                                       
                 else {
                  alert(res.result);
                }
            },
            error => {
            }
        );
    }
    singleClick(index)
    {
        this.selectedRowIndex = index;
        this.summary=this._trnMainService.ItemsListForMultiItemBarcode[index].itemSummary;
    }

    
  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) { 
    if (
      $event.code == "ArrowDown" &&
      this.selectedRowIndex < this._trnMainService.ItemsListForMultiItemBarcode.length -1
    ) {
      $event.preventDefault();
      this.selectedRowIndex++;
      if(this._trnMainService.ItemsListForMultiItemBarcode[this.selectedRowIndex]!=null){
      this.summary=this._trnMainService.ItemsListForMultiItemBarcode[this.selectedRowIndex].itemSummary;
      }
    } else if ($event.code == "ArrowUp" && this.selectedRowIndex-1 > -1) {
      $event.preventDefault();
      this.selectedRowIndex--; 
      if(this._trnMainService.ItemsListForMultiItemBarcode[this.selectedRowIndex]!=null){
      this.summary=this._trnMainService.ItemsListForMultiItemBarcode[this.selectedRowIndex].itemSummary;
      }
    }
     else if ( 
      $event.code == "Enter" &&
      this.selectedRowIndex >= 0 &&
      this.selectedRowIndex < this._trnMainService.ItemsListForMultiItemBarcode.length 
    ) { 
      $event.preventDefault();
      this.doubleClick(this._trnMainService.ItemsListForMultiItemBarcode[this.selectedRowIndex]);
      this.hide();
      
    }
     else if ($event.code == "Escape") { 
      $event.preventDefault(); 
      this.hide();
     
    }

  }
}