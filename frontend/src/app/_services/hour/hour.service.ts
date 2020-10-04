import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Hour } from '../../_interfaces/entities/hour';
import { HourView } from '../../_interfaces/entities/hour-view';

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
          hours(where: {id: {_eq: ${id}}}) {
            id project_id datetime description time active updated_at created_at
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
          hours {
            id project_id datetime description time active updated_at created_at
          }
        }
      `
      })
      .pipe(map(result => result.data.cities));
  }

  getAllView(userId: number, isSubscription = false): Observable<HourView[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} hour {
          hours_view(where: {user_id: {_eq: ${userId}}}) {
            id city_id project_id cost_center_id datetime description time active
            updated_at created_at user_id city cost_center_name full_name project_name
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
          updated_at: ${Date.now()}
        }) {
          returning {
            id project_id datetime description time active updated_at created_at
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
          created_at: ${Date.now()}
        }) {
          returning {
            id project_id datetime description time active updated_at created_at
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
    return this.save(hour, false);
  }
}
