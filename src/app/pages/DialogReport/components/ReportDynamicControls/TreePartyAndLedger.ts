import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { LedgerDialog } from '../../../../common/interfaces/LedgerDialog.interface';
import { ReportService, IReportMenu, IReport, IreportOption } from '../reports/report.service';
import { IActionMapping, TREE_ACTIONS } from "angular-tree-component/dist/models/tree-options.model";
import { KEYS } from "angular-tree-component/dist/constants/keys";
import { TreeComponent } from "angular-tree-component/dist/components/tree.component";
import { TreeNode } from "angular-tree-component/dist/models/tree-node.model";

const actionMapping: IActionMapping = {
  
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    },
    click: (tree, node, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event)
    }
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => node.setActiveAndVisible()
    //[KEYS.ENTER]: (tree, node, $event) =>  alert(`This is ${node.data.name}`)
  }
};
@Component(
    {
        selector: 'treeledgerandparty',
        template: `
        <div  [ngBusy]="busy"></div>
         <div class="plainBackGround">
	  <form style="background-color:#ffffff; border:1px solid;border-color:#dcdcdc">
                   
                    <input name="filter" #filter (keyup)="filterNodes(filter.value, tree)" placeholder="filter nodes" style="margin:10px;height:25px;width:150px"
                    />
                    <div id=treediv>
                        <div  style="overflow: auto; border: black;border-width: 2px;height: 300px;background:white;margin:10px;font-size:12px">
                            <Tree  #tree [nodes]="nodes" [focused]="true" [options]="customTemplateStringOptions"  (onActivate)="onTreeNodeselect(tree,$event)">
                                <ng-template #treeNodeTemplate let-node>
                                    <span title="{{node.data.subTitle}}">{{ node.data.ACNAME }}{{ childrenCount(node) }}</span>

                                </ng-template>
                                <ng-template #loadingTemplate>Loading, please hold....</ng-template>
                            </Tree>
                            
                        </div>
                        <br>
                    </div>
                   
                </form></div>
`,

    }
)
export class TreePartyAndLedgerComponent {
    @Input() control: any;
    @Input() form: FormGroup;
    public selectedNode: any;
  public nodes: any[] = [];
  @ViewChild(TreeComponent)
  public tree: TreeComponent;
   busy:Subscription;
  root:string;
    constructor(private reportService: ReportService, private fb: FormBuilder,private masterService:MasterRepo) { }

    ngOnInit() {

    }
    ngAfterViewInit() {
        if(this.control.type=='tree'){
            if(this.control.listName=="LedgerGroupList"){
            this.loadledgerGroupTree();
        }
        else if(this.control.listName=="PartyGroupList"){
            this.loadPartyGroupTree();
        }}
    }
    filterNodes(text, tree) {
    try {
      tree.treeModel.filterNodes(text, true);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  loadledgerGroupTree(){
   this.busy=this.masterService.getacListTree().map(x=>{return x})
      .subscribe(res => {
        this.nodes = res;
        if (this.tree != null) {
          this.tree.treeModel.update();
        }
      }, error => {
        //console.log(error);
      }
      );
  }
  loadPartyGroupTree(){
  this.masterService.getpartyListTree().map(x => { return x })
      .subscribe(res => {       
        this.nodes = res;
        if (this.tree != null) {
          this.tree.treeModel.update();
        }
        //console.log(this.tree);
      }, error => {
        //console.log(error);
      });
  }
  onTreeNodeselect(tree, $event) {
    try {
      this.selectedNode = tree.treeModel.getFocusedNode().data;
       this.form.controls['ACTYPE'].setValue(this.selectedNode.ACID.substring(2,0));
       this.getRootParent(this.selectedNode,this.nodes);
      var pare= this.nodes.filter(x=>x.ACID==this.root)[0];
       if(pare){this.form.controls['PARENT'].setValue(pare.PARENTID);}
      else{this.form.controls['PARENT'].setValue(this.root);}
      //console.log(this.selectedNode);
      //console.log(this.root);
     
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
customTemplateStringOptions = {
    // displayField: 'subTitle',
    isExpandedField: 'expanded',
    idField: 'uuid',
    getChildren: this.getChildren.bind(this),
    actionMapping,
    allowDrag: false
  }
   getChildren(node: any) {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(this.asyncChildren.map((c) => {
          return Object.assign({}, c, {
            hasChildren: node.level < 5
          });
        })), 1000);
      });
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
   asyncChildren = [
    {
      name: 'child2.1',
      subTitle: 'new and improved'
    }, {
      name: 'child2.2',
      subTitle: 'new and improved2'
    }
  ];
  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length})` : '';
  }
  getRootParent(node, list) {
    if (node.PARENTID == 'BS' || node.PARENTID == 'PL' || node.PARENTID == 'TD') { ////console.log("return"); this.root = node.ACID; return; }
    for (let t of list) {
      if (node.PARENTID != t.ACID) { this.loopingChild(node, t.children, t); }
      else { this.root = node.PARENTID; }
    }
  }
  }
  loopingChild(node, cList, root) {
    for (let c of cList) {
      if (c != node) { this.loopingChild(node, c.children, root); }
      else { this.root = root.ACID; }
    }
  }
}









