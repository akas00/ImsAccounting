import {Pipe, PipeTransform, ElementRef, HostListener} from '@angular/core';


@Pipe({name: 'twoDigitNumber'})
export class TwoDigitNumber implements PipeTransform {

  


  
  transform(input:number):string {
    if(!input){ input=0}
       return input.toFixed(2);
   
  }


}
