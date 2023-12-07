export class BankReconciliation
{    
     DATE1 : string;
     DATE2 : string;
     ACID : string;
     ACNAME : string;
     DIV : string;
     SHOWRECONSILLED : boolean;
     PHISCALID:string;
     COMPANYID:string;
     BSDATE1 : string;
     BSDATE2 : string;
     PARTYTYPE:any;
}

export class Reconcile
{
     isChecked :boolean;
     TRNDATE : Date;
     BSDATE : string;
     PARTICULARS :string;
     VCHRTYPE :string;
     CHEQUENO :string;
     CHEQUEDATE : Date;
     BANKDATE : string;
     DRAMNT :number;
     CRAMNT :number;
     VNO : string;
     DIV : string;
     B_ACID :string;
     STAMP :string;
     isReconciled:boolean

}