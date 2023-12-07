import { Component, OnInit, HostListener, ElementRef, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../repositories/masterRepo.service';
import { AlertService } from '../../services/alert/alert.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { TransactionService } from '../../Transaction Components/transaction.service';

@Component({
  selector: 'import-purchase-details',
  templateUrl: './import-purchase-details.component.html',
  styleUrls: ['./import-purchase-details.component.css'],
})
export class ImportPurchaseDetails implements OnInit {
  isActive: boolean;

  constructor(
    public masterservice: MasterRepo,
    public _trnMainService: TransactionService,
    public spinnerService: SpinnerService,
    public alertservice: AlertService
  ) {
  }

  ngOnInit() {
  }

  closeDialog() {
    this.isActive = false;
  }

  show() {
    this.isActive = true;
    }

  ok() {
    this.isActive = false;
  }

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == "Escape") {
      $event.preventDefault();
      this.closeDialog();
    }
  }

}

