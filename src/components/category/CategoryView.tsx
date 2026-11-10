import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Bell, 
  Send, 
  MessageSquare, 
  ChevronRight,
  ShieldCheck,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { CourseDetailModal } from '../learning/CourseDetailModal';

export const CategoryView: React.FC = () => {
  const { 
    selectedCategory, 
    closeCategoryView, 
    courses, 
    openCheckout,
    setIsAllCategoriesModalOpen 
  } = useApp();

  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);
  
  // Waitlist form state for empty state
  const [notifyContact, setNotifyContact] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  if (!selectedCategory) return null;

  // Filter only published & active courses belonging to this category
  const categoryCourses = courses.filter(
    (c) => c.categoryId === selectedCategory.id && c.isPublished !== false && c.isActive !== false
  );

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyContact.trim()) return;
    setWaitlistSubmitted(true);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={closeCategoryView}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-amber-300 transition-colors py-1.5 px-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-amber-400" />
          <span>Back to Home</span>
        </button>

        <span className="text-[11px] px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
          {selectedCategory.group}
        </span>
      </div>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12121a] via-[#0d0d12] to-[#08080c] border border-zinc-800 p-5 sm:p-8 shadow-xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* Background Artwork Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 overflow-hidden pointer-events-none hidden md:block">
          <img
            src={selectedCategory.thumbnailUrl}
            alt={selectedCategory.name}
            className="w-full h-full object-cover object-center filter grayscale"
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
              {selectedCategory.badge || 'Official Track'}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-zinc-500" />
              <span>{categoryCourses.length} {categoryCourses.length === 1 ? 'Batch Available' : 'Batches Available'}</span>
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {selectedCategory.name}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {selectedCategory.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>100% Exam-Aligned Syllabus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Direct Mentorship: Er. Alifer Sir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Downloadable Notes & Test Series</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course List or Empty State */}
      {categoryCourses.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <span>Available Batches</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {categoryCourses.length}
              </span>
            </h3>
            <span className="text-xs text-zinc-400">
              All courses include certificate & doubt support
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryCourses.map((course) => (
              <div
                key={course.id}
                className="group relative rounded-2xl bg-[#0f0f15] border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-amber-500/10"
              >
                {/* Course Banner */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-zinc-900">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f15] via-transparent to-black/40" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                      {course.level}
                    </span>
                    {course.isEnrolled && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/80 text-white backdrop-blur-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Enrolled</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/30">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{course.rating}</span>
                    <span className="text-zinc-400 text-[10px]">({course.reviewCount})</span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-display text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>{course.totalLectures} Lectures</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-amber-300">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Duration: {course.duration || '1 Year'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{course.totalNotes} Notes (PDF)</span>
                      </span>
                    </div>
                  </div>

                  {/* Instructor & Pricing Footer */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructor.avatarUrl}
                        alt={course.instructor.name}
                        className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                      />
                      <div className="text-left">
                        <span className="text-[11px] font-semibold text-white block">
                          {course.instructor.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 block">
                          Academic Director
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-sm font-extrabold text-white">
                          ₹{course.price.toLocaleString('en-IN')}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="text-[10px] text-zinc-500 line-through">
                            ₹{course.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-emerald-400 font-medium block">
                        Inclusive of all tests & notes
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setSelectedCourseForDetail(course)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-700 hover:border-zinc-500 transition-colors text-center"
                    >
                      View Syllabus
                    </button>
                    {course.isEnrolled ? (
                      <button
                        onClick={() => setSelectedCourseForDetail(course)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-md shadow-emerald-500/20 text-center flex items-center justify-center gap-1"
                      >
                        <span>Continue Learning</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          openCheckout(course);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black text-xs font-extrabold shadow-md shadow-amber-500/20 hover:brightness-110 transition-all text-center flex items-center justify-center gap-1"
                      >
                        <span>Enroll Now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* PROFESSIONAL EMPTY STATE */
        <div className="rounded-3xl bg-[#0f0f15] border border-zinc-800/80 p-6 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Academic Graphic / Icon */}
          <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-black">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Curriculum Under Final Review
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white pt-2">
              {selectedCategory.name} Batch Launching Soon
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              The official academic syllabus, video lecture modules, and handwritten formula notes for{' '}
              <strong className="text-amber-300">{selectedCategory.name}</strong> are currently being curated by{' '}
              <span className="text-zinc-200 font-semibold">Er. Alifer Sir</span> to guarantee 100% conceptual mastery.
            </p>
          </div>

          {/* Early Access Notification Form */}
          <div className="max-w-md mx-auto bg-[#14141c] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Get Early Admission Alert & 50% Early Bird Discount</span>
            </div>

            {waitlistSubmitted ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Thank you! You are on the priority notification list. We will send the syllabus and launch discount to {notifyContact}.
                </span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={notifyContact}
                  onChange={(e) => setNotifyContact(e.target.value)}
                  placeholder="Enter WhatsApp Number or Email"
                  required
                  className="flex-1 bg-black/60 border border-zinc-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20"
                >
                  <span>Notify Me</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}

            <p className="text-[10px] text-zinc-500">
              🔒 No spam. You will only receive admission opening dates and early batch discounts.
            </p>
          </div>

          {/* Action Navigation */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsAllCategoriesModalOpen(true)}
              className="py-2.5 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <span>Explore Other Categories</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={closeCategoryView}
              className="py-2.5 px-5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
            >
              Return to Home
            </button>
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
