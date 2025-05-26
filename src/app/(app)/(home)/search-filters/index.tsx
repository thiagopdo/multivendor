import { Categories } from "./categories";
import { SearchInput } from "./search-input";

interface Props {
  data: any;
}

export function SearchFilters({ data }: Props) {
  return (
    <div className="flex flex-col px-4 lg:px-12 py-8 border-b gap-4 w-full">
      <SearchInput />
      <Categories data={data} />
    </div>
  );
}
