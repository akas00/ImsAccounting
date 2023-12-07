import { SessionStorage } from "./sessionStorage.service";
import { Injectable } from '@angular/core'
export class CACHE_CONSTANT {
  USER_PROFILE: string
  TOKEN: string
};

@Injectable()
export class CacheService {
  constructor() {
  }

  remove(key: string) {
    if (this.exist) localStorage.removeItem(key)
  }
  exist(key: string): boolean {
    return localStorage.getItem(key) != null
  }
  get(key: string): any {
    if (!this.exist(key)) {
      return null;
    }
    let data: any = localStorage.getItem(key);
    return JSON.parse(data);
  }
  set(key: string, data: any): any {
    localStorage.setItem(key, JSON.stringify(data));
  }

  checkUserRight(right: string) {
    let user_profile: any = localStorage.getItem('USER_PROFILE')
    let user_rights: any;
    var result;
    if (user_profile) {
      user_rights = user_profile.userRights;
      if (user_rights) {
        result = user_rights[right]
      }
    }
    return result;
  }
}
