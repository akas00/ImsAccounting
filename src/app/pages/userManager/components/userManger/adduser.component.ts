import { Component, OnInit, ViewChild } from "@angular/core";
import { PAGES_MENU } from "../../../../../app/pages/pages.menu";
import * as _ from "lodash";
import { Routes, ActivatedRoute, Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray
} from "@angular/forms";
import "style-loader!./grid.scss";
import { AddUserService } from "./adduser.service";
import { EditPasswordValidator } from "../../../../theme/validators";
import { ModalDirective } from "ng2-bootstrap";
import { Warehouse, Division } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AuthService } from "../../../../common/services/permission";

@Component({
  selector: "user-manager",
  templateUrl: "./adduser.component.html",
  styleUrls: ["./adduser.component.css"],
  providers: [AddUserService]
})
export class AddUser implements OnInit {
  @ViewChild("childModal") childModal: ModalDirective;
  @ViewChild("loginModal") loginModal: ModalDirective;
  DialogMessage: string = "Saving data please wait ...";
  mode: string = "add"; //mode of the form add or edit
  modeTitile: string = "Add user";
  userForm: FormGroup; //main form
  userMenuList = []; //list data menulist of user
  items = []; //converted array of usermenu from main menu
  userRightList = []; //list of rights of user or empty {right,description,value,valutype}
  userType: string = "group"; //default user type ie, usergroup or user
  warehouseList: Warehouse[] = [];
  divisionWarehouseList: Warehouse[] = [];
  divisionList: Division[] = [];
  userdivisionList: Division[] = [];
  private returnUrl: string;
  private user: string;
  private roleList: any;
  productCategoryList = [];
  private userProfile: any
  latepostedit: number = 0;
  latepostdelete: number = 0;
  AllowReverseEntry: number = 0;
  StockAgeingLimit: number = 0;
  ShowDashboard:number = 0;

