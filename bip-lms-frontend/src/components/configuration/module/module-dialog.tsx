// ModuleDialog.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { forwardRef, useImperativeHandle, useState } from "react"
import { initialModule, Module } from "@/types/model/module-model"
import { DialogTrigger } from "@radix-ui/react-dialog"
import QuillEditor from "@/components/editor/quill/quill-editor"

interface ModuleDialogProps {
  onClose: () => void
  onSave: (data: Module) => void
  ref: React.Ref<any>
}

function ModuleDialog(props: ModuleDialogProps, ref: React.Ref<any>) {
  const [isModuleDialogOpen, setModuleDialogOpen] = useState(false);
  const { onClose, onSave } = props;
  const [formdata, setFormData] = useState<Module>({ ...initialModule })

  useImperativeHandle(ref, () => ({
    onOpen: (data?: Module) => {
      if (data) {
        setFormData(data)
      } else {
        setFormData({ ...initialModule });
      }
      setModuleDialogOpen(true);
    },
    onClose: () => {
      setModuleDialogOpen(false);
      setFormData({ ...initialModule })
    },
  }))

  const handleSubmit = () => {
    onSave(formdata);
    onClose()
  }

  const handleChange = (property: string, value: any) => {
    setFormData({ ...formdata, [property]: value })
  }

  return (
    <Dialog open={isModuleDialogOpen} onOpenChange={onClose}>
      <DialogTrigger>
        <Button onClick={() => setModuleDialogOpen(true)} variant="default">
          Add New Module
        </Button>
      </DialogTrigger>
      <DialogContent style={{ width: '150vw', maxWidth: '1500px', height: '80vh', maxHeight: '1000px' }} className="rounded-2xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle>{formdata?.id ? "Update Module" : "Add Module"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="module-name">Module Name</Label>
            <Input
              name="name"
              value={formdata?.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="Enter module name"
            />
          </div>

          <div className="space-y-2">
           <Label>Description</Label>
          <QuillEditor 
           style={{ height: '300px' }}
        theme="snow" 
        value={formdata?.description} 
        onChange={(value) => handleChange('description', value)} 
        placeholder="Enter module description" 
        />
       </div>
          
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => {
              setModuleDialogOpen(false);
              setFormData({ ...initialModule })
            }}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>{formdata?.id ? "Update" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default forwardRef(ModuleDialog);