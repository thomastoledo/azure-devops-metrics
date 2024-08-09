import {
  FrameworkName,
  FrameworkCount,
  FrameworkVersionReport,
  RepositoryName,
} from "@/lib/types";
import PieChartCountProjectsPerFramework from "../visual/PieChartCountProjectsPerFramework";
import { filterAgainstItem } from "@/lib/utils";
import Selector from "../visual/Selector";
import { useEffect, useState } from "react";
import { ALL } from "@/lib/constants";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "../ui/card";

export default function FrameworkCountReporting({
  frameworks,
  repositories,
  title
}: {
  frameworks: FrameworkVersionReport[];
  title: string;
  repositories: RepositoryName[];
}) {
  const [currentRepository, setRepository] = useState(ALL);
  const [frameworksCount, setFrameworksCount] = useState<FrameworkCount[]>([]);
  const selectRepository = (repository: string) => setRepository(repository);

  const reduceFrameworksReportsToNbOccurences = ({
    reports,
    referenceRepository,
  }: {
    reports: FrameworkVersionReport[];
    referenceRepository?: string;
  }): FrameworkCount[] => {
    const reducedReports = reports
      .filter(({ repository }) =>
        filterAgainstItem(repository, referenceRepository)
      )
      .reduce((acc, curr) => {
        if (!acc[curr.name]) {
          acc[curr.name] = 0;
        }
        acc[curr.name] += 1;
        return acc;
      }, {} as Record<FrameworkName, number>);

    return Object.entries(reducedReports).map(([frameworkName, count]) => ({
      name: frameworkName,
      count,
    }));
  };


  useEffect(() => setFrameworksCount(reduceFrameworksReportsToNbOccurences({
    reports: frameworks,
    referenceRepository: currentRepository,
  })), [currentRepository])

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <CardDescription>
            {title ?? 'Number of repositories by framework'}
          </CardDescription>
          <CardTitle className="text-4xl tabular-nums">
            {repositories.length}{" "}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              repositories
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="flex-1 pb-0">
            Select a repository
          </span>
          <Selector
            data={repositories}
            value={currentRepository ?? ALL}
            onChange={selectRepository}
          />
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            Frameworks
          </span>
          <PieChartCountProjectsPerFramework data={frameworksCount} />
        </CardContent>
      </Card>
    </>
  );
}
