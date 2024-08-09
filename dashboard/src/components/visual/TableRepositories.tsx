import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RepositoryName } from "@/lib/types";

export default function TableRepositories({
  data,
}: {
  data: RepositoryName[];
}) {
  if (!data || data.length === 0) {
    return (
      <>
      </>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>Repositories</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Repositories</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((name) => (
            <TableRow key={name}>
              <TableCell className="font-medium">{name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total Repositories</TableCell>
            <TableCell className="text-left">{data.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
