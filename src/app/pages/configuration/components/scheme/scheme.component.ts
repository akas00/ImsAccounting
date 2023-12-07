import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Item } from "../../../../common/interfaces/ProductItem";
import { Subscriber } from "rxjs/Subscriber";
import { ModalDirective } from "ng2-bootstrap";
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, TreeComponent } from 'angular-tree-component';
import { PoplistComponent } from '../../../../common/popupLists/PopItemList/PopItems.component';
import { PopCategoryComponent } from '../../../../common/popupLists/PopupCategoryList/PopCategory.component';
import { FromEventObservable } from 'rxjs/observable/FromEventObservable';

const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    },
    click: (tree, node, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event)
    }
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => node.setActiveAndVisible()
    //[KEYS.ENTER]: (tree, node, $event) =>  alert(`This is ${node.data.name}`)
  }
};
@Component({
  selector: "scheme",
  templateUrl: "./scheme.component.html",
  styleUrls: ["../../../modal-style.css", "../../../Style.css", "../../../../common/Transaction Components/halfcolumn.css", "../../../../common/popupLists/pStyle.css"]
})

export class SchemeComponent implements AfterViewInit {
  DialogMessage: string = "Saving";
  @ViewChild('childModal') childModal: ModalDirective;
  // @ViewChild('showBatch') showBatch: ElementRef;
  @ViewChild("showList") showList: ElementRef;
  @ViewChild("showCat") showCat: ElementRef;
  @ViewChild("showQtyRange") showQtyRange: ElementRef;

  @ViewChild(PoplistComponent) itemListChild: PoplistComponent;
  @ViewChild(PopCategoryComponent) PopCatChild: PopCategoryComponent;
  mode: any;
  ItemListFromGroupTree: any[] = [];
  ScheduleList: any[] = [];
  results: Observable<Item[]>;
  subscriptions: Subscription[] = [];
  RangeObj: any = <any>{}
  SchemeObj: any = <any>{};
  discountByTotalAmtObj: any = <any>{};
  ComboByItemlist: any[] = [];
  saveItemList: any[] = [];
  schemePriority: any;
  schemeCardPriority: any;
  selectedCategory: any;
  getScheduleList: any[] = [];
  discountratelist = false;
  discountamountlist = false;
  discountitemlist = false;
  comboItemList: any[] = [];
  comboitemselect: any[] = [];
  selectedcomboitem: any;
  selectedrate = false;
  selectedamount = false;
  comboitemGroup: any = <any>{};
  allcombolist: any = <any>{};
  selectedcombocode: any;
  comboitemcode: any;
  selectedSchemeType: any;

  saveEnabled = false;
  enabledComboGrpList = false;
  enabledComboGrpRate = false;
  enabledComboGrpAmt = false;
  viewInit: any;
  bulkObj: any = <any>{};
  private returnUrl: string;
  isCategory = false;
  CategoryList: any[] = [];
  AllItemList: any[] = [];

  ItemList: Item[] = [];
  AlternateUnits: any[] = [];
  TableHeader: any;
  flag: any;
  enableTable = false;
  constructor(private masterRepo: MasterRepo, private router: Router, private _activatedRoute: ActivatedRoute) {
    this.ItemList=[];
    this.isCategory = false;
    this.bulkObj.RangeType = this.RangeObj.RangeType = 'F';
    this.addRow();
    this.mode = "new"
    this.enableTable = false;
    this.getScheduleList = [];
    this.masterRepo.getAllSchedule()
      .subscribe(res => {
        this.getScheduleList.push(<any>res);
      }
      );

    var data: any[] = [];


    if (!!this._activatedRoute.snapshot.params['returnUrl']) {
      this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
    }
    if (!!this._activatedRoute.snapshot.params['viewInit']) {
      this.viewInit = this._activatedRoute.snapshot.params['viewInit'];
      this.mode = 'view';
    }

    if (!!this._activatedRoute.snapshot.params['initial']) {
      let Initial: string = "";
      Initial = this._activatedRoute.snapshot.params['initial'];
      this.SchemeObj.DisID = Initial;
      this.masterRepo.getAllSchemeList(Initial).subscribe(data => {
        if (data) {
          if (data.status == "ok") {
            ////console.log("SchemeReturn", data)

          }
          //}
        }
      })
    }


  }

