import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../../../../common/services/permission";
import { Subject } from "rxjs/subject";
import { GlobalState } from "../../../../../app/global.state";
import "rxjs/Rx";

@Injectable()
export class ExcelImportService {
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private state: GlobalState
  ) { }
  private get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    return apiUrl;
  }

  public loadConfig(importName: string) {
    return this.http
      .get(this.apiUrl + `/getConfig/${importName}`, this.getRequestOption())
      .map(response => response.json() || []);
  }

  public downloadConfigCSV(importName: string) {
    return this.http
      .get(this.apiUrl + `/downloadCSV/${importName}`, this.getRequestOption())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `${importName}.csv`
        };
        return data;
      });
  }

  public saveConfig(data: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: "EDIT", data: data };
    this.http
      .post(this.apiUrl + "/saveConfig", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  importConfig(model: any, importName: string) {
    let res = { status: "error", result: "error" };
    let returnSubject: Subject<any> = new Subject();

    this.http
      .post(
        this.apiUrl + `/masterImport/${importName}`,model,
        this.getRequestOptionWithoutContent()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public loadImportErrorList(importName: string) {
    return this.http
      .get(this.apiUrl + `/masterImportErrorList/${importName}`, this.getRequestOption())
      .map(response => response.json() || []);
  }

  public saveCorrectedList(data: any, importName: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: "EDIT", data: data };
    this.http
      .post(
        this.apiUrl + `/masterImportCorrection/${importName}`,
        data,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }


  private getRequestOption() {
    let headers: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: this.authService.getAuth().token
    });
    return new RequestOptions({ headers: headers });
  }

  private getRequestOptionWithoutContent() {
    let headers: Headers = new Headers({
      Authorization: this.authService.getAuth().token
    });
    return new RequestOptions({ headers: headers });
  }
}
