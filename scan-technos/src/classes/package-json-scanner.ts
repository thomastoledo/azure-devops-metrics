import { Framework } from "../interfaces/framework";
import { FrameworkVersion, PackageJson, PackagesOfReferences } from "../types";
import { JsonFileFetcher } from "./json-file-fetcher";
export class PackageJsonScanner {
  private packageJsonUrl: string;
  private packagesOfReference: PackagesOfReferences;

  constructor(packageJsonUrl: string, packagesOfReference: PackagesOfReferences) {
    this.packageJsonUrl = packageJsonUrl;
    this.packagesOfReference = packagesOfReference;
  }

  async scanPackageJsonFile(): Promise<{ name: string; version: FrameworkVersion }[]> {
    console.log("start scanning package.json file: ", this.packageJsonUrl, "...");

    let packageJsonContent: PackageJson;
    try {
      packageJsonContent = await (new JsonFileFetcher(this.packageJsonUrl)).fetchPackageJsonContent();
    } catch (e) {
      console.error("Error fetching package.json file", e);
      return [];
    }

    console.log("end scanning package.json file: ", this.packageJsonUrl, "...");
    return this.packagesToDetectedFrameworks(
      packageJsonContent,
      this.packagesOfReference
    );
  }

  private packagesToDetectedFrameworks(
    packageJson: PackageJson,
    packages: PackagesOfReferences
  ): Framework[] {
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    const detectedFrameworks: { name: string; version: string }[] = [];
    for (const [framework, dependecykey] of Object.entries(packages)) {
      if (dependencies[dependecykey as string]) {
        detectedFrameworks.push({
          name: framework,
          version: dependencies[dependecykey as string]
            .replace(/\^|~|>(=?)|<(=?)/, "")
            .split(".")[0],
        });
      }
    }
    return detectedFrameworks;
  }
}
