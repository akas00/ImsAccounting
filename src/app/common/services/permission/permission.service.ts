import {UserToken} from './userToken.service';
import {Injectable} from '@angular/core'
@Injectable()
export class Permissions {
  constructor(){

  }
  canActivate(user: UserToken, id: string): boolean {
    return true;
  }
}