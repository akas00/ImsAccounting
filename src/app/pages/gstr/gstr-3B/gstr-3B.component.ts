import { Component, OnInit } from '@angular/core';
import { GstrService } from '../gstr.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { CacheService } from '../../../common/services/permission';
import * as moment from 'moment'

@Component({
    selector: 'gstr-3B',
    templateUrl: './gstr-3B.component.html',
})

export class Gstr3BComponent implements OnInit {

    public detailOfOutwaredSupplies:any
    public eligibleTax:any
    public exempted:any
    public lateFeePayable:any
    public interIntraState:any
    public userProfile:any

    constructor(private _cacheService: CacheService, private alertService: AlertService, private _gstrService: GstrService, private _activateRoute: ActivatedRoute, private spinnerService: SpinnerService) {
        if (this._cacheService.get('startDate') == undefined || this._cacheService.get('startDate') == null || this._cacheService.get('startDate') == "" || this._cacheService.get('endDate') == undefined || this._cacheService.get('endDate') == null || this._cacheService.get('endDate') == "") {
            this._gstrService.gstMain.startDate = moment().startOf('month').format('MM-DD-YYYY')
            this._gstrService.gstMain.endDate = moment().endOf('month').set('month', 2).add(1, 'year').format('MM-DD-YYYY')
        }

       this.userProfile= this._cacheService.get('USER_PROFILE')

    }

    ngOnInit(): void {
        if (this._activateRoute.snapshot.url.length == 1) {
            this._gstrService.gstMain.activeGstType = ((this._activateRoute.snapshot.url[0].path)).toUpperCase()
            this.spinnerService.show("Please Wait while data is loaded");
            this._gstrService.getGstSubTypeById(this._gstrService.gstMain.activeGstType).subscribe((res) => {
                this._gstrService.gstMain.detailOfOutwaredSupplies = res.result[0].detailOfOutwardSupplies
                this._gstrService.gstMain.eligibleTax = res.result[0].eligibleTax
                this._gstrService.gstMain.lateFeePayable = res.result[0].lateFeePayable
                this._gstrService.gstMain.exempted = res.result[0].exempted
                this._gstrService.gstMain.interIntraState = res.result[0].interIntraState
                this._gstrService.gstMain.isGstReport = true
                this.spinnerService.hide();
            }, error => {
                this.alertService.error(error)
                this.spinnerService.hide()
            })
        }

    }





}