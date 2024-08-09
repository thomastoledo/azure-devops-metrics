import { IRepositoryReport } from "../interfaces/repository-report";

export type FrameworkType = keyof Omit<IRepositoryReport, 'sonarqube'>