import { Injectable } from '@angular/core'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { IDivision } from "../../../../common/interfaces/commonInterface.interface";
import {Headers, Http,  RequestOptions} from '@angular/http';
import { AuthService } from "../../../../common/services/permission/index";
import { GlobalState } from "../../../../global.state";
@Injectable()
export class PurchaseInvoiceService {
    constructor(private http: Http, private authService: AuthService, private state: GlobalState){
        
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        //console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }

    getPurchaseList(){
        
    }

    getDNList() {
        return [{ VCHRNO: 'DN1', DIVISION: 'MMX', TRNAC: 'Investment Bank',PhiscalId:'2016' },
            { VCHRNO: 'DN2', DIVISION: 'MMX', TRNAC: 'Citizen Bank', PhiscalId: '2016' },
            { VCHRNO: 'DN3', DIVISION: 'AAX', TRNAC: 'My Bank', PhiscalId: '2016' }];
    }
    getAccountList(){
        return[
       {ACID:'A1',ACCODE:'AA1',ACNAME:'Account1',HASSUBLEDGER:0},
        {ACID:'B1',ACCODE:'BB1',ACNAME:'Account2',HASSUBLEDGER:0},
        {ACID:'C1',ACCODE:'CC1',ACNAME:'Account3',HASSUBLEDGER:1},
        {ACID:'D1',ACCODE:'DD1',ACNAME:'Account4',HASSUBLEDGER:1},
        {ACID:'E1',ACCODE:'EE1',ACNAME:'Account5',HASSUBLEDGER:1}];
    }
    getSubledgerList(){
        return[{ACID:'Ram1',ACCODE:'Ram1',ACNAME:'Ram1'},
        {ACID:'Ram2',ACCODE:'Ram2',ACNAME:'Ram2'},
        {ACID:'Ram3',ACCODE:'Ram3',ACNAME:'Ram3'}];
    }
     getProductList() {
        return [
            {
                MCODE: 'A1',
                MENUCODE: 'A11',
                DESCA: 'Apple',
                BARCODE: '123123',
                RATE: 45,
                PRATE: 40,
                UNIT: 'PC',
                ISVAT: 0,
                ISSERVICECHARGE: 0,
                QUANTITY:0
            },
            {
                MCODE: 'B1',
                MENUCODE: 'B11',
                DESCA: 'Ball',
                BARCODE: 'B1111',
                RATE: 35,
                PRATE: 30,
                UNIT: 'PC',
                ISVAT: 0,
                ISSERVICECHARGE: 0,
                QUANTITY: 0
            },
            {
                MCODE: 'C1',
                MENUCODE: 'C11',
                DESCA: 'Cat',
                BARCODE: 'C432',
                RATE: 25,
                PRATE: 20,
                UNIT: 'PC',
                ISVAT: 0,
                ISSERVICECHARGE: 0,
                QUANTITY: 0
            }];
    }

    getSelectedItem(Mcode) {
       var aa= 
            {
                MCODE: Mcode,
                MENUCODE: 'A11',
                DESCA: 'Apple',
                BARCODE: '123123',
                RATE: 45,
                PRATE: 40,
                UNIT: 'PC',
                ISVAT: 0,
                ISSERVICECHARGE: 0,
                QUANTITY: 0
            }
       return aa;
    }
}