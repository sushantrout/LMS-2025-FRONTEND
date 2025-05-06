"use client";

import { useEffect, useState } from "react";
import { usersService } from "@/http/user-service";
import { DataTable } from "@/components/dashboard/data-table";
import { User } from "@/types/model/user-model";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getApplcationUsersList();
      setUsers(response?.data?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading users...</div>;
  }

  return (
    <div className="w-full">
      {users.length === 0 ? (
        <div className="text-center py-8">No users found</div>
      ) : (
        <DataTable data={users} />
      )}
    </div>
  );
}
