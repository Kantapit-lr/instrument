import ProjectManager from "@/components/projects/ProjectManager";

export default function ProjectsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-card-text">จัดการโครงการ</h1>
      <ProjectManager />
    </div>
  );
}
