

import { AuthService } from '../../../common/services/permission/authService.service';
import { Component } from '@angular/core';

@Component({
  selector: 'fiscalyear',
  templateUrl: './fiscalyear.component.html',
})
export class fiscalyearComponent {
  
  userProfile: any = <any>{};
  constructor( authservice: AuthService
    ) {
      
      this.userProfile = authservice.getUserProfile();
      this.FYLIST.push(this.userProfile.CompanyInfo);
      this.FY = this.FYLIST[0].PhiscalID;



  }

 
  showFiscalYearPopUp : boolean = false;
  PhiscalYearList:any[]=[];
  NewPhiscalYear:string;
  FYClose:string;
  FY:string;FYLIST:any[]=[];
  ChangeFY(value){
    // if(value=='changeFY')
    // {
    //   this._service.getAllPhiscalYear().subscribe(res=>{
    //   if(res.status=='ok'){
    //     this.PhiscalYearList = res.result.result;
    //     this.NewPhiscalYear = this.PhiscalYearList[0].PhiscalID;
    //     this.checkBookClose( this.PhiscalYearList[0].FYClose);
    //     }
    //   }
        
    //     )
    //   this.showFiscalYearPopUp = true;
    // }
  }
  checkBookClose(value){
    this.FYClose = value == 0 ? "No":"Yes";
  }
  onClickChangeFY(){
    // this._service.updatePhiscalYear(this.NewPhiscalYear).subscribe(res=>{
    //   if(res.status == 'ok'){
    //     this.showFiscalYearPopUp = false;
        
        
         
    //       this._service.Relogin(this.userProfile.username)
    //       .subscribe(
    //         data => {
    //           window.location.reload();
    //         },
           
            
    //       )
       
       
    //   }
    // })
  }
  onClickCancelFY(){
    this.showFiscalYearPopUp = false;
    this.FY = this.FYLIST[0].PhiscalID;
  }
  changeFY(value){
    for(let i of this.PhiscalYearList){
      if(i.PhiscalID == value){
        this.checkBookClose(i.FYClose);
      }
    }
    
  }

}
