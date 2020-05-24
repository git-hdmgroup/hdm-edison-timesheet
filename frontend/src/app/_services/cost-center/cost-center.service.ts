import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import { CostCenter } from '../../_interfaces/entities/cost-center';

@Injectable({
  providedIn: 'root'
})
export class CostCenterService {

  constructor(private apollo: Apollo) { }

  getCostCenter(id: number, isSubscription = false): Observable<CostCenter> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} costCenter {
          cost_centers(where: {id: {_eq: ${id}}}) {
            id name type active updated_at created_at
          }
        }
      `
      })
      .pipe(map(result => result.data.cost_centers[0]));
  }

  getAll(isSubscription = false): Observable<CostCenter[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} costCenter {
          cost_centers {
            id name type active updated_at created_at
          }
        }
      `
      })
      .pipe(map(result => result.data.cost_centers));
  }

  save(costCenter: CostCenter, insert: boolean) {
    const updateQuery = gql`
      mutation costCenter {
        update_cost_centers(where: {id: {_eq: ${costCenter.id}}}, _set: {
          name: "${costCenter.name}",
          type: ${costCenter.type},
          active: ${costCenter.active},
          updated_at: ${Date.now()}
        }) {
          returning {
            id name type active updated_at created_at
          }
        }
      }`;

    const insertQuery = gql`
      mutation costCenter {
        insert_cost_centers(objects: {
          name: "${costCenter.name}",
          type: ${costCenter.type},
          active: ${costCenter.active},
          created_at: ${Date.now()},
          updated_at: ${Date.now()}
        }) {
          returning {
            id name type active updated_at created_at
          }
        }
      }`;

    return this.apollo
      .mutate<any>({
        mutation: insert ? insertQuery : updateQuery
      })
      .pipe(map(result => insert ? result.data.insert_cost_centers.returning[0] : result.data.update_cost_centers.returning[0]));
  }

  deactivate(costCenter: CostCenter) {
    costCenter.active = 0;
    return this.save(costCenter, false);
  }
}
