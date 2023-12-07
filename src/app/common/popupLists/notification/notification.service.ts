import { Http, RequestOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core"; 
import { Subject } from "rxjs/subject"; 
import { AuthService } from "../../services/permission";
import { GlobalState } from "../../../global.state";
@Injectable()
export class NotificationService {
  constructor(
    private http: Http,
    private authService: AuthService,
    private state: GlobalState
  ) {}

  private get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    return apiUrl;
  }
  getNotificationCount() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject(); 
    this.http
      .get(this.apiUrl + "/getNotificationCount", this.getRequestOption())
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

  public markAsRead(id : number) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject(); 
    this.http
      .get(`${this.apiUrl}/notificationMarkAsRead/${id}`, this.getRequestOption())
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
}
