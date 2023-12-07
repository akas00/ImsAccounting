import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../../../common/popupLists/report-filter/report-filter.module';
import { CanActivateTeam } from '../../../common/services/permission/guard.service';
import { CacheService } from '../../../common/services/permission';
import { BudgetComponent } from './budget.component';
import { BudgetService } from './budget.service';
import { BudgetRoutingModule } from './budget.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BudgetRoutingModule,
    ReportFilterModule.forRoot()

  ],
  declarations: [
    BudgetComponent,
  ],
  providers: [
    CanActivateTeam,
    BudgetService,
    CacheService,
  ]
})
export class BudgetModule {
}
