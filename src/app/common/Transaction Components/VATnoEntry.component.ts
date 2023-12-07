import { Component, Input, OnInit,EventEmitter,Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validator, ValidationErrors } from '@angular/forms';

@Component({
    selector: 'vatnoentry',
    templateUrl: './VATnoEntry.component.html'
})
export class VATNoEntry implements ControlValueAccessor, Validator {
    public VatNo: string;
    //@Output()Change = new EventEmitter();
    public No1: string ='';
    No2: string ='';
    No3: string ='';
    No4: string ='';
    No5: string ='';
    No6: string ='';
    No7: string ='';
    No8: string ='';
    No9: string ='';
    nos:string[] =[];
    
    
    validate(c: FormControl): ValidationErrors {
         return (this.checkVatNo()) ? null : {
            jsonParseError: {
                valid: false,
            },
        };
    }
    registerOnValidatorChange(fn: () => void): void {
        
    }

    private propagateChange=(_:any)=>{};

    writeValue(obj: any): void {
        this.VatNo=obj;
        this.fillVatNo();
    }
    registerOnChange(fn: any): void {
        this.propagateChange=fn;
    }
    registerOnTouched(fn: any): void {
        
    }
    setDisabledState(isDisabled: boolean): void {
        
    }

    
    
    public onChange(event){
        
        this.VatNo=this.No1 + this.No2 + this.No3 + this.No4 + this.No5 + this.No6 + this.No7 + this.No8 + this.No9
        if(this.checkVatNo()==true){
            this.propagateChange(this.VatNo);
        }
    }

    checkVatNo(): boolean {
        if (!parseFloat(this.VatNo)) return false;
        if (this.VatNo.length < 9 || this.VatNo.length > 9) {
            return false;
        }
        return true
    }

    fillVatNo() {
        if (this.checkVatNo() == true) {
            var no = this.VatNo.split('');
            for (var i = 0; i < 9; i++) {
                this.nos[i]=no[i];
            }
            this.No1=this.nos[0];
            this.No2=this.nos[1];
            this.No3=this.nos[2];
            this.No4=this.nos[3];
            this.No5=this.nos[4];
            this.No6=this.nos[5];
            this.No7=this.nos[6];
            this.No8=this.nos[7];
            this.No9=this.nos[8];
        }
    }

}