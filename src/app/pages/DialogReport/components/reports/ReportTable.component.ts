import { Component, OnInit, Input, ViewChild, Output, EventEmitter,ElementRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import 'style-loader!./smartTables.scss';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ReportService } from "./report.service";
declare let jsPDF;
@Component({
    selector: 'reporttable',
    template:
    `
    <div class="widgets">
  <div class="row table-container">
   <table id="BlueHeaderResizableTable" style="width:97%;font-size:12px" class="reportTabel">
            <thead>
             <tr *ngIf="source.optionalHeader!=null">
                    <th *ngFor="let column of source.optionalHeader"  width="{{column.width}}" [attr.colspan]="column.colspan" >
                        {{column.title}}
                    </th>
                </tr>
                <tr>
                    <th *ngFor="let column1 of source.mainHeader" width="{{column1.width}}" [hidden]="column1.hidden==1">
                        {{column1.title}}
                    </th>
                </tr>
            </thead>
            <tbody>
              <tr *ngFor=" let data of data;let i=index" [style.height]="last" [contextMenu]="myContextMenu" [contextMenuSubject]="data" [class.active]="i == selectedRowIndex">
                    <td style="white-space: pre;overflow: auto;" [style.font-weight]="data.TYPE=='G' ? 'bold' : 'inherit'" [style.text-align]="column.type=='string'?'inherit':'end'" [style.padding-left]="data.TYPE=='G' ? '3px' : '3px'" *ngFor="let column of source.mainHeader" width="{{column.width}}" [hidden]="column.hidden==1">{{data[column.mappingname]}}</td>
                  
                </tr>
            </tbody>
        </table>
  </div>
</div>
<context-menu #myContextMenu>
  <ng-template *ngFor="let action of reportDrill" contextMenuItem let-item
    (execute)="contextMenuClick($event.item,action.reportDrillValue)">
    {{ action.html(item) }}
  </ng-template>
</context-menu>
    `,
    //   <ng-template *ngFor="let action of contextMenuActions" contextMenuItem let-item
    //   [visible]="action.visible" [enabled]="action.enabled" [divider]="action.divider"
    //   (execute)="contextMenuClick($event.item,action)">
    //   {{ action.html(item) }}
    // </ng-template>
    styles: [`
    .table-container {
    height: 500px;
}
table {
    display: flex;
    flex-flow: column;
    height: 100%;
    width: 100%;
}
table thead {
    /* head takes the height it requires, 
    and it's not scaled when table is resized */
    flex: 0 0 auto;
    width: calc(100% - 0.9em);
}
table tbody {
    /* body takes all the remaining available space */
    flex: 1 1 auto;
    display: block;
    overflow-y: scroll;
}
table tbody tr {
    width: 99.6%;
}
table thead, table tbody tr {
    display: table;
    table-layout: fixed;
}
 .reportTabel tr:hover {
        background-color: #e0e0e0;
    }
    .reportTabel tr.active td {
  background-color:burlywood !important;
  color: white;
}
#BlueHeaderResizableTable>tbody>tr:last-child { 
    font-weight:bold;
font-size:14px;
height:40px; }
`],
    providers: []
})
export class ReportTable {
    @Input() reportname: string;
    @Input() source: any = <any>{};
    @Input() data: any[] = [];
    @Input() reportDrill: any[] = [];
    @Input() repordGridData: any[] = [];
    @Output() contextmenuEmit = new EventEmitter();
    @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
selectedRowIndex:number;

    constructor(private reportservice: ReportService) { }
    contextMenuClick(gridRowValue, contextMenuRowValue) {
this.selectedRowIndex=this.data.indexOf(gridRowValue);
        for (let r of contextMenuRowValue.reportParam) {
            if (r.valueFrom == "dialog") {
                for (let d of this.repordGridData)
                    if (r.param == d.param) {
                        r.value = d.value;
                    }
            }
            else if (r.valueFrom == "table") {
                Object.keys(gridRowValue).forEach((key: any) => {
                    if(r.param=="DIVISION"){this.reportservice.getDivisionList();}
                    else if(r.param=="COSTCENTER"){this.reportservice.getCostCenterList();}
                     else if(r.param=="ACID"){this.reportservice.getAcList();}
                    if (r.param == key) { r.value = gridRowValue[key]; }
                });
            }

        }
        this.contextmenuEmit.emit({ reportParamAndValues: contextMenuRowValue.reportParam,reportName:contextMenuRowValue.reportName});
    }
    //      ngAfterViewInit() {
    // let html="<div class='grip'></div>"
    //      $('<script  src="../../../assets/colResizable/colResizable-1.6.js"></script>').appendTo(document.body);
    //  $('<script type="text/javascript">	$("#BlueHeaderResizableTable").colResizable({liveDrag:true, gripInnerHtml:'+html+', draggingClass:"dragging", resizeMode:"fit" }); </script>').appendTo(document.body);

    // }
    // public contextMenuActions=this.getContextMenuList();
    // getContextMenuList(){
    //   let rdList=[];
    //   for(let rd of this.reportDrill)
    //   {
    //       rdList.push({html:(item)=>rd.title});
    //   }
    //   return rdList;
    // }
    // public contextMenuActions = [
    //       {
    //         html: (item) => `Party Ledger`,
    //         click: (item) =>////console.log("party Click"),
    //         enabled: (item) => true,
    //         visible: (item) => true,
    //       },
    //       {
    //         divider: true,
    //         visible: true,
    //       },
    //       {
    //         html: (item) => `Something else`,
    //         click: (item) => alert('Or not...'),
    //         enabled: (item) => false,
    //         visible: (item) => true,
    //       },
    //     ];

}