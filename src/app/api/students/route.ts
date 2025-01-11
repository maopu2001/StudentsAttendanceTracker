import { connectDB } from '@/lib/connectDB';
import { NextRequest, NextResponse } from 'next/server';
import Students from '@/schemas/students';
import Courses from '@/schemas/courses';

async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');
    const regNo = searchParams.get('regNo');
    if (courseId) {
      const course = await Courses.findById(courseId).populate('semester');
      const students = await Students.find({ semester: course.semester });
      return NextResponse.json({ students, course }, { status: 200 });
    }
    if (studentId) {
      const student = await Students.findById(studentId);
      return NextResponse.json({ student }, { status: 200 });
    }
    if (regNo) {
      const student = await Students.findOne({ regNo: regNo });
      return NextResponse.json({ student }, { status: 200 });
    }
    const allStudents = await Students.find().sort({ regNo: 1 });
    return NextResponse.json({ students: allStudents }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function POST(req: Request) {
  try {
    await connectDB();
    const { name, regNo, session, semester } = await req.json();

    const student = await Students.findOne({ regNo: regNo });
    if (student) {
      return NextResponse.json({ message: 'Student already exists', student }, { status: 404 });
    }
    const newStudent = await Students.insertMany({
      name,
      regNo,
      session,
      semester,
    });
    return NextResponse.json({ message: 'Student is added successfully', student: newStudent }, { status: 201 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function PATCH(req: Request) {
  try {
    await connectDB();
    const { name, regNo, session, semester } = await req.json();

    const student = await Students.findOne({ regNo: regNo });
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const editedStudent = await Students.updateOne(
      { regNo: regNo },
      {
        name,
        session,
        semester,
      }
    );
    return NextResponse.json({ message: 'Student is edited successfully', student: editedStudent }, { status: 202 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function DELETE(req: Request) {
  try {
    await connectDB();
    const { regNo } = await req.json();
    const actionInfo = await Students.deleteOne({ regNo: regNo });
    return NextResponse.json({ data: actionInfo }, { status: 202 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

export { POST, GET, DELETE, PATCH };
