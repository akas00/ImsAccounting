import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject';
import { TrnMain } from "./../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/index";

@Injectable()

export class poatdirectoryService {
  constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private masterService: MasterRepo) {
  }

  getVoucher(Initial: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: 'query', data: { VCHRNO: Initial } };
    this.http.post(this.masterService.apiUrl + '/getExpensesVoucher', bodyData, this.getRequestOption())
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
    /* return this.http.get("/rategroups.json").toPromise()
         .then((res) => res.json());*/


  }

  private getRequestOption() {
    let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
    return new RequestOptions({ headers: headers });
  }

  saveVoucher(mode: string, guid: string, transaction: TrnMain) {
    let res = { status: "error", result: "" }
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
    let op: RequestOptions = new RequestOptions()
    let bodyData = { mode: mode, guid: guid, data: transaction };
    this.http.post(this.masterService.apiUrl + "/saveTransaction", bodyData, this.getRequestOption())
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
}