  ngOnInit() { }
  ngAfterViewInit() {
    setTimeout(() => {
      this.showList.nativeElement.style.display = 'none';
      // this.showBatch.nativeElement.style.display = 'none';
      this.showCat.nativeElement.style.display = 'none';
      this.showQtyRange.nativeElement.style.display = 'none';
    }, 100)

  }




  // saveObj: any = <any>{};
  // saveObjlist: any;
  // mode: string = "add";
  // onSaveClicked() {
  //   this.DialogMessage = "Saving.... Please Wait!"
  //   this.childModal.show();
  //   if (this.SchemeObj.ScheduleID == null || this.SchemeObj.schemeName == null) {
  //     alert("Scheme or Schedule name is Empty!")
  //     return;
  //   }

  //   this.mode = 'edit' ? this.mode = 'edit' : this.mode = 'add';
  //   var setScheme;
  //   var setcombogrp;
  //   let requiredSaveList: any[] = [];
  //   if (this.selectedSchemeType == 'bydiscount') {
  //     if (this.DiscountByMGroupList.length != 0) {

  //       requiredSaveList = [];
  //       ////console.log("DISCOUNT%%", this.DiscountByMGroupList)
  //       for (let i of this.DiscountByMGroupList) {
  //         if (i.Rate == null && i.Amount == null) {
  //           alert("Amount and Rate cannot be empty.");
  //           return
  //         }
  //         ////console.log("DiscountByMGroupList", this.DiscountByMGroupList)
  //         let rList = <any>{};
  //         rList.Mgroup = i.MCODE;
  //         rList.DisRate = i.Rate ? i.Rate : 0;
  //         rList.DisAmount = i.Amount ? i.Amount : 0;
  //         rList.CardPriority = this.SchemeObj.schemeCardPriority ? 1 : 0;
  //         rList.Priority = this.SchemeObj.schemePriority ? 1 : 0;
  //         rList.ScheduleID = this.SchemeObj.ScheduleID;
  //         rList.SchemeName = this.SchemeObj.schemeName;
  //         if (this.mode == 'edit')
  //           rList.DisId = this.SchemeObj.DisId;
  //         requiredSaveList.push(rList);

  //       }
  //     }
  //     if (this.DiscountByItemList.length != 0) {

  //       requiredSaveList = [];
  //       for (let p of this.DiscountByItemList) {
  //         let dpList = <any>{}
  //         dpList.Mcode = p.MCODE;
  //         dpList.DisRate = p.Rate ? p.Rate : 0;
  //         dpList.DisAmount = p.Amount ? p.Amount : 0;
  //         dpList.CardPriority = this.SchemeObj.schemeCardPriority ? 1 : 0;
  //         dpList.Priority = this.SchemeObj.schemePriority ? 1 : 0;
  //         dpList.ScheduleID = this.SchemeObj.ScheduleID;
  //         dpList.SchemeName = this.SchemeObj.schemeName;
  //         if (this.mode == 'edit')
  //           dpList.DisId = this.SchemeObj.DisId;
  //         requiredSaveList.push(dpList);

  //       }
  //     }
  //     if (this.DiscountByParentList.length != 0) {

  //       requiredSaveList = [];
  //       for (let a of this.DiscountByParentList) {
  //         let itemList = <any>{}
  //         itemList.Parent = a.MCODE;
  //         itemList.DisRate = a.Rate ? a.Rate : 0;
  //         itemList.DisAmount = a.Amount ? a.Amount : 0;
  //         itemList.CardPriority = this.SchemeObj.schemeCardPriority ? 1 : 0;
  //         itemList.Priority = this.SchemeObj.schemePriority ? 1 : 0;
  //         itemList.ScheduleID = this.SchemeObj.ScheduleID;
  //         itemList.SchemeName = this.SchemeObj.schemeName;
  //         if (this.mode == 'edit')
  //           itemList.DisId = this.SchemeObj.DisId;
  //         requiredSaveList.push(itemList);
  //         ////console.log("requiredS@ve", requiredSaveList)
  //       }
  //     }
  //   }
  //   if (this.selectedSchemeType == 'bytotalamount') {
  //     if (this.discountByTotalAmtObj.length != 0) {
  //       requiredSaveList = [];
  //       for (let d of this.ComboBydiscountlist) {
  //         let amtList = <any>{}
  //         amtList.DisRate = d.rate ? d.rate : 0;
  //         amtList.DisAmount = d.amount ? d.amount : 0;
  //         amtList.CardPriority = this.SchemeObj.schemeCardPriority ? 1 : 0;
  //         amtList.Priority = this.SchemeObj.schemePriority ? 1 : 0;
  //         amtList.ScheduleID = this.SchemeObj.ScheduleID;
  //         amtList.SchemeName = this.SchemeObj.schemeName;
  //         amtList.GreaterThan = d.greaterThan;
  //         amtList.LessThan = d.lessThan;

