import { Framework } from "../interfaces/framework";
import { RepositoryFramework } from "../interfaces/repository-framework";
import { RepositorySonarqube } from "../interfaces/repository-sonarqube";
import {
    FrameworkType,
    ProjectId,
  ProjectName,
  RepoId,
} from "../types";
import { RepositoryReport } from "./repository-report";

export class ProjectReport {
  private project: { name: ProjectName; id: ProjectId };
  private repositoryReports: Map<RepoId, RepositoryReport> = new Map();

  private static readonly frameworkHeaders = `projectId,projectName,repository,framework,version`;
  private static readonly sonarqubeHeaders = `projectId,projectName,repository,path,sonarqube`;

  constructor(project: { name: ProjectName; id: ProjectId }) {
    this.project = project;
  }

  addRepositoryReport(
    repositoryId: RepoId,
    repositoryReport: RepositoryReport
  ): ProjectReport {
    this.repositoryReports.set(repositoryId, repositoryReport);
    return this;
  }

  size() {
    return this.repositoryReports.size;
  }

  projectReportToFrameworksCSVString(typeOfFramework: FrameworkType): {headers: string, body: string} {
    const repositoryFrameworks = this.flattenRepositoryReportsToRepositoryFrameworks(typeOfFramework);
    const { id, name } = this.project;
    return  {
      headers: ProjectReport.frameworkHeaders, 
      body: repositoryFrameworks
      .map(
        ({ repository, name: framework, version }) =>
          `\n${id},${name},${repository},${framework},${version}`
      )
      .join("")
    };
  }

  projectReportToSonarqubeCSV(): {headers: string, body: string} {
    const repositorySonarqube = this.flattenRepositoryReportToSonarqube();
    const { id, name } = this.project;
    return {
      headers: ProjectReport.sonarqubeHeaders,
      body: repositorySonarqube
      .map(
        ({ repository, path, setup }) =>
          `\n${id},${name},${repository},${path},${setup}`
      )
      .join("")
    };
  }

  projectReportSonarqubeToJson(): RepositorySonarqube[] {
    return Array.from(this.repositoryReports, ([, repositoryReport]) => repositoryReport).flatMap((repositoryReport) => repositoryReport.sonarqubeToArray())
  }

  projectReportFrameworksToJson(typeOfFramework: FrameworkType): RepositoryFramework[] {
    return Array.from(this.repositoryReports, ([, repositoryReport]) => repositoryReport).flatMap((repositoryReport) => repositoryReport.flattenFrameworks(typeOfFramework))
  }

  private flattenRepositoryReportsToRepositoryFrameworks(
    typeOfFramework: FrameworkType
  ): RepositoryFramework[] {
    return Array.from(
      this.repositoryReports,
      ([, repositoryReport]) => repositoryReport.flattenFrameworks(typeOfFramework)
    ).reduce((acc, curr) => [...acc, ...curr], []);
  }

  private flattenRepositoryReportToSonarqube(): RepositorySonarqube[] {
    return Array.from(this.repositoryReports, ([, repositoryReport]) => repositoryReport.sonarqubeToArray()).reduce((acc, curr) => [...acc, ...curr], []);
  }
}
