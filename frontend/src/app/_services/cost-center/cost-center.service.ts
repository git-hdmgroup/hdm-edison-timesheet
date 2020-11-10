import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import { CostCenter } from '../../_interfaces/entities/cost-center';
import { filterValidTo } from '../../_utils/utils';

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
          cost_centers(where: {id: {_eq: ${id}}, ${filterValidTo()}}) {
            id name description garrison id_geo_area valid_from valid_to created_at updated_at valid_from valid_to
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
          cost_centers(where: {${filterValidTo()}}) {
            id name description garrison id_geo_area valid_from valid_to created_at updated_at valid_from valid_to
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
          description: "${costCenter.description}",
          garrison: "${costCenter.garrison}",
          id_geo_area: "${costCenter.id_geo_area}",
          valid_from: ${costCenter.valid_from},
          valid_to: ${costCenter.valid_to},
          updated_at: ${Date.now()}
        }) {
          returning {
            id name description garrison id_geo_area valid_from valid_to created_at updated_at valid_from valid_to
          }
        }
      }`;

    const insertQuery = gql`
      mutation costCenter {
        insert_cost_centers(objects: {
          name: "${costCenter.name}",
          description: "${costCenter.description}",
          garrison: "${costCenter.garrison}",
          id_geo_area: "${costCenter.id_geo_area}",
          valid_from: ${costCenter.valid_from},
          valid_to: ${costCenter.valid_to},
          created_at: ${Date.now()},
          updated_at: ${Date.now()}
        }) {
          returning {
            id name description garrison id_geo_area valid_from valid_to created_at updated_at valid_from valid_to
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
    costCenter.valid_to = Date.now();
    return this.save(costCenter, false);
  }
}