  //         if (this.mode == 'edit')
  //           amtList.DisId = this.SchemeObj.DisId;
  //         requiredSaveList.push(amtList);
  //         ////console.log("reqSave", requiredSaveList)
  //       }
  //     }
  //   }
  //   if (this.selectedSchemeType == 'bycomboitem') {
  //     requiredSaveList = [];
  //     let itmgrp = <any>{};
  //     itmgrp.DisAmount = this.comboitemGroup.amount ? this.comboitemGroup.amount : 0;
  //     itmgrp.DisRate = this.comboitemGroup.rate ? this.comboitemGroup.rate : 0;
  //     itmgrp.comboId = this.comboitemGroup.comboitemcode;
  //     itmgrp.ScheduleID = this.SchemeObj.ScheduleID;
  //     itmgrp.SchemeName = this.SchemeObj.schemeName;
  //     itmgrp.CardPriority = this.SchemeObj.schemeCardPriority ? 1 : 0;
  //     itmgrp.Priority = this.SchemeObj.schemePriority ? 1 : 0;
  //     if (this.mode == 'edit')
  //       itmgrp.DisId = this.SchemeObj.DisId;
  //     let cil = [];

  //     for (let ig of this.ComboByItemlist) {
  //       ////console.log("%%%%%%%%%%%", this.ComboByItemlist);
  //       let c = <any>{};
  //       c.DisRate = ig.selectedrate ? ig.selectedrate : 0;
  //       c.DisAmount = ig.selectedamount ? ig.selectedamount : 0;
  //       c.Quantity = ig.selectedquantity;
  //       c.MCODE = ig.selectedCombo.MCODE;
  //       c.comboId = this.comboitemGroup.comboitemcode;
  //       c.Discount = ig.selecteddiscount;
  //       if (this.mode == 'edit')
  //         c.CID = this.allcombolist.CID
  //       cil.push(c);
  //       ////console.log("@@", requiredSaveList);

  //     }
  //     itmgrp.comboSubItemList = cil;
  //     requiredSaveList.push(itmgrp);
  //   }
  //   this.saveItemList = requiredSaveList;
  //   ////console.log("scheme", this.saveItemList)
  //   this.masterRepo.saveScheme(this.mode, this.saveItemList).subscribe(data => {
  //     if (data.status == 'ok') {
  //       if (data) {
  //         setTimeout(() => {
  //           this.childModal.hide();
  //         }, 1000)
  //         this.router.navigate([this.returnUrl]);
  //       }
  //     }
  //     else {
  //       if (data.result._body == "The ConnectionString property has not been initialized.") {
  //         this.router.navigate(['/login', this.router.url])

  //       }

  //     }
  //   })

  // }



  DiscountTypeChangeEvent(key) {
    this.ItemList = [];
    this.bulkObj.RangeType = this.RangeObj.RangeType = 'F';
    this.addRow();
    // var index = 0
    if (key == "MGroup") {
      this.isCategory = false;
      this.TableHeader = 'Main Group '
    }
    else if (key == "Parent" || key == "Mcode") {
      this.isCategory = false;
      // document.getElementById('menucode' + nextindex).focus();
      if (key == "Parent") this.TableHeader = 'Parent Group'
      else if (key == "Mcode") this.TableHeader = 'Item Wise'
    }
    else if (key == "Category") {
      this.TableHeader = 'CategoryWise'
    }
  }
  selectedDiscountType: any;

  comboGrpAmt = false;
  comboGrpRate = false;



  // batchlist: any[] = [];
  // getBatchFromMCode(mcode) {



  //   //console.log({ checkmcode: mcode })
  //   this.masterRepo.masterGetmethod("/getBatchListOfItem/" + mcode).subscribe(res => {

  //     ////console.log("BatchListonScheme", res)
  //     if (res.status == 'ok') {

