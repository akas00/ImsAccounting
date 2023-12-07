import { Injector, OnInit, HostListener } from "@angular/core";
import { AppComponentBase } from "./app-component-base";

export class PagedResultDto {
  items: any[];
  totalCount: number;
}

export class EntityDto {
  id: number;
}

export class PagedRequestDto {
  skipCount: number;
  maxResultCount: number;
}

export abstract class PagedListingComponentBase extends AppComponentBase
  implements OnInit {
  public pageSize: number = 10;
  public pageNumber: number = 1;
  public totalPages: number = 1;
  public totalItems: number;
  public gridSummary: string;
  public isTableLoading = false;

  filterValue: string = "";
  filterOption: string = ""; 

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  refreshPage() {
    this.pageNumber = 1;
    this.totalPages = 1;
  }

  refresh(): void {
    this.getData();
  }

  onPageChange(value) {
    this.pageNumber = value ? value : 1;
    this.refresh();
  }

  getFilterOption(url: string): string {
    let filter = [];
    if (
      this.filterOption == null ||
      this.filterOption == undefined ||
      this.filterOption == ""
    )
      return url;
    if (
      this.filterValue == null ||
      this.filterValue == undefined ||
      this.filterValue == ""
    )
      return url;
    filter.push({ Field: this.filterOption, Value: this.filterValue });
    return `${url}&filters=${JSON.stringify(filter)}`;
  }

  abstract getData();

  calculateTotalPages(){
    this.totalPages = Math.ceil(this.totalItems / this.pageSize); 
  }
}
