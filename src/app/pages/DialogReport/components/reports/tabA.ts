import { Component, Input } from '@angular/core';

@Component({
    selector: 'tabA',
    styles: [`
    .pane{
      padding: 1em;
    }
  `],
    template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class TabA {
    @Input('tabTitle') title: string;
    @Input() active = true;
    
}