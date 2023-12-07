import { Directive, ElementRef, HostListener, Input } from "@angular/core";
@Directive({
  selector: "[decimalPlacesRestriction]"
})
export class DecimalPlacesRestriction {
  @Input() decimalPlacesRestriction: string;
  private regex: RegExp
  private specialKeys: Array<string> = ["Backspace", "Tab", "End", "Home","Delete","ControlLeft","v","V"];
  constructor(private el: ElementRef) {}
  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    let regexp = `^\\d*\\.?\\d{0,${this.decimalPlacesRestriction==""?2:this.decimalPlacesRestriction}}$`;
    this.regex = new RegExp(regexp, "g");
    // Allow Backspace, tab, end, and home keys

    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
