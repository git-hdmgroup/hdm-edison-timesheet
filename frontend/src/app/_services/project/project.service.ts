import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Project } from '../../_interfaces/entities/project';
import { HourView } from '../../_interfaces/entities/hour-view';
import { ProjectView } from '../../_interfaces/entities/project-view';

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
            id city_id cost_center_id cost_asset typology description active valid_from valid_to created_at updated_at
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
            id city_id cost_center_id cost_asset typology description active valid_from valid_to created_at updated_at
          }
        }
      `
      })
      .pipe(map(result => result.data.projects));
  }

  getAllView(isSubscription = false): Observable<ProjectView[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} project {
          projects_view {
            id active valid_from valid_to created_at updated_at
            cost_center_name project_name city city_id cost_center_id cost_asset typology
          }
        }
      `
      })
      .pipe(map(result => result.data.projects_view));
  }

  save(project: Project, insert: boolean) {

    const updateQuery = gql`
      mutation project {
        update_projects(where: {id: {_eq: ${project.id}}}, _set: {
          city_id: ${project.city_id},
          cost_center_id: ${project.cost_center_id},
          cost_asset: "${project.cost_asset}",
          typology: "${project.typology}",
          description: "${project.description}",
          active: ${project.active},
          updated_at: ${Date.now()}
        }) {
          returning {
            id city_id cost_center_id cost_asset typology description active valid_from valid_to created_at updated_at
          }
        }
      }`;

    const insertQuery = gql`
      mutation city {
        insert_projects(objects: {
          city_id: ${project.city_id},
          cost_center_id: ${project.cost_center_id},
          cost_asset: "${project.cost_asset}",
          typology: "${project.typology}",
          description: "${project.description}",
          active: ${project.active},
          updated_at: ${Date.now()},
          created_at: ${Date.now()},
          valid_from: ${project.valid_from},
          valid_to: ${project.valid_to}
        }) {
          returning {
            id city_id cost_center_id cost_asset typology description active valid_from valid_to created_at updated_at
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
