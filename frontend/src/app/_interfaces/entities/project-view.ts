import { Project } from './project';

export interface ProjectView extends Project {
  city: string;
  cost_center_name: string;
}
