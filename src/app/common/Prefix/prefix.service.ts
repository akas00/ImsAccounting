import { Injectable } from '@angular/core'
import { PREFIX } from '../interfaces/Prefix.interface';
import { Http } from "@angular/http";
import { MasterRepo } from "../repositories/masterRepo.service";
import { VoucherTypeEnum } from "../interfaces/index";
import { Observable } from "rxjs/Observable";

@Injectable()
export class PrefixService {
  vlist: any[] = [];
  vlistObservable: Observable<any[]>;
  constructor(private http: Http, private masterService: MasterRepo) {

  }
  getVoucherType(voucherType: VoucherTypeEnum) {
    if (this.vlist.length > 0) {
      return Observable.of(this.vlist);
    }
    else if (this.vlistObservable) {
      return this.vlistObservable;
    }
    else {

      this.vlistObservable = this.http.post(this.masterService.apiUrl + '/getVoucherTypeList', { voucherType: voucherType }, this.masterService.getRequestOption())
        .flatMap(res => {
          return res.json() || []
        })
        .map(data => {
          this.vlistObservable = null;
          this.vlist.push(data)
          return this.vlist;
        }).share();
      return this.vlistObservable;
    }
  }
}

