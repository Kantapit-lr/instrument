"use client";

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { InstrumentListItem } from '@/types/instrument';

const AUTOCOMPLETE_LIMIT = 5;
const DEBOUNCE_MS = 300;

export default function SearchBar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<InstrumentListItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ดึง autocomplete แบบ debounce กันยิง API ถี่เกินไปทุกครั้งที่กดคีย์
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetch(`/api/instruments?q=${encodeURIComponent(keyword)}&limit=${AUTOCOMPLETE_LIMIT}`)
        .then((res) => res.json())
        .then((json) => setSuggestions(json.data ?? []))
        .catch(() => setSuggestions([]));
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [keyword]);

  // ปิด dropdown เมื่อคลิกที่อื่นนอกกล่องค้นหา
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function goToSearchPage() {
    if (!keyword.trim()) return;
    setIsOpen(false);
    router.push(`/instruments/search?q=${encodeURIComponent(keyword)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      goToSearchPage();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-80">
      <div className="flex items-center gap-2 bg-topbar px-4 py-2 rounded-xl shadow-sm border border-border">
        <Search className="w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search instrument..."
          className="bg-transparent text-sm outline-none w-full text-topbar-text placeholder-text-muted"
        />
      </div>

      {/* dropdown แสดงผลที่ตรงกันบางส่วน ขณะพิมพ์ */}
      {isOpen && keyword.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card text-card-text border border-border rounded-xl shadow-md overflow-hidden z-30">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((item) => (
                <Link
                  key={item.registrationNumber}
                  href={`/instruments/${item.registrationNumber}/edit`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-surface-muted transition-colors"
                >
                  <span className="font-medium truncate">{item.name}</span>
                  <span className="text-xs text-text-muted">{item.registrationNumber}</span>
                </Link>
              ))}
              <button
                type="button"
                onClick={goToSearchPage}
                className="w-full text-left px-4 py-2.5 text-sm text-action-text hover:bg-surface-muted transition-colors border-t border-border"
              >
                ดูผลการค้นหาทั้งหมดสำหรับ &ldquo;{keyword}&rdquo;
              </button>
            </>
          ) : (
            <p className="px-4 py-3 text-sm text-text-muted">ไม่พบรายการที่ตรงกัน</p>
          )}
        </div>
      )}
    </div>
  );
}
