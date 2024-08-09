import { randomHexColor, toFixedPercentage } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  RadialBar,
  RadialBarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
export default function BarChartPercentageSonarqubeRepositories({
  data,
}: {
  data: { name: string; totalPaths: number; totalOkPaths: number }[];
}) {
  const toXAxisDataKey = (entry: { name: string }): string => `${entry.name}`;
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
          data={data.map(({ totalOkPaths, totalPaths, name }) => ({
            name,
            percentage: toFixedPercentage(totalOkPaths, totalPaths),
          }))}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={toXAxisDataKey} />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
            tickCount={5}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value, _, { payload: { name } }) => {
              return [`${name}: configured at ${value}%`];
            }}
          />
          <Legend
            formatter={() => {
              return [`Percentage of Sonarqube configuration`];
            }}
          />
          <Bar yAxisId="left" dataKey="percentage" fill="#8884d8" />
        </BarChart>
      </ChartContainer>
    </>
  );
}
