"use client";
import FrameworkCountReporting from "@/components/logical/FrameworkCountReporting";
import FrameworkVersionCountReporting from "@/components/logical/FrameworksVersionsCountReporting";
import SonarqubeReporting from "@/components/logical/SonarqubeReporting";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import getMainFrameworks from "@/services/getMainFrameworks.service";
import getSonarqube from "@/services/getSonarqube";
import getTestFrameworks from "@/services/getTestFrameworks";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  ReferenceLine,
  Label,
  LineChart,
  CartesianGrid,
  YAxis,
  Line,
  LabelList,
  RadialBarChart,
  PolarAngleAxis,
  RadialBar,
  AreaChart,
  Area,
} from "recharts";

export default function Home() {
  const mainFrameworks = getMainFrameworks();
  const testFrameworks = getTestFrameworks();
  const sonarqube = getSonarqube();

  const repositories = Array.from(
    new Set(
      mainFrameworks
        .map(({ repository }) => repository)
        .concat(testFrameworks.map(({ repository }) => repository))
        .concat(sonarqube.map(({ repository }) => repository))
    )
  );

  return (
    <>
      <div className="chart-wrapper mx-auto flex max-w-7xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
        <div className="grid w-full items-start gap-6 sm:grid-cols-1 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[23rem]">
          <FrameworkCountReporting
            frameworks={mainFrameworks}
            repositories={repositories}
            title="Number of repositories by main framework"
          />
          <FrameworkCountReporting
            frameworks={testFrameworks}
            repositories={repositories}
            title="Number of repositories by test framework"
          />
        </div>
        <div className="grid w-full items-start gap-6 sm:grid-cols-1 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[23rem]">
          <FrameworkVersionCountReporting
            frameworks={mainFrameworks}
            title="Count of repositories per main frameworks and versions"
          />
          <FrameworkVersionCountReporting
            frameworks={mainFrameworks}
            title="Count of repositories per test frameworks and versions"
          />
        </div>
        <div className="grid w-full items-start gap-6 sm:grid-cols-1 lg:max-w-[46rem] lg:grid-cols-1 xl:max-w-[23rem]">
          <SonarqubeReporting data={sonarqube} repositories={repositories} />
        </div>
      </div>
    </>
  );
}
