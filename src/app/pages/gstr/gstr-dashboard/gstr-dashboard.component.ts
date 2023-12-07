import { Component } from '@angular/core';
import { GstrService } from '../gstr.service';
import { CacheService } from '../../../common/services/permission/cacheService.service';

@Component({
    selector: 'gstr-dashboard',
    template: `
    <gstr-card *ngIf="this._gstrService.gstMain.listOfCard" [cardList]="this._gstrService.gstMain.listOfCard"></gstr-card>
    `,
})

export class GstrDashBoardComponent {
    constructor(private _gstrService: GstrService, private _cacheService: CacheService) {
        this._gstrService.gstMain.isGstReport=false
        this._gstrService.gstMain.isGstSubReport=false
        this._gstrService.getGstType().subscribe((res) => {
            this._gstrService.gstMain.listOfCard = res.result
        })

    }
}

