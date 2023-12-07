import { SettingService } from './../../common/services/setting.service';
import {AppSettings} from '../../common/services/AppSettings';
import { Warehouse, Division } from './../../common/interfaces/TrnMain';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MasterRepo } from "../../common/repositories/index";
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import $ from 'jquery';
import { CookieService } from 'angular2-cookie/core';
import { ModalDirective } from 'ng2-bootstrap';
import { Subscription } from "rxjs/Subscription";
import { GlobalState } from '../../global.state';
@Component({
    selector: 'terminal',
    template: `<div>
    <form id=fId class="form-horizontal" [formGroup]="form">
        <ba-card [title]="modeTitle">

            <div class="form-group">
                <label for="vatno" class=" form-control-label ">Terminal Id</label>
                <div >
                    <input  style="color:black" type="text " class="form-control " name="vatno" id="vatno" formControlName="VATNo" 
                        placeholder="Terminal Id">
                </div>
            </div>
            <div class="form-group ">
                <label for="terminalno" class="form-control-label ">Terminal No.</label>
                <div >
                <select class="form-control " name="terminalno" id="terminalno" formControlName="TerminalNo">
                <option *ngFor="let t of TerminalList" [ngValue]="t.INITIAL">{{t.NAME}}</option>
                </select>
                </div>
            </div>
            <div class="form-group ">
                <label for="id " class="form-control-label ">Computer Id</label>
                <div >
                    <input  style="color:black" type="text " class="form-control " name="id" id="id " formControlName="ComputerId" placeholder="Computer Id ">
                </div>
            </div>
            <div class="form-group">
                <label for="cd " class="form-control-label ">Computer Description</label>
                <div>
                    <input class="form-control" type="text" style="color:black"  name="cd" id="cd" formControlName="ComputerDesc" placeholder="Computer Description">
                   
                </div>
            </div>
             <div class="form-group ">
                <label for="terminalno" class="form-control-label ">Division</label>
                <div >
                <select class="form-control " name="Division" formControlName="Division">
                <option *ngFor="let d of masterService.allDivisionList$ | async" [ngValue]="d.INITIAL">{{d.NAME}}<option>
                </select>
                </div>
            </div>
             <div class="form-group ">
                <label for="terminalno" class="form-control-label ">Warehouse</label>
                <div >
                <select class="form-control " name="Warehouse" formControlName="Warehouse">
                 <option *ngFor="let d of masterService.warehouseList$ | async" [ngValue]="d.NAME">{{d.NAME}}</option>
                </select>
                </div>
            </div>
        </ba-card>
        <div style="padding-bottom: 10px; margin-top: -8px;">
            <button  (click)="onSave()" style="margin-right: 4px;" class="btn btn-info " [disabled]="!form.valid" >Save</button>
            <button type="button " class="btn btn-info" (click)="onCancel()">Back</button>
        </div>
       <div class="modal fade" bsModal #childModal="bs-modal" [config]="{backdrop: 'static'}" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" aria-label="Close" (click)="hideChildModal()">
          <span aria-hidden="true">&times;</span>
          
        </button>
                        <h4 class="modal-title">Information</h4>
                    </div>
                    <div class="modal-body">
                        {{DialogMessage}}
                    </div>
                </div>
            </div>
        </div> 
    </form>

</div>`
    ,
    providers: [CookieService]
})
export class TerminalComponent {
    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Saving data please wait ..."
    form: FormGroup;
    mode: string = "add";
    private subcriptions: Array<Subscription> = [];
    TerminalList:any[]=[];
    warehouseList: Warehouse[]=[];
    divisionList:any[]=[];
    AppSettings;
    subscriptions: any[] = [];
    constructor(private state: GlobalState, private router: Router, public masterService: MasterRepo, private fb: FormBuilder, private _cookieService: CookieService,private setting: SettingService){
    this.AppSettings = this.setting.appSetting;
      
    }

    // checkValidTerminal(){
    //       try {
    //         var cookie = this._cookieService.get("imsposcookie");
    //         let Allow = false;
    //         let message = "Please Wait....";
    //         if (cookie != null) {
    //             var J = JSON.parse(cookie);
    //             this.masterService.getSingleObject({ VATNo: J.VATNo, TerminalNo: J.TerminalNo, ComputerId: J.ComputerId }, '/getClientTerminal')
    //                 .subscribe(data => {
    //                     if (data.status == 'ok') {
    //                         if (data.result == null) { message = "Please Register this Terminal. Thank you..."; Allow = false; }
    //                         else {
    //                             if (data.result.Allow == 1) {
    //                                 Allow = true;
    //                             }
    //                             else {
    //                                 message = "This Terminal is not authorize For this function";
    //                                 Allow = false;
    //                             }
    //                         }
    //                     }
    //                     else {
    //                         Allow = false;
    //                         alert(data.result);
    //                     }
    //                 }
    //                 )
    //         }
    //         else { message = "Please create a Terminal Cookie.Thank you...";Allow=false; }
    //         return {permisson:Allow,message:message};
    //     } catch (ex) {
            
    //         //console.log(ex);
    //         alert(ex);
    //         return {permisson:false,message:ex};
    //     }
    // }

    ngOnInit() {
        this.formInitialize();
       //    // Fetch the computer's mac address
        // require('getmac').getMac(function(err,macAddress){
        //     if (err)  throw err
        //     //console.log(macAddress)
        // })

        // // Validate that an address is a mac address
        // if ( require('getmac').isMac("e4:ce:8f:5b:a7:fc") ) {
        //     //console.log('valid mac')
        // }
        // else {
        //     //console.log('invalid mac')
        // }

        //     $.getJSON('//api.ipify.org?format=json', function(data) {
        //   //console.log(JSON.stringify(data));
        // });
        //require('node-macaddress').one(function (err, addr) { //console.log(addr); });
        //        var macaddress = require('node-macaddress');
        //  //console.log(macaddress);
    }
    formInitialize() {
        this.form = this.fb.group({
            VATNo: ['',Validators.required],
            TerminalNo: ['',Validators.required],
            ComputerId: ['',Validators.required],
            ComputerDesc: [''],
            MACAddress: [''],
            Division:['',Validators.required],
            Warehouse:['',Validators.required]
        });
        this.masterService.getSalesTerminal().subscribe(data=>{this.TerminalList.push(data)});
     }
    onSave() {
        try {
            this.DialogMessage = "Saving Data please wait...";
            this.childModal.show();
           
            let sub = this.masterService.saveClientTerminal(this.mode, this.form.value).subscribe(data => {
                if (data.status == 'ok') {
                     this._cookieService.putObject("imsposcookie", this.form.value);
                     //console.log({Cookies:this.form.value})
                    //Displaying dialog message for save with timer of 1 secs
                    this.DialogMessage = "Data Saved Successfully";
                    setTimeout(() => {
                        this.childModal.hide();
                        this.formInitialize();

                    }, 1000)


                }
                else {
                    //alert(data.result);
                    //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
                    if (data.result._body == "The ConnectionString property has not been initialized.") {
                        this.router.navigate(['/login', this.router.url])
                        return;
                    }
                    //Some other issues need to check
                    this.DialogMessage = "Error in Saving Data:" + data.result._body;
                    //console.log(data.result._body);
                    setTimeout(() => {
                        this.childModal.hide();
                    }, 3000)
                }
            },
                error => { alert(error) }
            );
            this.subcriptions.push(sub);
        }
        catch (e) {
            alert(e);
        }
    }
    onCancel() { }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    
}
