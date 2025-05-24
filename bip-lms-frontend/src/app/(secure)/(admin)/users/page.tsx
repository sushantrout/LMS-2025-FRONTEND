"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usersService } from "@/http/user-service";
import { showErrorToast, showSuccessToast } from "@/util/helpers/toast-helper";
import { roleService } from "@/http/role-service";
import {
  userDefaultValues,
  userFormSchema,
  UserFormValues,
  User,
  getUserData,
} from "@/types/model/user-model";
import UserFormComponent from "@/components/users/user-from";
import UserList from "@/components/users/users-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

export default function UsersPage() {
  const [roles, setRoles] = useState([]);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  const getUserRoles = () => {
    roleService
      .getApplicationRoles()
      .then((response) => {
        setRoles(response.data?.data?.data || []);
      })
      .catch((error) => {
        showErrorToast("Error fetching roles");
      });
  };

  useEffect(() => {
    getUserRoles();
  }, []);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: userDefaultValues,
  });

  const handleEditUser = async (userId: string) => {
    try {
      debugger;
      const response = await usersService.getApplicationUser(userId);
      const userData = response.data?.data;
      if (userData) {
        setEditingUser(userData);
        form.reset(getUserData(userData));
        setIsFileModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      showErrorToast("Error fetching user details");
    }
  };

  const updateExistingUser = (data: UserFormValues) => {
    usersService
      .updateApplcationUser(editingUser.id, data)
      .then((response) => {
        console.log("User updated successfully:", response);
        showSuccessToast("User updated successfully");
        form.reset();
        setEditingUser(null);
        setIsFileModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        showErrorToast("Error updating user");
      });
  };

  const createNewUser = (data: UserFormValues) => {
    usersService
      .createApplicationUser(data)
      .then((response) => {
        console.log("User created successfully:", response);
        showSuccessToast("User created successfully");
        form.reset();
        setIsFileModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        showErrorToast("Error creating user");
      });
  };

  const onSubmit = (data: UserFormValues) => {
    if (editingUser) {
      updateExistingUser(data);
    } else {
      createNewUser(data);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await usersService.deleteApplicationUser(userId);
      showSuccessToast("User deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      showErrorToast("Error deleting user");
    }
  };

  const handleRequestDeleteUser = (userId: string) => {
    setUserIdToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteUser = () => {
    if (userIdToDelete) {
      handleDeleteUser(userIdToDelete);
      setIsDeleteModalOpen(false);
      setUserIdToDelete(null);
    }
  };

  return (
    <div className="container mx-auto max-w-full px-4 py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          variant="default"
          onClick={() => {
            form.reset(userDefaultValues);
            setIsFileModalOpen(true);
          }}
        >
          Create User
        </Button>
      </div>

      <Dialog
        open={isFileModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsFileModalOpen(false);
            form.reset();
            setEditingUser(null);
          }
        }}
      >
        <DialogContent className="max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </DialogTitle>
          </DialogHeader>
          <UserFormComponent
            userForm={form}
            roles={roles}
            onSubmit={onSubmit}
            isEditing={!!editingUser}
            onCancel={() => {
              setIsFileModalOpen(false);
              form.reset();
              setEditingUser(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <UserList 
          refreshTrigger={refreshTrigger} 
          onEditUser={handleEditUser}
          onDeleteUser={handleRequestDeleteUser}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDeleteUser}
        title="Are you sure?"
        description="This action cannot be undone. The user will be permanently deleted."
      />
    </div>
  );
}
