export class LoadChartModel {

    VoucherNumber: string;
    Vechicleno: string;
    DriverName: string;
    DriverlicNo: string;
    SalesManName: string;
    RouteNo: string;
    SalesVoucher: SalesVoucher[] = [];
  }
  
  export class SalesVoucher {
  
    SalesVoucherNumber: string;
    ClientName: string;
    Address: string;
    Phone: string;
    SalesVoucherItem: SalesVoucherItem[];
  
  }
  
  export class SalesVoucherItem {
  
    SalesVoucherNumber: string;
    ItemCode: string;
    ItemDescription: string;
    Quantity: string;
    BaseUnit: string;
    AltUnit: string;
    Weight: string;
    Amount: string;
  }
  
  