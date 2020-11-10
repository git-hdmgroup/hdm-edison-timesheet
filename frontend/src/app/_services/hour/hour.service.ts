import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Hour } from '../../_interfaces/entities/hour';
import { HourView } from '../../_interfaces/entities/hour-view';
import { filterValidTo } from '../../_utils/utils';

@Injectable({
  providedIn: 'root'
})
export class HourService {

  constructor(private apollo: Apollo) {
  }

  getHour(id: number, isSubscription = false): Observable<Hour> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} hour {
          hours(where: {id: {_eq: ${id}}, ${filterValidTo()}) {
            id project_id datetime description time active updated_at created_at valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.hours[0]));
  }

  getAll(isSubscription = false): Observable<Hour[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} hour {
          hours(where: {${filterValidTo()}}) {
            id project_id datetime description time active updated_at created_at valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.cities));
  }

  getAllView(userId: number, byDate = 0, isSubscription = false): Observable<HourView[]> {
    const filterByDate = byDate === 0 ? '' : `, datetime: {_eq: "${byDate}"}`;
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} hour {
          hours_view(where: {user_id: {_eq: ${userId}}${filterByDate}, ${filterValidTo()}}) {
            id city_id project_id cost_center_id datetime description time active
            updated_at created_at user_id city cost_center_name full_name project_name valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.hours_view));
  }

  save(hour: Hour, insert: boolean) {
    const updateQuery = gql`
      mutation hour {
        update_hours(where: {id: {_eq: ${hour.id}}}, _set: {
          datetime: ${hour.datetime},
          time: ${hour.time},
          project_id: ${hour.project_id},
          description: "${hour.description}",
          active: ${hour.active},
          updated_at: ${Date.now()},
          valid_from: ${hour.valid_from},
          valid_to: ${hour.valid_to}
        }) {
          returning {
            id project_id datetime description time active updated_at created_at valid_from valid_to
          }
        }
      }`;

    const insertQuery = gql`
      mutation hour {
        insert_hours(objects: {
          user_id: ${hour.user_id},
          datetime: ${hour.datetime},
          time: ${hour.time},
          project_id: ${hour.project_id},
          description: "${hour.description}",
          active: ${hour.active},
          updated_at: ${Date.now()},
          created_at: ${Date.now()},
          valid_from: ${Date.now()},
          valid_to: 253402300799000
        }) {
          returning {
            id project_id datetime description time active updated_at created_at valid_from valid_to
          }
        }
      }`;

    return this.apollo
      .mutate<any>({
        mutation: insert ? insertQuery : updateQuery
      })
      .pipe(map(result => insert ? result.data.insert_hours.returning[0] : result.data.update_hours.returning[0]));
  }

  deactivate(hour: Hour) {
    hour.active = 0;
    hour.valid_to = Date.now();
    return this.save(hour, false);
  }
}
