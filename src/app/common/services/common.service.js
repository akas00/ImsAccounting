"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var CommonService = (function () {
    function CommonService() {
    }
    CommonService.prototype.getAccountList = function () {
        return [
            {
                acId: 'ac1',
                acName: 'Nepal Investment Bank Ltd.',
                acCode: 'ac-001',
                acType: 'Current',
                mapId: 'mp-001',
                path: 'main',
                hasSubLedger: true,
            },
            {
                acId: 'ac2',
                acName: 'Himalayan Bank Ltd.',
                acCode: 'ac-002',
                acType: 'Current',
                mapId: 'mp-002',
                path: 'main',
                hasSubLedger: false,
            },
            {
                acId: 'ac3',
                acName: 'Mr. Ram Shrestha',
                acCode: 'ac-003',
                acType: 'Current',
                mapId: 'mp-003',
                path: 'main',
                hasSubLedger: true,
            },
            {
                acId: 'ac4',
                acName: 'Mrs. Sita Amatya',
                acCode: 'ac-004',
                acType: 'Fixed',
                mapId: 'mp-004',
                path: 'main',
                hasSubLedger: false,
            },
        ];
    };
    ;
    CommonService.prototype.getDivisionList = function () {
        return [
            {
                initial: 'D1',
                name: 'Division 1'
            },
            {
                initial: 'D2',
                name: 'Division 2'
            },
            {
                initial: 'D3',
                name: 'Division 3'
            },
            {
                initial: 'D4',
                name: 'Division 4'
            }
        ];
    };
    ;
    CommonService.prototype.getCostCenterList = function () {
        return [
            {
                name: 'Cost Center 1'
            },
            {
                name: 'Cost Center 2'
            },
            {
                name: 'Cost Center 3'
            },
            {
                name: 'Cost Center 4'
            }
        ];
    };
    ;
    CommonService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], CommonService);
    return CommonService;
}());
exports.CommonService = CommonService;
//# sourceMappingURL=common.service.js.map