import { TreeViewAcService, GroupAccounts } from './accountLedger.service';
import { LocalDataSource } from 'ng2-smart-table';
// import { LocalDataSource } from 'ng2-smart-table/ng2-smart-table/lib';
import { Parent } from './../../../../common/interfaces/CostCenter.interface';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AcListTree, TAcList } from "../../../../common/interfaces/Account.interface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { SelectItem } from 'primeng/primeng';
import { MdDialog, MdDialogRef } from "@angular/material";
import { MessageDialog } from "../../../modaldialogs/messageDialog/messageDialog.component";
import { AuthService } from '../../../../common/services/permission';
@Component(
    {
        selector: 'addLedgerSelector',
        templateUrl: 'addledger.component.html',
        providers: [],

    }
)
export class LedgComponent {
    @Output('onClose') onClose = new EventEmitter();
    @ViewChild('childModal') childModal: ModalDirective;
    @Input('acid') ACID: string;
    @Input() rootID: string;
    @Input() modeTitle: string = '';
    @Input() mode: string;
    @Input() grp: string;
    @Output() SaveAcEmit = new EventEmitter();
    @Input('PrimaryGrp') PrimaryGrp:string;
    selectednode: any;
    parentid: any;
    majorparent: any = <any>{};
    majorParentAcList: any[] = [];
    acParentList: AcListTree[] = [];
    PARENTACNAME: string;
    RootName: string;
    acListtree: AcListTree = <AcListTree>{};
    ledgerAcObj: TAcList = <TAcList>{};
    ledgerAcList: TAcList[];
    private returnUrl: string;
    router: Router;
    dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
    //DialogMessage: string = "Saving data please wait ..."
    private subcriptions: Array<Subscription> = [];
    public acledgerSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<TAcList[]>([]);
    public acledgerList$: Observable<TAcList[]> = this.acledgerSubject.asObservable();
    //treeList:any[]=[];
    AddLedger: FormGroup;
    // modeTitle: string = '';
    viewMode = false;
    TreeParent: any[];
    initialTextReadOnly: boolean = false;
    public selectedNode: any;
    source: LocalDataSource = new LocalDataSource();
    // groupListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    // groupList$: Observable<any[]> = this.groupListSubject.asObservable();
    acGroups: any[] = [];
    hasSubLedger: number = 0
    disableHassubledger: boolean = false;
    actype: string = '';
    disableActype: boolean = false;
    parentGroup: GroupAccounts;
    value = false;
    // mode: string = "add";
    SubGroup = true;
    DialogMessage: string = "Saving data please wait ..."
    lastParentID: string;
    // PartialAccountList: any[] = [];
    // @Input() AccountTreePart: any[];
    userProfile:any;
    ngOnInit() {
        ////console.log("AddLedger Reached")
        this.AddLedger = this._fb.group({
            ACNAME: ['', Validators.required],
            majorparent: [''],
            // parentid: [''],
            hasSub: [''],
            ACType: [''],
            ACCODE: ['', Validators.required],
            ASSETTYPE: [''],
            isNotActive:['']
        });


        let self = this;
        this.getGroups();
        this.value = false;
        this.modeTitle;
        if (this.mode == 'edit') {
            ////console.log("Mode Edit", this.ACID);
            this.modeTitle = 'Edit Ledger'
            this.MasterService.getAllAccount(this.ACID)

                .subscribe(data => {
                    if (data.status == 'ok') {
                        ////console.log("EDIT GetAllAccountReached");
                        // this.AddLedger.get('parentid').setValue(data.result.PARENT);
                        this.AddLedger.get('ACNAME').setValue(data.result.ACNAME);
                        this.AddLedger.get('ACCODE').setValue(data.result.ACCODE);
                        //console.log(data);
                        this.mode = 'edit';
                        this.initialTextReadOnly = true;

                    }
                    else {
                        this.mode = '';
                        this.modeTitle = "Edit - Error in AccountLedger";
                        this.initialTextReadOnly = true;
                    }
                }, error => {
                    this.mode = '';
                    this.modeTitle = "Edit2 - Error in AccountLedger";
                    this.MasterService.resolveError(error, "AccountLedger - getAccountLedger");
                }
                );
        }
    }
    constructor(public MasterService: MasterRepo, router: Router, private accountService: TreeViewAcService,
        private _activatedRoute: ActivatedRoute, public _fb: FormBuilder, public dialog: MdDialog,private _authService:AuthService) {
        ////console.log("");
        this.router = router;
        this.majorparent.children = [];
        // if (!!_activatedRoute.snapshot.params['returnUrl']) {
        //     this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
        // }
        this.userProfile=this._authService.getUserProfile();
        // ////console.log("User",this.userProfile)

    }

    majorgroupChange(majorparent) {
        this.filter(this.AddLedger.get('majorparent').value);
        //  var p= this.treeList.filter(x => x.ACID == majorparent)[0];

        //   if(p!=null){ this.acParentList =p.children;} 

    }

