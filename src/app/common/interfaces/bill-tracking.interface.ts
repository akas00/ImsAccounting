export interface BillTracking{
    SHOWMORE:boolean;
    PARTYTYPE:string;
    ACID:string;
    ACNAME:string;
    VCHRNO:string;
    TRNDATE:string;
    LEDGERBALANCE:number;
    DUEBALANCE:number;
    BALANCE:number;
    ADJUSTINGAMOUNT:number;
    BILL:BILL[];
    TOTALADJAMOUNT:number;
    SHOWZEROBALANCE:boolean;
    REFVCHRNO:string;
    AdjustmentMode:string;
    NonTracking:[]

}

export interface BILL{
    BILLDATE:string;
    BILLNO:string;
    VCHRNO:string;
    REFBILL:string;
    BILLAMOUNT:number;
    CLEARAMOUNT:number;
    DUEAMOUNT:number;
    TAdjustingAmt:number;
    AMOUNT:number;
    TRACK:TRACK[];
    TempAdjustingAmount:number;

}
export interface TRACK{
    TRACKBY:string;
    TRACKAMOUNT:number;
}