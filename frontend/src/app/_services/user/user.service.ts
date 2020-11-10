import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { AppUser } from 'src/app/_interfaces/entities/app-user';
import { Observable } from 'rxjs';
import { filterValidTo } from '../../_utils/utils';
import { HourView } from '../../_interfaces/entities/hour-view';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) {
  }

  getUser(id: number, isSubscription = false): Observable<AppUser> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} user {
          users(where: {id: {_eq: ${id}}, ${filterValidTo()}}) {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
            id_responsible valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.users[0]));
  }

  getUserByEmail(user: string, isSubscription = false): Observable<AppUser> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} user {
          users(where: {email: {_eq: "${user}"}, ${filterValidTo()}}) {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
            id_responsible valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.users[0]));
  }

  getAll(isSubscription = false): Observable<AppUser[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} user {
          users(where: {${filterValidTo()}}) {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
            id_responsible valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.users));
  }

  getAllByRole(role: number, isSubscription = false): Observable<AppUser[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} user {
          users(where: {role: {_eq: ${role}}, ${filterValidTo()}}) {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
            id_responsible valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.users));
  }

  getAllView(isSubscription = false): Observable<AppUser[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} user {
          users_view (where: {${filterValidTo()}}) {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
            id_responsible responsible_full_name valid_from valid_to
          }
        }
      `
      })
      .pipe(map(result => result.data.users_view));
  }

  save(user: AppUser, insert: boolean) {
    const updateQuery = gql`
      mutation user {
        update_users(where: {id: {_eq: ${user.id}}}, _set: {
          email: "${user.email}",
          name: "${user.name}",
          surname: "${user.surname}",
          role: ${user.role},
          full_name: "${user.name} ${user.surname}",
          cost_center_sender: "${user.cost_center_sender}",
          id_position: ${user.id_position},
          id_responsible: ${user.id_responsible},
          valid_from: ${user.valid_from},
          valid_to: ${user.valid_to},
          updated_at: ${Date.now()}
        }) {
          returning {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
            id_responsible valid_from valid_to
          }
        }
      }`;

    const insertQuery = gql`
      mutation user {
        insert_users(objects: {
          email: "${user.email}",
          name: "${user.name}",
          surname: "${user.surname}",
          role: ${user.role},
          full_name: "${user.name} ${user.surname}",
          cost_center_sender: "${user.cost_center_sender}",
          id_position: ${user.id_position},
          id_responsible: ${user.id_responsible},
          valid_from: ${user.valid_from},
          valid_to: ${user.valid_to},
          updated_at: ${Date.now()},
          created_at: ${Date.now()}
        }) {
          returning {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
            id_responsible valid_from valid_to
          }
        }
      }`;

    return this.apollo
      .mutate<any>({
        mutation: insert ? insertQuery : updateQuery
      })
      .pipe(map(result => insert ? result.data.insert_users.returning[0] : result.data.update_users.returning[0]));
  }

  deactivate(user: AppUser) {
    user.active = 0;
    user.valid_to = Date.now();
    return this.save(user, false);
  }
}
