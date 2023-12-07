import { Cost, prodCost } from '../../pages/Purchases/components/AdditionalCost/addtionalCost.service';
import { ImporterPriceCalc, TAcList } from './Account.interface';
import { importdocument } from './AddiitonalCost.interface';
import { Product } from "./ProductItem";
export interface TrnMain {
  Mode: string;
  NextVno: string;
  TotalWithIndDiscount: number;
  guid: string;
  ReplaceIndividualWithFlatDiscount: number;
  TOTALINDDISCOUNT: number;
  TOTALLOYALTY: number;
  TOTALPROMOTION: number;
  TOTALFLATDISCOUNT: number;
  COSTCENTER: string;
  RECEIVEBY: string;
  STATUS: number;
  CONFIRMEDBY: string;
  CONFIRMEDTIME: string;
  PhiscalID: string;
  Stamp: number;
  Customer_Count: number;
  DBUSER: string;
  HOSTID: string;
  ORDERS: number;
  REFORDBILL: string;
  INDDIS: number;
  CREBATE: number;
  CREDIT: number;
  PONO: string;
  DUEDATE: Date | string;
  TRNAC: string;
  PARAC: string;
  TRNACName: string;
  PARTRNAMNT: number;
  RETTO: string;
  REFBILL: string;
  CHEQUENO: string;
  CHEQUEDATE: Date | string;
  EDATE: Date | string;
  POST: number;
  POSTUSER: string;
  FPOSTUSER: string;
  SHIFT: string;
  EXPORT: number;
  CHOLDER: string;
  CARDNO: string;
  EditUser: string;
  MEMBERNO: string;
  MEMBERNAME: string;
  EDITED: number;
  VMODE: number;
  BILLTOTEL: string;
  BILLTOMOB: string;
  TRN_DATE: Date | string;
  BS_DATE: string;
  STAX: number;
  TOTALCASH: number;
  TOTALCREDIT: number;
  TOTALCREDITCARD: number;
  TOTALGIFTVOUCHER: number;
  CardTranID: string;
  ReturnVchrID: string;
  TranID: number;
  VoucherStatus: string;
  PRESCRIBEBY: string;
  DISPENSEBY: string;
  Longitude: string;
  Latitude: string;
  MobileNo: string;
  DeliveryDate: Date | string;
  DeliveryAddress: string;
  DeliveryTime: string;
  DeliveryMiti: string;
  OrderNo: string;
  ADJWARE: string;
  BATCHNO: string;
  BATCHNAME: string;
  DPSNO: string;
  EDITTIME: string;
  EID: string;
  EXTRACHARGE: string;
  ISSUEWARE: string;
  ADVANCE: number;
  VoucherType: VoucherTypeEnum;
  VoucherAbbName: string;
  VoucherName: string;
  VoucherPrefix: string;
  NextNumber: number;
  SalesManID: string;
  VCHRNO: string;
  CHALANNO: string;
  DIVISION: string;
  TRNDATE: Date | string;
  BSDATE: string;
  TRNTIME: string;
  TOTAMNT: number;
  DCAMNT: number;
  DCRATE: number;
  VATAMNT: number;
  NETAMNT: number;
  TRNMODE: string;
  TAXABLE: number;
  NONTAXABLE: number;
  BILLTO: string;
  BILLTOADD: string;
  TRNUSER: string;
  TERMINAL: string;
  TENDER: number;
  CHANGE: number;
  ROUNDOFF: number;
  NETWITHOUTROUNDOFF: number;
  ServiceCharge: number;
  IsTable: boolean;
  IsVATBill: boolean;
  VATBILL: number;
  REMARKS: string;
  VoucherNumber: number;
  MWAREHOUSE: string;
  TrntranList: Trntran[];
  AdditionTranList: Trntran[]; 
  ProdList: TrnProd[];
  BillTrackedList: BillTrack[];
  AdditionProdList: TrnProd[];
  FCurrency: string;
  EXRATE: number;
  TOTALDISCOUNT: number;
  TOTALDISCOUNT_VATINCLUDED: number;
  // AddedByBzu - for purchase invoice
  CREDITDAYS: number;
  InvAmount: number;
  DiscRate: number;
  RoundOffAmount: number;
  ManualDiscount: number;
  BRANCH: string;
  BALANCE: number;
  TOTALQTY: number;
  TOTALWEIGHT: number;
  AdditionalObj: TrnMain_AdditionalInfo
  SHIPNAME: string;
  INVOICETYPE: string;
  TRNTYPE: string;
  TenderList: TBillTender[];
  PARTY_ORG_TYPE: string;
  HOLDBILLID: number;
  TransporterEway: Transporter_Eway;
  IsAccountBase: boolean;
  hasShipName: boolean;
  isVoucherLatePostEnable: number;
  tag: string;
  gstInfoOfAccount: any;
  REVCHARGE: string;
  JournalGstList: any[];
  gstItcReversalList: any[];
  AdvanceAdjustmentObj: any;
  ECOM_GSTNO: string;
  PREGST: string;
  CNDN_MODE: number;
  CHALANNOPREFIX: any;
  isOneisToManyvchr : boolean;
  AdditionalCostJson:string;
  DmsSchemesApplied:any
  SALESMAN:string;
  CUS_FIX_DISCOUNT_PER:number;
  CUS_Remote_Discount:number;
  DOFULLRETURN:number;
  ImportDocument:importdocument;
  SelectedPhiscalID : string;
  IMPORTDETAILS : IMPORT_DETAILS;
  PURCHASETYPE:string;
  PI_CNDN_MODE:number;
  CASHBANK_SL_ACID: string;
  CASHBANK_SL_NAME: string;
  HASSUBLEDGER: number;
  IndividualCostList:prodCost[];
}
export interface TrnProd {
  INDDISCOUNT: number;
  FLATDISCOUNT: number;
  NETAMOUNT: number;
  LOYALTY: number;
  PROMOTION: number;
  ISSERVICECHARGE: number;
  ISVAT: number;
  ADDTIONALROW: number;
  COSTCENTER: string;
  VCHRNO: string;
  CHALANNO: string;
  DIVISION: string;
  MCODE: string;
  UNIT: string;
  Quantity: number;
  RealQty: number;
  AltQty: number;
  RATE: number;
  AMOUNT: number;
  DISCOUNT: number;
  VAT: number;
  REALRATE: number;
  EXPORT: number;
  IDIS: string;
  OPQTY: number;
  REALQTY_IN: number;
  ALTQTY_IN: number;
  WAREHOUSE: string;
  REFBILLQTY: number;
  SPRICE: number;
  EXPDATE: Date | string;
  REFOPBILL: number;
  ALTUNIT: string;
  TRNAC: string;
  PRATE: number;
  VRATE: number;
  ALTRATE: number;
  VPRATE: number;
  VSRATE: number;
  TAXABLE: number;
  NONTAXABLE: number;
  SQTY: number;
  REMARKS: string;
  INVRATE: number;
  EXRATE: number;
  NCRATE: number;
  CRATE: number;
  SNO: number;
  CUSTOM: number;
  WEIGHT: number;
  DRATE: number;
  CARTON: number;
  INVOICENO: string;
  ISSUENO: string;
  BC: string;
  GENERIC: string;
  BATCH: string;
  MFGDATE: Date | string;
  MANUFACTURER: string;
  SERVICETAX: number;
  BCODEID: number;
  VoucherType: number;
  SALESMANID: number;
  PhiscalID: string;
  STAMP: number;
  ITEMDESC: string;
  MENUCODE: string;
  TOTAL: number;
  Ptype: number;
  Product: Product;
  unitQty: UnitAndQty;
  Mcat: string;
  Mcat1: string;
  ITEMTYPE: string;
  HASITEMTYPE: number;
  RECEIVEDTYPE: string;
  inputMode: boolean;
  index: number;
  MRP: number;
  GODOWN: string;
  INDDISCOUNTRATE: number;
  SELECTEDITEM: any | null;
  BRANCH: string;
  Supplier: string;
  STOCK: number;
  ALLSCHEME: any;
  BATCHSCHEME: any;
  PrimaryDiscount: number;
  SecondaryDiscount: number;
  LiquiditionDiscount: number;
  BasePrimaryDiscount: number;
  BaseSecondaryDiscount: number;
  BaseLiquiditionDiscount: number;

