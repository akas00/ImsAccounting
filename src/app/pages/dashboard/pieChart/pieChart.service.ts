import {Injectable} from '@angular/core';
import {BaThemeConfigProvider, colorHelper} from '../../../theme';

@Injectable()
export class PieChartService {

  constructor(private _baConfig:BaThemeConfigProvider) {
  }

  getData() {
    let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;
    let redCOlor = '#FC0303'
    let colorgreen = '#79EC7D'
    return [
      {
        color: pieColor,
        description: 'Meals and Entertainment',
        stats: 'Rs 1,20,000',
        // icon: 'person',
      }, {
        color: colorgreen,
        description: 'Rent & Mortgage',
        stats: 'Rs 30000',
        // icon: 'money',
      }, {
        color: pieColor,
        description: 'Automotive',
        stats: 'Rs 30000',
        // icon: 'face',
      }, {
        color: redCOlor,
        description: 'Travel Expenses',
        stats: ' Rs 32,592',
        // icon: 'refresh',
      }
    ];
  }
}
