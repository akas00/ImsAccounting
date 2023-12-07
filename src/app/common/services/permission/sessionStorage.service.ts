
import {Injectable} from '@angular/core';

@Injectable()
export class SessionStorage{

exist(key: string): boolean {
    return window.sessionStorage.getItem(key) != null;
}
remove(key: string) {
    window.sessionStorage.removeItem(key);
}
set(key: string, data: any) {
    window.sessionStorage.setItem(key, JSON.stringify(data));
    
}
get(key: string): any {
    if (!this.exist(key)) {
        return null;
    }
    let data: any = window.sessionStorage.getItem(key);
    return JSON.parse(data);
}
}