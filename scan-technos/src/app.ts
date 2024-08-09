/**
 * @license Royal canin
 * @author Thomas TOLEDO & Omar BERRABEH
 */
import { WebApi, getPersonalAccessTokenHandler } from "azure-devops-node-api";
import * as fs from "fs";
import { token } from "./constants/token";
import { ProjectScanner } from "./classes/project-scanner";
import { OrganizationReport } from "./classes/organization-report";
import { organizationUrl } from "./constants/organization-url";
// script configurations
(async () => {
  try {
    // initialize an azure devops connection
    const authHandler = getPersonalAccessTokenHandler(token);
    const connection = new WebApi(organizationUrl, authHandler);

    // get connected to GitApi
    const gitApi = await connection.getGitApi();
    // retrieve all organization projects (the list can vary according to your PAT)
    const projects = await (await connection.getCoreApi()).getProjects();

    const organizationReport: OrganizationReport = new OrganizationReport();

    // map to retrieve the name when unfolding everything for the reporting
    for (const project of projects) {
      const projectReport = await new ProjectScanner(
        project,
        gitApi
      ).scanProject();
      if (projectReport.size() > 0) {
        organizationReport.addProjectReport(project, projectReport);
      }
    }
    if (!fs.existsSync("reporting")) {
      fs.mkdirSync("./reporting");
    }


    exportOrganizationReportToCSVFiles(organizationReport);
    exportOrganizationReportToJSONFiles(organizationReport);
  } catch (e) {
    console.error(e);
  }
})();

function exportOrganizationReportToCSVFiles(organizationReport: OrganizationReport): void {
  fs.writeFileSync(
    `./reporting/mainFrameworks-${new Date().toISOString()}.csv`,
    organizationReport.reportMainFrameworksToCSVString()
  );
  fs.writeFileSync(
    `./reporting/testFrameworks-${new Date().toISOString()}.csv`,
    organizationReport.reportTestFrameworksToCSVString()
  );
  fs.writeFileSync(
    `./reporting/sonarqube-${new Date().toISOString()}.csv`,
    organizationReport.reportSonarqubeToCSVString()
  );
}

function exportOrganizationReportToJSONFiles(organizationReport: OrganizationReport): void {
  fs.writeFileSync(
    `./reporting/mainFrameworks-${new Date().toISOString()}.json`,
    JSON.stringify(organizationReport.reportMainFrameworksJSON())
  );
  fs.writeFileSync(
    `./reporting/testFrameworks-${new Date().toISOString()}.json`,
    JSON.stringify(organizationReport.reportTestFrameworksJSON())
  );
  fs.writeFileSync(
    `./reporting/sonarqube-${new Date().toISOString()}.json`,
    JSON.stringify(organizationReport.reportSonarqubeJSON())
  );
}