import { FrameworkName, FrameworkVersion } from "../types";

export interface IRepositoryReport {
    mainFrameworks: Map<FrameworkName, Set<FrameworkVersion>>;
    testFrameworks: Map<FrameworkName, Set<FrameworkVersion>>;
    sonarqube: Map<string, boolean>;  
}