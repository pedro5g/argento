import { useSearchParams } from "react-router";
import {
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonWrapper } from "./skeleton-wrapper";
import { FacetedFilter } from "./faceted-filter";
import { ColumnToggle } from "./column-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// AmountInput component adapted for filters
interface AmountInputProps {
  id: string;
  value?: number;
  onChange: (value?: number) => void;
  placeholder?: string;
}

const AmountInput = ({
  id,
  value,
  onChange,
  placeholder = "0.00",
}: AmountInputProps) => {
  const cleanFormat = (value: string) => {
    return value.replace(/\D/g, "").trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = cleanFormat(inputValue);

    if (cleanValue === "" || cleanValue === "0") {
      onChange(undefined);
    } else {
      onChange(parseFloat(cleanValue) / 100);
    }
  };

  const displayValue = value
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(value)
    : "";

  return (
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      className="pl-9"
      value={displayValue}
      onChange={handleChange}
    />
  );
};
import { Label } from "@/components/ui/label";
import {
  DownloadIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowLeftRight,
  CalendarIcon,
  DollarSign,
  FilterX,
} from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useGetPaginatedTransactions } from "@/api/hooks/use-get-paginated-transactions";
import type { ListPaginatedTransactionsParams } from "@/api/api-types";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { columns } from "./columns";
import { StatsCard } from "./stats-card";
import { SearchInput } from "@/components/search-input";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Transactions",
});

