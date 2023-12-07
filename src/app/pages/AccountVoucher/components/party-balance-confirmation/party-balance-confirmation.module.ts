import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PartyBalanceConfirmationComponent} from './party-balance-confirmation.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PartyBalanceConfirmationComponent
    ],
    exports: [
        PartyBalanceConfirmationComponent
    ]
})
export class PartyBalanceConfirmationModule {}
