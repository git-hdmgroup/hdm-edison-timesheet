import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Project } from '../../_interfaces/entities/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private apollo: Apollo) {
  }

  getProject(id: number, isSubscription = false): Observable<Project> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} project {
          projects(where: {id: {_eq: ${id}}}) {
            id name start_date end_date duration active updated_at created_at
          }
        }
      `
      })
      .pipe(map(result => result.data.projects[0]));
  }

  getAll(isSubscription = false): Observable<Project[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} project {
          projects {
            id name start_date end_date duration active updated_at created_at
          }
        }
      `
      })
      .pipe(map(result => result.data.projects));
  }

  save(project: Project, insert: boolean) {

    const updateQuery = gql`
      mutation project {
        update_projects(where: {id: {_eq: ${project.id}}}, _set: {
          name: "${project.name}",
          start_date: ${project.start_date},
          end_date: ${project.end_date},
          duration: ${project.end_date - project.start_date},
          active: ${project.active},
          updated_at: ${Date.now()}
        }) {
          returning {
            id name start_date end_date duration active updated_at created_at
          }
        }
      }`;

    const insertQuery = gql`
      mutation city {
        insert_projects(objects: {
          name: "${project.name}",
          start_date: ${project.start_date},
          end_date: ${project.end_date},
          duration: ${project.end_date - project.start_date},
          active: ${project.active},
          updated_at: ${Date.now()},
          created_at: ${Date.now()}
        }) {
          returning {
            id name start_date end_date duration active updated_at created_at
          }
        }
      }`;

    return this.apollo
      .mutate<any>({
        mutation: insert ? insertQuery : updateQuery
      })
      .pipe(map(result => insert ? result.data.insert_projects.returning[0] : result.data.update_projects.returning[0]));
  }

  deactivate(project: Project) {
    project.active = 0;
    return this.save(project, false);
  }
}
