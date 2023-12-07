import { Injectable } from '@angular/core'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { IDivision } from "../../../../common/interfaces/commonInterface.interface";
@Injectable()
export class CompanyService {
    
  smartTableData = [
    {
      INITIAL: '1',
      Name: 'hiralal',
      Address: 'Kirtipur',
      TelA: 4563727,
      TelB:9890467982,
      VAT:283,
      
    },
    {
     INITIAL: '2',
      Name: 'ram',
      Address: 'Balku',
      TelA: 68777887,
      TelB:987983223,
      VAT:121,
    },
    {
      INITIAL: '3',
      Name: 'hiralal',
      Address: 'Kirtipur',
      TelA: 4563727,
      TelB:9890467982,
       VAT:121,
    },
    {
      INITIAL: '4',
      Name: 'ram',
      Address: 'Balku',
      TelA: 68777887,
      TelB:9890467982,
       VAT:121,
    },
    {
      INITIAL: '5',
      Name: 'hiralal',
      Address: 'Balku',
      TelA: 4563727,
      TelB:9890467982,
       VAT:121,
    },
    {
      INITIAL: '6',
      Name: 'ram',
      Address: 'Kirtipur',
      TelA: 68777887,
      TelB:9890467982,
       VAT:121,
    },
    {
       INITIAL: '7',
      Name: 'hiralal',
      Address: 'Balku',
      TelA: 68777887,
      TelB:9890467982,
       VAT:121,
    },
    {
      INITIAL: '8',
      Name: 'ram',
      Address: 'Balku',
      TelA: 4563727,
      TelB:9890467982,
       VAT:121,
    },
    {
      INITIAL: '9',
      Name: 'hiralal',
      Address: 'Kirtipur',
      TelA: 4563727,
      TelB:9890467982,
       VAT:121,
    },
    {
      INITIAL: '10',
      Name: 'ram',
      Address: 'Balku',
      TelA: 68777887,
      TelB:9890467982,
       VAT:121,
    },
    {
      INITIAL: '11',
      Name: 'hiralal',
      Address: 'Kirtipur',
      TelA: 4563727,
      TelB:9890467982,
       VAT:121,
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