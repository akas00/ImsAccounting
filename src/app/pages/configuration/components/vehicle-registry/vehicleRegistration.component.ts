import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { VehicleRegistrationService } from './vehicle.service';
@Component(
    {
        selector: 'VehicleRegistration',
        templateUrl: './vehicleRegistration.html',
        styleUrls: ["./../../../Style.css", "./../../../../common/Transaction Components/halfcolumn.css"],
        providers: [VehicleRegistrationService],
    }
)
export class VehicleRegistrationComponent {
    DialogMessage: string = "Saving";
    @ViewChild('childModal') childModal: ModalDirective;
    private subcriptions: Array<Subscription> = [];
    form: FormGroup;
    private returnUrl: string;
    modeTitle: string = '';
    constructor(protected masterService: MasterRepo, private fb: FormBuilder, private _activatedRoute: ActivatedRoute,private router: Router) {

    }

    ngOnInit() {
    }






}