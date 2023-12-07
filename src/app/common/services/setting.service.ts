import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { AuthService } from "./permission/authService.service";
import { AppSettings } from './AppSettings';
interface Dictionary {
  [index: string]: any
}

@Injectable()
export class SettingService {
  appSetting: AppSettings

  private cacheSetting;
  constructor(private authService: AuthService, private apSetting: AppSettings) {
    this.appSetting = apSetting;
    let userProfile = authService.getUserProfile()
    this.cacheSetting = authService.getSetting();
  }
}
