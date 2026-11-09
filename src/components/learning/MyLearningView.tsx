import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lecture } from '../../types';
import { BRAND_ASSETS } from '../../data/constants';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  ChevronRight, 
  Award,
  Layers,
  History,
  FolderDown
} from 'lucide-react';
import { CourseDetailModal } from './CourseDetailModal';

export const MyLearningView: React.FC = () => {
  const { 
    enrolledCourses, 
    courses, 
    openLecture, 
    openPdfViewer, 
    watchHistory, 
    downloads, 
    setActiveTab 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'materials' | 'history'>('courses');
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);

  return (
    <div className="space-y-6 pb-20">
      {/* Learning Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#111118] via-[#141522] to-[#0c0c12] border border-amber-500/25 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Alifer Academy Student Library</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-white">
            My Learning & Academic Library
          </h2>
          <p className="text-xs text-zinc-300 max-w-lg">
            Track syllabus progress, watch lectures, and download handwritten notes for offline revision.
          </p>
        </div>

        <div className="p-3 bg-black/50 border border-amber-500/30 rounded-2xl flex items-center gap-4 text-center shrink-0">
          <div>
            <span className="font-mono text-xl font-black text-amber-400 block tabular-nums">
              {enrolledCourses.length}
            </span>
            <span className="text-[10px] text-zinc-400">Enrolled</span>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <span className="font-mono text-xl font-black text-emerald-400 block tabular-nums">
              52%
            </span>
            <span className="text-[10px] text-zinc-400">Avg. Completion</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Enrolled Courses, Study Materials, Watch History */}
      <div className="flex items-center gap-2 border-b border-zinc-800 text-xs font-semibold pb-1">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeSubTab === 'courses'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Enrolled Batches ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveSubTab('materials')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeSubTab === 'materials'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Study Materials & PDFs
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeSubTab === 'history'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Watch History ({watchHistory.length})
        </button>
      </div>

      {/* 1. ENROLLED COURSES */}
      {activeSubTab === 'courses' && (
        <div className="space-y-4">
          {enrolledCourses.length === 0 ? (
            <div className="p-10 text-center text-xs text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800 space-y-3">
              <p>You haven't enrolled in any course batches yet.</p>
              <button
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
              >
                Browse Popular Courses
              </button>
            </div>
          ) : (
            enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#101016] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start justify-between hover:border-amber-500/30 transition-all shadow-md"
              >
                <div className="relative w-full md:w-56 aspect-video rounded-xl overflow-hidden bg-black border border-amber-500/20 shrink-0">
                  <img
                    src={course.thumbnailUrl || BRAND_ASSETS.teacherPortrait}
                    alt={course.title}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-semibold text-amber-300">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-bold text-white leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Mentor: {course.instructor.name} · {course.totalLectures} Total Lectures
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Syllabus Progress</span>
                      <span className="font-mono text-amber-400 font-bold tabular-nums">
                        {course.progressPercent}% Completed
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={() => setSelectedCourseForDetail(course)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Continue Course</span>
                    </button>
                    <button
                      onClick={() => setSelectedCourseForDetail(course)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800"
                    >
                      View Syllabus Hierarchy
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. STUDY MATERIALS & PDFS */}
      {activeSubTab === 'materials' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-white">
              Handwritten Notes & Formula Books
            </h3>
            <span className="text-xs text-zinc-400">Available across your courses</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enrolledCourses.flatMap((c) =>
              c.modules.flatMap((m) =>
                m.chapters.flatMap((ch) =>
                  ch.lectures.flatMap((l) =>
                    l.resources.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 bg-[#101016] border border-zinc-800 rounded-xl flex items-center justify-between gap-3 hover:border-amber-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-semibold text-white truncate">
                              {res.title}
                            </h5>
                            <span className="text-[10px] text-zinc-400">
                              {c.title} · {res.fileSize}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => openPdfViewer({
                            title: res.title,
                            courseName: c.title,
                            pages: res.pages || 12,
                          })}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-amber-300 border border-zinc-800 shrink-0"
                        >
                          View PDF
                        </button>
                      </div>
                    ))
                  )
                )
              )
            )}
          </div>
        </div>
      )}

      {/* 3. WATCH HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-white">
              Recently Watched Lectures
            </h3>
            <span className="text-xs text-zinc-400">Resume learning right where you left off</span>
          </div>

          <div className="space-y-2.5">
            {watchHistory.map((item) => {
              const matchedCourse = courses.find((c) => c.id === item.courseId);
              let matchedLecture: any = null;
              matchedCourse?.modules.forEach((m) =>
                m.chapters.forEach((ch) =>
                  ch.lectures.forEach((l) => {
                    if (l.id === item.lectureId) matchedLecture = l;
                  })
                )
              );

              return (
                <div
                  key={item.lectureId}
                  className="p-3.5 bg-[#101016] border border-zinc-800 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                        <span>{item.courseTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400 font-mono">{item.progressPercent}% Watched</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.watchedAt}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (matchedCourse && matchedLecture) {
                        openLecture(matchedLecture, matchedCourse);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0"
                  >
                    Resume
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourseForDetail && (
        <CourseDetailModal
          course={selectedCourseForDetail}
          onClose={() => setSelectedCourseForDetail(null)}
        />
      )}
    </div>
  );
};
