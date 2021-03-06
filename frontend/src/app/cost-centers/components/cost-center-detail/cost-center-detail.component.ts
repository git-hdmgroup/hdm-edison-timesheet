import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CostCenter } from '../../../_interfaces/entities/cost-center';
import { CostCenterService } from '../../../_services/cost-center/cost-center.service';
import { COST_CENTER_TYPES } from 'src/app/_constants/cost-center-types';

@Component({
  selector: 'app-cost-center-detail',
  templateUrl: './cost-center-detail.component.html',
  styleUrls: ['./cost-center-detail.component.sass']
})
export class CostCenterDetailComponent implements OnInit, OnDestroy {

  costCenterSubscription: Subscription;

  selectedCostCenter: CostCenter;
  costCenterTypes = COST_CENTER_TYPES;
  isLoadingData = false;
  isNewCostCenter = false;

  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    id_geo_area: ['', Validators.required],
    garrison: ['', Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private costCenter: CostCenterService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      const id = paramMap.get('id');
      if (id === 'new') {
        this.isNewCostCenter = true;
      } else {
        this.costCenterSubscription = this.costCenter.getCostCenter(Number(id)).subscribe((data) => {
          this.selectedCostCenter = data;

          this.form.setValue({
            name: this.selectedCostCenter.name,
            description: this.selectedCostCenter.description,
            id_geo_area: this.selectedCostCenter.id_geo_area,
            garrison: this.selectedCostCenter.garrison
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.costCenterSubscription?.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: CostCenter = {
      name: this.form.value.name,
      description: this.form.value.description,
      id_geo_area: this.form.value.id_geo_area,
      garrison: this.form.value.garrison,
      id: this.isNewCostCenter ? undefined : this.selectedCostCenter.id,
      valid_from: 0,
      valid_to: 0
    };

    console.log(payload);

    this.costCenter.save(payload, this.isNewCostCenter).toPromise().then((data) => {
      this.isLoadingData = false;
      this.alertType = 'success';
      this.alertMessage = this.isNewCostCenter ? 'app.cost-centers.insert' : 'app.cost-centers.update';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    }).catch(() => {
      this.isLoadingData = false;
      this.alertType = 'danger';
      this.alertMessage = 'app.generic.error';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    });
  }
}
