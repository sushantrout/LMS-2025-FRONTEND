import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";


export default function FileUploadModal({
    isOpen,
    onClose,
    onSave,
    userId,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userId: string | number, file: File) => void;
    userId: string | number;
  }) {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
      }
    };
  
    const handleSave = () => {
      if (selectedFile) {
        onSave(userId, selectedFile);
        handleClose();
      }
    };
  
    const handleClose = () => {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Please select a file to upload for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            {selectedFile && (
              <p className="text-sm">Selected: {selectedFile.name}</p>
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button type="button" onClick={handleSave} disabled={!selectedFile}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }