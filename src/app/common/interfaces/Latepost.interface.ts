export interface LatePost{
    DATE1 : Date,
    DATE2 : Date,
    VTYPE : string,
    VSERIES : string,
    ACID:string,
    DIV:string,
    PhiscalID:string,
    check:boolean
  }
  
export interface LatePostGrid{
    ACCOUNTNAME : string,
    CHEQUEDATE: Date,
    CHEQUENO: string,
    COSTCENTER: string,
    CRAMNT: number,
    DIVISION: string,
    DIVNAME: string,
    DRAMNT: number,
    FFLG: string,
    MITI: string,
    NARATION: string,
    REFNO: string
    SL_ACNAME: string,
    TRNDATE: Date,
    TRNTIME: string,
    TRNUSER: string,
    VOUCHERNO: string,
    VOUCHERTYPE: string,
    isShowCheck:boolean
    isCheck:boolean
    VOUCHERSTATUS : string;
    BANKCODE:string;
    ACCODE : string;
    ISCHECKED:number;
    ChequeNo:string;
  }
  export class LatePostObj{
    PostList : LatePostGrid[]
    VOUCHERTYPE:string
  }