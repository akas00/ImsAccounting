import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchData', pure: false })

export class SearchPipe implements PipeTransform {
  transform(data, query: string): any {
    if (data) {
      if (query) {
        return data.filter(item => {
          const searchedQuery = query.replace(/[^A-Z0-9]/ig, '').toLowerCase();
          const comId = (item.CAPITALPURCHASE_VCHRNO) ? (item.CAPITALPURCHASE_VCHRNO).replace(/[^A-Z0-9]/ig, '').toLowerCase() : '';
          if (
            comId.indexOf(searchedQuery) !== -1
          ) {
            return item;
          }
        });
      
      } else {
        return data;
      }
    }
  }
}