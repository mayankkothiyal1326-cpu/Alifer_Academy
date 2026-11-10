import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBanner } from './HeroBanner';
import { QuickAccess } from './QuickAccess';
import { CategoryFilter } from './CategoryFilter';
import { CourseGrid } from './CourseGrid';
import { WatchHistoryStrip } from './WatchHistoryStrip';
import { Course } from '../../types';
import { Search, Sparkles } from 'lucide-react';
import { CourseDetailModal } from '../learning/CourseDetailModal';
import { CategoryExploreStrip } from './CategoryExploreStrip';
import { CategoryView } from '../category/CategoryView';

export const HomeView: React.FC = () => {
  const { 
    student, 
    courses, 
    searchQuery, 
    setSearchQuery,
    setIsAiOpen,
    setActiveTab,
    selectedCategory 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // If a specific category is selected, render the dedicated category view
  if (selectedCategory) {
    return <CategoryView />;
  }

  // Filter courses by category and search
  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = 
      !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Greeting & Search Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-zinc-400 font-medium">
              Welcome back to class,
            </span>
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-white">
              {student.name.split(' ')[0]} 👋
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
              <span>🔥 {student.streakDays} Day Streak</span>
            </span>
          </div>
        </div>

        {/* Global Instant Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lectures, calculus, python, physics, notes..."
            className="w-full bg-[#111116] border border-zinc-800 focus:border-amber-500/80 rounded-2xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 1. Promotional Banner */}
      <HeroBanner />

      {/* 2. Horizontal Explore by Category Strip */}
      <CategoryExploreStrip />

      {/* 3. Quick Access Cards */}
      <QuickAccess 
        onOpenBookmarks={() => setActiveTab('learning')}
        onOpenDownloads={() => setActiveTab('profile')}
      />

      {/* 3. Watch History (Compact section) */}
      <WatchHistoryStrip />

      {/* 4. Course Categories Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
            Explore Course Categories
          </h3>
          <span className="text-xs text-zinc-400 font-medium">
            {filteredCourses.length} Batches
          </span>
        </div>

        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      {/* 5. Popular Courses (Two-column grid on mobile) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              Popular Courses & Batches
            </h3>
            <p className="text-[11px] text-zinc-400">
              Curated by Er. Alifer Sir · Direct enrollment with certificates
            </p>
          </div>
        </div>

        <CourseGrid
          courses={filteredCourses}
          onSelectCourse={(course) => setSelectedCourse(course)}
        />
      </div>

      {/* Course Detail / Syllabus Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};
