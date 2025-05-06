"use client";

import { useEffect, useState } from "react";
import { usersService } from "@/http/user-service";
import { DataTable } from "@/components/dashboard/data-table";

interface User {
  id: number | string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  applicationRole: {
    id: string;
    name: string;
  };
  profilePicture: string | null;
}

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
