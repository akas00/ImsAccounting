import { Component, Output, EventEmitter, Injector } from "@angular/core";
import { PagedListingComponentBase } from "../../../paged-list-component-base";
import { GenericPopUpSettings } from "../generic-grid/generic-popup-grid.component";
import { Headers, RequestOptions } from "@angular/http";
import { NotificationService } from "./notification.service";
import { Router } from "@angular/router";

@Component({
  selector: "notification-popup-grid",
  templateUrl: "./notification-popup-grid.component.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class NotificationPopUpComponent extends PagedListingComponentBase {
  /** List Declaration  */

  isActive: boolean = false;
  itemList: any[] = [];
  selectedRowIndex: number = 0;
  tabindex: string = "list";

  /** Output  */

  @Output() onPopUpClose = new EventEmitter();
  @Output() onItemDoubleClick = new EventEmitter();
  @Output() notificationCountUpdate = new EventEmitter();

  /** Input  */

  popupsettings: GenericPopUpSettings;

  constructor(
    public injector: Injector,
    private notificationService: NotificationService,
    private router: Router
  ) {
    super(injector);
    this.popupsettings = {
      title: "All Notifications",
      apiEndpoints: `/getAllNotificationPagedList`,
      defaultFilterIndex : 0,
      columns: [
        {
          key: "MESSAGE",
          title: "Details",
          hidden: false,
          noSearch: false
        },
        {
          key: "TIMESTAMP",
          title: "Notification At",
          hidden: false,
          noSearch: false
        }
      ]
    };

    this.refreshPage();
    this.refresh();
  }

  show() {
    this.isActive = true;
    this.selectedRowIndex = 0;
  }

  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe(
      result => {
        let count = Number(result) ? Number(result) : 0;
        this.notificationCountUpdate.emit(count);
      },
      error => {
        this.notificationCountUpdate.emit(0);
      }
    );
  }

  markAsRead(item) {
    this.redirectToBestRoute(item);
    if (item.ISSEEN) return;
    this.notificationService
      .markAsRead(item.ID)
      .subscribe(result => {}, error => {});
  }

  redirectToBestRoute(item) {
    let caseString = "";
    let parentNotificationId = 0;
    let status = 0;
    let isDownloaded = 0;
    if (item) {
      caseString = item.TYPE;
      parentNotificationId = item.PARENTNOTIFICATIONID;
      status =
        item.ISAPPROVED ||
        item.ISAPPROVED == null ||
        item.ISAPPROVED == undefined
          ? 0
          : 1;
      isDownloaded =
        item.ISDOWNLOADED ||
        item.ISDOWNLOADED == 0 ||
        item.ISDOWNLOADED == null ||
        item.ISDOWNLOADED == undefined
          ? 0
          : 1;
    }


    switch (caseString) {
      case "PERFORMA": {
        //statements;

        if (
          parentNotificationId == 0 ||
          parentNotificationId == undefined ||
          parentNotificationId == null
        ) {
          //redirect to performa
          this.router.navigate(
            ["/pages/transaction/sales/performa-invoice"],
            {
              queryParams: {
                voucher: item.REFNO,
                status: status,
                downloaded: isDownloaded
              }
            }
          );
        } else {
          this.router.navigate(
            ["/pages/transaction/sales/addsientry"],
            { queryParams: { voucher: item.REFNO, downloaded: isDownloaded } }
          );
          //redirect to sales -- approved
        }
        break;
      }
      case "PURCHASEORDER": {
        //statements;
        if (
          parentNotificationId == 0 ||
          parentNotificationId == undefined ||
          parentNotificationId == null
        ) {
          //redirect to performa
          this.router.navigate(
            ["/pages/transaction/sales/sales-order"],
            {
              queryParams: {
                voucher: item.REFNO,
                status: status,
                downloaded: isDownloaded
              }
            }
          );
        } 
        break;
      }
      case "SALES": {
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }

  getData() {
    this.selectedRowIndex = 0;
    let apiUrl = `${this.apiUrl}${
      this.popupsettings.apiEndpoints
    }?currentPage=${this.pageNumber}&maxResultCount=${this.pageSize}`;
    apiUrl = this.getFilterOption(apiUrl);
    return this._http
      .get(apiUrl, this.getRequestOption())
      .map(res => res.json() || [])
      .subscribe(res => {
        this.totalItems = res ? res.totalCount : 0;
        this.itemList = res ? res.data : [];
        //console.table(this.itemList);
      });
  }

  hide() {
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

  // @HostListener("document : keydown", ["$event"])
  // updown($event: KeyboardEvent) {
  //   if (
  //     $event.code == "ArrowDown" &&
  //     this.selectedRowIndex < this.pageSize - 1
  //   ) {
  //     $event.preventDefault();
  //     this.selectedRowIndex++;
  //   }
  //   else if ($event.code == "ArrowDown") {
  //     $event.preventDefault();
  //     this.selectedRowIndex = 0;
  //     this.pageNumber = this.pageNumber + 1;
  //   }
  //   else if ($event.code == "ArrowUp" && this.selectedRowIndex - 1 > -1) {
  //     $event.preventDefault();
  //     this.selectedRowIndex--;
  //   }
  //   else if ($event.code == "ArrowUp") {
  //     $event.preventDefault();
  //     this.selectedRowIndex = 0;
  //     this.pageNumber = this.pageNumber > 0 ? this.pageNumber -1 : this.pageNumber
  //   }
  //    else if (
  //     $event.code == "Enter" &&
  //     this.selectedRowIndex >= 0 &&
  //     this.selectedRowIndex < this.itemList.length - 1
  //   ) {
  //     $event.preventDefault();

  //     let itemIndex = ((this.pageNumber - 1) * this.pageSize)  + (this.selectedRowIndex)
  //     this.onItemDoubleClick.emit(this.itemList[this.selectedRowIndex]);
  //     this.hide();
  //     this.itemListClosed();
  //   }
  // }

  itemListClosed() {
    this.onPopUpClose.emit();
  }

  public getRequestOption() {
    let token = localStorage.getItem("TOKEN");
    let headers: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: token ? token.replace(/['"]+/g, "") : ""
    });
    return new RequestOptions({ headers: headers });
  }

  toggle() {
    if (this.isActive) {
      this.hide();
    } else {
      this.getNotificationCount();
      this.refresh();
      this.show();
    }
  }
}
