import {Injectable} from '@angular/core';
import {BaThemeConfigProvider, colorHelper, layoutPaths} from '../../../theme';

@Injectable()
export class LineChartService {

  constructor(private _baConfig:BaThemeConfigProvider) {
  }

  getData() {

    var layoutColors = this._baConfig.get().colors;
    var graphColor = this._baConfig.get().colors.custom.dashboardLineChart;

    return {
      type: 'serial',
      theme: 'blur',
      marginTop: 15,
      marginRight: 10,
      responsive: {
        'enabled': true
      },
      dataProvider: [
  


        { date: new Date(2013, 2), value: 25000, value0: 22000},
        { date: new Date(2013, 3), value: 21000, value0: 25000},
        { date: new Date(2013, 4), value: 24000, value0: 29000},
        { date: new Date(2013, 5), value: 31000, value0: 26000},
        { date: new Date(2013, 6), value: 40000, value0: 25000},
        { date: new Date(2013, 7), value: 37000, value0: 20000},
        { date: new Date(2013, 8), value: 18000, value0: 22000},
        { date: new Date(2013, 9), value: 5000, value0: 26000},
        { date: new Date(2013, 10), value: 40000, value0: 30000},
        { date: new Date(2013, 11), value: 20000, value0: 25000},
        { date: new Date(2014, 0), value: 5000, value0: 13000},

        
      ],
      categoryField: 'date',
      categoryAxis: {
        parseDates: true,
        gridAlpha: 0,
        color: layoutColors.defaultText,
        axisColor: layoutColors.defaultText
      },
      valueAxes: [
        {
          minVerticalGap: 50,
          gridAlpha: 0,
          color: layoutColors.defaultText,
          axisColor: layoutColors.defaultText
        }
      ],
      graphs: [
        {
          id: 'g0',
          bullet: 'none',
          useLineColorForBulletBorder: true,
          lineColor: colorHelper.hexToRgbA(graphColor, 0.4),
          lineThickness: 1,
          negativeLineColor: layoutColors.danger,
          type: 'smoothedLine',
          valueField: 'value0',
          fillAlphas: 1,
          fillColorsField: 'lineColor'
        },
        {
          id: 'g1',
          bullet: 'none',
          useLineColorForBulletBorder: true,
          lineColor: colorHelper.hexToRgbA(graphColor, 0.8),
          lineThickness: 1,
          negativeLineColor: layoutColors.danger,
          type: 'smoothedLine',
          valueField: 'value',
          fillAlphas: 1,
          fillColorsField: 'lineColor'
        }
      ],
      chartCursor: {
        categoryBalloonDateFormat: 'MM YYYY',
        categoryBalloonColor: '#4285F4',
        categoryBalloonAlpha: 0.7,
        cursorAlpha: 0,
        valueLineEnabled: true,
        valueLineBalloonEnabled: true,
        valueLineAlpha: 0.5
      },
      dataDateFormat: 'MM YYYY',
      export: {
        enabled: true
      },
      creditsPosition: 'bottom-right',
      zoomOutButton: {
        backgroundColor: '#fff',
        backgroundAlpha: 0
      },
      zoomOutText: '',
      pathToImages: layoutPaths.images.amChart
    };
  }
}
