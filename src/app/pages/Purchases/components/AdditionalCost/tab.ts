import { EventEmitter, Output } from '@angular/core';
import {Component,Input} from '@angular/core';

@Component({
    selector: 'tab',
    template: `
        <p [hidden]="!show">
            <ng-content></ng-content>
        </p>
    `
})
export class TabComponent {
    @Input()tabTitle:string;
    @Input() show:boolean;

   // show:boolean = false;
   
}