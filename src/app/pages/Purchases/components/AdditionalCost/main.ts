import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import './polyfills';
import { environment } from './environments/environment';
import { AppModule } from './app.module';


if (environment.production) {
    window.//console.log = () => { }
}
platformBrowserDynamic().bootstrapModule(AppModule);


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/