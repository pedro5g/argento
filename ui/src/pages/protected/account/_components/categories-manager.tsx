import { useGetCategories } from "@/api/hooks/use-get-categories";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { CategoryTypes } from "@/api/api-types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateCategoryDialog } from "@/components/dialogs/create-category-dialog";
import { DeleteCategoryAlert } from "@/components/dialogs/delete-category-alert";

export const CategoriesManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<CategoryTypes | "all">("all");
  const { categories, isPending } = useGetCategories();

  const filteredCategories = (categories || []).filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || category.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your income and expense categories
          </p>
        </div>
        <div>
          <CreateCategoryDialog>
            <Button variant="blue">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </CreateCategoryDialog>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-9 border-0 bg-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Badge
            variant={typeFilter === "all" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all",
              typeFilter === "all" && "bg-blue-200 ring-blue-700 ring-2"
            )}
            onClick={() => setTypeFilter("all")}>
            All
          </Badge>
          <Badge
            variant={typeFilter === "income" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300",
              typeFilter === "income" && "bg-green-200 ring-green-700 ring-2"
            )}
            onClick={() => setTypeFilter("income")}>
            Income
          </Badge>
          <Badge
            variant={typeFilter === "expense" ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300",
              typeFilter === "expense" && "bg-red-200 ring-red-700 ring-2"
            )}
            onClick={() => setTypeFilter("expense")}>
            Expense
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isPending || !categories ? (
          [...Array.from({ length: 8 })].map((_, i) => (
            <Skeleton
              key={i}
              className="bg-gradient-to-r from-zinc-100 to-zinc-50 w-[270px] h-[134px] rounded-md shadow"
            />
          ))
        ) : filteredCategories.length ? (
          filteredCategories.map((category) => (
            <Card
              key={category.id}
              className="group bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-md">
              <CardContent className="px-2 py-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{category.emoji}</div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-50">
                        {category.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          category.type === "income"
                            ? "text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-600 dark:bg-green-900/20"
                            : "text-red-700 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-600 dark:bg-red-900/20"
                        }`}>
                        {category.type}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <CreateCategoryDialog category={category}>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer ">
                          <EditIcon className=" h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </CreateCategoryDialog>
                      <DropdownMenuSeparator />
                      <DeleteCategoryAlert category={category}>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          variant="destructive"
                          className=" cursor-pointer">
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DeleteCategoryAlert>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-10 bg-zinc-50">
            <div className="flex flex-col gap-2 flex-1 items-center justify-center">
              <p className="text-2xl text-zinc-600">No categories found :(</p>
              <span className="font-semibold">
                Tip: create{" "}
                {typeFilter !== "all"
                  ? `a new ${typeFilter} category`
                  : "category"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
