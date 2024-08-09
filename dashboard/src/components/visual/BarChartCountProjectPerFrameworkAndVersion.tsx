import { OccurencesFrameworksVersion } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "../ui/chart";
export default function BarChartCountProjectPerFrameworkAndVersion({
  data,
  handleClick,
}: {
  data: OccurencesFrameworksVersion[];
  handleClick: (
    data: { payload: OccurencesFrameworksVersion },
    index: number
  ) => void;
}) {
  const toXAxisDataKey = (entry: { name: string; version: string }): string =>
    `${entry.name} ${entry.version}`;
  if (!data) {
    return <></>;
  }
  return (
    <>
      <ChartContainer
        config={{
          steps: {
            label: "Frameworks",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="mx-auto aspect-square "
      >
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={toXAxisDataKey} />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <Tooltip
            formatter={(count, _, { payload: { name, version } }) => {
              return [
                `${name} ${version}: ${count} ${
                  count === 1 ? "repository" : "repositories"
                }`,
              ];
            }}
          />
          <Legend
            formatter={() => {
              return [`Number of repositories using this framework`];
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="count"
            fill="#8884d8"
            onClick={handleClick}
          />
        </BarChart>
      </ChartContainer>
    </>
  );
}
