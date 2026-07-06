import { NextRequest, NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/services/projectService";
import { ProjectIdRouteParams } from "@/types/api";

export async function PATCH(request: NextRequest, { params }: ProjectIdRouteParams) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    const body = await request.json();

    if (!body.name || !body.nickName) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อโครงการและชื่อเล่นให้ครบ" },
        { status: 400 }
      );
    }

    const project = await updateProject(projectId, {
      name: body.name,
      nickName: body.nickName,
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("[PATCH /api/projects/[id]]", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "ชื่อโครงการหรือชื่อเล่นนี้มีอยู่ในระบบแล้ว" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: ProjectIdRouteParams) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    await deleteProject(projectId);

    return NextResponse.json({ data: { projectId } });
  } catch (error) {
    console.error("[DELETE /api/projects/[id]]", error);

    // ข้อความนี้มาจาก deleteProject ที่เช็คจำนวนอุปกรณ์ผูกอยู่ก่อนแล้ว (อ่านง่าย ไม่ใช่ raw FK error)
    if (error instanceof Error && error.message.startsWith("ไม่สามารถลบได้")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
