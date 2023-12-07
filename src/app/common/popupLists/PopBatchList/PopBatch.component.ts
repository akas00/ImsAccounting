import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MasterRepo } from '../../repositories';
import { TrnProd, VoucherTypeEnum } from '../../interfaces';
import { TransactionService } from '../../Transaction Components/transaction.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component(
    {
        selector: 'PBatchList',
        templateUrl: './PopBatch.html',
        styleUrls: ["../../../pages/Style.css", "../pStyle.css"],

    }
)
export class PopBatchComponent {
    /** Input/Output/Viewchild  */
    //@Input('voucherType') voucherType:VoucherTypeEnum;
    @Input() title: string;
    @Input() tabindex;
    @Input() inputSearch: string;
    @Output() dbClickEvent = new EventEmitter();
    @Output() BatchClosedClick = new EventEmitter();
    @Output() searchItem = new EventEmitter();
    @Output() returnBatchValue = new EventEmitter();
    @Output() multiBatchScheme=new EventEmitter();
    @ViewChild("BatchEntry") _BE: ElementRef;
    @ViewChild("SearchBox") _Search: ElementRef;
 
    /** Object Declaration  */
    selectPopupRowList: Function;
    selectedRow: number;
    selectedRowIndex: number;
    isFocus: boolean = true;

    /** List Declaration  */
    p: number[] = [];
    setClickedRow: Function;
    BatchObj: any=<any>{};
    BatchList:any[]=[];
   @Input() BList:any[]=[];
   unitList: any[] = [];
   @Input() voucherType:any;
   @Input() activerowIndex:number;
   @Input() AlternateUnits:any[]=[];
    constructor(private masterService: MasterRepo,private _trnMainService: TransactionService) {
        // this.masterService.getAllUnitList().subscribe(data => {
        //     this.unitList.push(data);
        // })
        this.selectedRowIndex=0;
        this.setClickedRow = function (index) {
            this.selectedRow = index;
        }
        // var DummyData = [{ "BC": '1234', "EXPDATE": '03/18/2020', "MFGDATE": '03/18/2018', "SP": '500', "Stock": 24, "MP": "350" },
        // { "BC": '2738', "EXPDATE": '03/18/2025', "MFGDATE": '03/18/2018', "SP": '500', "Stock": 2429, "MP": "350" },
        // { "BC": '4885', "EXPDATE": '02/12/2021', "MFGDATE": '03/19/2019', "SP": '400', "Stock": 2400, "MP": "250" },
        // { "BC": '6905', "EXPDATE": '07/13/2019', "MFGDATE": '07/13/2018', "SP": '750', "Stock": 2241, "MP": "550" },
        // { "BC": '1239', "EXPDATE": '08/28/2020', "MFGDATE": '03/28/2017', "SP": '1100', "Stock": 1124, "MP": "800" },
        // { "BC": '4993', "EXPDATE": '09/08/2019', "MFGDATE": '03/08/2020', "SP": '200', "Stock": 2402, "MP": "150" },
        // { "BC": '1944', "EXPDATE": '012/22/2022', "MFGDATE": '03/18/2019', "SP": '100', "Stock": 343, "MP": "50" }]
        // this.BList=DummyData;
    }
    ngAfterViewInit() {
      //  document.getElementById('batchFilterPopup').focus();
        
        if(this.voucherType==3){
           // this.AlternateUnits= this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits;
        //     let defaultunit=this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits.filter(x=>x.ISDEFAULT==1)[0];
        //    if(defaultunit!=null){
        //     this.BatchObj.UNIT = defaultunit.ALTUNIT;
        //     this.BatchObj.PPrice=defaultunit.PRATE;
        //     this.BatchObj.SPrice=defaultunit.RATE;
        //    } 
         }
    }
    ngOnInit() {
        
    }
    SelectUnit()
{
    this.BatchObj.UNIT = this.BatchObj.ALTUNITObj.ALTUNIT;
   this.BatchObj.PRATE=this.BatchObj.ALTUNITObj.PRATE;
    this.BatchObj.SRATE=this.BatchObj.ALTUNITObj.RATE;
    // this._trnMainService.TrnMainObj.ProdList[i].unitQty=<UnitAndQty>{};
    // this.TrnMainObj.ProdList[i].unitQty.BaseUnit=this.TrnMainObj.ProdList[i].SELECTEDITEM.BASEUNIT;
    // this.TrnMainObj.ProdList[i].unitQty.ConversionFactor=selectedunit.CONFACTOR;
    // this.TrnMainObj.ProdList[i].unitQty.Unit=selectedunit.ALTUNIT;
    // this.TrnMainObj.ProdList[i].unitQty.Rate=selectedunit.PRATE;
    // this.TrnMainObj.ProdList[i].ALTRATE=selectedunit.PRATE;
    // this.TrnMainObj.ProdList[i].ALTUNIT=selectedunit.ALTUNIT;
    // this.TrnMainObj.ProdList[i].REALRATE=this.TrnMainObj.ProdList[i].PRATE=selectedunit.PRATE/selectedunit.CONFACTOR;
    // this.TrnMainObj.ProdList[i].UNIT=selectedunit.ALTUNIT;
}
    pagingChange(value) {
        this.p[this.tabindex] = value;
    }
    setFocus() {
       // this._BE.nativeElement.focus();
    }
    SearchList(value) {
        // this.itemChanged(value);

    }



