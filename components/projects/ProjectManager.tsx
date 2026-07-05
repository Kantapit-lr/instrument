"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/new-instrument/Input";
import { ProjectFormData, ProjectListItem, emptyProjectForm } from "@/types/project";

export default function ProjectManager() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<ProjectFormData>(emptyProjectForm);
  const [editingId, setEditingId] = useState<number | null>(null); // null = กำลังเพิ่มใหม่, ไม่ใช่ null = กำลังแก้ไข
  const [submitting, setSubmitting] = useState(false);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects?full=true");
      const json = await res.json();
      setProjects(json.data ?? []);
    } catch {
      setErrorMessage("ไม่สามารถโหลดรายชื่อโครงการได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(project: ProjectListItem) {
    const hasUnsavedInput = form.name.trim() !== "" || form.nickName.trim() !== "";

    // ถ้ากำลังกรอกอะไรอยู่ (ไม่ว่าจะโหมดเพิ่มใหม่ หรือกำลังแก้ไขแถวอื่นอยู่ก่อนแล้ว)
    // และข้อมูลนั้นยังไม่ถูกบันทึก ให้เตือนก่อนเปลี่ยนแถว ไม่งั้นข้อมูลที่กรอกไว้จะหายไปเงียบๆ
    if (hasUnsavedInput) {
      const confirmed = confirm(
        "คุณมีข้อมูลที่ยังไม่ได้บันทึกอยู่ ถ้าเปลี่ยนไปแก้ไขรายการนี้ ข้อมูลที่กรอกไว้จะหายไป ยืนยันหรือไม่?"
      );
      if (!confirmed) return;
    }

    setEditingId(project.projectId);
    setForm({ name: project.name, nickName: project.nickName });
    setErrorMessage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyProjectForm);
    setErrorMessage(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const isEditing = editingId !== null;
      const url = isEditing ? `/api/projects/${editingId}` : "/api/projects";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        return;
      }

      cancelEdit();
      await loadProjects();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(project: ProjectListItem) {
    if (project.profileCount > 0) {
      setErrorMessage(
        `ไม่สามารถลบ "${project.name}" ได้ เนื่องจากมีอุปกรณ์ผูกอยู่ ${project.profileCount} รายการ`
      );
      return;
    }

    if (!confirm(`ยืนยันลบโครงการ "${project.name}" ?`)) return;

    setErrorMessage(null);

    try {
      const res = await fetch(`/api/projects/${project.projectId}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      await loadProjects();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    }
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="bg-danger-bg border border-danger-border text-danger-text text-sm px-4 py-3 rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* ฟอร์มเพิ่ม/แก้ไขโครงการ */}
      <form
        onSubmit={handleSubmit}
        className="bg-card text-card-text p-6 rounded-2xl border border-border shadow-sm space-y-4"
      >
        <h2 className="text-sm font-bold text-mahidol-blue uppercase tracking-wider">
          {editingId !== null ? "แก้ไขโครงการ" : "เพิ่มโครงการใหม่"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ชื่อโครงการ (Name)"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="ชื่อเล่น (Nickname)"
            name="nickName"
            value={form.nickName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl shadow-sm transition-all hover:bg-mahidol-blue/90 disabled:opacity-60"
          >
            {editingId !== null ? "บันทึกการแก้ไข" : "เพิ่มโครงการ"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-5 py-2.5 text-sm font-semibold text-card-text bg-card border border-border rounded-xl transition-all hover:bg-surface-muted"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>

      {/* รายชื่อโครงการทั้งหมด */}
      <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-text-muted">กำลังโหลด...</p>
        ) : projects.length === 0 ? (
          <p className="p-6 text-sm text-text-muted">ยังไม่มีโครงการในระบบ</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-muted text-surface-muted-text text-left">
                <th className="px-6 py-3 font-medium">
                  ชื่อโครงการ
                  <span className="ml-2 font-normal text-text-muted">
                    (ทั้งหมด {projects.length} โครงการ)
                  </span>
                </th>
                <th className="px-6 py-3 font-medium">ชื่อเล่น</th>
                <th className="px-6 py-3 font-medium">จำนวนอุปกรณ์</th>
                <th className="px-6 py-3 font-medium text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.projectId} className="border-t border-border">
                  <td className="px-6 py-3">{project.name}</td>
                  <td className="px-6 py-3">{project.nickName}</td>
                  <td className="px-6 py-3">{project.profileCount}</td>
                  <td className="px-6 py-3 text-right space-x-3">
                    <button
                      onClick={() => startEdit(project)}
                      className="text-action-text hover:underline"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      className="text-danger-text hover:underline"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
