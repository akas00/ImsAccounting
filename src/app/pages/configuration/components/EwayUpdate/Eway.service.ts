import { AuthService } from './../../../../common/services/permission/authService.service';
import { GlobalState } from '../../../../global.state';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Schedule } from "../../../../common/interfaces/Schedule.interface";
import { LedgerNameComponentRep } from '../../../DialogReport/components/AllCommon/ledgerName.component';
@Injectable()
export class EwayService {
  id: any;
  schedule: Array<Schedule>;
  ewayList: EwayArray[] = [];
  selectedTransportObj: EwayArray = <EwayArray>{}
  constructor(private masterRepoService: MasterRepo, private http: Http, private state: GlobalState, private authService: AuthService) {

  }
  create(): void {
    let div: Schedule = <Schedule>{};
    div.DiscountName = 'MYX';
    this.schedule.push(div);
  }

  private get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) { apiUrl = url[0] };
    return apiUrl
  }

  getEwayJson(billno: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: 'query', data: { vchrno: billno } };
    this.http.post(this.apiUrl + '/getEwayJSONBill', bodyData, this.getRequestOption())
      .subscribe(response => {
        let data = response.json();
        if (data.status == 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe();

        }
        else {
          returnSubject.next(data)
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
      );
    return returnSubject;


  }

  getAllTodaysEway() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getAllTodaysEwayBills', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  getEwayFromDateRange(frm, to) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();

    let bodyData = { mode: 'query', data: { from: frm, to: to } };

    this.http.post(this.apiUrl + '/getEwayFromDateRange', bodyData, this.getRequestOption())
      .subscribe(response => {

        let data = response.json();
        if (data.status == 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe();

        }
        else {
          returnSubject.next(data)
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
      );
    return returnSubject;

  }

  public updateEway(ewayList: any[]) {
    let res = { status: "error", result: "" }
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
    let op: RequestOptions = new RequestOptions()
    let bodyData = { data: ewayList };
    this.http.post(this.apiUrl + "/updateEway", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          res.status = "ok";
          res.result = retData.result
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
        else {
          res.status = "error1"; res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      },
        error => {
          res.status = "error2", res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;

  }

  public updateTableRow(tableObj: EwayArray) {
    let res = { status: "error", result: "" }
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
    let op: RequestOptions = new RequestOptions()
    let bodyData = { data: tableObj };
    this.http.post(this.apiUrl + "/updateTableRowData", bodyData, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          res.status = "ok";
          res.result = retData.result
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
        else {
          res.status = "error1"; res.result = retData.result;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      },
        error => {
          res.status = "error2", res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;

  }
  private getRequestOption() {
    let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
    return new RequestOptions({ headers: headers });
  }

  getAllTransporterName() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getAllTransporterName', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

}
export class EwayArray {
  VCHRNO: string;
  Customer: string;
  Counter: string;
  AMOUNT: number;
  Date: string
  TRANSPORTER: string;
  VEHICLENO: string;
  PERSON: string;
  VEHICLENAME: string;
  DRIVERNAME: string;
  DRIVERNO: string;
  TOTALBOX: string;
  MODE: string;
  LRNO: string;
  LRDATE: string;
  EWAYNO: string;
  EWAYCHECK: boolean;
  DISTANCE: number
  TOTALWEIGHT: number;
}
