export interface PriceRate 
{
    PriceFormulaType:string;
    FromParty:string;
    ToParty:string;
    RateType:string;
    ColNo:number;
    ColName:string;
    Constant:string;
    FormulaDescription:string;
    FormulaString:string;
    Formula:PriceFormula;
    ColType:string;
    Value:number;
}
export interface PriceFormula
{
    c1:PriceRate;
    c2:PriceRate;
    Operator:string;
}