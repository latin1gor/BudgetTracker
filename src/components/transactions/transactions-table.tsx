"use client";

import { FromToType, TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { DateToUTCDate } from "@/lib/helpers";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { GetTransactionHistoryReturnType } from "@/app/api/transactions-history/route";
import { flexRender, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonWrapper from "@/components/general/skeleton-wrapper";
import { DataTableColumnHeader } from "@/components/transactions/data-table/column-header";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DataTableFacetedFilter } from "@/components/transactions/data-table/faceted-filters";
import { DataTableViewOptions } from "@/components/transactions/data-table/column-togle";
import { Button } from "@/components/ui/button";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { DownloadIcon, MoreHorizontal, TrashIcon } from "lucide-react";
import { Dropdown } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteTransactionDialog from "@/components/transactions/delete-transaction-dialog";

type TransactionHistoryRow = GetTransactionHistoryReturnType[0];
const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Category"} />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className={"flex gap-2 capitalize"}>
        {row.original.categoryIcon}
        <div className={"capitalize"}>{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Description"} />
    ),
    cell: ({ row }) => (
      <div className={"capitalize"}>{row.original.description}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",

    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return <div className={"text-muted-foreground"}>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Type"} />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "rounded-lg text-center p-2",
          row.original.type === "income"
            ? "text-emerald-500 bg-emerald-400/10"
            : "text-red-500 bg-red-400/10",
        )}
      >
        {row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Amount"} />
    ),
    cell: ({ row }) => (
      <p
        className={
          "text-md rounded-lg bg-gray-500/10 p-2 text-center font-medium"
        }
      >
        {row.original.formattedAmount}
      </p>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <RowActions transaction={row.original} />,
  },
];

const csvCofig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const emptyData: any[] = [];

const TransactionsTable = ({ from, to }: FromToType) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const history = useQuery<GetTransactionHistoryReturnType>({
    queryKey: ["transactions", "history", from, to],
    queryFn: () =>
      fetch(
        `/api/transactions-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
      ).then((res) => res.json()),
  });

  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvCofig)(data);
    download(csvCofig)(csv);
  };

  const table = useReactTable({
    data: history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();
    history.data?.forEach((i) => {
      categoriesMap.set(i.category, {
        value: i.category,
        label: `${i.categoryIcon} ${i.category}`,
      });
    });
    const uniqueCategories = new Set(categoriesMap.values());
    return Array.from(uniqueCategories);
  }, [history.data]);

  return (
    <div className={"w-full"}>
      <div className={"flex flex-wrap items-end justify-between gap-2 p-4"}>
        <div className={"flex gap-2"}>
          {table.getColumn("category") && (
            <DataTableFacetedFilter
              options={categoriesOptions}
              title={"Category"}
              column={table.getColumn("category")}
            />
          )}
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              options={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
              title={"Type"}
              column={table.getColumn("type")}
            />
          )}
        </div>
        <div className={"flex flex-wrap gap-2"}>
          <Button
            variant={"outline"}
            size={"sm"}
            className={"ml-auto h-8 lg:flex"}
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((row) => ({
                category: row.original.category,
                categoryIcon: row.original.categoryIcon,
                description: row.original.description,
                type: row.original.type,
                amount: row.original.amount,
                formattedAmount: row.original.formattedAmount,
                date: row.original.date,
              }));

              handleExportCSV(data);
            }}
          >
            <DownloadIcon className={"h-4 w-4 mr-2"} /> Export CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <SkeletonWrapper isLoading={history.isFetching}>
        <div className="rounded-md border w-full">
          <Table className={"w-full"}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default TransactionsTable;

const RowActions = ({
  transaction,
}: {
  transaction: TransactionHistoryRow;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteTransactionDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        transactionId={transaction.id}
      ></DeleteTransactionDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className={"h-8 w-8 p-0"}>
            <span className={"sr-only"}>Open menu</span>
            <MoreHorizontal className={"h-4 w-4"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"end"}>
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={"flex items-center gap-2"}
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon className={"h-4 w-4 text-muted-foreground"} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
