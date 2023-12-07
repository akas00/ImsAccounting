import { Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { GlobalState } from '../../global.state';
import { Router, Routes } from '@angular/router';
import { MasterRepo } from "../../common/repositories/index";
import { Subscription } from "rxjs/Subscription";
import { AlertService } from '../../common/services/alert/alert.service';
import { BaMenuService } from '../../theme/services/baMenu/baMenu.service';
import * as chartJs from 'chart.js';
// import chartJs from 'chart.js';
import { AuthService } from '../../common/services/permission/authService.service';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const window: any;
@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnDestroy {
  subsriptionArray:Subscription[]=[];
  Currdate: string;
  totalIncome: number = 0;
  totalexpenses: number = 0;
  netsalesamount: number = 0;
  salesamount: number = 0;
  salesreturnamount: number = 0;

  stockGraph: boolean = false;
  barGraph: boolean = false;

  cashinhand: number = 0;
  cashatbank: number = 0;
  receipt: number = 0;
  payment: number = 0;
  receivable: number = 0;
  payable: number = 0;
  netvat: number = 0;
  vatpayable: number = 0;
  vatreceivable: number = 0;
  debtorsValue: any;
  debtorsValuewithoutcomms: any;
  creditorsValue: number;
  receivepaymentLabels: string[];
  salespurchaselabels: string[];
  stockvalue: any;

  userProfile: any = {} as any;
  userSetting: any = {} as any;



  test: any;
  stockdataArray: any;
  incomeexpensereportmode: number = 0;
  receivepayementreportmode: number = 0;
  expensesreportmode: number = 0;
  reportmode: number = 0;

  ctx: any;
  ctx2: any;
  ctx3: any;
  ctx4: any;

  fiscalForm: FormGroup = new FormGroup({
    StartDate_AD: new FormControl("", [Validators.required]),
    EndDate_AD: new FormControl("", [Validators.required]),
    FiscalID: new FormControl("", [Validators.required])
  })
  StartDate_BS: any;
  EndDate_BS: any;
  private subcriptions: Array<Subscription> = [];

  public inputValue: string;
  canvas: any;
  canvas2: any;
  canvas3: any;
  canvas4: any;
  str: any;
  showDashboard: number;

  @ViewChild('line') line: any;
  // @ViewChild('donutchart') donutchart: any;
  @ViewChild('bar') bar: any;
  @ViewChild('chart4') chart4: any;
  constructor(private state: GlobalState, private router: Router,
    public masterService: MasterRepo,
    private alertService: AlertService,
    public authService: AuthService,) {
    const today = new Date();
    this.Currdate = moment(today).format('YYYY-MM-DD');
    this.userProfile = authService.getUserProfile();
    this.userSetting = authService.getSetting();
  
    this.userProfile = this.authService.getUserProfile();
    let dashboardright = this.userProfile.userRights.find(x=> x.right == "ShowDashboard");
    this.showDashboard = dashboardright ? dashboardright.value : 0;


    if(this.showDashboard==1){
      this.getoverallchartapidata();

    }
  }


  IncomeExpensesAccounting() {
    if (this.incomeexpensereportmode) {
      this.incomeexpensereportmode = 1;
    } else {
      this.incomeexpensereportmode = 0;
    }

    this.masterService.getIncomeExpensesAccounting(this.Currdate, this.userProfile.userDivision, this.userProfile.PhiscalYearInfo.PhiscalID, this.incomeexpensereportmode).subscribe((data: any) => {
      // console.log('incomeexpenses', data);
      let fordatelabels = data[0];
      //  this.receivepayment= data[0].2022-06-18;

      // console.log('purchasedatevalue', data);
      this.salespurchaselabels = [];
      for (var attribute in fordatelabels) {
        if (['A'].indexOf(attribute) == -1) {
          this.salespurchaselabels.push(attribute);
        }

      }

      let dataset: linechart[] = []
      for (var datavalue of data) {
        let tempsalpurData: linechart = <linechart>{}
        tempsalpurData.data = [];
        tempsalpurData.backgroundColor = [];
        tempsalpurData.fill = true;

        // tempsalpurData.borderColor = [];
        let bgcolor: any = ['#00ACED'];
        // console.log('tempsalpurData.backgroundColor', tempsalpurData.backgroundColor);
        if (datavalue.A == 'INCOMEAMOUNT') {
          bgcolor = '#E06DDE'
        }
        else {
          bgcolor = '#00ACED'

        }
        if (datavalue.A == "INCOMEAMOUNT") {
          bgcolor = '#E06DDE'
        }
        else {
          bgcolor = '#00ACED'

        }
        tempsalpurData.backgroundColor.push(bgcolor);
        tempsalpurData.label = datavalue.A;
        for (var attri in datavalue) {
          if (['A'].indexOf(attri) == -1) {
            // console.log("attri", attri, parseFloat(datavalue[attri]));
            let num: number = parseFloat(datavalue[attri]);
            // console.log("num", num)
            tempsalpurData.data.push(num);


            // let bgcolors: any = ['#00ACED'];
            // console.log('tempsalpurData.backgroundColor', tempsalpurData.backgroundColor);
            // if (datavalue.A == 'net sales') {
            //   bgcolors = '#E06DDE'
            // }
            // else {
            //   bgcolors = '#00ACED'

            // }
            // if (datavalue.A == 'purchase qty') {
            //   bgcolor = '#E06DDE'
            // }
            // tempsalpurData.backgroundColor.push(bgcolors);

          }
        }
        // console.log("TEMP DATA", tempsalpurData);

        dataset.push(tempsalpurData);

      }





      if (window.myCharts3 != undefined)
        window.myCharts3.destroy();
      window.myCharts3 = new chartJs(this.ctx, {
        type: 'line',
        data: {
          datasets: dataset,
          labels: this.salespurchaselabels

        },

      });


    });
  }

  // getDashboardexpensesforchart() {
  //   this.masterService.getDashboardexpensesforchart(this.Currdate, this.userProfile.userDivision, this.userProfile.PhiscalYearInfo.PhiscalID, this.expensesreportmode).subscribe((data: any) => {
  //     console.log('Indirectexpenses', data);
  //     let keysList = (Object.keys(data[0]));


  //     let keysss = [];

  //     Object.keys(data[0]).forEach(function (key, index) {
  //       var value = data[0][key];
  //       keysss.push(value);

  //       console.log('keyesvalues', keysss)
  //     });

  //     let i: any;

  //     const backgroundColor = [];
  //     for (i = 0; i < keysList.length; i++) {
  //       const r = Math.floor(Math.random() * 255);
  //       const g = Math.floor(Math.random() * 255);
  //       const b = Math.floor(Math.random() * 255);
  //       backgroundColor.push('rgb(' + r + ',' + g + ',' + b + ')');

  //     }


  //     console.log("bg coloe", backgroundColor);

  //     if (window.myCharts != undefined)
  //       window.myCharts.destroy();
  //     window.myCharts = new chartJs(this.ctx2, {
  //       type: 'doughnut',


  //       data: {
  //         labels: keysList,

  //         datasets: [
  //           {
  //             // data: [0, 0, 0],
  //             data: keysss,
  //             backgroundColor: backgroundColor,
  //             fill: true
  //           },
  //         ]
  //       },
  //       options: {

  //         tooltips: {
  //           enabled: true
  //         },

  //         animation: {
  //           onComplete: function (animation) {
  //             var firstSet = animation.chart.config.data.datasets[0].data,
  //               dataSum = firstSet.reduce((accumulator, currentValue) => accumulator + currentValue);

  //             if (typeof firstSet !== "object" || dataSum === 0) {
  //               document.getElementById('no-data-stock').style.display = 'block';
  //               document.getElementById('chart4').style.display = 'none'
  //             }
  //           }
  //         }
  //       }
  //     });

  //   });

  // }


  getReceivePaymentforchartata() {
    if (this.receivepayementreportmode) {
      this.receivepayementreportmode = 1;
    } else {
      this.receivepayementreportmode = 0;
    }
    this.masterService.getReceivePaymentforchart(this.Currdate, this.userProfile.userDivision, this.userProfile.PhiscalYearInfo.PhiscalID, this.receivepayementreportmode)
      .subscribe((data: any) => {
        // console.log('receivepayment', data);

        let fordatelabels = data[0];
        //  this.receivepayment= data[0].2022-06-18;
        this.receivepaymentLabels = [];
        for (var attribute in fordatelabels) {
          if (['a'].indexOf(attribute) == -1) {
            this.receivepaymentLabels.push(attribute);
          }
        }
        // console.log("datelabelsss", this.receivepaymentLabels);
        let dataset: Barchart[] = []

        for (var datavalue of data) {
          let tempData: Barchart = <Barchart>{}
          tempData.data = [];
          tempData.backgroundColor = []
          tempData.label = datavalue.a;
          for (var attri in datavalue) {
            if (['a'].indexOf(attri) == -1) {
              // console.log("attri", attri, parseFloat(datavalue[attri]));
              let num: number = parseFloat(datavalue[attri]);
              // console.log("num",num)
              tempData.data.push(num);
              let bgcolor = '#00ACED';
              if (datavalue.a == 'Payment Value') {
                bgcolor = '#E06DDE'
              }
              if (datavalue.a == 'PAYMENT') {

                bgcolor = '#E06DDE'
              }

              tempData.backgroundColor.push(bgcolor);
            }
          }
          // console.log("TEMP DATA", tempData);
          dataset.push(tempData);
          // console.log("dataset", dataset);

        }


        //create chart
        if (window.myCharts2 != undefined)
          window.myCharts2.destroy();
        window.myCharts2 = new chartJs(this.ctx3, {
          type: 'bar',




          data: {
            labels: this.receivepaymentLabels,

            datasets: dataset,

          },
        


        });
        
        if((dataset == null || undefined ) ) {
          this.barGraph = true;
        }


      });

   
  }

  dashboardmaindata() {
    this.masterService.getdashboardmaindata(this.Currdate, this.userProfile.userDivision, this.userProfile.PhiscalYearInfo.PhiscalID)
      .subscribe((mainData: any) => {
        // console.log('chartdata', mainData);


        // if (mainData && mainData?.length > 0) {
        this.totalIncome = this.masterService.nullToZeroConverter(mainData[0].TOTALINCOME);
        this.totalexpenses = this.masterService.nullToZeroConverter(mainData[0].TOTALEXPENSES);
        this.netsalesamount = this.masterService.nullToZeroConverter(mainData[0].NETSALESAMOUNT);
        this.salesamount = this.masterService.nullToZeroConverter(mainData[0].SALESAMOUNT);
        this.salesreturnamount = this.masterService.nullToZeroConverter(mainData[0].SALESRETURNAMOUNT);
        this.cashinhand = this.masterService.nullToZeroConverter(mainData[0].CASH);
        this.cashatbank = this.masterService.nullToZeroConverter(mainData[0].BANK);

        this.receipt = this.masterService.nullToZeroConverter(mainData[0].RECEIPT);

        this.payment = this.masterService.nullToZeroConverter(mainData[0].PAYMENT);
        this.receivable = this.masterService.nullToZeroConverter(mainData[0].RECEIVABLE);
        this.payable = this.masterService.nullToZeroConverter(mainData[0].PAYABLE);
        this.netvat = this.masterService.nullToZeroConverter(mainData[0].NETVAT);
        this.vatpayable = this.masterService.nullToZeroConverter(mainData[0].VATPAYABLE);
        this.vatreceivable = this.masterService.nullToZeroConverter(mainData[0].VATRECEIVABLE);


        // }

      })
  }

  getdata() {
    // console.log("get data called here");
    this.masterService.getDetailsforchartjs(this.Currdate, this.userProfile.userDivision, this.userProfile.PhiscalYearInfo.PhiscalID)
    

      .subscribe((data: any) => {
        // console.log('cuuurentdateapi', this.Currdate);
        // console.log('debtors/creatorsdata', data);


       

      
        if (data[0].DEBTORS == null) {
          let notnulldebtors = data[0].DEBTORS;

          let nulltozerodebtors = (notnulldebtors);
          this.debtorsValue = nulltozerodebtors;

        }
        else {
          const myNum1 = +(data[0].DEBTORS.replace(/,/g, ""));
          this.debtorsValue = myNum1;

        }
        if (data[0].CREDITORS == null) {
          let notnullcreditors = data[0].CREDITORS;

          let nulltozerocreditors =(notnullcreditors);
          this.creditorsValue = nulltozerocreditors;

        }
        else {
          const myNum1 = +(data[0].CREDITORS.replace(/,/g, ""));
          this.creditorsValue = myNum1;

        }

        if (window.myCharts != undefined)
        window.myCharts.destroy();
      window.myCharts = new chartJs(this.ctx4, {

     
        // new chartJs(this.ctx4, {
          type: 'pie',

          data: {
            datasets: [{
              label: 'My First Dataset',
              data: [this.debtorsValue, this.creditorsValue],
              // data: [100, 200],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)'

              ],


            }],
            labels: [
              'Debtors',
              'Creditors'

            ],
          },
        
          options: {
           
            // animation: {
            //   onComplete: function (e) {
            //     var firstSet = e.chart.config.data.datasets[0].data,
            //       dataSum = firstSet.reduce((accumulator, currentValue) => accumulator + currentValue);

            //     if (typeof firstSet !== "object" || dataSum === 0) {
            //       document.getElementById('no-data').style.display = 'block';
            //       document.getElementById('chart4').style.display = 'none'
            //     }
            //   }
            // }
          }

        });
        if((this.creditorsValue == 0 || null) && (this.debtorsValue == 0 || null )) {
          this.stockGraph = true;
        }
        else if(data.length ==0){
          this.stockGraph = true;


        }
      
        
      
      });


  }



  getoverallchartapidata() {
    this.getdata();
    this.dashboardmaindata();
    this.getReceivePaymentforchartata();
    // this.getDashboardexpensesforchart();
    this.IncomeExpensesAccounting();
  }

  ngAfterViewInit() {
    if(this.showDashboard==1){
    this.canvas4 = this.chart4.nativeElement;
    this.canvas3 = this.bar.nativeElement;
    // this.canvas2 = this.donutchart.nativeElement;
    this.canvas = this.line.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    // this.ctx2 = this.canvas2.getContext('2d');
    this.ctx3 = this.canvas3.getContext('2d');
    this.ctx4 = this.canvas4.getContext('2d');
    }

  }


  ngOnDestroy(){
    this.subsriptionArray.forEach(sub=>{
      sub.unsubscribe();
    })
  }
  ngOnInit() {
    this.setDefault();
  }
  cancelFiscalForm() {
    this.authService.showfiscalPopup = false;
  }
  setDefault() {
    var abc = this.userProfile.CompanyInfo.PhiscalID;
    var xyz = abc.substring(0, 2);
    var pqr = abc.substring(3, 6);
    var a = ((+xyz) + 1).toString();
    var b = ((+pqr) + 1).toString();
    var phiscalid = a + '/' + b;
    // console.log("@@phiscalid", phiscalid)

    let defaultDate = {
      StartDate_AD: moment(this.userProfile.CompanyInfo.FEDATE).add(1, 'days').format('YYYY-MM-DD'),
      EndDate_AD: moment(this.userProfile.CompanyInfo.FEDATE).add(1, 'year').format('YYYY-MM-DD'),
      FiscalID: phiscalid
    };
    let fiscalYearEndDate= moment(defaultDate.EndDate_AD).format('YYYY');
    let checkLeapYears=this.leapYear(fiscalYearEndDate);
    let newEndDate: any;

    if(checkLeapYears){
      newEndDate=moment(defaultDate.EndDate_AD).subtract(1,`days`).format('YYYY-MM-DD');
      defaultDate.EndDate_AD=newEndDate;
    }

    this.fiscalForm.setValue(defaultDate);
    this.fiscalForm.get('StartDate_AD').disable();
    this.fiscalForm.get('EndDate_AD').disable();
    this.fiscalForm.get('FiscalID').disable();
  }


 leapYear(year):boolean
  {
if(((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)){
  return true;
}else{
  return false;
}
  }
  onSubmit() {
    // console.log("@@this.fiscalForm.value.StartDate_AD", this.fiscalForm.value.StartDate_AD)
    this.changeEntryDate(this.fiscalForm.value.StartDate_AD, 'AD');
    this.changeEndDate(this.fiscalForm.value.EndDate_AD, 'AD');
    // console.log("@@StartDate_BS", this.StartDate_BS)
    // console.log("@@EndDate_BS", this.EndDate_BS)

    try {
      let saveModel = Object.assign(<FiscalData>{}, this.fiscalForm.value);
      let sub = this.masterService.saveFiscalYear(saveModel, this.StartDate_BS, this.EndDate_BS).subscribe(
        data => {
          if (data.status == "ok") {
            this.alertService.success("Fiscal Year Data Saved Successfully");
            this.authService.showfiscalPopup = false;
          } else {
            this.alertService.error(
              "Error in Saving Data:" + data.result._body
            );
          }
        },
        error => {
          this.alertService.error(error);
        }
      );
      this.subcriptions.push(sub);
    } catch (e) {
      this.alertService.error(e);
    }
  }

  changeEntryDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.StartDate_BS = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;

    }
  }

  changeEndDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("-", "/")).replace("-", "/");
      var bsDate = adbs.ad2bs(adDate);
      this.EndDate_BS = (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day) + '/' + bsDate.en.month + '/' + bsDate.en.year;

    }
  }

}
export interface Barchart {
  label: string,
  backgroundColor: any[],
  data: any[],
}

export interface linechart {
  label: string,
  backgroundColor: any[],
  data: any[],
  fill: boolean,
  fillColor: any,
}
export interface FiscalData {
  StartDate_AD: Date;
  EndDate_AD: Date;
  FiscalID: Date;
}

