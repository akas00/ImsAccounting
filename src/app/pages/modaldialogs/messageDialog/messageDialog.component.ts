import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";

export interface DialogInfo{
    header: string;
    message: Observable<string>;
}

@Component({
    selector:'result-dialog',
    template:`
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header">
                <div class="close" aria-label="Close" (click)="authResult(true)">&times;</div>
                <h4 class="modal-title">{{heading}}</h4>
                </div>
                    
                <div class="modal-body">
                    <div style="display:inline-block"></div>
                    {{message$|async}}
                </div>
            </div>
        </div>
`
})
export class MessageDialog{
    heading: string = "Information";
    message$: Observable<string>;

    constructor(public dialogref:MdDialogRef<MessageDialog>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
       // //console.log({data: data});
        this.heading = data.header;
        this.message$ = data.message;
    }

    public authResult(res){
       // //console.log({messageDialog:res})
        this.dialogref.close(res);
    }
        
}