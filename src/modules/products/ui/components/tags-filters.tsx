import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";

interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[] | null) => void;
}

export function TagsFilter({ value, onChange }: TagsFilterProps) {
  // Initialize the TRPC client to interact with the backend.
  // `trpc.tags.getMany` is expected to fetch a paginated list of tags.
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        },
      ),
    );

  //
  function onClick(tag: string) {
    if (value?.includes(tag)) {
      onChange(value?.filter((t) => t !== tag) || []);
    } else {
      onChange([...(value || []), tag]);
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map((tag) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={tag.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onClick(tag.name)}
            >
              <p className="font-medium">{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name) || false}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          )),
        )
      )}
      {hasNextPage && (
        <button
          type="button"
          className="underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          Load more...
        </button>
      )}
    </div>
  );
}
