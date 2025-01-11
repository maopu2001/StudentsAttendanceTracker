'use client';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
type Semester = {
  _id: string;
  name: string;
  program: string;
};

type Course = {
  _id: string;
  title: string;
  courseCode: string;
  code: number;
  semester: string;
};

type SemestersData = Semester[];

export default function CourseSelectionForm() {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const { toast } = useToast();
  const router = useRouter();

  const { data: semestersData, isLoading: semesterIsLoading } = useQuery({
    queryKey: ['semesters'],
    queryFn: () => fetch('/api/semesters').then((res) => res.json()),
  });

  const { data: coursesData, isFetched: coursesIsFetched } = useQuery({
    queryKey: ['courses', selectedSemester],
    queryFn: () => fetch(`/api/courses?semesterId=${selectedSemester}`).then((res) => res.json()),
    enabled: !!selectedSemester,
  });

  const subitForm = () => {
    if (!selectedCourse || !selectedProgram || !selectedSemester) {
      toast({
        title: 'Error',
        description: 'Please select all the fields',
        variant: 'destructive',
      });
      return;
    }
    router.push(`/attendance/${selectedCourse}`);
  };

  if (semesterIsLoading) return <div>Loading...</div>;

  return (
    <div className="w-[80%] max-w-[600px] mx-auto rounded-3xl bg-blue-100 p-5 flex flex-col gap-5">
      <Select onValueChange={(e) => setSelectedProgram(e)}>
        <SelectTrigger className="px-6 py-3 w-full bg-blue-200 border-none">
          <SelectValue placeholder="Choose an academic program" />
        </SelectTrigger>
        <SelectContent>
          {semestersData.semesters
            .filter(
              (semester: Semester, i: number, self: SemestersData) =>
                self.findIndex((s: Semester) => s.program === semester.program) === i
            )
            .map((semester: Semester, i: number) => {
              return (
                <SelectItem key={i} value={semester.program}>
                  {semester.program}
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>

      <Select onValueChange={(e) => setSelectedSemester(e)}>
        <SelectTrigger className="px-6 py-3 w-full bg-blue-200 border-none">
          <SelectValue placeholder="Choose a semester" />
        </SelectTrigger>
        <SelectContent>
          {selectedProgram &&
            semestersData.semesters
              .filter((semester: Semester) => semester.program === selectedProgram)
              .map((semester: Semester, i: number) => {
                return (
                  <SelectItem key={i} value={semester._id}>
                    {semester.name}
                  </SelectItem>
                );
              })}
        </SelectContent>
      </Select>

      <Select onValueChange={(e) => setSelectedCourse(e)}>
        <SelectTrigger className="px-6 py-3 w-full bg-blue-200 border-none">
          <SelectValue placeholder="Choose a course" />
        </SelectTrigger>
        <SelectContent>
          {coursesIsFetched &&
            selectedSemester &&
            selectedProgram &&
            coursesData.courses.map((course: Course, i: number) => {
              return (
                <SelectItem key={i} value={course._id}>
                  {course.title} ({course.courseCode})
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
      <button
        onClick={subitForm}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
      >
        Submit
      </button>
    </div>
  );
}
