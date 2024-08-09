import { FrameworkCount } from "@/lib/types";
import { randomHexColor, toFixedPercentage } from "@/lib/utils";
import { Legend, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer } from "../ui/chart";
export default function PieChartCountProjectsPerFramework({
  data,
}: {
  data: FrameworkCount[];
}) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  const customLabelizer = ({ value }: { value: number }) => {
    return `${toFixedPercentage(value, total)}%`;
  };

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
        <PieChart>
          <Pie
            data={data.map((datum) => ({ ...datum, fill: randomHexColor() }))}
            dataKey="count"
            nameKey="name"
            outerRadius={'60%'}
            strokeWidth={2}
            label={customLabelizer}
          ></Pie>
          <Tooltip
            formatter={(count, _, { payload: { name } }) => {
              return [
                `${name}: ${count} ${
                  count === 1 ? "repository" : "repositories"
                }`,
              ];
            }}
          />
          <Legend />
        </PieChart>
      </ChartContainer>

    </>
  );
}