    PopupItemListRowClick(index) {
        this.selectedRowIndex = index;
    }
    
    itemBatchClosed() {
        this.BatchClosedClick.emit();
    }
    keydownClick() {

    }
    AddNewBatch() {
      //  this.BatchList=this.BList;
        setTimeout(()=>{
           // this._BE.nativeElement.focus();
        },50)
       
    }

    tabClick() {
        this.returnBatchValue.emit(this.BatchObj);
    }
    clickPlusButton(){
        this.tabClick()
    }
    clickButtonClick() {
        if (this.BatchObj.BATCH == null) {
           alert("Please enter Batch no.");
            // this.childModal.show();
            // this.DialogMessage="Please enter Batch no.";
            // setTimeout(()=>{
            //     this.childModal.hide();
            // },500)

            return;
        }
        else if(this.BatchObj.MFGDATE>this.BatchObj.EXPIRY
            ){
            alert("Manufacture date cannot be greater than Expiry date!!")
            // this.childModal.show();
            // this.DialogMessage="Manufacture date cannot be greater than Expiry date!";
            // setTimeout(()=>{
            //     this.childModal.hide();
            // },1500)
            return;
        }
        else if(this.BatchObj.SRATE>this.BatchObj.MRP){
            // this.childModal.show();
            // this.DialogMessage="SP cannot be greater than MRP!";
            // setTimeout(()=>{
            //     this.childModal.hide();
            // },800)
           // alert("SP cannot be greater than MRP!")
           // return;
        }
        else if(this.BatchObj.MFGDATE==null || this.BatchObj.EXPIRY == null){
            alert("MFGDate and ExpDate cannot be empty!")
            // this.childModal.show();
            // this.DialogMessage="MFGDate and ExpDate cannot be empty!";
            // setTimeout(()=>{
            //     this.childModal.hide();
            // },800)
            return;
        }
        this.tabClick()
        
       
    }
    RowClickEvent(index)
    {
        this.selectedRowIndex=index;
    }
    dblClickBatchObj(value) {
    //     if(value.SchemeRateType==2){
    //             if(value.tQuantity==null || value.tQuantity<=0)
    //     {
    //         alert("Invalid Quantity Detected in selected batch. Please enter valid quantity..");
    //         return;
    //     }
    //     if(value.STOCK< value.tQuantity)
    //     {
    //         alert("Invalid Quantity Detected in selected batch. Quantity exceed the stock..");
    //         return;
    //     }
    //     if((value.SCHEME.minQty+value.SCHEME.schemeDisRate)>value.tQuantity)
    //     {         
    //       if(confirm("Enter quantity not contain scheme.Do you want to continue?")==false){
    //         return;
    //       }
    //     }
    // }
        this.dbClickEvent.emit(value)
 
     }
     MultiBatchEntryClicked()
     {
        var filteredList= this.BList.filter(x=>x.tQuantity>0);
        var firstBatch=filteredList[0];
        if(firstBatch==null){alert("Row with valid Quantity not detected...");return;}
        if(filteredList.filter(x=>x.SCHEME.schemeID!=firstBatch.SCHEME.schemeID)[0]!=null)
        {
            alert("Can not Choose multi batch of different Scheme...");
            return;
        }
        if(filteredList.filter(x=>x.STOCK<x.tQuantity)[0]!=null)
        {
            alert("Exceed Quantity than Stock detected...");
            return;
        }
        this.multiBatchScheme.emit(filteredList);
       // let totaltQty=0;
       // filteredList.forEach(q=>{totaltQty+=q.tQuantity;});
     }
     onKeydown(event)
      {
        this.setFocus();
          if(this.selectedRowIndex==null)this.selectedRowIndex=0;
          
          if(event.key==="ArrowDown")
          {        
              this.selectedRowIndex=this.selectedRowIndex+1;
              if(this.selectedRowIndex>(this.BList.length-1))this.selectedRowIndex=this.BList.length-1;
          }
          else if(event.key==="ArrowUp")
          {
            this.selectedRowIndex=this.selectedRowIndex-1;
            if(this.selectedRowIndex<0)this.selectedRowIndex=0;
          }
          if(event.key==="Enter")
          {
              if(this.selectedRowIndex!=null)
              {
                  if(this.BList[this.selectedRowIndex]!=null){
                  this.dblClickBatchObj(this.BList[this.selectedRowIndex]);
                  }
              }
          }

         
      }
}