export const TransactionsTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnsFilters] = useState<ColumnFiltersState>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const params: ListPaginatedTransactionsParams = useMemo(() => {
    const getParam = (key: string) => {
      const value = searchParams.get(key);
      return value && value.trim() !== "" ? value : undefined;
    };

    const getNumberParam = (key: string) => {
      const value = getParam(key);
      return value ? parseFloat(value) : undefined;
    };

    const getIntParam = (key: string) => {
      const value = getParam(key);
      return value ? parseInt(value, 10) : undefined;
    };

    const getBooleanParam = (key: string) => {
      const value = getParam(key);
      return value ? value === "true" : undefined;
    };

    return {
      limit: getIntParam("limit") || 10,
      offset: getIntParam("offset") || 0,
      type: getParam("type"),
      is_scheduled: getBooleanParam("is_scheduled"),
      confirmed: getBooleanParam("confirmed"),
      recurrence: getParam("recurrence"),
      date_from: getParam("date_from"),
      date_to: getParam("date_to"),
      amount_min: getNumberParam("amount_min"),
      amount_max: getNumberParam("amount_max"),
      category_id: getIntParam("category_id"),
      account_id: getParam("account_id"),
      client_id: getParam("client_id"),
      payment_method_id: getIntParam("payment_method_id"),
      search: getParam("search"),
      order_by: getParam("order_by"),
      order_direction:
        (getParam("order_direction") as "asc" | "desc") || undefined,
    };
  }, [searchParams]);

  const { transactions, pagination, summary, isPending } =
    useGetPaginatedTransactions(params);

  const updateParams = useCallback(
    (newParams: Partial<ListPaginatedTransactionsParams>) => {
      const current = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== 0
        ) {
          current.set(key, String(value));
        } else {
          current.delete(key);
        }
      });

      setSearchParams(current);
    },
    [searchParams, setSearchParams]
  );

  const handleSearch = useCallback(
    (search: string) => {
      const trimmedSearch = search?.trim();
      updateParams({
        search: trimmedSearch || undefined,
        offset: 0,
      });
    },
    [updateParams]
  );

  const handlePagination = useCallback(
    (offset: number) => {
      updateParams({ offset });
    },
    [updateParams]
  );

  const handleLimitChange = useCallback(
    (limit: number) => {
      updateParams({ limit, offset: 0 });
    },
    [updateParams]
  );

  const handleFilterChange = useCallback(
    (filterKey: string, value?: string) => {
      const processedValue =
        Array.isArray(value) && value.length === 0 ? undefined : value;
      updateParams({ [filterKey]: processedValue, offset: 0 });
    },
    [updateParams]
  );

  const handleDateChange = useCallback(
    (type: "from" | "to", date?: Date) => {
      if (!date) {
        updateParams({
          [type === "from" ? "date_from" : "date_to"]: undefined,
          offset: 0,
        });
        return;
      }

      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const dateString = format(localDate, "yyyy-MM-dd");

      updateParams({
        [type === "from" ? "date_from" : "date_to"]: dateString,
        offset: 0,
      });
    },
    [updateParams]
  );
  const handleAmountChange = useCallback(
    (type: "min" | "max", value?: number) => {
      updateParams({
        [type === "min" ? "amount_min" : "amount_max"]: value,
        offset: 0,
      });
    },
    [updateParams]
  );

  const clearAllFilters = useCallback(() => {
    updateParams({
      type: undefined,
      confirmed: undefined,
      is_scheduled: undefined,
      recurrence: undefined,
      date_from: undefined,
      date_to: undefined,
      amount_min: undefined,
      amount_max: undefined,
      category_id: undefined,
      account_id: undefined,
      client_id: undefined,
      payment_method_id: undefined,
      search: undefined,
      offset: 0,
    });
  }, [updateParams]);

  const handleExportCSV = useCallback(() => {
    if (!transactions?.length) return;

    const data = transactions.map((transaction) => ({
      title: transaction.title,
      description: transaction.description,
      category: transaction.category_name,
      account: transaction.account_name,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      status: transaction.confirmed === 1 ? "Confirmed" : "Pending",
    }));

    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  }, [transactions]);

  const table = useReactTable({
    data: transactions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnsFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: pagination?.total_pages || 0,
  });

  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();

    if (!transactions || transactions.length === 0) {
      return [];
    }

    transactions.forEach((transaction) => {
      const categoryName = transaction?.category_name;
      const categoryEmoji = transaction?.category_emoji;
      if (categoryName && categoryName.trim() !== "") {
        categoriesMap.set(categoryName, {
          value: categoryName,
          label: `${categoryEmoji} ${categoryName}`,
        });
      }
    });

    return Array.from(categoriesMap.values());
  }, [transactions]);

  const currentPage =
    pagination && pagination.total > 0
      ? Math.floor((params.offset || 0) / (params.limit || 10)) + 1
      : 1;

  const hasActiveFilters = useMemo(() => {
    return !!(
      params.type ||
      params.confirmed !== undefined ||
      params.is_scheduled !== undefined ||
      params.recurrence ||
      params.date_from ||
      params.date_to ||
      params.amount_min ||
      params.amount_max ||
      params.category_id ||
      params.account_id ||
      params.client_id ||
      params.payment_method_id ||
      params.search
    );
  }, [params]);

  return (
    <div className="w-full space-y-4">
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="total"
            icon={
              <ArrowLeftRight
                className="size-12 rounded-lg 
                 p-2 text-purple-500 bg-purple-400/10"
              />
            }
            value={summary.total_transactions.toString()}
            countUp={false}
          />

          <StatsCard
            title="income"
            icon={
              <TrendingUp
                className="size-12 rounded-lg 
                 p-2 text-emerald-500 bg-emerald-400/10"
              />
            }
            value={summary.total_income}
          />
          <StatsCard
            value={summary.total_expense}
            title="expense"
            icon={
              <TrendingDown
                className="size-12 items-center rounded-lg 
                p-2 text-red-500 bg-red-400/10"
              />
            }
          />

          <StatsCard
            value={summary.balance}
            title="balance"
            icon={
              <Wallet
                className="size-12 items-center rounded-lg 
                p-2 text-blue-500 bg-blue-400/10"
              />
            }
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              searchQuery={params.search || ""}
              setSearchQuery={handleSearch}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FacetedFilter
              title="Transaction type"
              column={table.getColumn("type")}
              options={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
              onFilterChange={(value) => handleFilterChange("type", value?.[0])}
            />

            <FacetedFilter
              title="Status"
              column={table.getColumn("confirmed")}
              options={[
                { label: "Confirmed", value: "true" },
                { label: "Pending", value: "false" },
              ]}
              onFilterChange={(value) =>
                handleFilterChange("confirmed", value?.[0])
              }
            />

            {/* <FacetedFilter
              title="Scheduled"
              column={table.getColumn("is_scheduled")}
              options={[
                { label: "Scheduled", value: "true" },
                { label: "Not Scheduled", value: "false" },
              ]}
              onFilterChange={(value) =>
                handleFilterChange("is_scheduled", value?.[0])
              }
            /> */}

            {categoriesOptions.length > 0 && (
              <FacetedFilter
                title="Category"
                column={table.getColumn("category_name")}
                options={categoriesOptions}
                onFilterChange={(value) =>
                  handleFilterChange("category_name", value?.[0])
                }
              />
            )}

            {/* <FacetedFilter
              title="Recurrence"
              column={table.getColumn("recurrence")}
              options={[
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
              ]}
              onFilterChange={(value) =>
                handleFilterChange("recurrence", value?.[0])
              }
            /> */}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              Advanced Filters
            </Button>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <FilterX className="mr-2 size-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <h3 className="text-sm font-medium">Advanced Filters</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_from">Date From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {params.date_from
                        ? format(
                            new Date(params.date_from + "T00:00:00"),
                            "dd/MM/yyyy"
                          )
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        params.date_from
                          ? new Date(params.date_from + "T00:00:00")
                          : undefined
                      }
                      onSelect={(date) => handleDateChange("from", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_to">Date To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {params.date_to
                        ? format(
                            new Date(params.date_to + "T00:00:00"),
                            "dd/MM/yyyy"
                          )
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        params.date_to
                          ? new Date(params.date_to + "T00:00:00")
                          : undefined
                      }
                      onSelect={(date) => handleDateChange("to", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount_min">Min Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <AmountInput
                    id="amount_min"
                    value={params.amount_min}
                    onChange={(value) => handleAmountChange("min", value)}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount_max">Max Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <AmountInput
                    id="amount_max"
                    value={params.amount_max}
                    onChange={(value) => handleAmountChange("max", value)}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Select
            value={String(params.limit)}
            onValueChange={(value) => handleLimitChange(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((q) => (
                <SelectItem
                  key={`selete_table_quantity_${q}`}
                  value={q.toString()}>
                  {q}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {transactions && transactions.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <DownloadIcon className="mr-2 size-4" />
              CSV
            </Button>
          )}

          <ColumnToggle table={table} />
        </div>
      </div>

      <SkeletonWrapper isLoading={isPending}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    Nenhuma transação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && pagination.total > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(params.offset || 0) + 1} to{" "}
              {Math.min(
                (params.offset || 0) + (params.limit || 0),
                pagination.total
              )}{" "}
              of {pagination.total} transactions
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePagination(
                    Math.max(0, (params.offset || 0) - (params.limit || 0))
                  )
                }
                disabled={!pagination.has_previous}>
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>

              <div className="flex items-center gap-1">
                <span className="text-sm">
                  Page {currentPage} of {pagination.total_pages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePagination((params.offset || 0) + (params.limit || 0))
                }
                disabled={!pagination.has_next}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SkeletonWrapper>
    </div>
  );
};
