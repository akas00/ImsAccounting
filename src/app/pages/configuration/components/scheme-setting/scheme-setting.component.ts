import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

//import { SmartTablesService } from './smartTables.service';
import { ModalDirective } from 'ng2-bootstrap';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { CommonService } from './../../../../common/services/common.service';
import { SchemeSettingService } from './scheme-setting.service';
import { SchemeSetting, ProductCategory } from './scheme-setting.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Product } from "../../../../common/interfaces/ProductItem";
@Component({
    selector: 'scheme-setting-list',
    templateUrl: './scheme-setting.template.html',
    providers: [CommonService, SchemeSettingService],
    styles: [`
          .margin{
              margin-bottom: 10px;
          }
          .padding{
              padding-right: 0px;
          }
          th{
              font-weight: bold;
              background-color: #FFFFFF;
          }
          tr:hover{
              background-color: #F8F8F8;
          }
          input{
              width: 110px;
          }
          tr td{
              padding-top: 5px;
              padding-bottom: 5px;
          }
  `]
})
export class SchemeSettingComponent {
    public productCategoryList: Product[] = [];
    public schemeSubGroupList: any[] = [];
    public productCategory: Product = <Product>{};
    productGroupValue: string = null;

    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Saving data please wait ...";
    mode: string = "add";
    modeTitle: string = '';
    initialTextReadOnly: boolean = false;
    private returnUrl: string;
    rategroup: Array<any> = [];
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];

    constructor(private _service: MasterRepo, private _commonService: CommonService, private _schemeSettingService: SchemeSettingService, private _activatedRoute: ActivatedRoute, private _router: Router, private _fb: FormBuilder) {
    }

    ngOnInit() {
        this._service.getSchemeGroupList().subscribe(res => {
            this.productCategoryList.push(<Product>res);
        }, error => {
            if (error._body == 'The ConnectionString property has not been initialized.')
                this._router.navigate(["/login", { returnUrl: this._router.url }]);
            //console.log(error);
        });
        // let self = this;
        this.form = this._fb.group({
                DESCA:  ['', Validators.required],
                SCHEMEA: [''],
                SCHEMEB: [''],
                SCHEMEC: [''],
                SCHEMED: [''],
                SCHEMEE: [''],
                productGroup: [''],
            });

        // if (!!this._activatedRoute.snapshot.params['returnUrl']) {
        //     this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
        // }
        // if (!!this._activatedRoute.snapshot.params['MCODE']) {
        //     let MCode = this._activatedRoute.snapshot.params['MCODE'];

        //     this._schemeSettingService.getScheme(MCode)
        //         .subscribe(data => {
        //             if (data.status == 'ok') {
        //                 this.form.patchValue({
        //                     DESCA:  data.result.DESCA,
        //                     MCODE: data.result.MCODE,
        //                     SCHEMEA: data.result.SCHEME_A,
        //                     SCHEMEB: data.result.SCHEME_B,
        //                     SCHEMEC: data.result.SCHEME_C,
        //                     SCHEMED: data.result.SCHEME_D,
        //                     SCHEMEE: data.result.SCHEME_E,

        //                 });

        //                 self.mode = 'edit';
        //                 self.modeTitle = "Edit Membership Scheme Setting";
        //                 self.initialTextReadOnly = true;
        //             }
        //             else {
        //                 this.mode = '';
        //                 this.modeTitle = "Edit - Error in Scheme Setting";
        //                 this.initialTextReadOnly = true;
        //             }
        //         }, error => {
        //             this.mode = '';
        //             this.modeTitle = "Edit2 - Error in Scheme Setting";

        //         }
        //         )
        // }
        // else {
        //     this.mode = "add";
        //     this.modeTitle = "Add Membership Scheme Setting";
        //     this.initialTextReadOnly = false;

        // }
        // //console.log(this.productCategory.MCODE);

    }

    changeToArray(data) {
        //console.log(data);
        if (data) {
            let retData: Array<any> = [];
            retData.concat([], data);
            return retData;
        }
        return [];

    }

    onSave() {
        //validate before Saving
        this.DialogMessage = "Saving Data please wait..."
        this.childModal.show();
        this.save();
    }
    hideChildModal() {
        this.childModal.hide();
    }

    removeRow(index) {
        // this.salesTerminal.product.splice(index, 1);
    }


    save() {
        //console.log(this.productCategory,this.form.value);
        
    }

    ngOnDestroy() {
        this.subcriptions.forEach(subs => {
            subs.unsubscribe();

        });
    }

    back() {
        this._router.navigate(['pages/pages/dashboard']);
    }

    changeProductGroup() {
        this.schemeSubGroupList = [];
        // this.productGroupValue = this.form.get('productGroup').value;
        // //console.log((this.form.get('productGroup').value).MCODE);
        // //console.log(this.schemeSubGroupList[0]);
        // getSchemeSubGroup
        // this._schemeSettingService.getSchemeSubGroup(this.form.get('productGroup.MCODE').value)
        //         .subscribe(data => {
        //             if (data.status == 'ok') {
        //                 this.form.patchValue({
        //                     DESCA:  data.result.DESCA,
        //                     MCODE: data.result.MCODE,
        //                     PARENT: data.result.PARENT,       
        //                 });
        //             }
        //         });
        // //console.log((this.form.get('productGroup').value).MCODE);
        // this._schemeSettingService.getSchemeSubGroup((this.form.get('productGroup').value).MCODE)
        //     .subscribe(res=>{
        //         this.schemeSubGroupList.push(<Product>res);
        //         //console.log( "mylist="+res); 
        //     });

        this._schemeSettingService.getSchemeSubGroup(this.productCategory.MCODE)
            .subscribe(res => {
                this.schemeSubGroupList.push(<any>res);
            });

    }
}