import {FormGroup,AbstractControl} from '@angular/forms'
export class EditPasswordValidator{
  public static validate(edit){
    return (c:AbstractControl)=>{
      if(edit=='add'){
        if(c.value ==""){
          return {editPasswordValidate:{valid:false}};
        }
        if(c.value.length < 5){
          return {editPasswordValidate:{valid:false}};
        }
        return null;
      }
     return null; 
    }
  }
}
