import { Directive, Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, Renderer, ElementRef, Inject } from '@angular/core';
@Directive({
    selector: '[subFocus]'
})
export class SubFocusDirective {
    @Input()subFocus:boolean;
    constructor(@Inject(ElementRef) private element: ElementRef) {}
    protected ngOnChanges() {
        if(this.subFocus == true){
        this.element.nativeElement.focus();
        }
    }
}