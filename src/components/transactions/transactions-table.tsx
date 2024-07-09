"use client";

import { FromToType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { DateToUTCDate } from "@/lib/helpers";
import {
  ColumnDef,
  getCoreRowModel,
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
import { useState } from "react";
import { cn } from "@/lib/utils";

type TransactionHistoryRow = GetTransactionHistoryReturnType[0];
export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Category"} />
    ),
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
];

const emptyData: any[] = [];

const TransactionsTable = ({ from, to }: FromToType) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const history = useQuery<GetTransactionHistoryReturnType>({
    queryKey: ["transactions-history", "history", from, to],
    queryFn: () =>
      fetch(
        `/api/transactions-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
      ).then((res) => res.json()),
  });

  const table = useReactTable({
    data: history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className={"w-full"}>
      <div className={"flex flex-wrap items-end justify-between gap-2 p-4"}>
        <SkeletonWrapper isLoading={history.isLoading}>
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
        </SkeletonWrapper>
      </div>
    </div>
  );
};

export default TransactionsTable;
