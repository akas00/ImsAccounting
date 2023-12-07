import { Injectable } from '@angular/core'

@Injectable()
export class JournalVoucherService {
    journalList = [
        {
        id: 1,
        vchrNo: 'JV001',
        chalanNo: '1001',
        },
        {
        id: 2,
        vchrNo: 'JV002',
        chalanNo: '1002',
        },
        {
        id: 3,
        vchrNo: 'JV003',
        chalanNo: '1003',
        },
        {
        id: 4,
        vchrNo: 'JV004',
        chalanNo: '1004',
        },
        {
        id: 5,
        vchrNo: 'JV005',
        chalanNo: '1005',
        },
        {
        id: 6,
        vchrNo: 'JV006',
        chalanNo: '1006',
        },
        {
        id: 7,
        vchrNo: 'JV007',
        chalanNo: '1007',
        },
        {
        id: 8,
        vchrNo: 'JV008',
        chalanNo: '1008',
        },
        {
        id: 9,
        vchrNo: 'JV009',
        chalanNo: '1009',
        },
        {
        id: 10,
        vchrNo: 'JV010',
        chalanNo: '1010',
        },
        {
        id: 11,
        vchrNo: 'JV011',
        chalanNo: '1011',
        },
        {
        id: 12,
        vchrNo: 'JV012',
        chalanNo: '1012',
        },
        
    ]
    getData(): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(this.journalList);
        }, 500);
        });
    }
    
}