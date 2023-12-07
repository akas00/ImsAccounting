import { Component, OnDestroy } from '@angular/core';
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { SettingService } from "../../../../common/services/index";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog,MdDialogRef } from "@angular/material";
import { MessageDialog } from "../../../modaldialogs/messageDialog/messageDialog.component";

@Component({
    selector: "backup-restore",
    templateUrl: "./main-backup-restore.component.html",
    providers: [],
    styleUrls: ["../../../modal-style.css"]
})

export class BackupRestoreComponent {
    private returnUrl: string;
    private subcriptions: Array<Subscription> = [];

    constructor(private masterService: MasterRepo, private router: Router, private arouter: ActivatedRoute, private setting: SettingService, public dialog: MdDialog,) {

    }

    ngOnInit() {
        if (!!this.arouter.snapshot.params['returnUrl']) {
            this.returnUrl = this.arouter.snapshot.params['returnUrl'];
        }

        if (!!this.arouter.snapshot.params['mode']) {
            var mode: string;
            mode = this.arouter.snapshot.params['mode'];
        }

        let division: string;
        let phiscalid: string;

        if (!!this.arouter.snapshot.params['div']) {
            division = this.arouter.snapshot.params['div'];
        }

        if (!!this.arouter.snapshot.params['phiscal']) {
            phiscalid = this.arouter.snapshot.params['phiscal'];
        }


    }

    onBackupClick(){
        var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Backing up data Please wait a moment...");
            var message$: Observable<string> = messageSubject.asObservable();
            let childDialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
        this.masterService.getList(null,'/backup').subscribe(ret=>{
            if(ret.status='ok'){
                messageSubject.next(ret.status);
                setTimeout(()=>{
                    childDialogRef.close();
                },2000)
            }
        },error=> {
            var msg=this.masterService.resolveError(error,'backup')
            messageSubject.next(msg.json());
            setTimeout(()=>{
                    childDialogRef.close();
                },3000)
        }
        )

    }

     onRestoreClick(){
        var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Restoring data Please wait a moment...");
            var message$: Observable<string> = messageSubject.asObservable();
            let childDialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
        this.masterService.getList(null,'/restore').subscribe(ret=>{
            if(ret.status='ok'){
                messageSubject.next(ret.status);
                setTimeout(()=>{
                    childDialogRef.close();
                },2000)
            }
        },error=> {
            var msg=this.masterService.resolveError(error,'backup')
            messageSubject.next(msg.json());
            setTimeout(()=>{
                    childDialogRef.close();
                },3000)
        }
        )
    }


    onCancelClicked() {
        this.router.navigate([this.returnUrl]);
    }



}
