"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
  UserCog,
  X,
} from "lucide-react";
import { User } from "@/types/model/user-model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageSrc } from "@/util/helpers/application-data-converter-util";

interface DataTableProps {
  data: User[];
  onEditUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
}

export function UserDataTable({
  data,
  onEditUser,
  onDeleteUser,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showUserDetails, setShowUserDetails] = useState<User | null>(null);

  // Filter data based on search term and filters
  const filteredData = data.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === null || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === null || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Handle sort
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRole(null);
    setSelectedStatus(null);
    setSortField(null);
    setCurrentPage(1);
  };

  // Get status badge color
  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "inactive":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Get initials for avatar
  const getInitials = (fullName: string | undefined) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full space-y-4">
      {/* Filters and actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-[300px]"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[250px]">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("fullName")}
                >
                  Full name
                  {sortField === "fullName" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((user, index) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={getImageSrc(user?.profilePicture)}
                          alt={user.fullName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          console.log(user);
                          return setShowUserDetails(user);
                        }}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEditUser?.(user.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteUser?.(user.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {paginatedData.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber: number;

              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={!!showUserDetails}
        onOpenChange={(open) => !open && setShowUserDetails(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user.
            </DialogDescription>
          </DialogHeader>
          {showUserDetails && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={getImageSrc(showUserDetails?.profilePicture)}
                    alt={showUserDetails.fullName}
                  />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {getInitials(showUserDetails.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">
                    {showUserDetails.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {showUserDetails.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    First Name
                  </p>
                  <p>{showUserDetails.firstName || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </p>
                  <p>{showUserDetails.lastName || "—"}</p>
                </div>
                {/* <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p>{showUserDetails.email || "—"}</p>
                </div> */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p>{showUserDetails.mobileNumber || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
