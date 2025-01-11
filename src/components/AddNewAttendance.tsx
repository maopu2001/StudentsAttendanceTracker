'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from 'react-query';
import dateToDateString from '@/lib/dateToDateString';

export default function AddNewAttendance({ courseId }: { courseId: string }) {
  const [date, setDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);

  const { data: attendanceData, error: attendanceError } = useQuery({
    queryKey: ['attendanceDate'],
    queryFn: async () => {
      if (!date) return;
      const dateString = dateToDateString(date);
      return fetch(`/api/attendance?courseId=${courseId}&attendanceDate=${dateString}`).then((res) => res.json());
    },
    enabled: !!date,
  });

  const { toast } = useToast();

  const router = useRouter();

  const submitDate = () => {
    if (!date) {
      toast({
        title: 'Error',
        description: 'Please select a date',
        variant: 'destructive',
      });
      return;
    }
    if (attendanceError) {
      toast({
        title: 'Error',
        description: attendanceError.toString(),
        variant: 'destructive',
      });
      return;
    }

    console.log(attendanceData);
    router.push(`/attendance/${courseId}/${dateToDateString(date)}`);
  };
  return (
    <div className="flex gap-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn('w-[280px] justify-start text-left font-normal rounded-xl', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(e) => {
              setDate(e);
              setIsOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <button onClick={submitDate} className="border px-2 py-1 bg-blue-200 rounded-xl hover:bg-blue-300">
        Submit
      </button>
    </div>
  );
}
