import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventListenerService {
 
    public reportObject = new Subject<{}>();
    public onreportObjectChange = this.reportObject.asObservable();
    public updateReportObject(data: any) {
        this.reportObject.next(data);
    }

    
}