  //       this.batchlist = JSON.parse(res.result);
  //     }
  //     else {
  //       ////console.log("error on getting BatchListOfItem " + res.result);
  //     };
  //   }, error => {
  //     ////console.log("error on getting BatchListOfItem ", error);
  //   });

  // }



  addRow() {
    try {
      this.ItemList.forEach(x => x.inputMode = false);
      var newRow = <Item>{};
      newRow.inputMode = true;
      newRow.MENUCODE = null;
      newRow.DESCA = null;
      this.ItemList.push(newRow);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  ChangeSchemeType(value) {
    this.ItemList = [];
    this.bulkObj.RangeType = this.RangeObj.RangeType = 'F';
    this.addRow();
    ////console.log("schemeValue", value)
    if (value == 'bybulk') {
      this.TableHeader = 'Bulk'
      this.flag = 'Bulk'
    }
    else if (value == 'bytotalamount') {
      this.TableHeader = 'Total Amount'
      this.flag = 'TotalAmount'
    }
    else {
      this.flag = 'bydiscount'
    }
    this.enableTable = true;
  }
  activerowIndex: number = 0;
  PlistTitle: string;

  /** Key Event/ Tab Event / EnterEvent */

  CatkeyEvent(index) {
    this.PlistTitle = "Category List";
    this.activerowIndex = index;
    this.Model1open();
  }
  ItemkeyEvent(index) {
    this.PlistTitle = "Item List";
    this.activerowIndex = index;
    // this.renderer.invokeElementMethod(this.inp.nativeElement, 'focus');
    this.Model1open();
    return false;
  }


  // BatchTabClick(index) {
  //   this.PlistTitle = "Batch List";
  //   this.masterRepo.masterPostmethod("/getBatchListOfItem", { mcode: this.ItemList[index].MCODE })
  //     .subscribe(res => {
  //       if (res.status == "ok") {
  //         this.batchlist = JSON.parse(res.result);
  //       this.Model1open();
  //       }
  //       else {
  //         ////console.log("error on getting BatchListOfItem " + res.result);
  //       };

  //     }, error => {
  //       ////console.log("error on getting BatchListOfItem ", error);
  //     }
  //     );

  // }
  // BatchEnter(index) {

  //   this.BatchTabClick(index);
  //   return false;
  // }
  RangeQtyEvent(i) {
    if (this.bulkObj != null) {
      var bt = this.bulkObj.RangeType;
      if (bt == 'R') {
        this.showQtyRange.nativeElement.style.display = 'block';
      }

    }
  }
  /**Popup Event */
  Model1open() { 
    switch (this.PlistTitle) {
      case "Item List":
        this.showList.nativeElement.style.display = 'block';

        // this.PItemListSelector.nativeElement.style.display = "block";
        if (this.flag == "MGroup") {
          //this.itemListChild.getMainGroup();
          this.PlistTitle = "Main-Group-List"

        }
        else if (this.flag == "Parent") {
         // this.itemListChild.getParentGroup();
          this.PlistTitle = "Parent-List"

        }
        else if (this.flag == "Bulk" || this.flag == "Mcode") {
         // this.itemListChild.getAllList();

        }

        break;
      // case "Batch List":
      //   this.showBatch.nativeElement.style.display = 'block'
      //   break;
      case "Category List":
        this.showCat.nativeElement.style.display = 'block'
        this.PopCatChild.getCatList();
        break;

    }
  }

  model1Closed() {
    switch (this.PlistTitle) {
      case "Item List" || "Main-Group-List" || "Parent-List":
        this.showList.nativeElement.style.display = 'none'
        // document.getElementById('showList').style.display = "none";
        break;
      // case "Batch List":
      //   this.showBatch.nativeElement.style.display = 'none'
      //   break;
      case "Category List":
        this.showCat.nativeElement.style.display = 'none'
        break;
    }
  }
  RangeQtyClose() {
    this.showQtyRange.nativeElement.style.display = 'none';
  }


  dblClickPopupItem(value) {
    this.showList.nativeElement.style.display = 'none';
    switch (this.flag) {
      case 'Mcode':
        this.ItemList[this.activerowIndex].Mcode = value.MCODE;
        document.getElementById('discount' + this.activerowIndex).focus();

        break;
        
        case 'Category':
        this.ItemList[this.activerowIndex].Mcode = value.MCODE;
        document.getElementById('discount' + this.activerowIndex).focus();

        break;
      case 'MGroup':
        this.ItemList[this.activerowIndex].MGroup = value.MCODE;
        document.getElementById('discount' + this.activerowIndex).focus();

        break;
      case 'Parent':
        this.ItemList[this.activerowIndex].Parent = value.MCODE;
        document.getElementById('discount' + this.activerowIndex).focus();

        break;
      case 'Bulk':
        this.ItemList[this.activerowIndex].RangeType=this.SchemeObj.RangeType = this.bulkObj.RangeType;
        this.RangeObj.Mcode = this.ItemList[this.activerowIndex].Mcode = value.MCODE;
        if(this.bulkObj.RangeType=='F'){
        document.getElementById('quantity' + this.activerowIndex).focus();
        }
        else{
         this.showQtyRange.nativeElement.style.display='block';
        }
        break;
    }

    this.ItemList[this.activerowIndex].DESCA = value.DESCA;
    this.ItemList[this.activerowIndex].MENUCODE = value.MENUCODE;
    // this.ItemList[this.activerowIndex].MCODE = value.MCODE;
    // this.ItemList[this.activerowIndex].STOCK = value.STOCK;
    
  }

  TableRowclick(i) {
    this.activerowIndex = i
  }

  itemListClosed() {
    // this.showBatch.nativeElement.style.display='none';
    document.getElementById('tempBatch').style.display = 'none';
  }
  // dblClickPopupBatch(value) {

  //   this.returnBatch(value);
  // }
  // returnBatch(value) {

  //   this.ItemList[this.activerowIndex].Batches = value.BCODE;
  //   if(this.flag=="Bulk") this.RangeObj.Batches=value.BCODE;

  //   this.model1Closed();

  //   this.showBatch.nativeElement.style.display = 'none';


  // }
 

  dblClickCategoryItem(value) {
    this.model1Closed();
    ////console.log("value", value)
    this.ItemList[this.activerowIndex].MCategory = value.MENUCAT;
    //this.itemListChild.getItemFromMCAT(value.MENUCAT);
    this.ItemkeyEvent(this.activerowIndex);
  }
  onSaveClicked() {
    ////console.log("saveObj", this.ItemList, this.SchemeObj)
    this.DialogMessage = "Saving.... Please Wait!"
    this.childModal.show();
    // if (this.SchemeObj.ScheduleID == null || this.SchemeObj.schemeName == null) {
    //   alert("Scheme or Schedule name is Empty!")
    //   return;
    // }
    // this.mode = 'edit' ? this.mode = 'edit' : this.mode = 'add';
    this.submitSave();

  }
  submitSave() {
    this.masterRepo.saveScheme(this.mode, this.ItemList, this.flag, this.SchemeObj, this.RangeList).subscribe(data => {
      if (data.status == 'ok') {
        this.DialogMessage = "Data saved sucessfully!"

        setTimeout(() => {
          this.childModal.hide();
        }, 1000)
        this.router.navigate([this.returnUrl]);

      }
      else {
        if (data.result._body == "The ConnectionString property has not been initialized.") {
          this.router.navigate(['/login', this.router.url])

        }

      }
    })
  }

  RangeList: any[] = []
  LoadRangeQty(value) {
    ////console.log("checkRangeValue", value)
    this.RangeList = value;
    this.RangeQtyClose();
  }
  ChangeType(value){
   
    this.validateRows(value);
  }
  validateRows(value){
    
    ////console.log("CheckChangeValue",value);
    if(value.DESCA==null){
      alert("Please add particulars");
      return;
    }
    if(value.DisRate==null){
      alert("Please add Discount");
      return;
    }
    
    if(value.DiscountRateType==null){
    alert("Please choose Discount Type");
    return;
    }
    this.addRow();
    var nextindex = this.activerowIndex + 1;
    var elmnt = document.getElementById("sno" + this.activerowIndex);
    setTimeout(() => {
      if (document.getElementById('menucode' + nextindex) != null) {
        document.getElementById('menucode' + nextindex).focus();
      }
    }, 500);
    
  }
  TypeTab(i,value) {
    this.validateRows(value);
   
  }
  clickMcode(i){
    this.ItemkeyEvent(i);
  }
  clickCategory(i){
    this.CatkeyEvent(i);
  }
}