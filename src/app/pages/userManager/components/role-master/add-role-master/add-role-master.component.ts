// import { SelectionModel } from '@angular/cdk/collections';
// import { FlatTreeControl } from '@angular/cdk/tree';
// import { Component, Injectable } from '@angular/core';
// import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
// import { BehaviorSubject } from 'rxjs';

// import { TodoItemFlatNode, TodoItemNode } from '../../../../../common/interfaces/role-master.interface';
// import { RoleMasterService } from './add-role-master.service';


// @Component({
//     selector: 'add-role-master',
//     templateUrl: 'add-role-master.component.html',
//     providers: [RoleMasterService]

// })

// export class AddRoleMaster {


//     flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
//     nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
//     selectedParent: TodoItemFlatNode | null = null;
//     newItemName = '';

//    treeControl: FlatTreeControl<TodoItemFlatNode>;

//  //treeControl : FlatTreeControl<>;

//    treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

//       dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

//       checklistSelection = new SelectionModel<TodoItemFlatNode>(true);

//     constructor(private _database: RoleMasterService) {
//         this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
//             this.isExpandable, this.getChildren);
//         this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
//         this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

//         _database.dataChange.subscribe(data => {
//             this.dataSource.data = data;
//         });
//     }

//     getLevel = (node: TodoItemFlatNode) => node.level;
//     isExpandable = (node: TodoItemFlatNode) => node.expandable;
  
//     getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  
//     hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  
//     hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

//     transformer = (node: TodoItemNode, level: number) => {
//         const existingNode = this.nestedNodeMap.get(node);
//         const flatNode = existingNode && existingNode.item === node.item
//             ? existingNode
//             : new TodoItemFlatNode();
//         flatNode.item = node.item;
//         flatNode.level = level;
//         flatNode.expandable = !!node.children;
//         this.flatNodeMap.set(flatNode, node);
//         this.nestedNodeMap.set(node, flatNode);
//         return flatNode;
//       }

//       descendantsAllSelected(node: TodoItemFlatNode): boolean {
//         const descendants = this.treeControl.getDescendants(node);
//         const descAllSelected = descendants.every(child =>
//           this.checklistSelection.isSelected(child)
//         );
//         return descAllSelected;
//       }
      
//       /** Whether part of the descendants are selected */
//   descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
//     const descendants = this.treeControl.getDescendants(node);
//     const result = descendants.some(child => this.checklistSelection.isSelected(child));
//     return result && !this.descendantsAllSelected(node);
//   }

//   /** Toggle the to-do item selection. Select/deselect all the descendants node */
//   todoItemSelectionToggle(node: TodoItemFlatNode): void {
//     this.checklistSelection.toggle(node);
//     const descendants = this.treeControl.getDescendants(node);
//     this.checklistSelection.isSelected(node)
//       ? this.checklistSelection.select(...descendants)
//       : this.checklistSelection.deselect(...descendants);

//     // Force update for the parent
//     descendants.every(child =>
//       this.checklistSelection.isSelected(child)
//     );
//     this.checkAllParentsSelection(node);
//   }

//   /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
//   todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
//     this.checklistSelection.toggle(node);
//     this.checkAllParentsSelection(node);
//   }

//   /* Checks all the parents when a leaf node is selected/unselected */
//   checkAllParentsSelection(node: TodoItemFlatNode): void {
//     let parent: TodoItemFlatNode | null = this.getParentNode(node);
//     while (parent) {
//       this.checkRootNodeSelection(parent);
//       parent = this.getParentNode(parent);
//     }
//   }

//   /** Check root node checked state and change it accordingly */
//   checkRootNodeSelection(node: TodoItemFlatNode): void {
//     const nodeSelected = this.checklistSelection.isSelected(node);
//     const descendants = this.treeControl.getDescendants(node);
//     const descAllSelected = descendants.every(child =>
//       this.checklistSelection.isSelected(child)
//     );
//     if (nodeSelected && !descAllSelected) {
//       this.checklistSelection.deselect(node);
//     } else if (!nodeSelected && descAllSelected) {
//       this.checklistSelection.select(node);
//     }
//   }

//   /* Get the parent node of a node */
//   getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
//     const currentLevel = this.getLevel(node);

//     if (currentLevel < 1) {
//       return null;
//     }

//     const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

//     for (let i = startIndex; i >= 0; i--) {
//       const currentNode = this.treeControl.dataNodes[i];

//       if (this.getLevel(currentNode) < currentLevel) {
//         return currentNode;
//       }
//     }
//     return null;
//   }

//   /** Select the category so we can insert the new item. */
//   addNewItem(node: TodoItemFlatNode) {
//     const parentNode = this.flatNodeMap.get(node);
//     this._database.insertItem(parentNode!, '');
//     this.treeControl.expand(node);
//   }

//   /** Save the node to database */
//   saveNode(node: TodoItemFlatNode, itemValue: string) {
//     const nestedNode = this.flatNodeMap.get(node);
//     this._database.updateItem(nestedNode!, itemValue);
//   }


// }



