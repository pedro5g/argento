import { useGetClients } from "@/api/hooks/use-get-clients";
import { DeleteClientAlert } from "@/components/dialogs/delete-client-alert";
import { RegisterClientDialog } from "@/components/dialogs/register-client-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { formatPhone, getInitials } from "@/lib/utils";
import {
  EditIcon,
  MailIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";

export const ClientsManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { clients } = useGetClients();

  const filteredClients = (clients || []).filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Manage your client contacts ({(clients || []).length} total)
          </p>
        </div>
        <div>
          <RegisterClientDialog>
            <Button variant="blue">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </RegisterClientDialog>
        </div>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          className="pl-9 border-0 bg-muted/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card
            key={client.id}
            className="group bg-white transition-all rounded-md border duration-200">
            <CardContent className="px-2 py-0">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 bg-blue-50">
                    <AvatarFallback className="bg-transparent font-semibold">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                      {client.name}
                    </h3>
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
                    <RegisterClientDialog client={client}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </RegisterClientDialog>
                    {client.email && (
                      <DropdownMenuItem
                        onClick={() => window.open(`mailto:${client.email}`)}>
                        <MailIcon className="mr-2 h-4 w-4" />
                        Email
                      </DropdownMenuItem>
                    )}
                    {client.phone && (
                      <DropdownMenuItem
                        onClick={() => window.open(`tel:${client.phone}`)}>
                        <PhoneIcon className="mr-2 h-4 w-4" />
                        Call
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DeleteClientAlert client={client}>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        variant="destructive"
                        className="text-red-600">
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DeleteClientAlert>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                {client.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MailIcon className="h-4 w-4 text-blue-500" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <PhoneIcon className="h-4 w-4 text-blue-500" />
                    <span>{formatPhone(client.phone)}</span>
                  </div>
                )}
                {!client.email && !client.phone && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    No contact information
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
