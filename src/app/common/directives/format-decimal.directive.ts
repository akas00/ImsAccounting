import { Directive, ElementRef, HostListener, Input, PipeTransform } from "@angular/core";
@Directive({
  selector: "[formatToDecimal]"
})
export class formatToDecimal implements PipeTransform {
  @Input() formatToDecimal: string;
  private regex: RegExp
  private specialKeys: Array<string> = ["Tab", "End", "Home",];
  constructor(private el: ElementRef) {
      ////console.log("format",formatToDecimal);
  }
  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
      ////console.log("format event",event);
    if (this.specialKeys.indexOf(event.key) !== -1) {
       this.transform(Number(formatToDecimal)); 
    }
  }
  transform(input:number):string {
    if(!input){ input=0}
       return input.toFixed(2);
   
  }


}
