import { GitApi } from "azure-devops-node-api/GitApi";
import { GitRepository } from "azure-devops-node-api/interfaces/TfvcInterfaces";
import { RepositoryScanner } from "./repository-scanner";
import { ProjectReport } from "./project-report";
import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";

export class ProjectScanner {
  private project: TeamProjectReference;
  private gitApi: GitApi;
  
  constructor(project: TeamProjectReference, gitApi: GitApi) {
    this.project = project;
    this.gitApi = gitApi;
  }

  async scanProject(): Promise<ProjectReport> {
    const {id, name} = this.project;
    const repositories: GitRepository[] = await this.gitApi.getRepositories(id as string);
    const projectReport: ProjectReport = new ProjectReport({name: name as string, id: id as string});

    for (const repository of repositories) {
      const repositoryReport = await (new RepositoryScanner(id as string, this.gitApi, repository)).scanRepository();
      if (repositoryReport) {
        projectReport.addRepositoryReport(repository.id as string, repositoryReport);
      }
    }

    return projectReport;
  }
}
