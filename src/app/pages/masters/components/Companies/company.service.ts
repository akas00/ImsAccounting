import { Injectable } from '@angular/core'
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { IDivision } from "../../../../common/interfaces/commonInterface.interface";

@Injectable()
export class DivisionService {
    divisions: Array<IDivision>;
    constructor(private masterRepoService: MasterRepo) {
        
    }
    /*
    function get(id: any) {
    let connector = window.ioc.resolve("IConnector");
    let url = String.format("{0}divisions/{1}", configHelper.getAppConfig().api.baseUrl, id);
    //return connector.get(url);
    let divRepo:IDivisionRepo = window.ioc.resolve("IDivisionRepo");
    //let obj = divRepo.divisions.find(x=>x.initial===id);
    let obj = divRepo.divisions[0];
    let def = PromiseFactory.create();
    setTimeout(function(){
            def.resolve(obj);
        },1);
        return def;
}*/
    create(): void{
        let div: IDivision = <IDivision>{};
        div.INITIAL = 'MYX'; div.NAME; 'Maro'; div.ID = '32';
        this.divisions.push(div);
        //this.masterRepoService.subjectDivision.next(this.divisions);
        /*return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(div);
            }, 1);
        })*/


    }
/*
function update(division: any) {
    let connector = window.ioc.resolve("IConnector");
    let url = String.format("{0}divisions/{1}", configHelper.getAppConfig().api.baseUrl, division.id);
    //return connector.put(url, role);
   let divRepo:IDivisionRepo = window.ioc.resolve("IDivisionRepo");
   //let toUpdate = divRepo.divisions.find(x=> x.initial===division.initial);
   let toUpdate = divRepo.divisions[0];
   toUpdate.name= division.name;
   let def = PromiseFactory.create();
    setTimeout(function(){
        def.resolve(division);
    },1);
    return def;
}
function remove(id: any) {
    let connector = window.ioc.resolve("IConnector");
    let url = String.format("{0}divisions/{1}", configHelper.getAppConfig().api.baseUrl, id);
    //return connector.delete(url);
    let divRepo:IDivisionRepo = window.ioc.resolve("IDivisionRepo");
    //divRepo.divisions.splice(divRepo.divisions.indexOf( divRepo.divisions.find(x=>x.initial===id)),1);
    divRepo.divisions.splice(divRepo.divisions.indexOf( divRepo.divisions[0]),1);
    let def = PromiseFactory.create();
    setTimeout(function(){
        def.resolve(id);
    },1);
    return def;

}*/

}