import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { TreeViewAcService } from './accountLedger.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AcListTree, TAcList } from "../../../../common/interfaces/Account.interface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

@Component(
    {
        selector: 'addLedgerSelectors',
        template: ` <div class="row" class="form-horizontal">
    <ba-card [title]="modeTitle" baCardClass="with-scroll">
    <div class="form-group row">
    <label class="col-sm-2 form-control-label">Root Parent:</label>
    <div class="col-sm-2">
    
        <select style="width:130px; height:28px;" [(ngModel)]="majorparent" (ngModelChange)="majorgroupChange(majorparent)">
       <option *ngFor="let code of acledgerList$ | async" [ngValue]="code">{{code.ACNAME}}</option>
      </select>
     </div>
  </div>
  <div [ngBusy]="busy"></div>
  <div class="form-group row">
    <label class="col-sm-2 form-control-label">Parent:</label>
    <div class="col-sm-2">
     <select style="width:130px; height:28px;" [(ngModel)]="parentid">
     <option *ngFor="let code of majorparent.children" [ngValue]="code.ACID">{{code.ACNAME}}</option>
    </select>
    </div>
  </div>

  <div class="form-group row">
    <label class="col-sm-2 form-control-label">Ledger Name:</label>
    <div class="col-sm-2">
      <input type="text" class="form-control" [(ngModel)]="ledgerAcObj.ACNAME" placeholder="Group Name">
    </div>
  </div>
  <div *ngIf="ledgerAcObj.PType!='B'">
  <fieldset style="border:1px solid black; margin-top:30px;">
                <label style="background-color:white; position: absolute; margin-top:-17px; margin-left: 20px; padding:5px;">Account Type</label>

                <table>
                    <tr>
                        <td> <label style="width:200px; padding:5px; margin-top:10px; margin-left:50px;">Assets: </label><input disabled value="A" type="radio"  [checked]="ledgerAcObj.PType=='A'" >
                        <td> <label style="width:200px; padding:5px; margin-top:10px; margin-left:30px;">Liabilities: </label><input disabled type="radio" value="L" [checked]="ledgerAcObj.PType=='L'">
                    </tr>
                    <tr>
                        <td> <label style="width:200px; padding:5px; margin-top:10px; margin-left:50px;">Direct Income: </label><input disabled  value="D" type="radio" [checked]="ledgerAcObj.PType=='D'">
                         <td> <label style="width:200px; padding:5px; margin-top:10px; margin-left:30px;">Indirect Income: </label><input disabled value="I" type="radio" [checked]="ledgerAcObj.PType=='I'">   
                    </tr>

                </table>

            </fieldset>
            </div>
   
    </ba-card>
    </div>
    
  <button type="button" (click)="onSave()" title="onSave" class="btn btn-info">Save</button>

  <button type="button" (click)="cancel()" title="Cancel" class="btn btn-info">Back</button>
  
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
                    <!--<div class="modal-footer">
                        <button class="btn btn-info confirm-btn" (click)="hideChildModal()">Save changes</button>
                        <button class="btn btn-info confirm-btn" type="button" (click)=onsubmit()>Save</button>
                    </div>!-->

                </div>
            </div>
        </div>
     <div>
  `,


        //  [(ngModel)]="PARENTACNAME"
        // [(ngModel)]="RootName"

        providers: [TreeViewAcService],

    }
)
export class AddLedgerComponent {
    selectednode: any;
    parentid: any;
    majorparent: any = <any>{};
    majorParentAcList: any[] = [];
    acParentList: any[] = [];
    PARENTACNAME: string;
    RootName: string;
    acListtree: AcListTree = <AcListTree>{};
    ledgerAcObj: TAcList = <TAcList>{};
    ledgerAcList: TAcList[];
    private returnUrl: string;
    router: Router;
    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Saving data please wait ..."
    private subcriptions: Array<Subscription> = [];
    public acledgerSubject:BehaviorSubject<TAcList[]> = new BehaviorSubject<TAcList[]>([]);
    public acledgerList$:Observable<TAcList[]> = this.acledgerSubject.asObservable();
    //treeList:any[]=[];
    busy:Subscription;
  
    ngOnInit() {

       this.busy= this.MasterService.getacListTree()
            .subscribe(data => {

               // let l = data.filter(x => x.PARENTID == 'BS' || 'PL' || 'TD');
                this.majorParentAcList = data;
                this.acledgerSubject.next(data);
                ////console.log("initial call")
                //console.log(this.majorParentAcList);
                //  this.treeList=data;
                if (!!this._activatedRoute.snapshot.params['Par']) {
                var mp = this._activatedRoute.snapshot.params['Par'];

                   var s=this.majorParentAcList.filter(x=>x.ACID==mp)[0];
                   if(s!=null){this.majorparent=s;}

                    //this.majorgroupChange( this.majorparent);
                }
                if (!!this._activatedRoute.snapshot.params['ACID']) {
                    this.parentid = this._activatedRoute.snapshot.params['ACID'];
                }
            });


    }
    constructor(public MasterService: MasterRepo, protected service: TreeViewAcService, router: Router, private _activatedRoute: ActivatedRoute) {
        this.router = router;
        this.majorparent.children = [];
        // this.service.getNewValues(selectL)
        //     .subscribe(data => {
        //         if (data.status == 'ok') {

        //             this.ledgerAcObj.PARENT = data.result.parent.ACID;
        //             this.PARENTACNAME = data.result.parent.ACNAME;
        //             this.ledgerAcObj.PType = data.result.parent.PType;
        //         }

        //     }
        //     , error => {
        //         this.router.navigate([this.returnUrl]);
        //         //console.log(error);
        //     }
        //     );


        if (!!_activatedRoute.snapshot.params['returmURl']) {
            var selectq = this._activatedRoute.snapshot.params['returmURl'];
        }


    }
    majorgroupChange(majorparent) {
        ////console.log("call")
        //console.log(this.majorparent);
        //  var p= this.treeList.filter(x => x.ACID == majorparent)[0];

        //   if(p!=null){ this.acParentList =p.children;} 

    }

    //     filter(majorparent) {
    //         this.MasterService.getacListTree().subscribe(data => {
    //             var p= data.filter(x => x.ACID == majorparent)[0];

    //             if(p!=null){ this.acParentList =p.children;} });

    // }
    onSave() {

        this.DialogMessage = "Saving Data please wait..."
        this.childModal.show();
        this.SumbitSave();
    }
    mode: string = "add";
    SumbitSave() {
        try {
            ////console.log("submit call");
            this.ledgerAcObj.TYPE = "A";
            // let pp = <TAcList>{}
            // pp.ACNAME=this.form.value.ACNAME;
            if (this.parentid == null) {
                this.ledgerAcObj.PARENT = this.majorparent;
                ////console.log("null value");
                //console.log(this.ledgerAcObj.PARENT);

            }
            else {
                this.ledgerAcObj.PARENT = this.parentid;
            }
            let sub = this.MasterService.saveAccount(this.mode, this.ledgerAcObj)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        //Displaying dialog message for save with timer of 1 secs
                        this.DialogMessage = "Data Saved Successfully"
                        setTimeout(() => {
                            this.childModal.hide();
                            this.router.navigate([this.returnUrl]);
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
    cancel() {
        this.router.navigate(["./pages/masters/AccountLedger"]);
    }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    
}