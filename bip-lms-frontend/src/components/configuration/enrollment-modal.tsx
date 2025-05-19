import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showSuccessToast, showErrorToast } from "@/util/helpers/toast-helper";
import { usersService } from "@/http/user-service";
import { User } from "@/types/model/user-model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { courseService } from "@/http/course-service";
import { EnrollmentCourse } from "@/types/model/enrollment-course";



interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

export default function EnrollmentModal({
  isOpen,
  onClose,
  courseId,
}: EnrollmentModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await usersService.getApplcationUsersList();
      setUsers(users?.data?.data?.data);
    };
    fetchUsers();
  }, [courseId]);

  const handleEnroll = async () => {
    if (selectedUsers.length === 0) {
      showErrorToast("Please select at least one user to enroll");
      return;
    }

    try {
      const enrollmentData: EnrollmentCourse = {
        courseId: courseId,
        traineeIds: selectedUsers
      };

      const response = await courseService.enrollUsers(enrollmentData);
      console.log(response);
      showSuccessToast(`${selectedUsers.length} users enrolled successfully!`);
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error('Enrollment error:', error);
      showErrorToast(error?.response?.data?.message || "Failed to enroll users. Please try again.");
    }
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Enroll Students</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.some((u) => u.id === user.id)}
                      onCheckedChange={() => toggleUserSelection(user)}
                    />
                  </TableCell>
                  <TableCell>{`${user.firstName || ""} ${
                    user.lastName || ""
                  }`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter className="pt-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {selectedUsers.length} users selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEnroll}
              disabled={selectedUsers.length === 0}
            >
              Enroll Selected
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
