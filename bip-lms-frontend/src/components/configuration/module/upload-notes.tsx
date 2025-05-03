// components/UploadNotesModal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Paperclip } from "lucide-react"
import { cn } from "@/lib/utils" // For utility classnames combining

export interface UploadNotesModalProps {
    open: boolean
    sessionName: string | null
    onClose: () => void
    onSave: (file: File | null) => void
}

export const UploadNotesModal = ({
    open,
    sessionName,
    onClose,
    onSave,
}: UploadNotesModalProps) => {
    if (!open) return null

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null
        onSave(file)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[500px] max-w-lg rounded-lg p-6 bg-white shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Upload Notes for <span className="font-medium text-blue-500">{sessionName}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-3">
                    <div>
                        <Input
                            type="file"
                            placeholder="No file chosen"
                            className="border border-gray-300"
                        />
                        <div className="mt-2 text-sm text-gray-500">Upload a PDF, Word, or any other supported document format for your notes.</div>
                    </div>
                </div>

                <DialogFooter className="flex justify-end gap-4">
                    <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-200" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => onSave(null)}>
                        Save Notes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
