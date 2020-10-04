import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { AppUser } from 'src/app/_interfaces/entities/app-user';
import { Observable } from 'rxjs';

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
          users(where: {id: {_eq: "${id}"}}) {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
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
          users(where: {email: {_eq: "${user}"}}) {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
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
          users {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
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
          users(where: {role: {_eq: ${role}}}) {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
          }
        }
      `
      })
      .pipe(map(result => result.data.users));
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
          valid_from: ${user.valid_from},
          valid_to: ${user.valid_to},
          updated_at: ${Date.now()}
        }) {
          returning {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
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
          valid_from: ${user.valid_from},
          valid_to: ${user.valid_to},
          updated_at: ${Date.now()},
          created_at: ${Date.now()}
        }) {
          returning {
            id id_position email cost_center_sender valid_from valid_to created_at updated_at name surname role full_name
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
    return this.save(user, false);
  }
}
