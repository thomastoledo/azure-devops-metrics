import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL } from "@/lib/constants";

export default function Selector({
  data,
  onChange,
  value,
}: {
  data: string[];
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="max-w-[300px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key={ALL} value={ALL}>
              {ALL}
            </SelectItem>
            {data.map((datum) => (
              <SelectItem key={datum} value={datum}>
                {datum}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
