import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { ReportsFullView } from '../../../_interfaces/entities/reports-full-view';

@Injectable({
  providedIn: 'root'
})
export class ReportFullService {

  constructor(private apollo: Apollo) { }

  getAll(isSubscription = false, where?: string): Observable<ReportsFullView[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} report_full {
          reports_full_view${where ? where : ''} {
            hour_datetime hour_description hour_time project_name project_typology
            project_cost_asset city_name city_scope cost_center_description cost_center_garrison
            cost_center_name user_name user_surname user_full_name user_role
            user_email user_city_center_sender position_name position_cost
            user_id project_id cost_center_id city_id responsible_full_name
          }
        }
      `
      })
      .pipe(map(result => result.data.reports_full_view));
  }
}
