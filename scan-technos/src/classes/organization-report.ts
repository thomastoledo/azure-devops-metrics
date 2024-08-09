import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";
import { FrameworkType, ProjectId } from "../types";
import { ProjectReport } from "./project-report";
import { RepositorySonarqube } from "../interfaces/repository-sonarqube";
import { RepositoryFramework } from "../interfaces/repository-framework";

export class OrganizationReport {
  private projectReports: Map<ProjectId, ProjectReport> = new Map();
  private projectIdNameMap: Map<ProjectId, string> = new Map();

  addProjectReport(
    project: TeamProjectReference,
    projectReport: ProjectReport
  ): OrganizationReport {
    this.projectReports.set(project.id as string, projectReport);
    this.projectIdNameMap.set(project.id as string, project.name as string);
    return this;
  }

  reportMainFrameworksToCSVString(): string {
    return this.reportFrameworksToCSVString("mainFrameworks");
  }

  reportTestFrameworksToCSVString(): string {
    return this.reportFrameworksToCSVString("testFrameworks");
  }

  reportSonarqubeToCSVString(): string {
    const projectReportsCSV = Array.from(this.projectReports.values(), (projectReport) =>
    projectReport.projectReportToSonarqubeCSV());
    return projectReportsCSV[0].headers + projectReportsCSV.map(({body}) => body).join('');
  }

  reportMainFrameworksJSON(): RepositoryFramework[] {
    return Array.from(this.projectReports, ([, projectReport]) => projectReport).flatMap((projectReport) => projectReport.projectReportFrameworksToJson('mainFrameworks'));
  }

  reportTestFrameworksJSON(): RepositoryFramework[] {
    return Array.from(this.projectReports, ([, projectReport]) => projectReport).flatMap((projectReport) => projectReport.projectReportFrameworksToJson('testFrameworks'));
  }

  reportSonarqubeJSON(): RepositorySonarqube[] {
    return Array.from(this.projectReports, ([, projectReport]) => projectReport).flatMap((projectReport) => projectReport.projectReportSonarqubeToJson());
  }

  private reportFrameworksToCSVString(typeOfFramework: FrameworkType): string {
    const projectReportsCSV = Array.from(this.projectReports.values(), (projectReport) =>
    projectReport.projectReportToFrameworksCSVString(typeOfFramework));
    return projectReportsCSV[0].headers + projectReportsCSV.map(({body}) => body).join('');
  }
}
