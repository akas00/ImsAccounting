import {NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NepaliDatePickerComponent} from './nepali-date-picker.component'

@NgModule({
    imports: [ReactiveFormsModule,FormsModule],
    declarations: [NepaliDatePickerComponent],
    exports: [NepaliDatePickerComponent]
})

export class NepaliDatePickerModule{}