  //source: LocalDataSource = new LocalDataSource();
  constructor(
    private loadingService: SpinnerService,
    private alertService: AlertService,
    private masterService: MasterRepo,
    private fb: FormBuilder,
    private addUserService: AddUserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _authService: AuthService
  ) {
    try {
      //getting parameter passed

      this.returnUrl = this.activatedRoute.snapshot.params["returnUrl"] || "";
      this.mode = this.activatedRoute.snapshot.params["mode"];
      this.userType = this.activatedRoute.snapshot.params["group"] || "";
      this.user = this.activatedRoute.snapshot.params["user"];
      this.masterService.refreshTransactionList();
      this.masterService.getWarehouse().subscribe(res => {
        this.warehouseList.push(<Warehouse>res);
      });
      this.masterService.getAllDivisions().subscribe(res => {
        this.divisionList.push(<Division>res);
        this.userdivisionList.push(<Division>res);


      });
      this.addUserService.getRoleList().subscribe(res => {
        this.roleList = res.result;
      });
      this.userProfile = this._authService.getUserProfile()

      ////console.log("user Profiles", this.userProfile);
      ////console.log("login profile", this.userProfile.CompanyInfo.LoginProfile);
    } catch (ex) {
      alert(ex);
    }
  }
  public roleForm: FormGroup;
  ngAfterViewinit() {

  }
  ngOnInit() {
    try {

      this.userForm = this.fb.group({
        username: ["", [Validators.required]],
        password: ["", Validators.compose([EditPasswordValidator.validate(this.mode)])],
        email: ["", [Validators.required]],
        division: [""],
        warehouse: [""],
        role: [""],
        ISACTIVE: [1],
        PCL: ["pc001"],
        LoginProfile: ["user_login"]

      });
      // this.getProductCategoryName();
      this.roleForm = this.fb.group({
        role: new FormControl("A", [Validators.required]),
        roleName: new FormControl("", [Validators.required]),
        menuRights: this.fb.array([]),
        userRights: this.fb.array([])
      });

      //
      if (this.mode == "edit") {
        this.modeTitile = "Editing User";
        this.addUserService.getUserProfile(this.user).subscribe(data => {
          console.log("CheckDataProfile", data)
          console.log('vvv',data.result.StockAgeingLimit)
          if (data.status == "ok") {
            this.userForm.controls["username"].patchValue(data.result.username);
            this.userForm.controls["email"].patchValue(data.result.email);
            this.userForm.controls["role"].patchValue(data.result.role);
            this.userForm.controls["division"].patchValue(data.result.division);
            this.userForm.controls["warehouse"].patchValue(
              data.result.warehouse
            );
            this.userForm.controls["ISACTIVE"].patchValue(data.result.ISACTIVE);
            this.userForm.controls["PCL"].patchValue(data.result.PCL);
            this.userForm.controls["LoginProfile"].patchValue(data.result.LoginProfile);
            this.latepostedit=data.result.latepostedit;
            this.latepostdelete=data.result.latepostdelete;
            this.AllowReverseEntry = data.result.AllowReverseEntry;
            this.StockAgeingLimit = data.result.StockAgeingLimit?data.result.StockAgeingLimit:0;
            this.ShowDashboard = data.result.ShowDashboard;
          }
        });



      }
      else if (this.mode == "user") {
        this.modeTitile = "Add User";


        let convertedMenuObject: Routes = _.cloneDeep(<Routes>PAGES_MENU);
        convertedMenuObject.forEach(route => {
          route.children.forEach(child => {
            this._convertObjectToItem(child, this.items, 1);
          });
        });
        this.initUserMenu();
        this.getRoleUserRights();

      }
      else if (this.mode == "role" || this.mode == "editRole") {
        let convertedMenuObject: Routes = _.cloneDeep(<Routes>PAGES_MENU);
        convertedMenuObject.forEach(route => {
          route.children.forEach(child => {
            this._convertObjectToItem(child, this.items, 1);
          });
        });

        if (this.mode == "role") {

          this.modeTitile = "Add Role";
          this.initUserMenu();


          this.getRoleUserRights();



        } else if (this.mode == "editRole") {
          this.modeTitile = "Edit Role";
          this.getRoleDetail(this.activatedRoute.snapshot.params["rolename"]);
        }

      }
      if (this.mode == "edit") {
        // this.addUserService.getUserProfile(this.user).subscribe(data => {
        //   if (data.status == "ok") {
        //     this.userForm.controls["username"].patchValue(data.result.username);
        //     this.userForm.controls["email"].patchValue(data.result.email);
        //     this.userForm.controls["role"].patchValue(data.result.role);
        //     this.userForm.controls["division"].patchValue(data.result.division);
        //     this.userForm.controls["warehouse"].patchValue(
        //       data.result.warehouse
        //     );
        //   }
        // });
      }
      //  else if (this.mode == "editRole") {
      //   // this.loadingService.show(
      //   //   "Please wait! Getting menu rights and user rights..."
      //   // );
      //   this.addUserService
      //     .getRightList()
      //     .map(data => {
      //       let rightsList: Array<any>;
      //       data.result.forEach(right => {
      //         // ////console.log("rights",right);
      //         if (right.value == 1) {
      //           right.value = true;
      //         } else {
      //           right.value = false;
      //         }
      //       });
      //       return data;
      //     })
      //     .subscribe(data => {
      //       this.loadingService.hide();
      //       this.userRightList = data.result;
      //       this.initUserMenu();
      //       this.initUserRights();
      //     });
      // }
    } catch (ex) {
      alert(ex);
    }
  }
  ngAfterViewInit() {

    if (this.mode == "edit") {
      if (this.masterService.userSetting.userwisedivision == 1) {
        this.addUserService.getUserDivList(this.user).subscribe(data => {
          if (data.status == "ok") {
            for (let i of data.result) {
              for (let x of this.userdivisionList) {
                if (i.isSelected == 1) {

                  if (x.INITIAL == i.Division) {
                    x.isCheck = true;
                  }
                }
                if (i.isSelected_trn == 1) {

                  if (x.INITIAL == i.Division) {
                    x.isCheck_trn = true;
                  }
                }

              }

            }
          }
        })
      }
      if (this.userdivisionList.every(x => x.isCheck == true)) {
        this.SelectAll = true;
      }
      if (this.userdivisionList.every(x => x.isCheck_trn == true)) {
        this.SelectAll_trn = true;
      }

    }
  }
  getRoleUserRights() {
    this.masterService.getRoleUserRights().subscribe((res: any) => {
      if (res.status == "ok") {

        for (let i of res.result.result) {
          let x: any = <any>{};
          let data_type = i.data_type;
          let value = i.value;
          let rightname = i.right;
          let right = { data_type: data_type, value: value, right: rightname };
          this.userRightList.push(right);

        }
        this.initUserRights();
      } else {

      }
    }, err => {

    });
  }
  //initializing the menu contols
  initUserMenu() {
    try {
      const control = <FormArray>this.roleForm.controls["menuRights"];
      ////console.log("checkValue",this.roleForm)
      this.items.forEach((usermenu: userMenu) => {
        let fgroup = this.fb.group({
          title: new FormControl({ value: usermenu.title, disabled: true }),
          path: new FormControl(usermenu.path),
          view: new FormControl(false),
          add: new FormControl(false),
          edit: new FormControl(false),
          delete: new FormControl(false),
          print: new FormControl(false),
          import: new FormControl(false),
          export: new FormControl(false),
          post: new FormControl(false),
          L_edit: new FormControl(false),
          L_delete: new FormControl(false)
        });

        control.push(fgroup);
      });


    } catch (ex) {
      alert(ex);
    }
  }
  //property maping
  public checkboxPropertiesMapping = {
    model: "value",
    value: "right",
    label: "description",
    baCheckboxClass: "class"
  };
  //initializing user rights controls in formgroup
  initUserRights() {
    try {

      const control = <FormArray>this.roleForm.controls["userRights"];
      let fgroup;
      this.userRightList
        .map(right => {
          right.valueType = right.data_type;
          if (right.valueType == "tinyint") {
            right.value = right.value == 0 ? false : true;
          } else if (
            right.valueType == "numeric" ||
            right.valueType == "decimal" ||
            right.valueType == "float"
          ) {
            if (right.value == "") right.value = 0;
          } else {
            if (right.value == null || right.value == "") {
              right.value = "";
            }
          }

          return right;
        })
        .forEach(right => {
          fgroup = this.fb.group({
            path: new FormControl({ value: right.description, disabled: true }),
            right: right.right,
            value: right.value,
            valueType: [right.data_type]
          });
          // ////console.log("checkValue%%%", fgroup)
          control.push(fgroup);
        });
    } catch (ex) {
      alert(ex);
    }
  }

