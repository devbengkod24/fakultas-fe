"use client";

import { useMemo, useState } from "react";
import { format, startOfDay } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerButtonProps {
  value: string; // dd-MM-yyyy (KP backend format) — empty string = no date
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePickerButton({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  disabled,
}: DatePickerButtonProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseDdMmYyyy(value) : undefined;

  // Disable semua tanggal sebelum hari ini (start of today in local TZ)
  const today = useMemo(() => startOfDay(new Date()), []);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="w-full justify-start font-normal text-left h-9 text-sm"
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50 shrink-0" />
          {selected ? (
            format(selected, "PPP", { locale: id })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (!d) return;
            const day = String(d.getDate()).padStart(2, "0");
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const y = d.getFullYear();
            onChange(`${day}-${m}-${y}`);
            setOpen(false);
          }}
          disabled={{ before: today }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function parseDdMmYyyy(s: string): Date | undefined {
  const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return undefined;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const d = new Date(year, month - 1, day);
  if (isNaN(d.getTime())) return undefined;
  return d;
}
