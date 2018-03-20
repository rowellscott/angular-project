import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], field: string, searchText: string): any[] {
    if(!items) {
      return []
    };
    
    if(!searchText){
      return items;
    };

searchText = searchText.toLowerCase();

return items.filter( it => {
      return it[field].toLowerCase().includes(searchText);
    });
   }

  // items =clients, field=client[lastName], value=pattern
  // transform(items: any[], field: string, value: string): any {
  //   if (!items) {
  //     return [];
  //   }

  //   if (!value) {
  //     return items;
  //   }

  //   const myPattern = new RegExp(value, 'i');
  //   return items.filter(it => it[field].match(myPattern));
  // }
}

