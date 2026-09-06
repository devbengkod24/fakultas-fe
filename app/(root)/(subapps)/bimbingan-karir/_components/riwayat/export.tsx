"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FileExportPopup() {
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState("exported-file.csv")
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)

    try {
      // This is an example of exporting data as a CSV file
      // Replace this with your actual data export logic
      const data = [
        ["Name", "Email", "Phone"],
        ["John Doe", "john@example.com", "123-456-7890"],
        ["Jane Smith", "jane@example.com", "098-765-4321"],
      ]

      const csvContent = data.map((row) => row.join(",")).join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Close the dialog after successful export
      setTimeout(() => {
        setExporting(false)
        setOpen(false)
      }, 1000)
    } catch (error) {
      console.error("Export failed:", error)
      setExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          {/* <Upload size={16}/> */}
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export File</DialogTitle>
          <DialogDescription>Export data tabel dibawah ini ke dalam bentuk csv.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fileName" className="text-right">
              File name
            </Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Notes :</h4>
            <p className="text-xs text-muted-foreground">
              Data anda akan diubah ke dalam format csv yang dapat dibuka nantinya pada aplikasi spreadsheet.
            </p>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={exporting || !fileName.trim()} className="gap-1">
            {exporting ? (
              <>Processing...</>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
