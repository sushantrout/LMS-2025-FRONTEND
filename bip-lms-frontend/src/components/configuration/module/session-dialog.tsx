// SessionDialog.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface SessionDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: { title: string; duration: string; videoUrl: string }) => void
  initialData?: { title: string; duration: string; videoUrl: string }
}

export function SessionDialog({ open, onClose, onSave, initialData }: SessionDialogProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [duration, setDuration] = useState(initialData?.duration || "")
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "")

  const handleSubmit = () => {
    onSave({ title, duration, videoUrl })
    onClose()
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
              id="session-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter session title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-duration">Duration</Label>
            <Input
              id="session-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter session duration"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-video-url">Video URL</Label>
            <Input
              id="session-video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
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
