import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Responsible } from '../../_interfaces/entities/responsible';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleService {

  constructor(private apollo: Apollo) {
  }

  getResponsible(id: number, isSubscription = false): Observable<Responsible> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} responsible {
          responsibles(where: {id: {_eq: "${id}"}}) {
            id id_user id_position email valid_from valid_to created_at updated_at
          }
        }
      `
      })
      .pipe(map(result => result.data.responsibles[0]));
  }

  getAll(isSubscription = false): Observable<Responsible[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} responsible {
          responsibles {
            id id_user id_position email valid_from valid_to created_at updated_at
          }
        }
      `
      })
      .pipe(map(result => result.data.responsibles));
  }

  save(responsible: Responsible, insert: boolean) {
    const updateQuery = gql`
      mutation responsible {
        update_responsibles(where: {id: {_eq: ${responsible.id}}}, _set: {
          id_user: ${responsible.id_user},
          email: "${responsible.email}",
          id_position: ${responsible.id_position},
          valid_from: ${responsible.valid_from},
          valid_to: ${responsible.valid_to},
          updated_at: ${Date.now()}
        }) {
          returning {
            id id_user id_position email valid_from valid_to created_at updated_at
          }
        }
      }`;

    const insertQuery = gql`
      mutation responsible {
        insert_responsibles(objects: {
          id_user: ${responsible.id_user},
          email: "${responsible.email}",
          id_position: ${responsible.id_position},
          valid_from: ${responsible.valid_from},
          valid_to: ${responsible.valid_to},
          updated_at: ${Date.now()},
          created_at: ${Date.now()}
        }) {
          returning {
            id id_user id_position email valid_from valid_to created_at updated_at
          }
        }
      }`;

    return this.apollo
      .mutate<any>({
        mutation: insert ? insertQuery : updateQuery
      })
      .pipe(map(result => insert ? result.data.insert_responsibles.returning[0] : result.data.update_responsibles.returning[0]));
  }
}
