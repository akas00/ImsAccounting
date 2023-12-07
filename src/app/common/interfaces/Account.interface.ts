import { AccountAutoCalculationInfo } from "./TrnMain";

export interface TAcList {
    SERIAL: number;
    ACID: string;
    ACNAME: string;
    PARENT: string;
    TYPE: string;
    OPBAL: string;
    MAPID: string;
    IsBasicAc: number;
    ADDRESS: string;
    PHONE: string;
    FAX: string;
    EMAIL: string;
    VATNO: string;
    PType: string;
    CRLIMIT: number;
    CRPERIOD: number;
    SALEREF: number;
    ACCODE: string;
    LEVELS: number;
    FLGNEW: number;
    COMMON: number;
    PATH: string;
    INITIAL: string;
    EDATE: Date;
    DISMODE: string;
    MCAT: string;
    HASSUBLEDGER: number;
    RATETYPE: number;
    INVCHECK: number;
    LEADTIME: number;
    DUELIMIT: number;
    PRICETAG: number;
    CURRENCY: number;
    ISACTIVE: number;
    MEMID: string;
    PARENTID: string;
    ACTYPE: string;
    DIV: string;
    BANKBUILDING: string;
    BANKACCOUNTNUMBER: string;
    BANKCOSTCENTER: string;
    BANKCODE:string;
    BANKNAME:string;
    BANKID:string;
    TITLE: string,
    SHORTNAME: string,
    CUSTOMERID: string,
    CATEGORY: string,
    Currency: string,
    PMODE: string,
    PSTYPE: string,
    GSTTYPE: string,
    MAILTYPE: string,
    TEMPADDRESS: string,
    CITY: string,
    STATE: string,
    AREA: string,
    LANDMARK: string,
    MOBILE: string,
    POSTALCODE: string,
    ADHARNO: string,
    GSTNO: string,
    PRICELEVELCONFIG: string,
    PRICELEVEL: string,
    CTYPE: string,
    ERPPLANTCODE: string
    ERPSTOCKLOCATIONCODE: string;
    CBALANCE: number;
    isRCMApplicable:number;
    isAutoGSTApplicable:number;
    AutoCalculationObj:AccountAutoCalculationInfo[];
    GSTRATE:number;
    GSTAMOUNT:number;
    parentAccountForAutoGSTCalculation:any;
    // IsActive:number;
   
    GEO:string,
    AREA_ID:any
    ISCOMMONAC:any;
    PCL:any;
    POSTDATEVOUCHERNO:string;
    enableDivSelectionTable:boolean;
    ISBRANCH: number;
    DISTRICT:string;
    PCompany:string;
    PCompanyName:string;
    IS_OVERSEAS_PARTY:number;
    TDS_TYPE:string;

}

export interface PartyAdditional{
    CNAME: string,
    ONAME: string,
    OCONTACT:string,
    ODESIGNATION: string,
    CONTACTNAME: string,
    CCONTACT_A: string,
    CCONTACT_B: string,
    CDESIGNATION: string,
    RELATEDSPERSON_A: string,
    RELATEDSPERSON_B: string,
    NOTES: string,
}
export interface AcListTree {
    SERIAL: Number;
    ACID: number;
    ACNAME: string;
    PARENTID: number;
    TYPE: string;
    isBasicAC: boolean;
    ACCODE: string;
    LEVELS: number;
    PATH: string;
    PARENT: AcListTree;
    PTYPE: string;
    CHILDREN: AcListTree[]
    TEXT: string;
    ANCESTORS: number[]
    HASSUBLEDGER:number,
    CRLIMIT: number;
}

export interface EnableLatePost {
    VoucherName: string;
    Status: number;
    Createdby: string;
    CreatedTime: Date
}

export interface SelectedDivisions {
    DIV: string;
}

export interface SalesTarget{
    BAISHAKH: number,
    JESTHA: number,
    ASHAD: number,
    SHARWAN: number,
    BHADRA: number,
    ASHWIN: number,
    KARTIK: number,
    MANGSHIR: number,
    PAUSH: number,
    MAGH: number,
    FALGUN: number,
    CHAITRA: number,
    TARGET_AMOUNT: number
}

export class TDSModel{
    DESCA : string;
    AMNT : string;
    TDS : number;
    ACID:string;
    TDS_TOBETRACK_LEDGERACID:string;
    TDS_TOBETRACK_LEDGERINDEX:number;
  }

  export interface ImporterPriceCalc{
    TotalInvoiceData_ImporterRate:number;
    ExciseDuty_ImporterRate:number;
    Insurance_ImporterRate:number;
    AssesableCustomDuty_ImporterRate:number;
    CustomDuty_ImporterRate:number;
    AssesableAntaShulka_ImporterRate:number;
    AntaShulka_ImporterRate:number;
    ServiceCharge_ImporterRate:number;
    CostBeforeVAT_ImporterRate:number;
    VAT_ImporterRate:number;
    Others_ImporterRate:number;
    InvoiceQty_ImporterRate:number;
    LandedCostPerRate_ImporterRate:number;
    MCODE:string;
    ITEMDESC:string;
    BATCH:string;
    BATCHID:string;
    VCHRNO:string;
    MODE:string;
    DIVISION:string;
    PHISCALID:string;
    COMPANYID:string;
    SUPPLIER:string;
    NETVALUE:number;
    CHALANNO:string;
    PPNO:string;
    LCNO:string;
    STOCK:number;
    PRICEID:string;
    Unit_ImporterRate:string;
    InvoiceQty_UnitWise:number;
    TaxableValue_VATWise:number;
}