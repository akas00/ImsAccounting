import { Component } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { EnableLatePostService } from './EnableLatePost.service';
import { EnableLatePost, VoucherTypeEnum } from '../../../../common/interfaces';
import { AuthService } from '../../../../common/services/permission';
import { Router } from '@angular/router';
@Component(
  {
    selector: 'EnableLatePost',
    templateUrl: './EnableLatePost.html',
    providers: [EnableLatePostService],
    styleUrls: ["../../../modal-style.css"],
  }
)
export class EnableLatePostComponent {
  LatePostObj: EnableLatePost = <EnableLatePost>{}
  userProfile: any = <any>{};
  router: Router;
  VoucherLatePostList: EnableLatePost[] = [];
  VoucherName: VoucherTypeEnum;

  constructor(private masterService: MasterRepo,
    private alert: AlertService,
    private loadingService: SpinnerService,
    protected _LatePostService: EnableLatePostService,
    private authservice: AuthService,
    router: Router
  ) {
    this.router = router;
    this.userProfile = this.authservice.getUserProfile();
    this.LatePostObj.Status = 1;
  }

  ngOnInit() {
    this.masterService.getEnableLatePost().subscribe(res => {
      if (res.status == "ok") {
        this.VoucherLatePostList = res.result
      }
    })
  }
  onSave() {
    this.LatePostObj.Createdby = this.userProfile.username;
    this.loadingService.show("saving data please wait..")
    this._LatePostService.saveEnableLatePost(this.LatePostObj).subscribe(res => {
      if (res.status == "ok") {
        this.alert.info("Data saved sucessfully!")
        this.loadingService.hide();
      }
      else {
        if (res.result._body == "The ConnectionString property has not been initialized.") {
          this.router.navigate(['/login', this.router.url])
          return;
        }

        this.alert.error("Error in Saving Data:" + res.result)

      }
    },
      error => {
        alert(error)
        this.masterService.resolveError(error, "Enable - LatePost");
      })
  }
  cancel() {

  }



}
