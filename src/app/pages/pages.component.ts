import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MasterRepo } from "./../common/repositories/masterRepo.service";
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { NotificationPopUpComponent } from '../common/popupLists/notification/notification-popup-grid.component';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top class="custom-page-top"></ba-page-top>
    <div class="al-main custom-page-body">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
        <alert></alert>
        <spinner></spinner>
        <navigation-preventor></navigation-preventor> 
       
       
      </div>
    </div>
    <pages-footer></pages-footer>
    <ba-back-top position="200"></ba-back-top>
    <notification-popup-grid #notification 
    (notificationCountUpdate)="updateNotificationCount($event)"
    >
    </notification-popup-grid>
    `
})
export class Pages implements OnInit, AfterViewInit {

  @ViewChild("notification") notification: NotificationPopUpComponent;
  notificationCount: number = 0;
  isActive: boolean = false;

  constructor(
    private masterRepService: MasterRepo,
    private _menuService: BaMenuService
  ) {

  }

  ngAfterViewInit() {
    this.getNotificationCount();
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    this.masterRepService.getCurrentDate().subscribe(date => { });
  }

  toggleNotificationPopup() {
    this.notification.toggle();
  }

  getNotificationCount() {
    //this.notificationCount = 2
    this.notification.getNotificationCount();
  }

  updateNotificationCount(count) {
    this.notificationCount = count;
  }

  updateNotification() {
    this.notification.refresh();
  }
}

