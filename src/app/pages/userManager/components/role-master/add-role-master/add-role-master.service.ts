import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TodoItemNode, TREE_DATA } from '../../../../../common/interfaces/role-master.interface';
@Injectable()

export class RoleMasterService {
    
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  get data(): TodoItemNode[] { return this.dataChange.value; }

    constructor() {   
        this.initialize();
    }

      initialize() {     
        const data = this.buildFileTree(TREE_DATA, 0);
        this.dataChange.next(data);
      }
     
      buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
        return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
          const value = obj[key];
          const node = new TodoItemNode();
          node.item = key;
    
          if (value != null) {
            if (typeof value === 'object') {
              node.children = this.buildFileTree(value, level + 1);
            } else {
              node.item = value;
            }
          }
    
          return accumulator.concat(node);
        }, []);
      }
      
      insertItem(parent: TodoItemNode, name: string) {
        if (parent.children) {
          parent.children.push({item: name} as TodoItemNode);
          this.dataChange.next(this.data);
        }
      }

      updateItem(node: TodoItemNode, name:string ){
        node.item = name;
        this.dataChange.next(this.data);
      }
      
 
}