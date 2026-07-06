"use client";

import { useEffect, useRef, useState } from "react";
import { ProfileImageData, getImageUrl } from "@/types/image";
import { ImageGalleryProps } from "@/types/components";

export function ImageGallery({ registrationNumber }: ImageGalleryProps) {
  const [images, setImages] = useState<ProfileImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadImages() {
    setLoading(true);
    try {
      const res = await fetch(`/api/instruments/${registrationNumber}/images`);
      const json = await res.json();
      setImages(json.data ?? []);
    } catch {
      setErrorMessage("ไม่สามารถโหลดรูปภาพได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // อุปกรณ์ใหม่ที่ยังไม่บันทึก (ยังไม่มี registrationNumber จริง) ยังอัปโหลดรูปไม่ได้
    if (registrationNumber) {
      loadImages();
    } else {
      setLoading(false);
    }
  }, [registrationNumber]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/instruments/${registrationNumber}/images`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "อัปโหลดรูปภาพไม่สำเร็จ");
        return;
      }

      await loadImages();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
      // เคลียร์ค่า input ไฟล์ เพื่อให้เลือกไฟล์ชื่อเดิมซ้ำได้ในครั้งต่อไป
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(image: ProfileImageData) {
    if (!confirm("ยืนยันลบรูปภาพนี้?")) return;

    setErrorMessage(null);

    try {
      const res = await fetch(`/api/instruments/images/${image.profileImageId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "ลบรูปภาพไม่สำเร็จ");
        return;
      }

      setImages((prev) => prev.filter((img) => img.profileImageId !== image.profileImageId));
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    }
  }

  if (!registrationNumber) {
    return (
      <p className="text-sm text-text-muted">
        กรุณาบันทึกข้อมูลพื้นฐานก่อน จึงจะสามารถเพิ่มรูปภาพได้
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="bg-danger-bg border border-danger-border text-danger-text text-sm px-4 py-3 rounded-xl">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {loading ? (
          <p className="text-sm text-text-muted">กำลังโหลดรูปภาพ...</p>
        ) : (
          images.map((image) => (
            <div
              key={image.profileImageId}
              className="relative w-32 h-32 rounded-xl overflow-hidden border border-border group"
            >
              {/* ใช้ img ปกติแทน next/image เพราะรูปมาจาก API route ของเราเอง ไม่ใช่ external domain ที่ config ไว้ */}
              <img
                src={getImageUrl(image.fileName)}
                alt="รูปภาพอุปกรณ์"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(image)}
                className="absolute top-1 right-1 bg-danger-bg text-danger-text text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ลบ
              </button>
            </div>
          ))
        )}

        {/* ปุ่มอัปโหลดรูปใหม่ ดีไซน์เป็นกล่อง dashed ให้ดูเป็นจุดเพิ่มข้อมูล สอดคล้องกับขนาดรูปอื่นในแถว */}
        <label className="w-32 h-32 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-text-muted text-sm cursor-pointer hover:bg-surface-muted transition-colors">
          {uploading ? (
            <span>กำลังอัปโหลด...</span>
          ) : (
            <>
              <span className="text-2xl">+</span>
              <span>เพิ่มรูปภาพ</span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <p className="text-xs text-text-muted">
        รองรับไฟล์ JPEG, PNG, WEBP ขนาดไม่เกิน 5MB ต่อรูป
      </p>
    </div>
  );
}
