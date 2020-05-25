import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import { AppUser } from 'src/app/_interfaces/entities/app-user';
import { Observable } from 'rxjs';
import { CostCenter } from '../../_interfaces/entities/cost-center';

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
            id email ldap_id name role surname active full_name updated_at created_at
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
            id email ldap_id name role surname active full_name updated_at created_at
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
            id email ldap_id name role surname active full_name updated_at created_at
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
          users(where: {role: {_eq: ${role}}, active: {_eq: 1}}) {
            id email ldap_id name role surname active full_name updated_at created_at
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
          active: ${user.active},
          email: "${user.email}",
          name: "${user.name}",
          surname: "${user.surname}",
          role: ${user.role},
          full_name: "${user.name} ${user.surname}",
          ldap_id: "${user.ldap_id}",
          updated_at: ${Date.now()}
        }) {
          returning {
            email id ldap_id name role surname active full_name updated_at created_at
          }
        }
      }`;

    const insertQuery = gql`
      mutation user {
        insert_users(objects: {
          active: ${user.active},
          email: "${user.email}",
          name: "${user.name}",
          surname: "${user.surname}",
          role: ${user.role},
          full_name: "${user.name} ${user.surname}",
          ldap_id: "${user.ldap_id}",
          updated_at: ${Date.now()},
          created_at: ${Date.now()}
        }) {
          returning {
            email id ldap_id name role surname active full_name updated_at created_at
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
