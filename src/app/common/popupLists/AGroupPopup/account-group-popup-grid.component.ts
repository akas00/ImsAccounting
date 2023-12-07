import {
  Component,
  Input,
  Output,
  EventEmitter,
  Injector,
  HostListener
} from "@angular/core";
import { PagedListingComponentBase } from "../../../paged-list-component-base";
import { MasterRepo } from "../../repositories";
import { GenericPopUpSettings } from "../generic-grid/generic-popup-grid.component";
import { PLedgerservice } from "../../../pages/masters/components/PLedger/PLedger.service";

@Component({
  selector: "account-group-popup-grid",
  templateUrl: "./account-group-popup-grid.component.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class AccountGroupPopUpComponent extends PagedListingComponentBase {
  /** List Declaration  */

  isActive: boolean = false;
  itemList: any[] = [];
  selectedRowIndex: number = 0;
  tabindex: string = "list";

  /** Output  */

  @Output() onPopUpClose = new EventEmitter();
  @Output() onItemDoubleClick = new EventEmitter();
  @Input() Prefix: string;
  /** Input  */

  popupsettings: GenericPopUpSettings;

  constructor(
    public injector: Injector,
    private masterService: MasterRepo,
    private _Ledgerservice: PLedgerservice
  ) {
    super(injector);
    this.popupsettings = {
      title: "Account Groups",
      apiEndpoints: `/getAccountItem/`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "ACNAME",
          title: "Account Name",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACID",
          title: "CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "PARENT",
          title: "PARENT",
          hidden: false,
          noSearch: false
        }
      ]
    };

  }

  show(currentItem: any = <any>{}) {
    // this.popupsettings.apiEndpoints=`/getAccountItem/${this.Prefix}`,
    this.isActive = true;
    this.selectedRowIndex = 0;
    if (this.itemList.length > 0) return;
    this.refreshPage();
    this.refresh();
  }

  getData() {
    if (this.Prefix == '') { alert("Please select MainGroup first!"); return }

    this.selectedRowIndex = 0;
    if (this.itemList.length) { return }
    this._Ledgerservice.getAccountLedgerItem(this.Prefix).subscribe(res => {
      if (res.status == "ok") {
        this.itemList = res.result.length > 0 ? res.result.filter(x => x.TYPE == "G") : [];
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
  }

  doubleClick($event) {
    this.onItemDoubleClick.emit($event);
    this.hide();
  }

  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) {
    if (
      $event.code == "ArrowDown" &&
      this.selectedRowIndex < this.pageSize - 1
    ) {
      $event.preventDefault();
      this.selectedRowIndex++;
    }
    else if ($event.code == "ArrowDown") {
      $event.preventDefault();
      this.selectedRowIndex = 0;
      this.pageNumber = this.pageNumber + 1;
    }
    else if ($event.code == "ArrowUp" && this.selectedRowIndex - 1 > -1) {
      $event.preventDefault();
      this.selectedRowIndex--;
    }
    else if ($event.code == "ArrowUp") {
      $event.preventDefault();
      this.selectedRowIndex = 0;
      this.pageNumber = this.pageNumber > 0 ? this.pageNumber - 1 : this.pageNumber
    }
    else if (
      $event.code == "Enter" &&
      this.selectedRowIndex >= 0 &&
      this.selectedRowIndex < this.itemList.length - 1
    ) {
      $event.preventDefault();

      let itemIndex = ((this.pageNumber - 1) * this.pageSize) + (this.selectedRowIndex)
      this.onItemDoubleClick.emit(this.itemList[this.selectedRowIndex]);
      this.hide();
      this.itemListClosed();
    }
  }

  itemListClosed() {
    this.onPopUpClose.emit();
  }
}
