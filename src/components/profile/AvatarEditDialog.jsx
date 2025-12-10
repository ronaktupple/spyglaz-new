import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AvatarEditDialog({ open, onOpenChange, onSelect, presets }) {
  const fileInputRef = React.useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      onSelect(dataUrl)
      onOpenChange(false)
    }
    reader.readAsDataURL(file)
  }

  const handleChoosePreset = (url) => {
    onSelect(url)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit avatar</DialogTitle>
        </DialogHeader>
        <div className="mt-1 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="avatar-upload">Upload a profile picture</Label>
            <Input
              id="avatar-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">PNG or JPG. Recommended square image.</p>
          </div>

          <div className="space-y-3">
            <Label className="block">Choose a smiling avatar</Label>
            <ScrollArea className="h-64 pr-2">
              <div className="flex flex-wrap gap-4 p-2">
                {presets.map((src, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleChoosePreset(src)}
                    className="relative w-20 h-20 overflow-hidden rounded-full ring-2 ring-border hover:ring-ring hover:ring-4 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-ring hover:scale-105 bg-background"
                    aria-label={`Choose avatar ${idx + 1}`}
                  >
                    <img 
                      src={src} 
                      alt={`Smiling avatar ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
