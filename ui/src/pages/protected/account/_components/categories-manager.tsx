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
import {
  PlusIcon,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchInput } from "@/components/search-input";

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
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
              className="group p-0 rounded-md border transition-all duration-200">
              <CardContent className="p-0">
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 bg-zinc-50">
                      <AvatarFallback className="bg-transparent text-lg">
                        {category.emoji}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          category.type === "income"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
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
            <div className="flex flex-col gap-2  items-center justify-center">
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