  ALTUNITObj: any;
  ALTRATE2: number;
  RATE2: number;
  GSTRATE: number;
  CONFACTOR: number;
  ACNAME: string;
  GSTRATE_ONLYFORSHOWING: number;
  VAT_ONLYFORSHOWING: number;
  PClist: any[];
  INDIVIDUALDISCOUNT_WITHVAT: number;
  IsApproveStockSettlement: boolean;
  ALTMRP: number;
  ADJUSTMENTNEWRATE: number;
  DIFFERENCEAMOUNT: number;
  TOTAlDIFFERENCEAMOUNT: number;
  COMPANYID: string;
  ALTERNATEQUANTIY: number;
  ImporterPriceCalcList:ImporterPriceCalc;
  IsCostingSaved:boolean;
  BATCHID:string;
  backgroundcolor:string;     
  BASEQUANTITY:number;                    
}

export class Trntran {

  ACNAME: string;
  SubledgerTranList: TSubLedgerTran[];
  AccountItem: TAcList;
  VCHRNO: string;
  CHALANNO: string;
  DIVISION: string;
  A_ACID: string;
  DRAMNT: number;
  CRAMNT: number;
  B_ACID: string;
  NARATION: string;
  TOACID: string;
  NARATION1: string;
  VoucherType: VoucherTypeEnum;
  ChequeNo: string;
  ChequeDate: string;
  CostCenter: string;
  MultiJournalSno: number;
  PhiscalID: string;
  SNO: number;
  ROWMODE: string;
  acType: string;
  hasDebit: boolean;
  hasCredit: boolean;
  drBGColor: string;
  crBGColor: string;
  drColor: string;
  crColor: string;
  inputMode: boolean;
  editMode: boolean;
  acitem: any;//to hold the select acount Item value;
  PartyDetails: PartyOpeningDetail[] = [];
  COMPANYID: string;
  OpeningBalanceBillDetail: any[] = [];
  // added by sopheeeeeee
  rootparent: any;
  rootparentname: any;
  guid:string;
  SL_ACID:string;
  SL_ACNAME:string;
  disableSubLedger:boolean;
  SALESMAN:string;
  OPPREMARKS:string;
  BANKCODE : string;
  BANKID : string;
  BANKNAME : string;
  OppAcid:string;
  disableBank:boolean;
  disableCellPayRow:boolean;
  hasAdditionalBank:boolean;
  ISTAXABLE:number;
  CPTYPE:number;
  Ref_BILLNO:string;
  Ref_TRNDATE:string;
  Ref_SupplierName:string;
  TDSAmount:string;
  TDSAccount_ACID:string;
  AdditionalDesc:string;
  AdditionalVAT:number;
  IsTaxableBill:any;
  DoAccountPosting:any;
  OPPNAME:string;
  IS_ECA_ITEM:any;
  ChequeDateBS: string;
  TDS_SL_ACID:string;
  // CR_SL_ACID:string;
  RowWiseBillTrackedList: BillTrack[]; // to save row wise billtracking data
  CCID:number;
  COSTCENTERGROUP_NAME:string;
  CCG_ID:number;
  BUDGETNAME:string;
}