    filter(majorparent) {
        this.MasterService.getacListTree().subscribe(data => {
            var p = data.filter(x => x.ACID == majorparent)[0];

            if (p != null) { this.acParentList = p.CHILDREN; }
        });

    }
    onSave() {
        
        this.dialogMessageSubject.next("Saving Data please wait...");
        var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })
        try {
            ////console.log("submit call");
            //console.log({ PARENT: this.parentGroup })
            if (!this.parentGroup) throw new Error("Parent is missing");

            let al = <TAcList>{};
            if (this.mode == 'edit') {
                al.ACID = this.ACID;
                //console.log({ EDITEDACID: al.ACID })
            }
            if (this.modeTitle == 'AddLedger' || this.mode == 'edit' && this.grp == 'A') {
                //console.log({ ModeTitle: "A" })
                al.TYPE = "A"
            }
            else {
                //console.log({ ModeTitle: "G" })
                al.TYPE = "G"
            }
            al.ACNAME = this.AddLedger.value.ACNAME;
            al.PType = this.AddLedger.value.ASSETTYPE;
            // al.PARENT = this.AddLedger.value.parentid == null ? this.AddLedger.value.majorparent : this.AddLedger.value.parentid;
            al.PARENT = this.parentGroup.ACID;
            al.HASSUBLEDGER = this.AddLedger.value.hasSub;
            al.ACCODE = this.AddLedger.value.ACCODE;
            al.ACTYPE = this.parentGroup.ACTYPE;
            al.MAPID = this.AddLedger.value.ASSETTYPE;
            al.DIV = this.userProfile.userDivision
           // al.IsNotActive = this.AddLedger.value.isNotActive
            //console.log({ ACLedgSave: al })
            //console.log({ SAVEMODE: this.mode })
            let sub = this.MasterService.saveAccount(this.mode, al)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        ////console.log("Status",data.status)
                        var selNode = {}
                        
                        if (this.grp == 'A') {
                            al.ACID = data.result.ACID
                            
                            ;
                            this.MasterService.PartialAccountList.push(al);
                            selNode = { type: 'A', value: al };
                            ////console.log("TYPE99", selNode)
                        }
                        else {
                            selNode = { type: 'G', lastparent: this.lastParentID, value: { ACID: data.result.acid, ACNAME: al.ACNAME, PARENT: null, PARENTID: this.lastParentID, children: [] } };
                        }

                        this.SaveAcEmit.emit(selNode);
                        this.dialogMessageSubject.next("Data Saved Successfully")
                        setTimeout(() => {
                            dialogRef.close();
                            // this.AccountTreePart(al);
                            //console.log({ AccountTree: this.AccountTreePart })
                            this.onClose.emit(true);
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
        }
        catch (ex) {
            this.dialogMessageSubject.next(ex)
            setTimeout(function () {

                dialogRef.close();
            }, 3000);
            //  alert(ex);
            //  //console.log(ex);
        }

    }



    cancel() {
        // this.router.navigate(["./pages/masters/AccountLedger"]);
        // this.onClose.emit(true);
    }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            //console.log(ex);
            alert(ex);
        }
    }
    AccountTreePart(event) {
        ////console.log("AccountTreePartCall")
        let addLedg = { ACID: event.ACID, ACNAME: event.ACNAME, PARENT: event.PARENT, SERIAL: event.SERIAL };
        this.MasterService.PartialAccountList.push(addLedg);
        var childproductList = this.MasterService.PartialAccountList.filter(p => p.PARENT == this.selectedNode.ACID);
        if (childproductList.length > 0) {
            this.source.load(childproductList);
        }
    }

    // public onGroupChange(event, i,selected) {
    //     try {

    //         let subjectData = this.groupListSubject.getValue();
    //         let newGroup: GroupAccounts = selected;
    //         //console.log({event:event, subjectData: subjectData, eventIndex: i ,selected:selected});
    //         newGroup.CHILDLIST = [];
    //         var ind = i;
    //         if(subjectData.length>ind+1){
    //             subjectData.splice(ind + 1, subjectData.length - 1)
    //         }
    //         //console.log({ negroup: newGroup, subjectData: subjectData });
    //         if (event) {
    //             //console.log({ GroupchageEvent: event, value: newGroup.ACID });
    //             this.accountService.getChildrenGroups(newGroup.ACID).subscribe(data => {
    //                 newGroup.CHILDLIST.push(data);
    //             }, Error => //console.log({ groupchangeError: Error })
    //                 , () => {
    //                     subjectData.push(newGroup);
    //                     this.groupListSubject.next(subjectData);
    //                     //console.log({ negroup2: newGroup, subjectData2: subjectData });
    //                 }
    //             );
    //         }

    //     }
    //     catch (ex) {
    //         //console.log({ onGroupChange: ex })
    //     }

    // }

    public onGrpChange(event, i, selected) {

        try {
            if (selected) {
                this.actype = selected.ACTYPE
                this.changeACtype(selected.ACTYPE);
                this.disableActype == true;
                //latest selected 
                this.parentGroup = selected;
            }


            //let newGroup: GroupAccounts = event.value;
            //console.log({ onGrpChangeEvent: event, eventIndex: i, selected: selected });
            let opt: SelectItem[] = [];
            var ind = i;

            if (event) {
                if (this.acGroups.length > ind + 1) {
                    this.acGroups.splice(ind + 1, this.acGroups.length - 1)
                }
                //console.log({ GroupchageEvent: event, value: event.value.ACNAME, ACID: event.value.ACID });
                this.lastParentID = event.value.ACID;
                this.accountService.getChildrenGroups(event.value.ACID)
                    .flatMap(data => data)
                    .subscribe(data => {
                        var selNode = {}
                        //console.log({ children: data });
                        if (data.TYPE == 'G')
                            opt.push({ label: data.ACNAME, value: data });
                    }, Error => //console.log({ groupchangeError: Error })
                    , () => {
                        if (opt.length > 0) {
                            this.acGroups.push({ group: event.value.ACNAME, value: event.value, options: opt });
                        }

                        //this.groupListSubject.next(subjectData);
                        // //console.log({ negroup2: { group: event.value.ACNAME, value: event.value, options: opt }, subjectData2: subjectData });
                    }
                    );
            }

        }
        catch (ex) {
            //console.log({ onGroupChange: ex })
        }

    }

    getGroups() {
        //FIRST GET THE MAIN GROUP
        this.hasSubLedger = 0;
        this.changehassubEvent(false);
        this.disableHassubledger = false;
        ////console.log("Has SUB is false")
        this.actype = '';
        this.disableActype = false;
        this.acGroups = [];
        this.getMainGroup();
        if (!this.ACID) return;
        //console.log({ acid: this.ACID });
        this.accountService.getParentGroups(this.ACID)
            .flatMap(data => data)
            .subscribe(data => {
                try {
                    data.SELECTEDGROUPAC = data.CHILDLIST.find(itm => itm.ACID == data.SELECTEDGROUP);
                    this.parentGroup = data.SELECTEDGROUPAC;
                    //console.log({ selectedGroup: data.SELECTEDGROUP, selectedGroupAC: data.SELECTEDGROUPAC })
                    if (data.SELECTEDGROUPAC.HASSUBLEDGER == 1 && this.hasSubLedger == 0) {
                        this.hasSubLedger = 1;
                        this.changehassubEvent(true);
                        this.disableHassubledger = true;
                        ////console.log("Disable AHS SUB")
                    }
                    
                    let opt: SelectItem[] = [];
                    data.CHILDLIST.forEach(child => {
                        opt.push({ label: child.ACNAME, value: child });
                    });
                    this.acGroups.push({ group: data.ACNAME, value: data, options: opt });
                }
                catch (ex) {
                    //console.log({ getParentGroups: ex })
                }
            }, error => { //console.log({ getgroupError: error }) }
            , () => {
                if (this.acGroups.length > 1) {
                    let selectedGroup = this.acGroups[0].options.find(itm =>
                        itm.value.ACID == this.acGroups[1].value.ACID
                    )
                    if (selectedGroup) {
                        this.acGroups[0].value.SELECTEDGROUPAC = selectedGroup.value;
                    }
                    //console.log({ selectedGroupValue: selectedGroup.value });
                    if (this.actype == '' && selectedGroup.value.ACTYPE) {
                        this.actype = selectedGroup.value.ACTYPE
                        this.changeACtype(selectedGroup.value.ACTYPE);
                        this.disableActype == true;
                    }
                    // //console.log({groupTofind:this.acGroups[1],options:this.acGroups[0].options,selected:this.acGroups[0].value.SELECTEDGROUPAC,selected2:this.acGroups[1].value.SELECTEDGROUPAC})
                }
            });

        return;
    }

    getMainGroup() {
        let opt: SelectItem[] = [];
        this.accountService.getTopGroups()
            .flatMap(data => data)
            .subscribe(data => {
               opt.push({ label: data.ACNAME, value: data })
            });
            ////console.log("VALUE#######",this.value)
        this.acGroups.push({ group: 'Main Group', value: { ACNAME: 'MAIN GROUP', ACID: null, PARENT: null }, options: opt });
    }

    changehassubEvent(value) {
        if (this.AddLedger == null) { return; }
        this.AddLedger.get('hasSub').patchValue(value);
        //console.log({ HasSubVAlue: value })
    }
    changeACtype(value) {
        try {
            this.AddLedger.get('ACType').patchValue(value);
            //console.log({ ChangeValue: value })
            if (value == 'AT') {
                this.value = true;
            }
            else {
                this.value = false;
            }
        }
        catch (ex) {
            //console.log(ex);
        }
    }
    clickedNotActive(value) {
        if(this.AddLedger==null){return}
        this.AddLedger.get('isNotActive').patchValue(value);
    }
    check(){

    }
    checkActive(){
        
    }
    BindValue(value){
        this.AddLedger.patchValue({
            ACNAME:value
        })
    }
}