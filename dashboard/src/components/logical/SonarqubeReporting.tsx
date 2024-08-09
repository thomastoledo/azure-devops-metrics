import { ALL } from "@/lib/constants";
import BarChartPercentageSonarqubeRepositories from "../visual/BarChartPercentageSonarqubeRepositories";
import PieChartPercentageSonarqubeRepository from "../visual/PieChartPercentageSonarqubeRepository";
import TableSonarqubeConfigurationRepositoryPaths from "../visual/TableSonarqubeConfigurationRepositoryPaths";
import {
  RepositoryName,
  RepositoryPathTotals,
  SonarqubePath,
  SonarqubeRepositoryPathsRecord,
} from "@/lib/types";
import Selector from "../visual/Selector";
import { useState } from "react";
import { filterAgainstItem } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "../ui/card";
import BarChartCountProjectPerFrameworkAndVersion from "../visual/BarChartCountProjectPerFrameworkAndVersion";
import TableRepositories from "../visual/TableRepositories";

export default function SonarqubeReporting({
  data,
  repositories,
}: {
  data: SonarqubePath[];
  repositories: RepositoryName[];
}) {
  const [currentRepository, setRepository] = useState(ALL);
  const selectRepository = (repository: string) => setRepository(repository);
  const reduceSonarqubeReportsToRepositoryRecords = ({
    reports,
    referenceRepository,
  }: {
    reports: SonarqubePath[];
    referenceRepository?: string;
  }): SonarqubeRepositoryPathsRecord => {
    return reports
      .filter(({ repository }) =>
        filterAgainstItem(repository, referenceRepository)
      )
      .reduce((acc, { path, repository, setup }) => {
        if (!acc[repository]) {
          acc[repository] = [];
        }
        acc[repository].push({ path, setup });
        return acc;
      }, {} as SonarqubeRepositoryPathsRecord);
  };

  if (data.length === 0) {
    return (
      <>
        <h2>No data for Sonarqube reporting</h2>
      </>
    );
  }

  const reducedData = reduceSonarqubeReportsToRepositoryRecords({
    reports: data,
    referenceRepository: currentRepository,
  });

  if (
    !!currentRepository &&
    currentRepository !== ALL &&
    !reducedData[currentRepository]
  ) {
    return (
      <>
        <h2>No Sonarqube data for repository {currentRepository}</h2>
      </>
    );
  }

  const dataToRepositoriesPathsTotals: RepositoryPathTotals[] = Object.entries(
    reducedData
  ).map(([repositoryName, paths]) => ({
    name: repositoryName,
    totalOkPaths: paths.filter(({ setup }) => setup).length,
    totalPaths: paths.length,
  }));

  const overallTotalPaths = dataToRepositoriesPathsTotals.reduce(
    (acc, { totalPaths }) => acc + totalPaths,
    0
  );
  const overallTotalOKPaths = dataToRepositoriesPathsTotals.reduce(
    (acc, { totalOkPaths }) => acc + totalOkPaths,
    0
  );

  if (!currentRepository || currentRepository === ALL) {
    return (
      <>
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardDescription>
              Repositories and their Sonarqube configuration percentage
            </CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {repositories.length}{" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                repositories
              </span>
              <br />
              {overallTotalOKPaths}
              {" / "}
              {overallTotalPaths}
              {" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                sonarqube configurations
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="flex-1 pb-0">Select a repository</span>
            <Selector
              data={repositories}
              value={currentRepository ?? ALL}
              onChange={selectRepository}
            />
            <BarChartPercentageSonarqubeRepositories
              data={dataToRepositoriesPathsTotals}
            />
          </CardContent>
        </Card>
      </>
    );
  } else {
    return (
      <>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardDescription>
              Sonarqube configuration percentage for {currentRepository}{" "}
              repository
            </CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {overallTotalOKPaths}
              {" / "}
              {overallTotalPaths}
              {" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                sonarqube configurations
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="flex-1 pb-0">Select a repository</span>
            <Selector
              data={repositories}
              value={currentRepository ?? ALL}
              onChange={selectRepository}
            />
            <PieChartPercentageSonarqubeRepository
              data={
                dataToRepositoriesPathsTotals.find(
                  (dataRepo) => dataRepo.name === currentRepository
                ) as RepositoryPathTotals
              }
            />
            <TableSonarqubeConfigurationRepositoryPaths
              data={reducedData[currentRepository]}
            />
          </CardContent>
        </Card>
      </>
    );
  }
}
