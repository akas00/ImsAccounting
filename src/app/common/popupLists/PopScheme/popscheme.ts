import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MasterRepo } from '../../repositories';
import { TransactionService } from '../../Transaction Components/transaction.service';
import { BatchStock } from '../../interfaces';
import { resolve } from 'dns';

@Component(
    {
        selector: 'PSalesSchemeList',
        templateUrl: './popscheme.html',
        styleUrls: ["../../../pages/Style.css", "../pStyle.css"],

    }
)
export class PopSchemeChooserComponent {
    /** Input/Output  */
    @Output() dbClickEvent = new EventEmitter();
    @Output() schemeCloseClick = new EventEmitter();
    @ViewChild("inputBox") _el: ElementRef;
    @Input() schemeList: any[] = [];
    title:string="Available Active Schemes on Item";
    constructor(private masterService: MasterRepo,public _trnMainService: TransactionService) {
    }
    ngAfterViewInit(){
      
    }
    ngOnInit() {
        
    }
   
    SearchList(value) {
        // this.itemChanged(value);

    }

    
    setFocus() {
        this._el.nativeElement.focus();
        }
  
    dblClickItemList(value) {
        this.dbClickEvent.emit(value);

    }
    schemeListClosed() {
        this.schemeCloseClick.emit();
    }
}