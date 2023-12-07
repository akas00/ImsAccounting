import { Component, ViewContainerRef, HostListener } from '@angular/core';
import { GlobalState } from './global.state';
import { BaImageLoaderService, BaMenuService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme/theme.config';
import { layoutPaths } from './theme/theme.constants';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'style-loader!./app.scss';
import 'style-loader!./theme/initial.scss';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from './common/services/alert/alert.service';






/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {

  isMenuCollapsed: boolean = false;
  constructor(private _state: GlobalState,
    private _imageLoader: BaImageLoaderService,
    private _spinner: BaThemeSpinner,
    private viewContainerRef: ViewContainerRef,
    private themeConfig: BaThemeConfig,
    private http: Http,
   private _service:BaMenuService,
   private alertService:AlertService) {


    themeConfig.config();
    // this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this.http.get("/appConfig.json")
      .map(res => res.json())
      .subscribe(data => {
        this._state.setGlobalSetting("apiUrl", [data.apiUrl])
      }, error => {
        this._state.setGlobalSetting("apiUrl", ["http://himshang.com.np:8081/api"])
      });

    this.startTimer();
    
  }

  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
    });

  }
  ticks = 0;
  sub: Subscription;
  private startTimer() {
    try {
      let header = new Headers({ 'content-type': 'application/json' });
      let option = new RequestOptions({ headers: header })
      let timer = Observable.timer(1, 10000);
      this.sub = timer.subscribe(
        t => {
          this.ticks = t;
          var apicall = this._state.getGlobalSetting("apiUrl") + "/TestConnection";
          this.http.get(apicall, option).subscribe(x => { }),
            () => { },
            error => { };
        }
      );
    } catch (ex) { }
  }
  private _loadImages(): void {
    // register some loaders
    BaThemePreloader.registerLoader(this._imageLoader.load(layoutPaths.images.root + 'sky-bg.jpg'));
  }
  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) {
  if ($event.code == "F11" && $event.ctrlKey) {
    $event.preventDefault();
    // if(this.currentUser){
      
      this.updateDatabase();
    // }
  }

  if ($event.code == "F9" && $event.ctrlKey) {
    $event.preventDefault();
    // if(this.currentUser){
      
      this.updateDatabaseNewQuery();
    // }
  }
}
updateDatabase(){
this._service.updateDatabase().subscribe((res:any)=>{
  if(res.status == 'ok'){
    console.log("success", res.result);
    this.alertService.success(res.result);
  }else{
    this.alertService.info(res.result);
  }
})
}

updateDatabaseNewQuery(){
  this._service.updateDatabaseNewQuery().subscribe((res:any)=>{
    if(res.status == 'ok'){
      console.log("success", res.result);
      this.alertService.success(res.result);
    }else{
      this.alertService.info(res.result);
    }
  })
  }
}
