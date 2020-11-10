import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Position } from '../../_interfaces/entities/position';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { filterValidTo } from '../../_utils/utils';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private apollo: Apollo) { }

  getPosition(id: number, isSubscription = false): Observable<Position> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} position {
          positions(where: {id: {_eq: ${id}}, ${filterValidTo()}) {
            id name cost valid_from valid_to updated_at created_at valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.positions[0]));
  }

  getAll(isSubscription = false): Observable<Position[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} position {
          positions(where: {${filterValidTo()}}) {
            id name cost valid_from valid_to updated_at created_at valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.positions));
  }

  save(position: Position, insert: boolean) {
    const updateQuery = gql`
      mutation position {
        update_positions(where: {id: {_eq: ${position.id}}}, _set: {
          name: "${position.name}",
          cost: ${position.cost},
          valid_from: ${position.valid_from},
          valid_to: ${position.valid_to},
          updated_at: ${Date.now()}
        }) {
          returning {
            id name cost valid_from valid_to updated_at created_at valid_from valid_to
          }
        }
      }`;

    const insertQuery = gql`
      mutation position {
        insert_positions(objects: {
          name: "${position.name}",
          cost: ${position.cost},
          valid_from: ${position.valid_from},
          valid_to: ${position.valid_to},
          created_at: ${Date.now()},
          updated_at: ${Date.now()}
        }) {
          returning {
            id name cost valid_from valid_to updated_at created_at valid_from valid_to
          }
        }
      }`;

    return this.apollo
      .mutate<any>({
        mutation: insert ? insertQuery : updateQuery
      })
      .pipe(map(result => insert ? result.data.insert_positions.returning[0] : result.data.update_positions.returning[0]));
  }

  deactivate(position: Position) {
    position.active = 0;
    position.valid_to = Date.now();
    return this.save(position, false);
  }
}
