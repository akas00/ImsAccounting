import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Item, Product, ItemRate, ProductType, KotCategory, Model, Brand, RateDiscount } from '../../../../common/interfaces';
import { Warehouse } from '../../../../common/interfaces/TrnMain';
import { TAcList } from '../../../../common/interfaces/Account.interface';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppSettings } from '../../../../common/AppSettings';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, TreeComponent } from 'angular-tree-component';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { TreeViewPartyService } from './treeViewParty.service';


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

@Component({
  selector: "treeViewParty",
  templateUrl: "./treeViewParty.component.html",
  // styleUrls: ["../../../Style.css",'./modals.scss'],
  providers: [MasterRepo, TreeViewPartyService]

})

export class treeViewPartyComponent implements OnInit {


  private _treeEnable: Boolean = true;

  public get treeEnable(): Boolean { return this._treeEnable; }

  public set treeEnable(value: Boolean) { this._treeEnable = value; }
  public selectedNode: any;
  public nodes: any[] = [];
  @ViewChild(TreeComponent)
  public tree: TreeComponent;
  source: LocalDataSource = new LocalDataSource();


  constructor(private masterService: MasterRepo, private router: Router, private ProductService: TreeViewPartyService) {
    try {
      this.masterService.getacListTree()
        .subscribe(res => {
          this.nodes.push(res);
          this.tree.treeModel.update();
        }, error => {
          this.masterService.resolveError(error, "treeViewParty(DialogReport) - getacListTree");
        }
        );
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }

  }
  ngOnInit() {

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
  addNode(tree) {
    try {
      ////console.log(tree.treeModel.getFocusedNode());
      let node = Object.assign({}, tree.treeModel.getFocusedNode().data);
      node.name = "next child";
      node.uuid = "1005"
      //console.log(node);
      //tree.treeModel.getFocusedNode().data.children.push(node);
      tree.treeModel.getFocusedNode().data.children.push({
        //this.nodes[0].children.push({

        //tree.treeModel._focusedNode.children.push({
        name: 'a new child',
        children: []
      });
      tree.treeModel.update();
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  childrenCount(node: TreeNode): string {
    try {
      return node && node.children ? `(${node.children.length})` : '';
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  filterNodes(text, tree) {
    try {
      tree.treeModel.filterNodes(text, true);
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  activateSubSub(tree) {
    try {
      // tree.treeModel.getNodeBy((node) => node.data.name === 'subsub')
      tree.treeModel.getNodeById(1001)
        .setActiveAndVisible();
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
  onEvent($event) {
    //console.log.bind(console);
  }

  onselect(tree, $event) {
    try {
      //$event.stopPropagation();
      //console.log(this.tree);
      this.selectedNode = tree.treeModel.getFocusedNode().data;
      let data: Array<any> = [];
      this.ProductService.getParentWisePartyList(this.selectedNode.id)
        .subscribe(res => {
          data.push(<any>res);
          this.source.load(data);
        }
        );
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }
  go($event) {
    try {
      $event.stopPropagation();
      alert('this method is on the app component')
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  onTreeEnable(value: boolean) {
    try {
      this.treeEnable = value;
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }

  AddItem() {
    try {
      this.router.navigate(["pages/masters/productmaster/addproduct", { returnUrl: this.router.url }])
    } catch (ex) {
      //console.log(ex);
      alert(ex);
    }
  }


}
