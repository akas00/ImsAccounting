import {
  Component,
  Input,
  Output,
  EventEmitter,
  Injector,
  HostListener,
  OnChanges,
  ElementRef,
  ViewChild
} from "@angular/core";
import { PagedListingComponentBase } from "../../../paged-list-component-base";
import { MasterRepo } from "../../repositories";

@Component({
  selector: "generic-popup-grid",
  templateUrl: "./generic-popup-grid.component.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class GenericPopUpComponent extends PagedListingComponentBase
  implements OnChanges {
  /** List Declaration  */

  requestUrl: string = "";

  isActive: boolean = false;
  itemList: any[] = [];
  selectedRowIndex: number = 0;
  tabindex: string = "list";

  //for transaction filter
  billTo: string = "";
  isForCancelOrder: boolean = false;
  tag: string = "";

  three:number = 3;
  /** Output  */

  @Output() onPopUpClose = new EventEmitter();
  @Output() onItemDoubleClick = new EventEmitter();

  /** Input  */

  @Input() popupsettings: GenericPopUpSettings;
  @Input() summary: string;
  @ViewChild('inputBox') inputBox: ElementRef
  constructor(public injector: Injector, private masterService: MasterRepo) {
    super(injector);
    this.masterService.ItemList_Available = '0';
  }

  show(billTo: string = "", isForCancelOrder: boolean = false, tag: string = "") {
    setTimeout(() => {
      this.inputBox.nativeElement.focus()
    }, 10);
    this.summary = null;
    this.billTo = billTo;
    this.isForCancelOrder = isForCancelOrder;
    this.itemList = [];
    this.isActive = true;
    this.selectedRowIndex = 0;
    this.tag = tag;

  
    setTimeout(() => {
      this.setFilterOption();
      this.refreshPage();
      this.refresh();
    }, 100)
  }

  setFilterOption() {
    if (this.popupsettings && this.popupsettings.columns.length) {
      let filterIndex = this.popupsettings.defaultFilterIndex ? this.popupsettings.defaultFilterIndex : 0;
      if (this.popupsettings.columns.length <= filterIndex) return;

      this.filterValue = "";
      this.filterOption = this.popupsettings.columns[filterIndex].key;
    }
  }

  getData() {
    this.summary = null;
    this.selectedRowIndex = 0;

    let apiEndpoints = this.popupsettings.apiEndpoints;
    let apiUrl = `${this.apiUrl}${apiEndpoints}?currentPage=${
      this.pageNumber
      }&maxResultCount=${this.pageSize}`;

    if (this.billTo && this.billTo != "" && this.billTo != null && this.billTo != undefined) {
      apiUrl = apiUrl + `&billTo=${this.billTo}`;
    }
    if (this.tag && this.tag != "" && this.tag != null && this.isTableLoading != undefined) {
      apiUrl = apiUrl + `&tag=${this.tag}`;
    }
    if (this.isForCancelOrder) {
      apiUrl = apiUrl + `&isForCancelOrder=${this.isForCancelOrder}`;
    }

    this.requestUrl = this.getFilterOption(apiUrl);

    return this._http
      .get(this.requestUrl, this.masterService.getRequestOption())
      .map(res => res.json() || [])
      .subscribe(res => {
        this.totalItems = res ? res.totalCount : 0;
        this.itemList = res ? res.data : [];

        ////console.log("itemList",this.itemList);
        if(this.itemList.length > 0){
          this.masterService.ItemList_Available = '1';
        }else{
          this.masterService.ItemList_Available = '0';
        }
        ////console.log("this.masterService.ItemList_Available",this.masterService.ItemList_Available);

        this.itemList.forEach(function (item) {
          if (item.TRNDATE != null && item.TRNDATE != undefined) {
            item.TRNDATE = item.TRNDATE.toString().substring(0, 10);
          }
          if (item.DATE != null && item.DATE != undefined) {
            item.DATE = item.DATE.toString().substring(0, 10);
          }
        });
        if (this.itemList[this.selectedRowIndex] != null) {
          this.itemList[this.selectedRowIndex].itemSummary;
        }

        if (
          this.itemList.length > 0 &&
          this.selectedRowIndex == 0 &&
          this.itemList[this.selectedRowIndex].itemSummary
        ) {
          this.summary = this.itemList[this.selectedRowIndex].itemSummary;
        }
      });
  }

  hide() {
    this.itemList = [];
    this.pageNumber = 1;
    this.totalItems = 0;
    this.isActive = false;
  }

  triggerSearch() {
    if (
      this.filterOption == null ||
      this.filterOption == undefined ||
      this.filterOption == ""
    )
      return;
    if (
      this.filterValue == null ||
      this.filterValue == undefined ||
      this.filterValue == ""
    )
      return;

    this.refreshPage();
    this.refresh();
  }

  singleClick(index) {
    this.selectedRowIndex = index;
    this.summary = this.itemList[index].itemSummary;
  }

  doubleClick($event) {
    this.onItemDoubleClick.emit($event);
    this.hide();
  }


  conditionalStyle(){
    let style:any;
  
    for(let item of this.popupsettings.columns){
   
        if(item.title.toUpperCase() == 'AMOUNT'){
          ////console.log("amountstle",);
          style = {'text-align':'right'};
         return style; 
        }
        style = {'text-align': 'left'};
        return style;
    }
  }

  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) {
    if (!this.isActive) return true;
    if ($event.code == "ArrowDown") {
      $event.preventDefault();
      this.selectedRowIndex++;
      if (this.itemList[this.selectedRowIndex] != null) {
        this.summary = this.itemList[this.selectedRowIndex].itemSummary;
      }
      this.calculateTotalPages();
      if (
        this.selectedRowIndex == this.itemList.length &&
        this.pageNumber < this.totalPages
      ) {
        this.pageNumber = this.pageNumber + 1;
        this.refresh();
        this.selectedRowIndex = 0;
        this.itemListClosed();
      } else if (
        this.selectedRowIndex == this.itemList.length &&
        this.pageNumber == this.totalPages
      ) {
        this.selectedRowIndex = this.itemList.length - 1;
      }
    } else if ($event.code == "ArrowUp") {
      $event.preventDefault();
      this.selectedRowIndex--;
      if (this.itemList[this.selectedRowIndex] != null) {
        this.summary = this.itemList[this.selectedRowIndex].itemSummary;
      }
      if (this.selectedRowIndex == -1 && this.pageNumber > 1) {
        this.pageNumber = this.pageNumber - 1;
        this.refresh();
        this.selectedRowIndex = this.itemList.length - 1;
        this.itemListClosed();
      } else if (this.selectedRowIndex == -1 && this.pageNumber == 1) {
        this.selectedRowIndex = 0;
      }
    } 
    else if (
      $event.code == "Enter" &&
      this.selectedRowIndex >= 0 &&
      this.selectedRowIndex < this.itemList.length
    ) {
     
      ////console.log("I am here")
      $event.preventDefault();
      if (this.filterOption == "BARCODE") { }
      else {
        this.onItemDoubleClick.emit(this.itemList[this.selectedRowIndex]);
        this.hide();
        this.itemListClosed();
      }
    } 
    else if ($event.code == "Escape") {
      $event.preventDefault();
      this.hide();
      this.itemListClosed();
    } else if ($event.code == "ArrowRight") {
      $event.preventDefault();
      this.calculateTotalPages();
      if (this.pageNumber >= this.totalPages) {
        this.pageNumber = this.totalPages;
        return;
      }

      this.selectedRowIndex = 0;
      this.pageNumber = this.pageNumber + 1;
      this.refresh();
    } else if ($event.code == "ArrowLeft") {
      $event.preventDefault();
      if (this.pageNumber <= 1) {
        this.pageNumber = 1;
        return;
      }
      this.selectedRowIndex = 0;
      this.pageNumber = this.pageNumber - 1;
      this.refresh();

    }
  }

  itemListClosed() {
    this.onPopUpClose.emit();
  }

  ngOnChanges(changes: any) {
    this.popupsettings = changes.popupsettings.currentValue;

    ////console.log("poppup column setting",this.popupsettings);
  }
}

export class GenericPopUpSettings {
  title: string;
  apiEndpoints: string;
  columns: ColumnSettings[] = [];
  defaultFilterIndex: number = 0;
}

export class ColumnSettings {
  key: string;
  title: string;
  hidden: boolean = false;
  noSearch: boolean = false;

}

export function debounce(delay: number): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    const original = descriptor.value;
    const key = `__timeout__${propertyKey}`;

    descriptor.value = function (...args) {
      clearTimeout(this[key]);
      this[key] = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}
