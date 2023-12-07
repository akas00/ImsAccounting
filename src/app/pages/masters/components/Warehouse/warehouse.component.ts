import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import { Warehouse } from "../../../../common/interfaces/TrnMain";
import { AddWarehouseService } from "./addWarehouse.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AuthService } from "../../../../common/services/permission";

@Component({
  selector: "warehouse",
  templateUrl: "./warehouse.component.html",
  providers:[AddWarehouseService,AuthService],
  styleUrls: ["../../../modal-style.css"]
})
export class WarehouseComponent implements OnInit, OnDestroy {
  viewMode = false;
  mode: string = "add";
  modeTitle: string = "";
  warehouse: Warehouse = <Warehouse>{};
  initialTextReadOnly: boolean = false;
  private returnUrl: string;
  form: FormGroup;
  private subcriptions: Array<Subscription> = [];
  divisonList : any[] = [];

  

  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    protected service: AddWarehouseService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.getDivisionList();    
  }

  ngOnInit() {
    try {
      this.form = this.fb.group({
        NAME: ["", [Validators.required]],
        ADDRESS: [""],
        PHONE: [""],
        REMARKS: [""],
        DIVISION: ["", [Validators.required]],
        WarehouseType: ["", [Validators.required]], 
        STATUS : [1]
      });

      this.onFormChanges();
      
      if (!!this._activatedRoute.snapshot.params["mode"]) {
        if (this._activatedRoute.snapshot.params["mode"] == "view") {
          this.viewMode = true;
          this.form.get("NAME").disable();
          this.form.get("ADDRESS").disable();
          this.form.get("PHONE").disable();
          this.form.get("REMARKS").disable();
        }
      }
      if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      }
      if (!!this._activatedRoute.snapshot.params["name"]) {
        let WarehouseName: string = "";
        WarehouseName = this._activatedRoute.snapshot.params["name"];
        this.loadingService.show("Getting data, Please wait...");
        this.service.getWarehouse(WarehouseName).subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              //console.log(data);
              this.form.patchValue({
                NAME: data.result.NAME,
                ADDRESS: data.result.ADDRESS,
                PHONE: data.result.PHONE,
                REMARKS: data.result.REMARKS,
                DIVISION: data.result.DIVISION,
                WarehouseType: data.result.WarehouseType,
                STATUS: data.result.STATUS 
              });

              if (this._activatedRoute.snapshot.params["mode"] == null) {
                this.modeTitle = "Edit Warehouse";
              } else if (
                this._activatedRoute.snapshot.params["mode"] == "view"
              ) {
                this.modeTitle = "View Warehouse";
              }
              this.mode = "edit";
              this.initialTextReadOnly = true;
            } else {
              this.mode = "";
              this.modeTitle = "Edit -Error in Warehouse";
              this.initialTextReadOnly = true;
            }
          },
          error => {
            this.loadingService.hide();
            this.mode = "";
            this.modeTitle = "Edit2 -Error in Warehouse";
            this.masterService.resolveError(error, "warehouse - getWarehouse");
          }
        );
      } else {
        this.mode = "add";
        this.modeTitle = "Add Warehouse";
        this.initialTextReadOnly = false;
      }
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.dirty)
        this.preventNavigationService.preventNavigation(true);
    });
  }

  cancel() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }

  ngOnDestroy() {
    try {
      this.subcriptions.forEach(subs => {
        subs.unsubscribe();
      });
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }

  disabled() {
    try {
      if (this.viewMode == true) {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }

  editDisabled() {
    try {
      if (this.mode == "edit") {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }

  getDivisionList(){
    this.divisonList = [];
    this.masterService.getAllDivisionList().subscribe( 
        (res) =>{
           // ////console.log("RouteName"+res);
            this.divisonList = res;
             var selDiv = this.divisonList.find(x =>x.MAIN==1)            
             ////console.log("division name" + JSON.stringify(selDiv.NAME));
             this.form.patchValue({                       
                 DIVISION : selDiv.INITIAL
              })
        }
    )
 } 

  onSave() {
    try {
      //validate before Saving
      if (!this.form.valid) {
        this.alertService.info(
          "Invalid Request, Please enter all required fields."
        );
        return;
      }
      this.onsubmit();
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }

  onsubmit() {
    try {
      // ////console.log("submit call");
      // let warehouseNAME = <Warehouse>{};
      // warehouseNAME.NAME = this.form.value.warehouseName;
      // // warehouseNAME.WID=this.form.value.WarehouseID;
      // warehouseNAME.ADDRESS = this.form.value.WarehouseAddress;
      // warehouseNAME.PHONE = this.form.value.Phone;
      // warehouseNAME.REMARKS = this.form.value.Remarks;
      // warehouseNAME.DIVISION = this.form.value.DIVISION;
      // warehouseNAME.WarehouseType = this.form.value.Type;
      // // costCenter.PARENT = this.form.value.PARENT;
      // //console.log({ tosubmit: warehouseNAME });

      //calling observable of saveDivision 
      
      let saveModel = Object.assign(<Warehouse>{}, this.form.value); 
      this.loadingService.show("Saving data, please wait...");
      let sub = this.masterService
        .saveWarehouse(this.mode, saveModel) 
        .subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              this.alertService.success("Data Saved Successfully");
              this.preventNavigationService.preventNavigation(false);
              setTimeout(() => {
                this.router.navigate([this.returnUrl]);
              }, 1000);
            } else {
              if (
                data.result._body ==
                "The ConnectionString property has not been initialized."
              ) {
                this.router.navigate(["/login", this.router.url]);
                return;
              }
              this.alertService.error(
                `Error in Saving Data: ${data.result._body}`
              );
            }
          },
          error => {
            this.loadingService.hide();
            this.alertService.error(error);
          }
        );
      this.subcriptions.push(sub);
    } catch (e) {
      this.alertService.error(e);
    }
  }

  @ViewChild("loginModal") loginModal: ModalDirective;
  hideloginModal() {
    try {
      this.loginModal.hide();
    } catch (ex) {
      //console.log(ex);
      this.alertService.error(ex);
    }
  }
}
