import React from 'react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { Clock, Star, BookOpen, ChevronRight, Check } from 'lucide-react';

interface CourseGridProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses, onSelectCourse }) => {
  const { enrollInCourse } = useApp();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {courses.map((course) => {
        return (
          <div
            key={course.id}
            className="group flex flex-col bg-[#101016] border border-zinc-800/90 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/20"
          >
            {/* Thumbnail: Subject-specific educational graphics and illustrations */}
            <div 
              onClick={() => onSelectCourse(course)}
              className="relative aspect-video w-full overflow-hidden bg-zinc-950 cursor-pointer"
            >
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay with brand watermark and course tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-2.5">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {course.category}
                  </span>
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 bg-black">
                    <img src={BRAND_ASSETS.logo} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-300">
                  <span className="flex items-center gap-1 font-semibold text-amber-300">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{course.duration || '1 Year'}</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="tabular-nums">{course.rating}</span>
                  </span>
                </div>
              </div>

              {course.isEnrolled && (
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/90 text-black flex items-center gap-1 shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Enrolled</span>
                  </span>
                </div>
              )}
            </div>

            {/* Course Information Body */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 
                  onClick={() => onSelectCourse(course)}
                  className="font-display text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug cursor-pointer group-hover:text-amber-300 transition-colors"
                >
                  {course.title}
                </h3>
                
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                  By {course.instructor.name}
                </p>

                {/* Progress bar if enrolled */}
                {course.isEnrolled && (
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                      <span>Course Progress</span>
                      <span className="font-mono text-amber-400 font-semibold">{course.progressPercent}%</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Action Row */}
              <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-sm sm:text-base font-extrabold text-amber-400">
                      ₹{course.price.toLocaleString()}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500 line-through">
                      ₹{course.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCourse(course)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-amber-500 hover:text-black text-amber-300 text-xs font-semibold border border-amber-500/30 hover:border-transparent transition-all flex items-center gap-1"
                >
                  <span>{course.isEnrolled ? 'Open' : 'Explore'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
