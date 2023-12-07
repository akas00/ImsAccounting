import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { IRateGroup, IDivision } from "../interfaces/commonInterface.interface";
import { ReplaySubject } from 'rxjs/ReplaySubject'

@Injectable()
export class MockMasterRepo {
    public _rateGroups: Array<IRateGroup> = [];
    public _divisions: Array<IDivision> = []
    public subjectDivision: ReplaySubject<Array<IDivision>> = new ReplaySubject<Array<IDivision>>(1);
    constructor() {

    }
    public getRateGroups(): Array<IRateGroup> {
        if (this._rateGroups.length == 0) {
            this._rateGroups = [
                { rid: 1, description: "Premium Gold", shortName: "Premium" },
                { rid: 2, description: "Lower Zone", shortName: "Lower" }
            ];
        }
        return this._rateGroups;
    }

    public getDivisions(): Promise<Array<IDivision>> {
        let self: MockMasterRepo = this;
        if (this._divisions.length == 0) {
            let div: IDivision = <IDivision>{};
            div.INITIAL = "MMX"; div.NAME = "Head Office"; div.RATEGROUPID = 1; div.REMARKS = "";
            div.rateGroup = { rid: 1, description: "Premium Gold", shortName: "Premium" };
            this._divisions.push(div);
            for (var i = 0; i < 15000; i++) {
                let div: IDivision = <IDivision>{};
                div.INITIAL = "MMX" + i; div.NAME = "Head Office" +i; div.RATEGROUPID = 1; div.REMARKS = "";
                div.rateGroup = { rid: 1, description: "Premium Gold", shortName: "Premium" };
                this._divisions.push(div);

            }
            let div2: IDivision = <IDivision>{};
            div2.INITIAL = "MMY"; div2.NAME = "Branch Office"; div2.RATEGROUPID = 1; div2.REMARKS = "";
            div.rateGroup = { rid: 2, description: "Lower Zone", shortName: "Lower" };
            this._divisions.push(div2);

        }
        this.subjectDivision.next(this._divisions);
        return new Promise<any>((resolve, reject) => {
            setTimeout(function () {
                resolve(self._divisions)
            }, 2000);
        }

        )

    }


}