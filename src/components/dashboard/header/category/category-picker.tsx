"use client";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Category } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import CategoryRow from "@/components/dashboard/header/category/category-row";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import CreateCategoryDialog from "@/components/dashboard/header/category/create-category-dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface IProps {
  type: TransactionType;
  onChange: (value: string) => void;
}

const CategoryPicker = ({ type, onChange }: IProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [value, onChange]);

  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = categoriesQuery.data?.find(
    (c: Category) => c.name === value,
  );

  const onSuccess = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen(false);
    },
    [setOpen, setValue],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role={"combobox"}
          aria-expanded={open}
          className={"w-[200px] justify-between"}
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select category"
          )}
          <ChevronsUpDown className={"opacity-50 ml-2 h-4 w-4 shrink-0"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"w-[200px] p-0"} asChild>
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder={"Search category..."} />
          <CreateCategoryDialog type={type} successCallback={onSuccess} />

          <CommandEmpty>
            <p>Category not found</p>
            <p className={"text-xs text-muted-foreground"}>
              Tip: create new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery.data &&
                categoriesQuery.data.map((category: Category) => (
                  <CommandItem
                    className={"flex justify-between"}
                    key={category.name}
                    onSelect={(currentValue) => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "text-sm opacity-0",
                        value === category.name && "opacity-50",
                      )}
                    />
                  </CommandItem>
                ))}{" "}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryPicker;
