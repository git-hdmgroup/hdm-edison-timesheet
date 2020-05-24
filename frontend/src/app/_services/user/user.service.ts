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

  getUser(user: string, isSubscription = false): Observable<AppUser> {
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

  save(user: AppUser) {
    return this.apollo
      .mutate<any>({
        mutation: gql`
          mutation MyMutation {
            update_users(where: {id: {_eq: ${user.id}}}, _set: {
                email: "${user.email}",
                name: "${user.name}",
                surname: "${user.surname}",
                role: ${user.role},
                full_name: "${user.name} ${user.surname}",
                updated_at: ${Date.now()}
              }) {
              returning {
                email id ldap_id name role surname active full_name updated_at created_at
              }
            }
          }
      `
      })
      .pipe(map(result => result.data.update_users.returning[0]));
  }

  deactivate(user: AppUser) {
    user.active = 0;
    return this.save(user);
  }
}
