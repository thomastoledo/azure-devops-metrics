import { filterAgainstItem } from "@/lib/utils";
import BarChartCountProjectPerFrameworkAndVersion from "../visual/BarChartCountProjectPerFrameworkAndVersion";
import {
  FrameworkName,
  FrameworkVersion,
  FrameworkVersionReport,
  OccurencesFrameworksVersion,
  RepositoryName,
} from "@/lib/types";
import { useEffect, useState } from "react";
import Selector from "../visual/Selector";
import { ALL } from "@/lib/constants";
import TableRepositories from "../visual/TableRepositories";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "../ui/card";

export default function FrameworkVersionCountReporting({
  frameworks,
  title,
}: {
  frameworks: FrameworkVersionReport[];
  title: string;
}) {
  const [currentFramework, setCurrentFramework] =
    useState<FrameworkName>(ALL);
  const [currentFrameworkVersion, setCurrentFrameworkVersion] =
    useState<FrameworkVersion>(ALL);
  const [
    repositoriesNamesForFrameworks,
    setRepositoriesNamesForFrameworks,
  ] = useState<RepositoryName[]>([]);
  const [
    nbOccurencesPerVersionFrameworks,
    setNbOccurencesPerVersionFrameworks,
  ] = useState<OccurencesFrameworksVersion[]>([]);

  const reduceFrameworksReportsToNbOccurencesPerVersion = ({
    reports,
    referenceFramework,
  }: {
    reports: FrameworkVersionReport[];
    referenceFramework?: FrameworkName;
  }): OccurencesFrameworksVersion[] => {
    const reducedReports = reports
      .filter(({ name }) => filterAgainstItem(name, referenceFramework))
      .reduce((acc, { name, version }) => {
        if (!acc[name]) {
          acc[name] = {};
        }
        if (acc[name][version]) {
          acc[name][version] = {
            ...acc[name][version],
            count: acc[name][version].count + 1,
          };
        } else {
          acc[name][version] = { name, version, count: 1 };
        }
        return acc;
      }, {} as Record<string, Record<string, OccurencesFrameworksVersion>>);
    return Object.values(reducedReports).reduce(
      (acc, curr) => [...acc, ...Object.values(curr)],
      [] as OccurencesFrameworksVersion[]
    );
  };

  const selectFramework = (framework: string) => {
    setCurrentFramework(framework);
    setCurrentFrameworkVersion(ALL);
  };

  const frameworksNames = Array.from(
    new Set(frameworks.map(({ name }) => name))
  );

  useEffect(() => {
    setNbOccurencesPerVersionFrameworks(
      reduceFrameworksReportsToNbOccurencesPerVersion({
        reports: frameworks,
        referenceFramework: currentFramework,
      })
    );
  }, [currentFramework]);

  useEffect(() => {
    if (currentFramework === ALL || currentFrameworkVersion === ALL) {
      setRepositoriesNamesForFrameworks([]);
    } else {
      setRepositoriesNamesForFrameworks(
        Array.from(
          new Set(
            frameworks
              .filter(
                ({ name, version }) =>
                  name === currentFramework &&
                  version === currentFrameworkVersion
              )
              .map(({ repository }) => repository)
          )
        )
      );
    }
  }, [currentFrameworkVersion]);
  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <CardDescription>
            {title ?? 'Count of repositories per frameworks and versions'}
          </CardDescription>
          <CardTitle className="text-4xl tabular-nums">
            {frameworksNames.length}{" "}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              frameworks
            </span>
            <br/>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="flex-1 pb-0">Select a framework</span>
          <Selector
            data={frameworksNames}
            value={currentFramework ?? ALL}
            onChange={selectFramework}
          />
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            Frameworks
          </span>
          <div className="my-5">
          <BarChartCountProjectPerFrameworkAndVersion
            data={nbOccurencesPerVersionFrameworks}
            handleClick={({ payload: { name, version } }) => {
              if (
                currentFramework === ALL ||
                name !== currentFramework
              ) {
                setCurrentFrameworkVersion(ALL);
              } else {
                setCurrentFrameworkVersion(version);
              }
              setCurrentFramework(name);
            }}
          />
          <TableRepositories data={repositoriesNamesForFrameworks} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
