import CourseSelectionForm from '@/components/CourseSelectionForm';
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col w-[80%] mx-auto gap-2 m-5">
      <CourseSelectionForm />
    </div>
  );
}
