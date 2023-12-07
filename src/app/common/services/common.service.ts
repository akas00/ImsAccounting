import { Injectable } from '@angular/core';

@Injectable()

export class CommonService {
    getAccountList() {
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
        ]
    };

    getDivisionList() {
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
            },
            {
                initial: 'D5',
                name: 'Division 5'
            }
        ]
    };

    getCostCenterList() {
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
        ]
    };

}