//import {LocalDataSource} from 'ng2-smart-table/ng2-smart-table/lib';
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { Component } from "@angular/core";
import { LocalDataSource } from "../../../../node_modules/ng2-smart-table/";
import "style-loader!./smartTables.scss";

import { AddUserService } from "./adduser.service";
import { Router } from "@angular/router";
import { AlertService } from "../../../../common/services/alert/alert.service";
@Component({
  selector: "user-list",
  templateUrl: "./userList.component.html",
  styleUrls:["./userList.component.css"],
  providers: [AddUserService]
})
export class UserList {
  query: string = "";
  userManager: any;
  userList: any = [];
  roleList: any = [];


  settings = {
    mode: "external",
    add: {
      addButtonContent: "Add",
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },
    edit: {
      editButtonContent: "Edit",
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      username: {
        title: "User Name",
        type: "text"
      },
      email: {
        title: "Email",
        type: "text"
      },
      role: {
        title: "Role",
        type: "text"
      }
    }
  };
  roleSettings = {
    mode: "external",
    add: {
      addButtonContent: "",
      createButtonContent: "",
      cancelButtonContent: ""
    },
    edit: {
      editButtonContent: "Edit",
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },
    delete: {
      deleteButtonContent: ""
    },
    columns: {
      rolename: {
        title: "Role Name",
        type: "text"
      },
      role: {
        title: "Role",
        type: "text"
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  roleSource: LocalDataSource = new LocalDataSource();

  constructor(
    private adduserService: AddUserService,
    private router: Router,
    private masterService: MasterRepo,
    private alertService:AlertService
  ) {
    this.userManager = 'user';
    // try {
    //   let data: Array<any> = [];
    //   this.adduserService
    //     .getUserList()
    //     .flatMap(d => d || [])
    //     .subscribe(
    //       res => {
    //         data.push(<any>res);
    //         this.source.load(data);
    //         ////console.log("@source", this.source)
    //       },
    //       error => {
    //         this.masterService.resolveError(error, "userList - getUserList");
    //       }
    //     );

    //   let roleData: Array<any> = [];
    //   this.adduserService.getRoleList().subscribe(res => {
    //     this.roleSource.load(res.result);
    //   });
    // } catch (ex) {
    //   alert(ex);
    // }
  }

  ngOnInit(){
    this.adduserService.getUserList().subscribe((res:any)=>{
      if(res){
        // ////console.log("@user list result", res);
        this.userList = res? res:[];
        // ////console.log("@user list data", this.userList);
      }else{
        this.userList = [];
        // ////console.log("Couldn't load user list");
      }
    },
    err=>{
      this.userList = [];
      // ////console.log("Couldn't load user list")
    });

    this.adduserService.getRoleList().subscribe((res:any)=>{
      if(res){
        this.roleList = res? res.result:[];
        // ////console.log("@role list reuslt",this.roleList);
      }else{
        this.roleList = [];
        // ////console.log("Couldn't load roe list");
      }
    }, err=>{
      this.roleList = [];
      // ////console.log("Couldn't load role list")
    });
    
  }

  openRoleList(){
    this.userManager="role";
  }

  openUserList(){
    this.userManager='user';
  }

  onAddClick(): void {
    try {
      //this.divService.create();
      this.router.navigate([
        "/pages/configuration/userManager/adduser",
        { mode: "user", returnUrl: this.router.url }
      ]);
      //window.alert("test add");
    } catch (ex) {
      alert(ex);
    }
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.adduserService.deleteUser(event).subscribe((data:any)=>{
        if(data.status=="ok"){
          this.alertService.success(data.result);
          this.getUserList()
        }
      })
      // event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEditClick(user): void {
    try {
      this.router.navigate([
        "pages/configuration/userManager/adduser",
        { mode: "edit", user: user.username, returnUrl: this.router.url }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }

  addRole(): void {
    try {
      this.router.navigate([
        "/pages/configuration/userManager/adduser",
        { mode: "role", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }

  onRoleEditClick(role) {
    try {
      this.router.navigate([
        "/pages/configuration/userManager/adduser",
        { mode: "editRole",rolename:role.rolename, returnUrl: this.router.url }
      ]);
    } catch (error) {
      alert(error);
    }
  }
  getUserList(){
    this.adduserService.getUserList().subscribe((res:any)=>{
      if(res){
        this.userList = res? res:[];
        // //console.log("@user list data", this.userList);
      }else{
        this.userList = [];
        // //console.log("Couldn't load user list");
      }
    },
    err=>{
      this.userList = [];
      // //console.log("Couldn't load user list")
    });
  }
}
