import React, { useState } from 'react';
import { Course, Lecture } from '../../types';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { 
  X, 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Award, 
  ShieldCheck,
  Share2
} from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, onClose }) => {
  const { enrollInCourse, openLecture, openPdfViewer, addDownload } = useApp();
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-py-1': true,
  });

  if (!course) return null;

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnroll = () => {
    enrollInCourse(course.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0d0d12] border border-amber-500/25 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-[#09090d]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {course.category}
            </span>
            <span className="text-xs text-zinc-400">· {course.level} Level</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Hero Banner inside modal */}
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <div className="relative w-full md:w-72 aspect-video rounded-xl overflow-hidden bg-black border border-amber-500/30 shrink-0">
              <img
                src={course.thumbnailUrl || BRAND_ASSETS.teacherPortrait}
                alt={course.title}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Alifer Academy Certified
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5">
              <h2 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                {course.title}
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {course.description}
              </p>

              {/* Instructor Lockup */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400 shrink-0 bg-black">
                  <img
                    src={course.instructor.avatarUrl || BRAND_ASSETS.teacherPortrait}
                    alt={course.instructor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {course.instructor.name}
                  </h4>
                  <p className="text-[10px] text-amber-400">
                    {course.instructor.title} · {course.instructor.experience}
                  </p>
                </div>
              </div>

              {/* Pricing & Enrollment CTA */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                    ₹{course.price.toLocaleString()}
                  </span>
                  <span className="font-mono text-xs text-zinc-500 line-through">
                    ₹{course.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400">
                    Save {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                  </span>
                </div>

                {course.isEnrolled ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Enrolled & Active
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    Enroll Now · Instant Access
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Course Features */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
              Course Inclusions & Deliverables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
              {course.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Syllabus Hierarchy: Module -> Chapter -> Lecture */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-white tracking-wide">
                Course Syllabus & Lectures Hierarchy
              </h3>
              <span className="text-xs text-zinc-400">
                {course.modules.length} Modules · {course.totalLectures} Lectures
              </span>
            </div>

            {course.modules.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 bg-zinc-900/40 rounded-xl border border-zinc-800">
                Course modules are being prepared by Er. Alifer Sir. Stay tuned!
              </div>
            ) : (
              course.modules.map((module) => {
                const isExpanded = expandedModules[module.id] ?? true;

                return (
                  <div
                    key={module.id}
                    className="border border-zinc-800 rounded-xl bg-[#111117] overflow-hidden"
                  >
                    {/* Module Title Accordion Header */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full px-4 py-3 bg-zinc-900/80 hover:bg-zinc-900 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-amber-500/15 text-amber-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                          {module.order}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-100">
                          {module.title}
                        </h4>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>

                    {/* Chapters and Lectures */}
                    {isExpanded && (
                      <div className="p-3 space-y-3 divide-y divide-zinc-800/60">
                        {module.chapters.map((chapter) => (
                          <div key={chapter.id} className="pt-2 first:pt-0 space-y-2">
                            <h5 className="text-xs font-semibold text-amber-300/90 px-1">
                              {chapter.title}
                            </h5>

                            <div className="space-y-1.5">
                              {chapter.lectures.map((lecture) => (
                                <div
                                  key={lecture.id}
                                  className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/40 hover:bg-zinc-900/60 border border-zinc-800/80 transition-colors group"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <button
                                      onClick={() => {
                                        openLecture(lecture, course);
                                        onClose();
                                      }}
                                      className="w-7 h-7 rounded-lg bg-amber-500/15 group-hover:bg-amber-500 group-hover:text-black text-amber-400 flex items-center justify-center shrink-0 transition-colors"
                                      title="Play Lecture"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                    </button>
                                    <div className="min-w-0">
                                      <h6 className="text-xs font-medium text-zinc-200 truncate group-hover:text-white">
                                        {lecture.title}
                                      </h6>
                                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-2.5 h-2.5" />
                                          <span>{lecture.durationMinutes} mins</span>
                                        </span>
                                        {lecture.resources.length > 0 && (
                                          <>
                                            <span aria-hidden="true">·</span>
                                            <span>{lecture.resources.length} Notes (PDF)</span>
                                          </>
                                        )}
                                        {lecture.isCompleted && (
                                          <>
                                            <span aria-hidden="true">·</span>
                                            <span className="text-emerald-400 font-semibold">Completed</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {lecture.resources[0] && (
                                      <button
                                        onClick={() => {
                                          openPdfViewer({
                                            title: lecture.resources[0].title,
                                            courseName: course.title,
                                            pages: lecture.resources[0].pages,
                                          });
                                          onClose();
                                        }}
                                        className="p-1.5 text-zinc-400 hover:text-amber-400 rounded-md hover:bg-zinc-800 transition-colors"
                                        title="View Lecture Notes"
                                      >
                                        <FileText className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        openLecture(lecture, course);
                                        onClose();
                                      }}
                                      className="px-2.5 py-1 rounded bg-zinc-900 text-[11px] font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition-colors"
                                    >
                                      Watch
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