export class PartyOpeningDetail {
  VCHRNO: string;
  DIVISION: string;
  REFVNO: string;
  ACID: string;
  REFDATE: string;
  AMOUNT: number;
  CLRAMOUNT: number;
  DUEAMT: number;
  DUEDATE: string;
  REFSNO: string;
  PHISCALID: string;
  STAMP: string
  REF_BSDATE: string;
  DUE_BSDATE: string;
  DUEDAYS:number;
}


export interface TSubLedgerTran {
  SNO: number;
  VCHRNO: string;
  CHALANNO: string;
  DIVISION: string;
  A_ACID: string;
  DRAMNT: number;
  CRAMNT: number;
  B_ACID: string;
  NARATION: string;
  TOACID: string;
  VoucherType: VoucherTypeEnum;
  PhiscalID: string;
  MultiJournalSno: number;
  SubledgerItem: TSubLedger;
  ACNAME: string;
  Amount: number;
  ROWMODE: string;
  inputMode: boolean;
  editMode: boolean;
}
export interface TSubLedger {
  SERIAL: number;
  ACID: string;
  ACCODE: string;
  ACNAME: string;
  PARENT: string;
  TYPE: string;
  OPBAL: number;
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
  LEVELS: number;
  FLGNEW: number;
  COMMON: number;
  PATH: string;
  INITIAL: string;
}

