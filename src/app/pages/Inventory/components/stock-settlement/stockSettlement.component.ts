import { Component, ViewChild, OnInit } from '@angular/core';
import { TransactionService } from './../../../../common/Transaction Components/transaction.service';
import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ActivatedRoute } from '@angular/router';
import { TrnMain } from '../../../../common/interfaces';
import { AuthService } from '../../../../common/services/permission/authService.service';


@Component({
    selector: 'StockSettlement',
    templateUrl: './stockSettlement.html',
    providers: [TransactionService]

})

export class StockSettlementComponent implements OnInit {
    @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;
    public activeurlpath:string;
    type:any;
    PhiscalObj: any = <any>{};

  //  _trnMainService.pageHeading:string;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    constructor(private _trnMainService: TransactionService, private masterService: MasterRepo, private arouter: ActivatedRoute,
    private authService: AuthService)
    {
        this.activeurlpath=this.arouter.snapshot.url[0].path;
      //  this._trnMainService.TrnMainObj.ProdList[].inputMode = true;

        this._trnMainService.initialFormLoad(9);
        this.PhiscalObj = authService.getPhiscalInfo();

        this._trnMainService.settlementList = [];
        if(this.activeurlpath =='StockSettlementEntryApproval'){
        
       }
        this.masterService.getSettlementMode()
            .subscribe(data => {
                // //console.log({SettlementData:data})
                this._trnMainService.settlementList.push(data);
            });
            var PID = this.PhiscalObj.PhiscalID;
            PID = PID.replace("/", "ZZ");
            this.gridPopupSettings = {
                title: "Settlement Item",
                apiEndpoints: `/getTrnMainPagedList/DM/${PID}`,
                defaultFilterIndex : 0,
                columns: [
                  {
                    key: "VCHRNO",
                    title: "Voucher No.",
                    hidden: false,
                    noSearch: false
                  },
                  {
                    key: "REMARKS",
                    title: "Remarks",
                    hidden: false,
                    noSearch: false
                  },
                  {
                    key: "TRNMODE",
                    title: "Settlement Mode",
                    hidden: false,
                    noSearch: false
                  },
                  {
                    key: "TRNDATE",
                    title: "Date",
                    hidden: false,
                    noSearch: false
                  }
                ]
      };
    }

    ngOnInit(){
        if(this.activeurlpath =='StockSettlementEntryApproval'){
             this._trnMainService.pageHeading = 'Stock Settlement Approval';
          }
    }

    showLoadFromStockSettlement($event){
        this.genericGridSO.show();
    }

    onItemDoubleClick($event){
        this.loadVoucher($event);
    }

    // onItemDoubleClick($event){
    //     this.onStockSettlementSelect($event);
    // }

    saveChangeStockSettlement($event){
        this.genericGridSO.show();
    }

    loadVoucher(selectedItem){      
       this._trnMainService.loadStockSettlement(selectedItem.VCHRNO)                 
    }
    
    onStockSettlementSelect(selectedItem) {
     // ////console.log("loadstocksettlement");
        this.masterService.LoadStockSettlement(selectedItem.VCHRNO ).subscribe(
          result => {
           
            if (result.status == "ok") { 
            //  ////console.log("react");
              this._trnMainService.TrnMainObj = JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );      
              this._trnMainService.TrnMainObj.Mode = "APPROVE" 

                for(let i in this._trnMainService.TrnMainObj.ProdList){
                  this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE,this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2,i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
         //  ////console.log("stocksettle",this._trnMainService.TrnMainObj.ProdList[i]);
            this._trnMainService.CalculateNormalNew(i);
                 
                }
             this._trnMainService.TrnMainObj.ProdList=this._trnMainService.TrnMainObj.ProdList.filter(x=>x.SELECTEDITEM.STOCK>0);
             this._trnMainService.getVoucherNumber();
              this._trnMainService.getCurrentDate();
              
              this._trnMainService.TrnMainObj.Mode = "APPROVE" 
              this._trnMainService.ReCalculateBill();
    
              this._trnMainService.showPerformaApproveReject = false;
              this._trnMainService.TrnMainObj.Mode = "APPROVE" 
    
            }
          },
          error => {}
        );
      }





}


