import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Position } from '../../../_interfaces/entities/position';
import { Router } from '@angular/router';
import { PositionService } from '../../../_services/position/position.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.sass']
})
export class PositionsComponent implements OnInit, OnDestroy {

  positionSubscription: Subscription;

  positions: Position[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  constructor(private position: PositionService,
              private router: Router) { }

  ngOnInit(): void {
    this.positionSubscription = this.position.getAll(true).subscribe((data) => {
      this.positions = data;
    });
  }

  ngOnDestroy(): void {
    this.positionSubscription?.unsubscribe();
  }

  openDetail(position: Position) {
    this.router.navigate([`/positions/${position.id}`]);
  }

  add() {
    this.router.navigate(['/positions/new']);
  }

  remove(position: Position) {
    this.position.deactivate(position).toPromise().then((data) => {
      this.alertType = 'success';
      this.alertMessage = 'app.positions.removed';
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
