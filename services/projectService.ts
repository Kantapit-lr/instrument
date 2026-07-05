import { prisma } from "@/lib/prisma";

export interface ProjectListItem {
  projectId: number;
  name: string;
  nickName: string;
  profileCount: number; // จำนวนอุปกรณ์ที่ผูกกับโครงการนี้ ใช้เตือนก่อนลบ
}

// ดึงรายชื่อโครงการทั้งหมด พร้อมจำนวนอุปกรณ์ที่ผูกอยู่ (สำหรับหน้า /projects)
export async function getAllProjects(): Promise<ProjectListItem[]> {
  const projects = await prisma.project.findMany({
    orderBy: { projectId: "asc" },
    select: {
      projectId: true,
      name: true,
      nickName: true,
      _count: { select: { profiles: true } },
    },
  });

  return projects.map((project) => ({
    projectId: project.projectId,
    name: project.name,
    nickName: project.nickName,
    profileCount: project._count.profiles,
  }));
}

// ดึงรายชื่อโครงการแบบสั้น สำหรับ dropdown (ใช้ในหน้า new-instrument)
export async function getProjectOptions() {
  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
    select: { projectId: true, name: true },
  });

  return projects.map((project) => ({
    value: String(project.projectId),
    label: project.name,
  }));
}

export async function createProject(data: { name: string; nickName: string }) {
  return prisma.project.create({
    data: {
      name: data.name.trim(),
      nickName: data.nickName.trim(),
    },
  });
}

export async function updateProject(
  projectId: number,
  data: { name: string; nickName: string }
) {
  return prisma.project.update({
    where: { projectId },
    data: {
      name: data.name.trim(),
      nickName: data.nickName.trim(),
    },
  });
}

// ลบโครงการ โดยเช็คก่อนว่ามีอุปกรณ์ผูกอยู่หรือไม่ ถ้ามีให้ throw error ที่อ่านง่าย
// แทนที่จะปล่อยให้ Prisma throw foreign key constraint error แบบดิบๆ
export async function deleteProject(projectId: number) {
  const profileCount = await prisma.profile.count({ where: { projectId } });

  if (profileCount > 0) {
    throw new Error(
      `ไม่สามารถลบได้ เนื่องจากมีอุปกรณ์ผูกกับโครงการนี้อยู่ ${profileCount} รายการ`
    );
  }

  return prisma.project.delete({ where: { projectId } });
}
