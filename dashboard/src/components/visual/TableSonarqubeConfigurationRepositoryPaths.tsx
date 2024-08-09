import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { toFixedPercentage } from "@/lib/utils";

export default function TableSonarqubeConfigurationRepositoryPaths({
  data,
}: {
  data: { path: string; setup: boolean }[];
}) {
  if (!data) {
    return <></>;
  }

  const totalOK = data.reduce((acc, { setup }) => acc + (setup ? 1 : 0), 0);
  return (
    <>
      <Table>
        <TableCaption>Paths</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Path</TableHead>
            <TableHead className="text-left">Is Sonarqube setup</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ path, setup }) => (
            <TableRow key={path}>
              <TableCell className="font-medium">{path}</TableCell>
              <TableCell className="text-left">
                {setup ? "Yes" : "No"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Configuration percentage</TableCell>
            <TableCell className="text-left">
              {toFixedPercentage(totalOK, data.length)}%
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
