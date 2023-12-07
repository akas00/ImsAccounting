import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Renderer, ElementRef } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { TrnMain, Trntran, TSubLedgerTran, TSubLedger, CostCenter, Division, VoucherTypeEnum } from "./../../../../common/interfaces/TrnMain";
import { CommonService, SettingService } from './../../../../common/services';
import { ActivatedRoute, Router } from '@angular/router';
import { TAcList } from './../../../../common/interfaces/Account.interface';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Subject } from 'rxjs/subject';
import { Observable } from "rxjs/Observable";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";


@Component({
  selector: 'test-entry',
  template: `
    <form [formGroup]="trntranForm">
        <div formArrayName="journal">
            <div *ngFor="let tList of trntranForm.controls.journal.controls;let i=index">
                <div [formGroupName]="i">
                    <div *ngIf="trnMain.TrntranList[i].inputMode == true">
                        <label>{{i+1}}Input</label>

                        <input type="text" ngui-auto-complete [source]="observableAclistAcname.bind(this)" style="height:23px;" max-num-list="25"
                                list-formatter="ACNAME" formControlName="AccountItem"
                                (change)="AutoSelectAcnameChange($event,i)"
                                display-property-name="ACNAME"/>
                        <input type="date" formControlName="TRNDATE"/>
                        <button (click)="addRow(i)">Add</button>
                        <button (click)="saveRow(i)">Save</button>
                    </div>

                    <div *ngIf="trnMain.TrntranList[i].inputMode == false">
                        <label>{{i+1}}Input</label>
                        {{trnMain.TrntranList[i].AccountItem.ACNAME}}
                        {{trnMain.TrntranList[i].TRNDATE}}
                        <button (click)="editRow(i)">Edit</button>

                    </div>
                </div>
            </div>
        </div>
    </form>
    `,
  styleUrls: ["./../../../../../assets/css/styles.css", "../../../modal-style.css"],

})

export class testComponent {
  public trnMain: TrnMain = <TrnMain>{};
  public trnTran: Trntran = <Trntran>{};
  private subjectACList = new Subject();
  trntranForm: FormGroup;
  trnTranControl;

  private subcriptions: Array<Subscription> = [];

  constructor(private masterService: MasterRepo, private _transactionService: TransactionService, private fb: FormBuilder, private _activatedRoute: ActivatedRoute, private _router: Router, private settingService: SettingService, private renderer: Renderer, private _sanitizer: DomSanitizer) {
    try {
      this.trnMain = this._transactionService.TrnMainObj;
      this.masterService.refreshAccountList('Journal-constructor');

    } catch (ex) {
      alert(ex);
    }
  }
  observableAclist = (): Observable<TAcList[]> => {
    //let serv=this._service
    try {
      return this.masterService.getAccount('journal-ObservableAclist');
    } catch (ex) {
      alert(ex);
    }

  }
  observableAclistAcname = (keyword: any): Observable<TAcList[]> => {
    //let serv=this._service
    try {
      if (keyword) {
        return this.masterService.getAccoutFilteredObs(keyword, 1);

      }
      else {
        return Observable.of([]);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  //aclist = this._service.accountList;
  observableAclistAcid = (keyword: any): Observable<TAcList[]> => {
    //let serv=this._service
    try {
      if (keyword) {
        return this.masterService.getAccoutFilteredObs(keyword, 0);

      }
      else {
        return Observable.of([]);
      }
    } catch (ex) {
      alert(ex);
    }
  }

  autocompleListFormatter = (data: any): SafeHtml => {
    try {
      let html = `<span>${data.ACNAME}</span>`;
      return this._sanitizer.bypassSecurityTrustHtml(html);
    } catch (ex) {
      alert(ex);
    }
  }
  autocompleListAcidFormatter = (data: any): SafeHtml => {
    try {
      let html = `<span>${data.ACCODE}</span>`;
      return this._sanitizer.bypassSecurityTrustHtml(html);
    } catch (ex) {
      alert(ex);
    }
  }

  AutoSelectAccodeChange($event, index) {
    try {
      let ret = this.masterService.accountList.find(x => x.ACCODE == $event);
      if (ret) {
        this.trnMain.TrntranList[index].AccountItem = ret;
        this.trnMain.TrntranList[index].acitem = ret;
      }
    }
    catch (error) {
      this.trnMain.TrntranList[index].AccountItem = undefined;
    }
  }

  AutoSelectAcnameChange($event, index) {
    try {
      if (typeof ($event) == 'object') {
        var ac = <TAcList>$event;
        this.trnMain.TrntranList[index].AccountItem = $event;
        this.trnMain.TrntranList[index].AccountItem.ACCODE = ac.ACCODE;
      }
      else {
        this.trnMain.TrntranList[index].AccountItem.ACCODE = "";
      }


    }
    catch (error) {
      this.trnMain.TrntranList[index].AccountItem.ACCODE = "";
    }
  }




  ngOnInit() {
    this.trntranForm = this.fb.group({
      journal: this.fb.array([]),
    });
    this.trnTranControl = <FormArray>this.trntranForm.controls['journal'];
    this.trntranForm.controls.journal.valueChanges.subscribe(form => {
      this.trnMain.TrntranList = this.trntranForm.get('journal').value;
    });
    this.initTrnTranList();
  }

  initTrnTranList() {
    this.trnTranControl = <FormArray>this.trntranForm.controls['journal'];
    let journalGroup;
    journalGroup = this.fb.group({
      AccountItem: "",
      TRNDATE: "",
      inputMode: true,
      editMode: false,
    });
    this.trnTranControl.push(journalGroup);
  }


  addRow(index) {
    for (var i = 0; i < this.trnTranControl.length; i++) {
      this.trnTranControl.at(i).get('inputMode').patchValue(false);
    }
    this.initTrnTranList();
  }

  editRow(index) {
    this.trnTranControl.at(index).get('inputMode').patchValue(true);
  }

  saveRow(index) {
    this.trnTranControl.at(index).get('inputMode').patchValue(false);
  }
}

