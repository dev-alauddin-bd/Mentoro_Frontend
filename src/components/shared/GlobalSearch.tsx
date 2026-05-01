"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2, X, BookOpen, User, ExternalLink } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export function GlobalSearch() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 500)
  const modalRef = useRef<HTMLDivElement>(null)

  const { data: coursesData, isLoading, isFetching } = useGetAllCoursesQuery(
    { search: debouncedSearch, limit: 10 },
    { skip: debouncedSearch.length < 2 }
  )

  const results = coursesData?.data?.courses || []

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 h-11 bg-secondary/50 border border-border/50 rounded-2xl text-muted-foreground hover:bg-secondary hover:border-primary/30 transition-all cursor-pointer group"
      >
        <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
        <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">{t("common.search_placeholder") || "Search Courses..."}</span>
        <div className="hidden lg:flex items-center gap-1 ml-4 border border-border/60 px-1.5 py-0.5 rounded text-[8px] font-black">
          ⌘K
        </div>
      </button>

      {/* Search Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300 flex items-start justify-center pt-[10vh] px-4">
          <div 
            ref={modalRef}
            className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300"
          >
            {/* Search Input Area */}
            <div className="p-6 border-b border-border flex items-center gap-4 bg-secondary/20">
              <Search className="w-6 h-6 text-primary" />
              <input 
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("common.search_courses") || "Enter course name, instructor, or category..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold placeholder:text-muted-foreground/50 placeholder:font-medium"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                Esc
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {isLoading || isFetching ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">{t("common.scanning")}</p>
                </div>
              ) : searchTerm.length < 2 ? (
                <div className="py-20 text-center space-y-4">
                   <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto border border-primary/10">
                      <BookOpen className="w-8 h-8 text-primary/40" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black italic">{t("common.start_typing") || "Start Typing to Explore"}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t("common.find_next_milestone")}</p>
                   </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <p className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Search Results ({results.length})</p>
                  {results.map((course: any) => (
                    <Link 
                      key={course.id}
                      href={`/courses/${course.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-4 hover:bg-primary/5 rounded-2xl border border-transparent hover:border-primary/20 transition-all group"
                    >
                      <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-border/50">
                        <img 
                          src={course.thumbnail || "/placeholder.jpg"} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black truncate group-hover:text-primary transition-colors">{course.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                           <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                              <User className="w-3 h-3" />
                              {course.instructor?.name || "Expert"}
                           </div>
                           <div className="px-2 py-0.5 bg-secondary rounded-md text-[9px] font-black uppercase tracking-widest text-primary">
                              {course.category?.name || "General"}
                           </div>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-secondary rounded-xl text-xs font-black tabular-nums group-hover:bg-primary group-hover:text-white transition-all">
                        ${course.price}
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                   <div className="w-16 h-16 bg-rose-500/5 rounded-full flex items-center justify-center mx-auto border border-rose-500/10">
                      <X className="w-8 h-8 text-rose-500/40" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black italic">{t("common.no_results") || "No Courses Found"}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t("common.no_results_adjust")}</p>
                   </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-secondary/30 border-t border-border flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-background border border-border rounded text-[8px]">↑↓</span> Select</span>
                 <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-background border border-border rounded text-[8px]">Enter</span> Open</span>
              </div>
              <p>Course Master Intelligence v2.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
