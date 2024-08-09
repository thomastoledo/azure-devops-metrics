import { randomHexColor, toFixedPercentage, toRawPercentage } from "@/lib/utils";
import { Legend, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer } from "../ui/chart";
export default function PieChartPercentageSonarqubeRepository({
  data,
}: {
  data: { name: string; totalPaths: number, totalOkPaths: number };
}) {
  const {totalOkPaths, totalPaths} = data;
  const customLabelizer = ({value}: {value: number}) => {
    return `${value}%`;
  }

  if (!data) {
    return <></>;
  };
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
          data={[
            {name: 'Configured', value: +toFixedPercentage(totalOkPaths, totalPaths), fill: '#038c03'},
            {name: 'Not configured', value: +toFixedPercentage(totalPaths - totalOkPaths, totalPaths), fill: '#fc3003'},
          ]}
          dataKey="value"
          nameKey="name"
          outerRadius={'60%'}
          strokeWidth={2}
          label={customLabelizer}
        >
        </Pie>
        <Tooltip formatter={(percentage, _, {payload: {name}}) => [`${name}: ${percentage}%`]}/>
        <Legend />
      </PieChart>
      </ChartContainer>
    </>
  );
}
