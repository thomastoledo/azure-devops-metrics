export type RepositoryName = string;
export type FrameworkVersion = string;
export type FrameworkName = string;
export type OccurencesFrameworksVersion = {
  name: FrameworkName;
  version: FrameworkVersion;
  count: number;
};
export type RepositoryCount = {name: RepositoryName; count: number};
export type SonarqubeRepositoryPathsRecord = Record<
  RepositoryName,
  { path: string; setup: boolean }[]
>;
export type FrameworkVersionReport = {
  name: string;
  version: string;
  repository: string;
};
export type SonarqubePath = {
  path: string;
  setup: boolean;
  repository: string;
};
export type FrameworkCount = { name: FrameworkName; count: number; }
export type RepositoryPathTotals = { name: RepositoryName; totalPaths: number; totalOkPaths: number; }