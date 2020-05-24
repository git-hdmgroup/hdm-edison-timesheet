import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { City } from '../../../_interfaces/entities/city';
import { Router } from '@angular/router';
import { CostCenter } from '../../../_interfaces/entities/cost-center';
import { CostCenterService } from '../../../_services/cost-center/cost-center.service';

@Component({
  selector: 'app-cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.sass']
})
export class CostCentersComponent implements OnInit, OnDestroy {

  costCenterSubscription: Subscription;

  costCenters: CostCenter[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  constructor(private costCenter: CostCenterService,
              private router: Router) { }

  ngOnInit(): void {
    this.costCenterSubscription = this.costCenter.getAll(true).subscribe((data) => {
      this.costCenters = data;
    });
  }

  ngOnDestroy(): void {
    this.costCenterSubscription?.unsubscribe();
  }

  openDetail(costCenter: CostCenter) {
    this.router.navigate([`/cost-centers/${costCenter.id}`]);
  }

  add() {
    this.router.navigate(['/cost-centers/new']);
  }

  remove(costCenter: CostCenter) {
    this.costCenter.deactivate(costCenter).toPromise().then((data) => {
      this.alertType = 'success';
      this.alertMessage = 'app.cost-centers.removed';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    }).catch(() => {
      this.alertType = 'danger';
      this.alertMessage = 'app.generic.error';

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    });
  }
}
