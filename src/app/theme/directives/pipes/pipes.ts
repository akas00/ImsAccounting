import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], key, term): any { 
        ////console.log(items); 
        if(key == null || key == undefined || key == "") return items;
        if(term == null || term == undefined || term == "") return items;
        return term 
            ? items.filter(item => 
                item[key] != undefined 
                && item[key] != null 
                && item[key].toLowerCase().indexOf(term.toLowerCase()) !== -1)
            : items;
    }
}

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    transform(items: any[], sortedBy: string): any {
        ////console.log('sortedBy', sortedBy);
        return items.sort((a, b) => {return b[sortedBy] - a[sortedBy]});
    }
} 

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}