  //DIVISIONLIST TO SELECT
  setDivisionList() { }

  //conversion function to from menuobject to array
  protected _convertObjectToItem(
    object,
    items: Array<userMenu>,
    level: number,
    parent?: any
  ): void {
    try {
      let item: userMenu = <userMenu>{};
      if (object.data && object.data.menu) {
        level = level + 2;
        item.path = object.path;
        item.title = Array(level).join("  ") + object.data.menu.title;
        item.add = false;
        item.delete = false;
        item.edit = false;
        item.print = false;
        item.export = false;
        item.import = false;
        item.view = true;
        item.post = false;
        items.push(item);
      }
      if (object.data && object.children && object.children.length > 0) {
        object.children.forEach(child => {
          this._convertObjectToItem(child, items, level + 1);
        });
      }
    } catch (ex) {
      alert(ex);
    }
  }
  saveData(data: any) {

    try {
      //console.log("ChecKVAke", data)
      if (this.mode == "user" || this.mode == "edit") {
        this.addUserService.saveUser(data).subscribe(
          data => {
            if (data.status == "ok") {
              if (this.mode == "user") {
                this.alertService.success("User created successfully");
              } else if (this.mode == "edit") {
                this.alertService.success("User updated successfully");
              }
              this.router.navigate([this.returnUrl]);
            } else {
              if (
                data.result._body ==
                "The ConnectionString property has not been initialized."
              ) {
                this.loginModal.show();
                return;
              }
              this.alertService.error(
                "Error in saving data:",
                data.result._body
              );
            }
          },
          Error => {
            try {
              if (Error.status != 200) {
                this.alertService.error(Error.json());
              }
            } catch (e) {
              this.alertService.error(e);
            }
          }
        );
      } else if (this.mode == "role" || this.mode == "editRole") {
        this.loadingService.show("Saving data please wait....");
        this.addUserService.saveRole(data).subscribe(res => {
          this.loadingService.hide();
          this.alertService.success(res.result);
          this.router.navigate([this.returnUrl]);
        }, error => {
          this.loadingService.hide();
          this.alertService.error(error);
        });
      }
    } catch (ex) {
      alert(ex);
      this.DialogMessage = ex;
      setTimeout(() => {
        this.childModal.hide();
      }, 3000);
    }
  }

