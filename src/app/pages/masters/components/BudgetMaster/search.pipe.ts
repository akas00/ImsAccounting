import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchData', pure: false })

export class SearchPipe implements PipeTransform {
  transform(data, query: string): any {
    if (data) {
      if (query) {
        return data.filter(item => {
          const searchedQuery = query.replace(/[^A-Z0-9]/ig, '').toLowerCase();
          const comId = (item.BUDGET_NUMBER) ? (item.BUDGET_NUMBER).replace(/[^A-Z0-9]/ig, '').toLowerCase() : '';
          const name = (item.BUDGET_NAME) ? (item.BUDGET_NAME).replace(/[^A-Z0-9]/ig, '').toLowerCase() : '';
          const fromdate = (item.FROM_DATE) ? (item.FROM_DATE).replace(/[^A-Z0-9]/ig, '').toLowerCase() : '';
          const createdon = (item.CREATED_ON) ? (item.CREATED_ON).replace(/[^A-Z0-9]/ig, '').toLowerCase() : '';
          const updatedon = (item.UPDATED_ON) ? (item.UPDATED_ON).replace(/[^A-Z0-9]/ig, '').toLowerCase() : '';
          const status = (item.STATUS) ? (item.STATUS).replace(/[^A-Z0-9]/ig, '').toLowerCase() : '';
          if (
            comId.indexOf(searchedQuery) !== -1
          ) {
            return item;
          }else if (
            name.indexOf(searchedQuery) !== -1
          ) {
            return item;
          }else if (
            fromdate.indexOf(searchedQuery) !== -1
          ) {
            return item;
          }else if (
            createdon.indexOf(searchedQuery) !== -1
          ) {
            return item;
          }else if (
            updatedon.indexOf(searchedQuery) !== -1
          ) {
            return item;
          }else if (
            status.indexOf(searchedQuery) !== -1
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