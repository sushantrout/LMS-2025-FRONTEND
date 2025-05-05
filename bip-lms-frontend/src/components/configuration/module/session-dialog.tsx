// SessionDialog.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { initialSession, Session } from "@/types/model/session-model"
import QuillEditor from "@/components/editor/quill/quill-editor"

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
    console.log("dataToSubmit===>", dataToSubmit)
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
  {/* Session Title */}
  <div className="space-y-2">
    <Label htmlFor="session-title">Session Title</Label>
    <Input
      name="name"
      value={formdata?.name}
      onChange={(e) => handleChange(e.target.name, e.target.value)}
      placeholder="Enter session title"
    />
  </div>

  {/* Session Duration */}
  <div className="space-y-2">
    <Label htmlFor="session-duration">Duration (in minutes)</Label>
    <Input
      name="duration"
      value={formdata?.duration}
      onChange={(e) => handleChange(e.target.name, e.target.value)}
      placeholder="Enter session duration"
    />
  </div>

  {/* Description */}
  <div>
    <Label htmlFor="description">Description</Label>
    <QuillEditor
      theme="snow"
      value={formdata?.description}
      onChange={(value) => handleChange('description', value)}
      placeholder="Enter session description"
    />
  </div>

  {/* Mode Selection */}
  <div className="space-y-2">
    <Label htmlFor="session-mode">Mode</Label>
    <select
      name="mode"
      value={formdata?.mode}
      onChange={(e) => handleChange(e.target.name, e.target.value)}
      className="w-full border rounded px-3 py-2"
    >
      <option value="">Select Mode</option>
      <option value="ONLINE">Online</option>
      <option value="OFFLINE">Offline</option>
      <option value="VIDEO">Video</option>
    </select>
  </div>

  {/* Start Time */}
  <div className="space-y-2">
    <Label htmlFor="startTime">Start Time</Label>
    <Input
      type="datetime-local"
      name="startTime"
      value={formdata?.startTime}
      onChange={(e) => handleChange(e.target.name, e.target.value)}
    />
  </div>

  {/* End Time */}
  <div className="space-y-2">
    <Label htmlFor="endTime">End Time</Label>
    <Input
      type="datetime-local"
      name="endTime"
      value={formdata?.endTime}
      onChange={(e) => handleChange(e.target.name, e.target.value)}
    />
  </div>

  {/* Location - Conditional for OFFLINE Mode */}
  {formdata?.mode === 'OFFLINE' && (
    <div className="space-y-2">
      <Label htmlFor="location">Location</Label>
      <Input
        name="location"
        value={formdata?.location}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        placeholder="Enter session location"
      />
    </div>
  )}

  {/* External Link - Conditional for ONLINE or VIDEO Mode */}
  {(formdata?.mode === 'ONLINE' || formdata?.mode === 'VIDEO') && (
    <div className="space-y-2">
      <Label htmlFor="link">External Link</Label>
      <Input
        name="link"
        type="url"
        value={formdata?.link}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        placeholder="Enter external video or meeting link"
      />
    </div>
  )}
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
