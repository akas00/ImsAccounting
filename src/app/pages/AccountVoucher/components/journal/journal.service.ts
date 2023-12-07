import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject';
import { TrnMain } from "./../../../../common/interfaces/TrnMain";

@Injectable()

export class JournalService {
  constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService) {
  }

  private getRequestOption() {
    let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
    return new RequestOptions({ headers: headers });
  }
}
