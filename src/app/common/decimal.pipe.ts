import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'convertToDecimal' })
export class ConvertToDecimalPipe implements PipeTransform {
    transform(value: any, decimalPlace: any) {
            return parseFloat(value).toFixed(decimalPlace)
    }
}