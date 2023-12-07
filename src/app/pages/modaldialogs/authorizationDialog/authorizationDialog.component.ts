import {NgaModule} from '../../../theme/nga.module';
import { MasterRepo } from "./../../../common/repositories/masterRepo.service";
import {Component, Inject} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";

export interface DialogInfo{
    header: string;
    message: Observable<string>;
}

@Component({
    selector:'auth-dialog',
    template:`
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header">
                <div class="close" aria-label="Close" (click)="authResult(true)">&times;</div>
                <h4 class="modal-title">{{heading}}</h4>
                </div>
                    
                <div class="modal-body">
                    <div class="modal-title glyphicon glyphicon-warning-sign" style="display:inline-block"></div>
                    {{message$ | async}}
                </div>
            </div>
        </div>
`
})
export class AuthDialog{
    message$: Observable<string>;
    heading: string;
    constructor(public dialogref:MdDialogRef<AuthDialog>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
        this.message$ = data.message;
        this.heading = data.header;
        //console.log({message: data});
    }

    public authResult(res){
        //console.log({authdialogresult:res})
        this.dialogref.close(res);
    }
        
}