  onSubmit() {
    let canSubmit: boolean = false;
    if (this.mode == "user") {
      if (this.userForm.valid) {
        canSubmit = true;
      }
    } else if (this.mode == "role" || this.mode == "editRole") {
      if (this.roleForm.valid) {
        canSubmit = true;
      }
    } else if (this.mode == "edit") {
      canSubmit = true;
    }

    if (canSubmit) {
      try {
        let data = this.prepareToSave();

        if (data) {
          this.saveData(data);
        }
      } catch (ex) {
        this.alertService.warning(ex);
      }
    } else {
      this.alertService.warning("Please Fill all the required fields");
    }
  }

  findMenuRights(menuname: string, menus: any, rt: string): boolean {
    try {
      // if (this.mode == "role") {
      //   return false;
      // }
      // if (menuname == "" || menuname == undefined || menuname == null) {
      //   return false;
      // }
      // let index = 0;
      // ////console.log("rightCheck",menuname,rt,menus);
      let men = menus && menus.length>0 && menus.filter(x => x.menu == menuname)[0];
      if (men != null) {
        return men.right.indexOf(rt) > -1;
      }
      //   for (index; index < menus.length; index++) {
      // menus.forEach(menu => {

      //  // ////console.log("menuss",menuname,menu);
      //   if (menu.menu == menuname) {
      //    // //console.log(menu.menu, menuname, _.includes(menu.right, rt));
      //    return menu.right.indexOf(rt) > -1;
      //    // return _.includes(menu.right, rt);
      //   } else {
      //     return false;
      //   }
      // });
      //   });
      return false;
    } catch (ex) {
      alert(ex);
    }
  }

