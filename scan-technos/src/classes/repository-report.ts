import { Framework } from "../interfaces/framework";
import { RepositoryFramework } from "../interfaces/repository-framework";
import { RepositorySonarqube } from "../interfaces/repository-sonarqube";
import { Sonarqube } from "../interfaces/sonarqube";
import { FrameworkName, FrameworkType, FrameworkVersion } from "../types";

export class RepositoryReport {
  private mainFrameworks: Map<FrameworkName, Set<FrameworkVersion>> = new Map();
  private testFrameworks: Map<FrameworkName, Set<FrameworkVersion>> = new Map();
  private sonarqube: Map<string, boolean> = new Map();

  private repositoryName: string;

  constructor(repositoryName: string) {
    this.repositoryName = repositoryName;
  }

  addMainFrameworks(...frameworks: Framework[]): this {
    this.addFrameworks(frameworks, this.mainFrameworks);
    return this;
  }

  addTestFrameworks(...frameworks: Framework[]): this {
    this.addFrameworks(frameworks, this.testFrameworks);
    return this;
  }

  addSonarqubes(...sonarqubes: Sonarqube[]): this {
    sonarqubes.forEach(({ path, setup }) => this.sonarqube.set(path, setup));
    return this;
  }

  mainFrameworksSize(): number {
    return this.mainFrameworks.size;
  }

  testFrameworksSize(): number {
    return this.testFrameworks.size;
  }

  flattenFrameworks(typeOfFramework: FrameworkType): RepositoryFramework[] {
    return Array.from(this[typeOfFramework], ([name, versions]) => {
      return Array.from(versions, (version) => ({
        name,
        version,
        repository: this.repositoryName,
      }));
    }).reduce((acc, curr) => [...acc, ...curr], []);
  }

  sonarqubeToArray(): RepositorySonarqube[] {
    return Array.from(this.sonarqube, ([path, setup]) => ({
      path,
      setup,
      repository: this.repositoryName,
    }));
  }

  private addFrameworks(
    frameworks: Framework[],
    frameworksMap: Map<FrameworkName, Set<FrameworkVersion>>
  ) {
    frameworks.forEach(({ name, version }) => {
      if (!frameworksMap.has(name)) {
        frameworksMap.set(name, new Set());
      }
      frameworksMap.get(name)?.add(version);
    });
  }
}
