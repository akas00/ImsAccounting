import { Injectable } from '@angular/core';
import { AngularIndexedDB } from '../../node_modules/angular2-indexeddb';
@Injectable()
export class IndexedDbWrapper {
    private _db: AngularIndexedDB;
    public get dbHelper(): AngularIndexedDB {
        this._db.createStore(3, null);
        return this._db;
    }
    constructor() {
        this._db = new AngularIndexedDB('POSDB', 3);
        this._db.createStore(3, (evt) => {
            let objectStore = evt.currentTarget.result.createObjectStore(
                'PRODUCT', { keyPath: "MCODE", autoIncrement: false });
            objectStore.createIndex('EDATE', 'EDATE', { unique: false });
        });
    }

    
}