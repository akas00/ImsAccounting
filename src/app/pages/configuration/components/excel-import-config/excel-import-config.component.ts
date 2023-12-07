import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter
} from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import {
  Warehouse,
  ExcelImportConfig
} from "../../../../common/interfaces/TrnMain";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { ExcelImportService } from "./excel-import-config.service";
import { isNull } from "util";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";

@Component({
  selector: "excel-import-congig",
  templateUrl: "./excel-import-config.component.html",
  providers: [ExcelImportService]
})
export class ExcelImportConfigComponent implements OnInit, OnDestroy {
  @ViewChild("fileSelect") fileSelector_Import: ElementRef;

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

  excelImportConfig: ExcelImportConfig[] = [];
  initialTextReadOnly: boolean = false;
  form: FormGroup;
  private subcriptions: Array<Subscription> = [];
  modeTitle: string;
  masterList: string[];

  selectedMasterName: string;
  activeurlpath: string;

  importErrorList: any[] = []

  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    protected service: ExcelImportService,
    private router: Router,
    public _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public _trnMainService: TransactionService
  ) { }

  ngOnInit() {
    try {
      this.resetConfig();
      this.onFormChanges();
      this.getAllMasterList();
    } catch (ex) {
      this.alertService.error(ex);
    }

  }


  showImportScheme() {
    this.activeurlpath = this._activatedRoute.snapshot.url[0].path;
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Scheme",
        uploadEndpoints: `/InsertPrimarySecondarySchemes`,
        allowMultiple: false,
        acceptFormat: ".csv"
      });
    this.fileUploadPopup.show();
  }


  UpdateSchemeImport() {

    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Update Scheme",
        sampleFileUrl: `/downloadSampleFile/`,
        uploadEndpoints: `/UpdatePrimarySecondarySchemes`,
        allowMultiple: false,
        acceptFormat: ".csv"
      });
    this.fileUploadPopup.show();
  }


  showImportMargin() {
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Margin",
        // sampleFileUrl : `/downloadSampleFile`,
        uploadEndpoints: `/insertMargins`,
        allowMultiple: false,
        acceptFormat: ".csv"
      });
    this.fileUploadPopup.show();
  }

  UpdateMarginImport() {
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "update Margin",
        // sampleFileUrl : `/downloadSampleFile`,
        uploadEndpoints: `/UpdateMargins`,
        allowMultiple: false,
        acceptFormat: ".csv"
      });

    this.fileUploadPopup.show();
  }

  fileUploadSuccessStatus(uploadStatus) {
    if (uploadStatus.status == "ok") {
      this.alertService.success("Upload Successfully")
    }
    else if (uploadStatus.status == "error") {
      this.alertService.error("Error List are on" + uploadStatus.result);
    }
    else {
      this.alertService.error("Could not uploaded")
    }
  }

  fileUploadSuccess(uploadedResult) {
    if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
      return;
    }

    if (uploadedResult.status == "ok") {
      let productList = uploadedResult.result;

      this._trnMainService.TrnMainObj.ProdList = productList

      for (let i in this._trnMainService.TrnMainObj.ProdList) {
        this._trnMainService.setAltunitDropDownForView(i);
        this._trnMainService.getPricingOfItem(i, "", false);
        this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
        this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
        //this._trnMainService.TrnMainObj.ProdList[i].MFGDATE= ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
        //this._trnMainService.TrnMainObj.ProdList[i].EXPDATE= ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));

      }

      // var ZeroStockedProduct=this._trnMainService.TrnMainObj.ProdList.filter(x=>x.SELECTEDITEM.STOCK<=0);
      //this._trnMainService.TrnMainObj.ProdList=this._trnMainService.TrnMainObj.ProdList.filter(x=>x.SELECTEDITEM.STOCK>0);

      this._trnMainService.ReCalculateBill();
    }
  }

  createFormItem(data: ExcelImportConfig): FormGroup {
    return this.fb.group({
      ImportName: [data.ImportName],
      ColumnName: [data.ColumnName],
      SNO: [data.SNO],
      ColumnSize: [data.ColumnSize],
      DataType: [data.DataType],
      ColumnValue: [data.ColumnValue],
      Mandatory: [data.Mandatory],
      AddToSheet: [data.AddToSheet]
    });
  }

  addItemsToForm(): void {
    let items = this.form.get("items") as FormArray;
    this.excelImportConfig.forEach(data => {
      items.push(this.createFormItem(data));
    });
  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.dirty)
        this.preventNavigationService.preventNavigation(true);
    });
  }

  cancel() {
    try {
      this.router.navigate(["/pages/dashboard"]);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  ngOnDestroy() {
    try {
      this.subcriptions.forEach(subs => {
        subs.unsubscribe();
      });
    } catch (ex) {
      this.alertService.error(ex);
    }
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
      this.alertService.error(ex);
    }
  }

  onsubmit() {
    try {
      let saveModel = this.form.get("items").value;
      if (saveModel == null || saveModel.length == 0) {
        return;
      }
      this.loadingService.show("Saving Config. Please Wait...");
      let sub = this.service.saveConfig(saveModel).subscribe(
        data => {
          this.loadingService.hide();
          if (data.status == "ok") {
            this.alertService.success("Config Saved Successfully");
            this.preventNavigationService.preventNavigation(false);
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

  getAllMasterList() {
    this.masterService.getAllExcelImportMasterList().subscribe(
      data => {
        this.masterList = data;
        if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE != 'central') {
          const index = this.masterList.indexOf('Item Master');
          this.masterList.splice(index, 1);
        }
      },
      error => {
        this.masterList = [];
      }
    );
  }

  loadConfig() {
    if (
      !this.selectedMasterName ||
      this.selectedMasterName == null ||
      this.selectedMasterName == undefined ||
      this.selectedMasterName == ""
    ) {
      this.alertService.info("Please Select a Master");
      return;
    }
    this.loadingService.show("Loading Config. Please Wait...");
    this.service.loadConfig(this.selectedMasterName).subscribe(
      data => {
        this.loadingService.hide();
        this.excelImportConfig = data;
        this.addItemsToForm();
      },
      error => {
        this.loadingService.hide();
        this.excelImportConfig = [];
      }
    );
  }

  downloadConfigCSV() {
    if (
      !this.selectedMasterName ||
      this.selectedMasterName == null ||
      this.selectedMasterName == undefined ||
      this.selectedMasterName == ""
    ) {
      this.alertService.info("Please Select a Master");
      return;
    }
    this.loadingService.show("Downloading...");
    this.service.downloadConfigCSV(this.selectedMasterName).subscribe(
      data => {
        this.loadingService.hide();
        this.downloadFile(data);
      },
      error => {
        this.loadingService.hide();
      }
    );
  }

  downloadFile(response: any) {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(response.content);
    element.download = response.filename;
    document.body.appendChild(element);
    element.click();
    // const blob = new Blob([(<any>response)._body], { type: "text/csv" });
    // const url = window.URL.createObjectURL(blob);
    // window.open(url);
  }

  fileList: FileList = null;
  onFileChange($event) {
    this.fileList = $event.target.files;

  }

  clearFile() {
    this.fileList = null;
  }

  importConfig() {
    // const fileSelected: File = $event.target.files[0];
    if (this.fileList == null || this.fileList.length == 0) {
      this.alertService.info("Please Select File.");
      return;
    }

    if (this.selectedMasterName == null || this.selectedMasterName == "") {
      this.alertService.info("Please Select Master.");
      return;
    }

    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append("config", file, file.name);

      this.loadingService.show("Uploading. Please Wait...this may take some time");
      this.service.importConfig(formData, this.selectedMasterName).subscribe(
        result => {
          this.loadingService.hide();

          if (result.status == "ok") {
            this.alertService.success("Request Successful");
            this.selectedMasterName = "";
            this.fileList = null;
            // this.fileSelector_Import.nativeElement.value = null;
          } else if (result.status == "errorfile") {
            this.alertService.error("Error list are on :" + result.result + " Note: please verify errors on 'Status' column and Save only those data again!");
          } else if (result.status == "error") {
            this.alertService.error("Error list are on :" + result.result);
          }
          else {
            this.alertService.error(result.result);
          }
        },
        error => {
          this.loadingService.hide();
          this.alertService.error(error);
        }
      );
    }
  }

  resetConfig() {
    this.form = this.fb.group({
      items: this.fb.array([])
    });

    this.excelImportConfig = [];
    this.selectedMasterName = "";
    this.importErrorList = [];
    this.preventNavigationService.preventNavigation(false);
  }

  MandatoryChanged($event, index: number) {
    let items = this.form.get("items") as FormArray;
    if (!$event.target.checked) return;
    items.at(index).patchValue({
      AddToSheet: true
    });
  }

  AddToSheetChanged($event, index: number) {
    let items = this.form.get("items") as FormArray;
    if (!items.controls[index].get("Mandatory").value) return true;

    items.at(index).patchValue({
      AddToSheet: true
    });
  }

  onLoadMaster() {
    if (this.selectedMasterName == null || this.selectedMasterName == "") {
      this.alertService.info("Please Select Master.");
      return;
    }
    this.loadingService.show("Loading Master Data. Please Wait...");
    this.service.loadImportErrorList(this.selectedMasterName)
      .subscribe(
        res => {
          this.loadingService.hide();
          this.importErrorList = res;
        }, error => {
          this.loadingService.hide();
          this.alertService.error("No Data Found");
        });
  }

  onLoadMargin() {

  }

  onSaveMaster() {
    if (this.selectedMasterName == null || this.selectedMasterName == "") {
      this.alertService.info("Please Select Master.");
      return;
    }
    this.loadingService.show("Saving Master Data. Please Wait...");
    this.service.saveCorrectedList(this.importErrorList, this.selectedMasterName)
      .subscribe(
        res => {
          this.loadingService.hide();
          this.alertService.success("Successfully Saved.")
        }, error => {
          this.loadingService.hide();
          this.alertService.error("No Data Found");
        });
  }

  @ViewChild("loginModal") loginModal: ModalDirective;
  hideloginModal() {
    try {
      this.loginModal.hide();
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
}
