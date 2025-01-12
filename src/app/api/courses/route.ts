import { connectDB } from '@/lib/connectDB';
import { Courses, Teachers } from '@/schemas';
import { NextRequest, NextResponse } from 'next/server';

async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { title, courseCode, code, semester } = await req.json();

    const course = await Courses.findOne({ title, courseCode, code, semester });
    if (course) {
      return NextResponse.json({ message: 'Course already exists', data: course }, { status: 404 });
    }
    const newCourse = await Courses.insertMany({
      title,
      courseCode,
      code,
      semester,
    });
    return NextResponse.json({ message: 'Course is added successfully', data: newCourse }, { status: 201 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

//still needs work
async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const semesterId = searchParams.get('semesterId');
    const teacherId = searchParams.get('teacherId');

    await connectDB();

    if (semesterId) {
      const courses = await Courses.find({ semester: semesterId }).sort({ code: 1 });
      return NextResponse.json({ courses }, { status: 200 });
    }

    if (teacherId) {
      const teacher = await Teachers.findById(teacherId);
      if (!teacher) {
        return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
      }
      return NextResponse.json({ courses: teacher.courses }, { status: 200 });
    }

    const courses = await Courses.find().sort({ code: 1 });
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

export { POST, GET };
