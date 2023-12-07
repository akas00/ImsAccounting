import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MasterRepo } from '../../repositories';
import { TransactionService } from '../../Transaction Components/transaction.service';
import { BatchStock } from '../../interfaces';
import { resolve } from 'dns';

@Component(
    {
        selector: 'popPartyChoose',
        templateUrl: './popPartyList.html',
        styleUrls: ["../../../pages/Style.css", "../pStyle.css"],

    }
)
export class PopPartyChooserComponent {
    /** Input/Output  */
    @Output() dbClickEvent = new EventEmitter();
    @Output() partyCloseClick = new EventEmitter();
    @ViewChild("inputBox") _el: ElementRef;
    @Input() partyList: any[] = [];
    selectedRowIndex:number=0;
    constructor(public masterService: MasterRepo) {
    }
    ngAfterViewInit(){
       
    }
    ngOnInit() {
        setTimeout(() => {
            this.setFocus();
          }, 50);
    }
   
    SearchList(value) {
        // this.itemChanged(value);

    }

    
    setFocus() {
        this._el.nativeElement.focus();
        }
  
    dblClickItemList(value,i) {
        this.selectedRowIndex=i;
        this.dbClickEvent.emit(value);

    }
    partyPopClosed() {
        this.partyCloseClick.emit();
    }

    onKeydown(event)
    {
      this.setFocus();
        if(this.selectedRowIndex==null)this.selectedRowIndex=0;
        
        if(event.key==="ArrowDown")
        {
          
            this.selectedRowIndex=this.selectedRowIndex+1;
            if(this.selectedRowIndex>9)this.selectedRowIndex=9;
        }
        else if(event.key==="ArrowUp")
        {
          this.selectedRowIndex=this.selectedRowIndex-1;
          if(this.selectedRowIndex<0)this.selectedRowIndex=0;
        }
        if(event.key==="Enter")
        {
            if(this.selectedRowIndex!=null)
            {
                if(this.partyList[this.selectedRowIndex]!=null){
                this.dblClickItemList(this.partyList[this.selectedRowIndex],this.selectedRowIndex);
                }
            }
            return false;
        }
        if(event.key==="Delete")
        {
            this.partyPopClosed();
            return false;
        }

       
    }
}