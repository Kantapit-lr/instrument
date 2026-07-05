import { NextRequest, NextResponse } from "next/server";
import { getProjectOptions, getAllProjects, createProject } from "@/services/projectService";

// GET /api/projects           -> { value, label }[]  สำหรับ dropdown (หน้า new-instrument)
// GET /api/projects?full=true -> ข้อมูลเต็มของ Project  สำหรับหน้าจัดการโครงการ (/projects)
export async function GET(request: NextRequest) {
  try {
    const isFull = request.nextUrl.searchParams.get("full") === "true";
    const data = isFull ? await getAllProjects() : await getProjectOptions();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/projects]", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงรายชื่อโครงการได้" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.nickName) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อโครงการและชื่อเล่นให้ครบ" },
        { status: 400 }
      );
    }

    const project = await createProject({ name: body.name, nickName: body.nickName });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/projects]", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "ชื่อโครงการหรือชื่อเล่นนี้มีอยู่ในระบบแล้ว" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}
