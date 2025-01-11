import { connectDB } from '@/lib/connectDB';
import Semesters from '@/schemas/semester';
import { NextResponse } from 'next/server';

async function GET() {
  try {
    await connectDB();
    const semesters = await Semesters.find().sort({ name: 1 });
    return NextResponse.json({ semesters }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
async function POST(req: Request) {
  try {
    await connectDB();
    const { name, program } = await req.json();

    const semester = await Semesters.findOne({ name, program });
    if (semester) {
      return NextResponse.json({ message: 'Semester already exists', semester }, { status: 404 });
    }
    const newSemester = await Semesters.insertMany({
      name,
      program,
    });
    return NextResponse.json({ message: 'Semester is added successfully', semester: newSemester }, { status: 201 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, name, program } = await req.json();

    const semester = await Semesters.findById(id);
    if (!semester) {
      return NextResponse.json({ message: 'Semester not found' }, { status: 404 });
    }
    const editedSemester = await Semesters.findByIdAndUpdate(id, {
      name,
      program,
    });
    return NextResponse.json({ message: 'Semester is edited successfully', semester: editedSemester }, { status: 202 });
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
    const actionInfo = await Semesters.deleteOne({ regNo: regNo });
    return NextResponse.json({ data: actionInfo }, { status: 202 });
  } catch (error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

export { POST, GET, DELETE, PATCH };
