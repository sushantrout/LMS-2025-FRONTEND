"use client";

import { useState, useRef, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usersService } from "@/http/user-service";
import { showErrorToast, showSuccessToast } from "@/util/helpers/toast-helper";
import { roleService } from "@/http/role-service";
import {
  userDefaultValues,
  userFormSchema,
  UserFormValues,
} from "@/types/model/user-model";
import UserFormComponent from "@/components/users/user-from";
import UserList from "@/components/users/users-list";

export default function UsersPage() {
  const [roles, setRoles] = useState([]);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserRoles = () => {
    roleService
      .getApplicationRoles()
      .then((response) => {
        setRoles(response.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
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

  const onSubmit = (data: UserFormValues) => {
    console.log("Form submitted:", {
      ...data,
      uploadedFileName: uploadedFileName,
    });
    usersService
      .createApplicationUser(data)
      .then((response) => {
        console.log("User created successfully:", response);
        showSuccessToast("User created successfully");
        form.reset();
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        showErrorToast("Error creating user");
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveFile = () => {
    if (selectedFile) {
      setUploadedFileName(selectedFile.name);
      setIsFileModalOpen(false);

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleOpenFileModal = () => {
    setIsFileModalOpen(true);
  };

  const handleCloseFileModal = () => {
    setIsFileModalOpen(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container py-4 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      <UserList />
      <UserFormComponent
        studentFrom={form}
        roles={roles}
        onSubmit={onSubmit}
      ></UserFormComponent>
    </div>
  );
}