export interface UnitAndQty {
  Unit: string;
  Qty: number;
  Rate: number;
  BaseUnit: string;
  BaseQty: number;
  BaseRate: number;
  ConversionFactor: number;
}

export interface AlternateUnit {
  SNO: number;
  MCODE: string;
  ALTUNIT: string;
  CONFACTOR: number;
  RATE: number;
  ISDEFAULT: number;
  ISDEFAULTPRATE: number;
  BRCODE: string;
  RATE_A: number;
  RATE_B: number;
  RATE_C: number;
  RATE_D: number;
  PRATE: number;
  ISDISCONTINUE: number;

}
export interface CostCenter {
  CostCenterName: string;
  DIVISION: string;
  Parent: string;
  TYPE: string;
  CCID: string;
  ccgid:number;
}
export interface CostCenterCategory {
  ccgid:number;
  COSTCENTERGROUPNAME: string;
  DIVISION: string;
  TYPE: string;
  COMPANYID: string;
}

export interface Division {
  INITIAL: string;
  NAME: string;
  REMARKS: string;
  MAIN: string;
  COMNAME: string;
  COMADD: string;
  isCheck : boolean;
  isDefault:boolean;
  isCheck_trn:boolean;
  isDisable:boolean;
  isDisable_trn:boolean;
}
export interface Warehouse {
  NAME: string;
  ADDRESS: string;
  PHONE: string;
  REMARKS: string;
  ISDEFAULT: boolean;
  IsAdjustment: number;
  AdjustmentAcc: string;
  ISVIRTUAL: number;
  VIRTUAL_PARENT: string;
  DIVISION: string;
  WarehouseType: string;
  // WID: number;
}

export interface Branch {
  COMPANYID: string;
  companyAlias: string;
  name: string;
  type: string;
  chanel: string;
  margin: string;
  remarks: string;
  PARENTBRANCHID: string;
}

export enum VoucherTypeEnum {
  Default = 0, Sales = 1, SalesReturn = 2, Purchase = 3, PurchaseReturn = 4, 
  StockIssue = 5, StockReceive = 6, BranchTransferIn = 7,
  BranchTransferOut = 8, StockSettlement = 9, Stockadjustment = 10, Receipe = 11, Journal = 12, Delivery = 13, TaxInvoice = 14,
  CreditNote = 15, DebitNote = 16, PaymentVoucher = 17, ReceiveVoucher = 18, PurchaseOrder = 19, SalesOrder = 20, DeliveryReturn = 21, AccountOpeningBalance = 22, PartyOpeningBalance = 23, OpeningStockBalance = 24, SubLedgerOpeningBalance = 25,
  GoodsReceived = 26,
 ReverseSalesRetrun = 38,
  PerformaSalesInvoice = 57,
  PurchaseOrderCancel = 58, RequestIndent = 59,
  StockSettlementEntryApproval = 60,
  TaxInvoiceCancel = 61,
  ContraVoucher = 62,
  CapitalVoucher = 64,
  AdditionalCost = 66,
  SinglePayment = 65,
  StockSample = 71,
  PostDirectory = 72,
  Cellpay = 75, ReverseCreditNote=41
}

export interface VoucherSatus {
  vouchertype: VoucherTypeEnum;
  VCHRNO: string;
  DIVISION: string;
  PhiscalID: string;
  BillMode: string;
}

