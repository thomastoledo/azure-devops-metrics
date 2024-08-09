import { GitApi } from "azure-devops-node-api/GitApi";
import {
  GitRepository,
  VersionControlRecursionType,
} from "azure-devops-node-api/interfaces/TfvcInterfaces";
import {
  frontendPackages,
  backendPackages,
  testPackages,
} from "../constants/reference-packages";
import { GitItem } from "azure-devops-node-api/interfaces/GitInterfaces";
import { PackageJsonScanner } from "./package-json-scanner";
import { RepositoryReport } from "./repository-report";
import { Sonarqube } from "../interfaces/sonarqube";

export class RepositoryScanner {
  private projectID: string;
  private gitApi: GitApi;
  private repository: GitRepository;
  
  constructor(projectID: string, gitApi: GitApi, repository: GitRepository) {
    this.projectID = projectID;
    this.gitApi = gitApi;
    this.repository = repository;
  }

  async scanRepository(): Promise<RepositoryReport | null> {
    console.log("start scanning repository: ", this.repository.name, "...");

    const items = await this.gitApi.getItems(
      this.repository.id as string,
      this.projectID,
      "/",
      VersionControlRecursionType.Full
    );

    if (!items?.length) {
      return null;
    }

    const packageJsonItems = items.filter(({ path }) =>
      path?.includes("package.json")
    );

    let repositoryReport: RepositoryReport = new RepositoryReport(this.repository.name as string);

    if (packageJsonItems.length > 0) {
      for (const packageJsonItem of packageJsonItems) {
        const mainFrameworks = await (new PackageJsonScanner(packageJsonItem.url as string, { ...frontendPackages, ...backendPackages })).scanPackageJsonFile();
        const testFrameworks = await (new PackageJsonScanner(packageJsonItem.url as string, testPackages)).scanPackageJsonFile();
        repositoryReport
        .addMainFrameworks(...mainFrameworks)
        .addTestFrameworks(...testFrameworks);

        const sonarqube: Sonarqube = {
          path: packageJsonItem.path as string,
          setup: await this.checkIfSonarqubeIsSetUp(
            items,
            packageJsonItem.path as string
          )
        }
        repositoryReport.addSonarqubes(sonarqube);
      }
    } else {
      // if no package.json (for whatever reason)
      // we still need to check if sonarqube has been set up for this repository
      const sonarqube: Sonarqube = {
        path: '/',
        setup: await this.checkIfSonarqubeIsSetUp(
          items,
          '/'
        )
      }
      repositoryReport.addSonarqubes(sonarqube);
    }

    if (repositoryReport.mainFrameworksSize() === 0) {
      repositoryReport.addMainFrameworks({name: 'Other', version: ''});
    }

    if (repositoryReport.testFrameworksSize() === 0) {
      repositoryReport.addTestFrameworks({name: 'Other', version: ''});
    }

    console.log("end scanning repository: ", this.repository.name, "...");
    return repositoryReport;
  }

  private async checkIfSonarqubeIsSetUp(
    items: GitItem[],
    packageJsonPath: string,
    recursionType: VersionControlRecursionType = VersionControlRecursionType.None
  ): Promise<boolean> {
    const pathArray = packageJsonPath.split("/");
    pathArray.pop();
    return items.some(({ path }) => {
      const itemPathArray = path?.split("/");
      const fileName = itemPathArray?.pop();
      if (recursionType === VersionControlRecursionType.Full) {
        return fileName?.match(/sonar(.*).properties/);
      } else {
        return (
          itemPathArray?.join("/") === pathArray.join("/") &&
          fileName?.match(/sonar(.*).properties/)
        );
      }
    });
  }
}
