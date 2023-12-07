import { Injectable } from '@angular/core'
import { MockMasterRepo } from '../../../../common/repositories'
import { IDivision } from "../../../../common/interfaces";
@Injectable()
export class AccountServices {
    
  smartTableData = [
    {
      id: 1,
      AccountName: '173848293829',
      AccountCode: 2345,
      AccountType: 'Cash',
     
    },
    {
      id: 2,
      AccountName: '432552342342',
      AccountCode:6436,
      AccountType: 'Bank',
    },
    {
       id: 3,
      AccountName: '777564444232',
      AccountCode: 2323,
      AccountType: 'Bank',
    },
    {
       id: 4,
      AccountName: '086565645334',
      AccountCode: 1323,
      AccountType: 'Cash',
    },
    {
       id: 5,
      AccountName: '645342323111',
      AccountCode: 2345,
      AccountType: 'Cash',
    },
    {
       id: 6,
      AccountName: '234443223523',
      AccountCode: 4233,
      AccountType: 'Cash',
    },
    {
       id: 7,
      AccountName: '53423134546',
      AccountCode: 2434,
      AccountType: 'Bank',
    },
    {
       id: 8,
      AccountName: '234554645344',
      AccountCode: 1244,
      AccountType: 'Cash',
    },
    {
        id: 9,
      AccountName: '345234223432',
      AccountCode: 7644,
      AccountType: 'Cash',
    },
    {
         id: 10,
      AccountName: '234234423421',
      AccountCode: 9776,
      AccountType: 'Bank',
    },
    {
        id: 11,
      AccountName: '231848293734',
      AccountCode: 5342,
      AccountType: 'Bank',
    },
   
  ];
   
    

  metricsTableData = [
    {
      image: 'app/browsers/chrome.svg',
      browser: 'Google Chrome',
      visits: '10,392',
      isVisitsUp: true,
      purchases: '4,214',
      isPurchasesUp: true,
      percent: '45%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/firefox.svg',
      browser: 'Mozilla Firefox',
      visits: '7,873',
      isVisitsUp: true,
      purchases: '3,031',
      isPurchasesUp: false,
      percent: '28%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/ie.svg',
      browser: 'Internet Explorer',
      visits: '5,890',
      isVisitsUp: false,
      purchases: '2,102',
      isPurchasesUp: false,
      percent: '17%',
      isPercentUp: false
    },
    {
      image: 'app/browsers/safari.svg',
      browser: 'Safari',
      visits: '4,001',
      isVisitsUp: false,
      purchases: '1,001',
      isPurchasesUp: false,
      percent: '14%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/opera.svg',
      browser: 'Opera',
      visits: '1,833',
      isVisitsUp: true,
      purchases: '83',
      isPurchasesUp: true,
      percent: '5%',
      isPercentUp: false
    }
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 2000);
    });
  }
}