export interface DialogInfo {
  TRANSACTION: String;
  PARAC: string;
  DIVISION: any;
  DELEVERYLIST: String;
  SALESMODE: String;
  WARRENTYTODATE: Date;
}
export interface TrnMain_AdditionalInfo {
  VCHRNO: string;
  STAMP: number;
  SHIPNAME: string;
  SHIPNAMEVIEW: string,
  TRNTYPE: string;
  CFORM: string;
  PAYMENTTYPE: string;
  RETURNMODE: string;
  PAYMENTMODE: string;
  PAYMENTTERMS: string;
  INVNO: string;
  INVDATE: Date;
  INVAMOUNT: number;
  TOTALGST: number;
  TOTALEXTRACESS: string;
  FREIGHT: string;
  CREDITDAYS: string;
  SOSTOCKSTATUS: string;
  INVOICETYPE: string;
  COUPONBALANCE: string;
  CHALANNOPREFIX:string;
  RETURNTYPE: string;
  BILLFORMATS: string;
  BILLUNITS: string;
  RECEIVEDDATE: Date | string;
  CUSTOMERTYPE:string;
  DUEDATE: Date | string;
  CREFBILL: string;
 



}
export class TenderObj {
  CREDIT: number;
  CHEQUE: number;
  CASH: number;
  WALLET: number;
  CARD: number;
  COUPON: number;
  CASHAMT: number;
  CARDAMT: number;
  CARDNO: string;
  CARDNAME: string;
  APPROVALCODE: string;
  CARDHOLDERNAME: string;
  CREDITAMT: number;
  CHEQUEAMT: number;
  CHEQUENO: string;
  DATE: Date;
  BANK: string;
  TOTAL: number;
  OUTSTANDING: string;
  ADVANCE: number;
  TENDERAMT: string;
  BALANCE: number;
  LOYALTYAMT: number;
  COUPONNAME: string;
  COUPONAMT: number;
  WALLETAMT: number;
  WALLETTYPE: string;
  WALLETCARDNO: string;
  TRNMODE: string;
  REMARKS: string;
  ACID: string;

}

export class TBillTender {
  VCHRNO: string;
  DIVISION: string;
  TRNMODE: string;
  ACCOUNT: string;
  REMARKS: string;
  SN: number;
  AMOUNT: number;
  PHISCALID: string;
  CHANGE: number;
  STAMP: number;
  guid: string;
  TRANSACTIONID: string;
  OTP: string;
  PROVIDERNAME: string;
  PROVIDERACCOUNT: string;
  SALESMANID: number;
  // added by bzu
  CARDNO: string
  APPROVALCODE: string;
  CARDHOLDERNAME: string;
}

export interface ExcelImportConfig {
  ImportName: string;
  ColumnName: string;
  SNO: number;
  ColumnSize: string;
  DataType: boolean;
  ColumnValue: number;
  Mandatory: string;
  AddToSheet: number;
}
export interface Transporter_Eway {
  ID: number;
  VCHRNO: string;
  TRANSPORTER: string;
  VEHICLENO: string;
  PERSON: string;
  VEHICLENAME: string;
  DRIVERNAME: string;
  DRIVERNO: string;
  TOTALBOX: string;
  MODE: string;
  LRNO: string;
  LRDATE: Date;
  STAMP: Date;
  DISTANCE: number;
  EWAYNO: string;
  TOTALWEIGHT: number;
  COMPANYID: String;
}

export interface BillTrack {
  TRNDATE: Date;
  VCHRNO: string;
  CHALANNO: string;
  AMOUNT: number;
  REFBILL: string;
  DIVISION: string;
  ACID: string;
  PhiscalID: string;
  REFDIVISION: string;
  ID: string;
  TBillNo: string;
  Row: number;
  guid


  //It will not go to API.
  TTRNDATE: Date | string;
  TVCHRNO: string;
  TCLRAMOUNT: string;
  TDUEAMOUNT: number;
  TAMOUNT: number
  TAdjustingAmt: number;
  VOUCHERTYPE:String;
}

export interface VoucherPosting {
  from: string,
  to: string,
  division: string,
  voucherPrefix: string,
  invoiceList: any
}
export interface AccountAutoCalculationInfo {
  PARTICULAR: string;
  ACCOUNT: string;
  PARENTACCOUNT: string;
  RATE: number;
}

export interface IMPORT_DETAILS {
  DOCUMENTNO: string;
  LCNUM: string;
  TOTALVAT: number;
  TOTALQTY: number;
  TOTALTAXABLE: number;
  TOTALNONTAXABLE: number;
  NETAMOUNT: number;
  prodList: IMPORT_DETAILS_PROD[]

}
export interface IMPORT_DETAILS_PROD {
  ITEMNAME: string;
  QUANTITY:number
  TAXABLE: number;
  NONTAXABLE: number;
  VAT: number;
  NETAMOUNT: number;
}