  MenuRights(menuname: string, menus: any, rt: string): boolean {
    try {
      let men = menus && menus.length>0 && menus.filter(x => x.menu == menuname)[0];
      if (men != null) {
        return men.right.indexOf(rt) > -1;
      }
      return false;
    } catch (ex) {
      alert(ex);
    }
  }
  prepareToSave() {
    let saveObj: any;
    try {
      if (this.mode == "user") {
        if (
          this.userForm.controls["username"].status == "INVALID" ||
          this.userForm.controls["password"].status == "INVALID" ||
          this.userForm.controls["email"].status == "INVALID" ||
          this.userForm.controls["role"].status == "INVALID" ||
          this.userForm.controls["division"].status == "INVALID" ||
          this.userForm.controls["warehouse"].status == "INVALID" ||
          this.userForm.controls["PCL"].status == "INVALID"
        ) {
          return null;
        }
        saveObj = {
          username: this.userForm.controls["username"].value,
          password: this.userForm.controls["password"].value,
          email: this.userForm.controls["email"].value,
          role: this.userForm.controls["role"].value,
          division: this.userForm.controls["division"].value,
          warehouse: this.userForm.controls["warehouse"].value,
          ISACTIVE: this.userForm.controls['ISACTIVE'].value,
          LoginProfile: this.userForm.controls["LoginProfile"].value,
          PCL: this.userForm.controls["PCL"].value,
          latepostedit: this.latepostedit,
          latepostdelete: this.latepostdelete,
          AllowReverseEntry: this.AllowReverseEntry,
          StockAgeingLimit: this.StockAgeingLimit,
          ShowDashboard:this.ShowDashboard
        };

      } else if (this.mode == "edit") {
        saveObj = {
          username: this.userForm.controls["username"].value,
          password: this.userForm.controls["password"].value,
          email: this.userForm.controls["email"].value,
          role: this.userForm.controls["role"].value,
          division: this.userForm.controls["division"].value,
          warehouse: this.userForm.controls["warehouse"].value,
          ISACTIVE: this.userForm.controls['ISACTIVE'].value,
          LoginProfile: this.userForm.controls["LoginProfile"].value,
          PCL: this.userForm.controls["PCL"].value,
          latepostedit: this.latepostedit,
          latepostdelete: this.latepostdelete,
          AllowReverseEntry: this.AllowReverseEntry,
          StockAgeingLimit: this.StockAgeingLimit,
          ShowDashboard:this.ShowDashboard
        };
      } else if (this.mode == "role" || this.mode == "editRole") {
        if (
          this.roleForm.controls["role"].status == "INVALID" ||
          this.roleForm.controls["roleName"].status == "INVALID"
        ) {
          return null;
        }

        let ctl = this.roleForm.value.menuRights;
        let mRights = [];
        ctl.forEach(menu => {
          let rights = [];
          for (var prop in menu) {
            if (typeof menu[prop] === "boolean") {
              if (menu[prop] == true) {
                rights.push(prop);
              }
            }
          }
          if (rights.length > 0) {
            mRights.push({ menu: menu["path"], right: rights });
          }
        });
        // ////console.log("checkUserRights", this.roleForm.value.userRights)
        let uRights = [];
        this.roleForm.value.userRights.forEach(right => {
          if (right.valueType == "tinyint") {
            if (right.value == true) {
              right.value = 1;
            } else {
              right.value = 0;
            }
          }
          if (
            right.valueType == "numeric" ||
            right.valueType == "decimal" ||
            right.valueType == "float"
          ) {
            if (right.value == "") right.value = 0;
            if (Number.isNaN(Number(right.value))) right.value = 0;
          }
          uRights.push(right);
        });

        saveObj = {
          role: this.roleForm.controls["role"].value,
          roleName: this.roleForm.controls["roleName"].value,
          menuRights: mRights,
          userRights: uRights,
        };

      }

      var UDivList: any[] = [];
      var UDivList_trn: any[] = [];
      if (this.masterService.userSetting.userwisedivision == 1) {
        var x = ''
        var y = ''
        if(this.SelectAll == true){
          x = '%';
        }
        else{
          x = ''
        }
        if(this.SelectAll_trn == true){
          y = '%';
        }
        else{
          y = ''
        }
       
        
        for (let i of this.userdivisionList) {
          if (i.isCheck == true || i.isCheck_trn == true) {
            let a: any = <any>{};
            a.DIV = i.INITIAL;
            a.ACID = "";
            a.STAMP = 1;
            a.ISACTIVE = 1;
            a.isSelectAll = x;
            a.SelectAll_trn = y;
            a.isSelected = i.isCheck == true ? 1 : 0;
            a.isSelected_trn = i.isCheck_trn == true ? 1 : 0;
            UDivList.push(a);
          }
        }


      }

      if (this.mode == "edit") {

        return { mode: "edit", data: saveObj, UserDivList: UDivList };
      } else if (this.mode == "user") {
        return { mode: "user", data: saveObj, UserDivList: UDivList };
      } else if (this.mode == "role") {
        return { mode: "role", data: saveObj };
      } else if (this.mode == "editRole") {
        return { mode: "editRole", data: saveObj };
      }
    } catch (ex) {
      alert(ex);
    }
  }

