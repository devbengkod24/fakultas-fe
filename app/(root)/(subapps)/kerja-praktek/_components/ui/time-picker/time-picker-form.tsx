'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from './time-picker';
import { cn } from '@/lib/utils';

export default function DateTimePopover() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {selectedDate ? format(selectedDate, 'PPP HH:mm:ss') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' side='right'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
          initialFocus
        />
        <div className='p-3 border-t border-border'>
          <TimePicker setDate={setSelectedDate} date={selectedDate} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
