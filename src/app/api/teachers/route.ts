import { connectDB } from '@/lib/connectDB';
import Courses from '@/schemas/courses';
import Teachers from '@/schemas/teachers';
import { NextRequest, NextResponse } from 'next/server';

async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, phone, designation, courses } = await req.json();

    const teacher = await Teachers.findOne({ name, email, phone, designation, courses });
    if (teacher) {
      return NextResponse.json({ message: 'Teacher already exists', teacher }, { status: 404 });
    }
    const newTeacher = await Teachers.insertMany({ name, email, phone, designation, courses });
    return NextResponse.json({ message: 'Teacher is added successfully', teacher: newTeacher }, { status: 201 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const semesterId = searchParams.get('semesterId');
    const teacherId = searchParams.get('teacherId');

    await connectDB();

    if (semesterId) {
      const courses = await Courses.find({ semester: semesterId }).sort({ code: 1 });
      const courseIds = courses.map((course) => course._id);
      const teachers = await Teachers.find({ courses: { $in: courseIds } });
      return NextResponse.json({ teachers }, { status: 200 });
    }

    if (teacherId) {
      const teacher = await Teachers.findById(teacherId);
      return NextResponse.json({ teacher }, { status: 200 });
    }

    const teachers = await Teachers.find().sort({ name: 1 });
    const designationOrder = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
    teachers.sort((a, b) => designationOrder.indexOf(a.designation) - designationOrder.indexOf(b.designation));
    return NextResponse.json({ teachers }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

export { POST, GET };