  hideChildModal() {
    try {
      this.childModal.hide();
    } catch (ex) {
      alert(ex);
    }
  }
  hideloginModal() {
    try {
      this.loginModal.hide();
    } catch (ex) {
      alert(ex);
    }
  }
  back() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      alert(ex);
    }
  }

  changeDivision(value) {
    this.divisionWarehouseList = this.warehouseList.filter(
      res => res.DIVISION == value
    );
  }


  public getRoleDetail(rolename: string) {
    this.loadingService.show("Please wait! Getting Role Detail");
    this.addUserService.getRole(rolename).subscribe(res => {
      this.roleForm.controls["roleName"].patchValue(res.result.rolename);
      this.userRightList = res.result.userRights;
      this.initUserRights();
      this.initUserMenuForEditRole(res.result.menuRights);
      this.loadingService.hide()
    });
  }

  public initUserMenuForEditRole(menuRights: any) {
    try {
      const control = <FormArray>this.roleForm.controls["menuRights"];
      let fgroup: FormGroup;
      //   let menu = [];
      //   let pushed: boolean = false;
      if(menuRights.length == 0){
        this.initUserMenu();
      }else{
        this.items.forEach(usermenu => {
          // menuRights.forEach(menus => {
          //   menu = menus.menu;
          this.menurights = menuRights
          fgroup = this.fb.group({
            title: new FormControl({
              value: usermenu.title,
              disabled: true
            }),
            path: new FormControl(usermenu.path),
            view: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "view")
            ),
            add: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "add")
            ),
            edit: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "edit")
            ),
            delete: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "delete")
            ),
            print: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "print")
            ),
            import: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "import")
            ),
            export: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "export")
            ),
            post: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "post")
            ),
            L_edit: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "L_edit")
            )
            ,
            L_delete: new FormControl(
              this.findMenuRights(usermenu.path, menuRights, "L_delete")
            )
          });
          //   if (menus.menu == usermenu.path) {
          control.push(fgroup);
          //   }
          // });
          // control.push(fgroup);
        });
      }     
    } catch (ex) {
      alert(ex);
    }
  }

  TickAllValue(menuright, e, valuename) {
    if (e.target.checked) {
      this.AssignCheckValue(menuright, true, valuename)
    }
    else if (e.target.checked == false) {
      this.AssignCheckValue(menuright, false, valuename)
    }
  }
  menurights: any;
  AssignCheckValue(menuright, value, valuename) {
    // ////console.log("checkValue",menuright,value)
    this.roleForm = this.fb.group({
      role: new FormControl('A', [Validators.required]),
      roleName: new FormControl('', [Validators.required]),
      menuRights: this.fb.array([]),
      userRights: this.fb.array([])
    });
    const control = this.roleForm.controls['menuRights'] as FormArray;
    var name: any;
    let fgroup: FormGroup;
    var Path = "";
    this.items.forEach(usermenu => {
      // if(menuright == "view")
      // {
      //   fgroup = this.fb.group({
      //     title: new FormControl({
      //       value: usermenu.title,
      //       disabled: true
      //     }),
      //     path: new FormControl(usermenu.path),
      //     view: new FormControl(value),
      //     add: new FormControl(usermenu['add'].value),
      //     edit: new FormControl(usermenu['edit'].value),
      //     delete: new FormControl(usermenu['delete'].value),
      //     print: new FormControl(usermenu['delete'].value),
      //     import: new FormControl(usermenu['delete'].value),
      //     export: new FormControl(usermenu['delete'].value),
      //     post: new FormControl(usermenu['delete'].value),
      //     L_edit: new FormControl(usermenu['delete'].value),
      //     export: new FormControl(usermenu['delete'].value),
      //     print: new FormControl(
      //       menuright == "print" ? value : this.findMenuRights(usermenu.path, this.menurights, 'print')
      //     ),
      //     import: new FormControl(
      //       menuright == "import" ? value : this.findMenuRights(usermenu.path, this.menurights, 'import')
      //     ),
      //     export: new FormControl(
      //       menuright == "export" ? value : this.findMenuRights(usermenu.path, this.menurights, 'export')
      //     ),
      //     post: new FormControl(
      //       menuright == "post" ? value : this.findMenuRights(usermenu.path, this.menurights, 'post')
      //     ),
      //     L_edit: new FormControl(
      //       menuright == "L_edit" ? value : this.findMenuRights(usermenu.path, this.menurights, 'L_edit')
      //     )
      //     ,
      //     L_delete: new FormControl(
      //       menuright == "L_delete" ? value : this.findMenuRights(usermenu.path, this.menurights, 'L_delete')
      //     )
      //   });
      //   control.push(fgroup);
      // }

      fgroup = this.fb.group({
        title: new FormControl({
          value: usermenu.title,
          disabled: true
        }),
        path: new FormControl(usermenu.path),
        view: new FormControl(
          menuright == "view" ? value : this.findMenuRights(usermenu.path, this.menurights, 'view')

        ),
        add: new FormControl(
          menuright == "add" ? value : this.findMenuRights(usermenu.path, this.menurights, 'add')
        ),
        edit: new FormControl(
          menuright == "edit" ? value : this.findMenuRights(usermenu.path, this.menurights, 'edit')
        ),
        delete: new FormControl(
          menuright == "delete" ? value : this.findMenuRights(usermenu.path, this.menurights, 'delete')
        ),
        print: new FormControl(
          menuright == "print" ? value : this.findMenuRights(usermenu.path, this.menurights, 'print')
        ),
        import: new FormControl(
          menuright == "import" ? value : this.findMenuRights(usermenu.path, this.menurights, 'import')
        ),
        export: new FormControl(
          menuright == "export" ? value : this.findMenuRights(usermenu.path, this.menurights, 'export')
        ),
        post: new FormControl(
          menuright == "post" ? value : this.findMenuRights(usermenu.path, this.menurights, 'post')
        ),
        L_edit: new FormControl(
          menuright == "L_edit" ? value : this.findMenuRights(usermenu.path, this.menurights, 'L_edit')
        )
        ,
        L_delete: new FormControl(
          menuright == "L_delete" ? value : this.findMenuRights(usermenu.path, this.menurights, 'L_delete')
        )
      });
      control.push(fgroup);
      this.BindNewlyTickValue(usermenu.path, this.menurights, menuright, value, valuename);


    });


  }
  BindNewlyTickValue(menuname: string, menus: any, rt: string, value, valuename) {


    // if (menus) {
    //   let men = menus.filter(x => x.menu === menuname)[0];
    //   if (men != null) {
    //     if (value == true) {
    //       if (!men.right.indexOf(rt)) men.right.push(rt);
    //     }
    //     else {
    //       if (!men.right.indexOf(rt)) men.right.splice(rt);

    //     }


    //   }
    // }
    let ctl = menus;
    // ////console.log("menu",ctl)
    for (let i of ctl) {

      if (i.menu == menuname) {

        if (value == true) {

          if (menuname == i.menu) {
            if (!i.right.rt) {

              i.right.push(rt)
            }
          }
        }
        else if (value == false) {
          if (menuname == i.menu) {
            if (i.right.rt) {

              i.right.splice(rt)
            }
          }
        }
      }
    }
  }

  // getProductCategoryName(){
  //   this.addUserService.getProductCategoryName()
  //   .subscribe(
  //     (res) => {
  //       this.productCategoryList = res.result;
  //     }
  //   )

  // }
  SelectAll: any
  SelectAll_trn: any
  ChangeAll() {
//console.log("checkHere",this.SelectAll)
    if (this.SelectAll == true) {
      this.userdivisionList.forEach(x => x.isCheck = true);
      // alert("reached1")
    }
    else{
      this.userdivisionList.forEach(x => x.isCheck = false);
      // alert("reacehd2")
    }

  }
  ChangeAll_trn() {

    if (this.SelectAll_trn == true) {
      
      this.userdivisionList.forEach(x => x.isCheck_trn = true);

    }
    else{
      this.userdivisionList.forEach(x => x.isCheck_trn = false);
    }

  }
  ChangeDiv() {
    if (this.userdivisionList.filter(x => x.isCheck ==
      false)) {
      this.SelectAll = false;
    }
    if (this.userdivisionList.every(x => x.isCheck == true)) {
      this.SelectAll = true;
    }

  }
  ChangeDiv_trn() {
    if (this.userdivisionList.filter(x => x.isCheck ==
      false)) {
      this.SelectAll_trn = false;
    }
    if (this.userdivisionList.every(x => x.isCheck == true)) {
      this.SelectAll_trn = true;
    }

  }
  changeWarehouse() {

    // this.masterService.getAllDivisions().subscribe(res => {
    //   // this.divisionList.push(<Division>res);
    //   var WarehouseObj :Warehouse=<Warehouse>{};
    //   WarehouseObj = this.warehouseList.filter(x=>x.NAME == this.userForm.value.warehouse)[0];
    //   var divList:Division[] = [];
    //   divList.push(<Division>res);

    //   this.divisionList = divList.filter(x=>x.INITIAL == WarehouseObj.DIVISION)


    // });

  }

  selectDivision(event) {
    if (this.mode == "user") {
      this.userdivisionList.forEach(
        x => x.INITIAL == event.target.value ?
          x.isCheck = true : x.isCheck = false
      )
      this.userdivisionList.forEach(
        x => x.INITIAL == event.target.value ?
          x.isCheck_trn = true : x.isCheck_trn = false)
      this.userdivisionList.forEach(
        a => a.isCheck == true ?
          a.isDisable = true : a.isDisable = false
      )
      this.userdivisionList.forEach(
        a => a.isCheck_trn == true ?
          a.isDisable_trn = true : a.isDisable_trn = false
      )
    }
  }

}

export interface userMenu {
  title: string;
  path: string;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  print: boolean;
  import: boolean;
  export: boolean;
  post: boolean;
}

export class userDivisionRight {
  UName: string;
  Division: string;
  isDefault: number;
}
