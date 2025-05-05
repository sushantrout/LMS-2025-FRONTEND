// SessionDialog.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { initialSession, Session } from "@/types/model/session-model"

interface SessionDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: Session) => void
  initialData?: { title: string; duration: string; videoUrl: string }
}

export function SessionDialog({ open, onClose, onSave, initialData }: SessionDialogProps) {
  const [formdata, setFormData] = useState<Session>(initialSession);

  const handleSubmit = () => {
    const dataToSubmit = { ...formdata, sortOrder: formdata.sortOrder ?? 1 };
    onSave(dataToSubmit);
    onClose()
  }

  const handleChange = (property: string, value: any) => {
    setFormData({ ...formdata, [property]: value})
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Update Session" : "Add Session"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-title">Session Title</Label>
            <Input
              name="name"
              value={formdata?.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="Enter session title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-duration">Duration</Label>
            <Input
              name="duration"
              value={formdata?.duration}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="Enter session duration"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-video-url">Description</Label>
            <Textarea
              name="description"
              value={formdata?.description}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="Enter video URL"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>{initialData ? "Update" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
