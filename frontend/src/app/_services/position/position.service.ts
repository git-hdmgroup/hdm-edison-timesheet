import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Position } from '../../_interfaces/entities/position';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

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
          positions(where: {id: {_eq: ${id}}}) {
            id name cost active updated_at created_at
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
          positions {
            id name cost active updated_at created_at
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
          active: ${position.active},
          updated_at: ${Date.now()}
        }) {
          returning {
            id name cost active updated_at created_at
          }
        }
      }`;

    const insertQuery = gql`
      mutation position {
        insert_positions(objects: {
          name: "${position.name}",
          cost: ${position.cost},
          active: ${position.active},
          created_at: ${Date.now()},
          updated_at: ${Date.now()}
        }) {
          returning {
            id name cost active updated_at created_at
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
    return this.save(position, false);
  }
}
