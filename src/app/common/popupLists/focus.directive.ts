import { OnInit, ElementRef, Renderer, Input, Directive } from '@angular/core';

@Directive({ selector: '[focuMe]' })
export class FocusDirective implements OnInit {

    @Input('focuMe') isFocused: boolean;

    constructor(private hostElement: ElementRef, private renderer: Renderer) { }

    ngOnInit() {
        if (this.isFocused) {
            this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'focus');
        }
    }
}