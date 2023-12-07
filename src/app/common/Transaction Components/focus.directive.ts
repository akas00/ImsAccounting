import { Directive, Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, Renderer, ElementRef, Inject } from '@angular/core';
@Directive({
    selector: '[focus]'
})
export class FocusDirective {
    @Input()focus:boolean;
    constructor(@Inject(ElementRef) private element: ElementRef) {}
    protected ngOnChanges() {
        if(this.focus == true){
        this.element.nativeElement.focus();
        }
    }
}