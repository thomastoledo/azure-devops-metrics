import { token } from "../constants/token";
import { PackageJson } from "../types";

export class JsonFileFetcher {
  private fileUrl: string;
  constructor(fileUrl: string) {
    this.fileUrl = fileUrl;
  }
  
  async fetchPackageJsonContent(): Promise<PackageJson> {
    return await (
      await fetch(this.fileUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(`:${token}`).toString("base64")}`,
        },
      })
    ).json();
  }
}
