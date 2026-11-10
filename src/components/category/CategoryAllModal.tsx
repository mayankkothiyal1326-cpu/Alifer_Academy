import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseCategory, CategoryGroup } from '../../types';
import { X, Search, ChevronRight, Sparkles, Layers, BookOpen } from 'lucide-react';

export const CategoryAllModal: React.FC = () => {
  const { 
    isAllCategoriesModalOpen, 
    setIsAllCategoriesModalOpen, 
    categories, 
    openCategoryView 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  if (!isAllCategoriesModalOpen) return null;

  const groups: (string)[] = [
    'All',
    'Competitive Examinations',
    'Higher Education',
    'School Foundation',
  ];

  const filteredCategories = categories.filter((cat) => {
    const matchesGroup = selectedGroup === 'All' || cat.group === selectedGroup;
    const matchesSearch = 
      !search.trim() ||
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase()) ||
      cat.group.toLowerCase().includes(search.toLowerCase());
    return matchesGroup && matchesSearch && cat.isActive !== false;
  });

  const handleSelectCategory = (cat: CourseCategory) => {
    setIsAllCategoriesModalOpen(false);
    openCategoryView(cat);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#0c0c12] border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between gap-3 bg-[#101018]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-white">
                All Course Categories
              </h2>
              <p className="text-xs text-zinc-400">
                Browse all curriculum tracks curated for exams and academic mastery
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAllCategoriesModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 space-y-3 bg-[#0a0a0f]">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category (e.g. UPSC IAS Maths, 12th Foundation, Engineering Maths)..."
              className="w-full bg-[#13131c] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Group Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {groups.map((group) => {
              const isSelected = selectedGroup === group;
              return (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Grid Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCategories.map((cat) => {
              const hasCourses = (cat.courseCount ?? 0) > 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="group relative rounded-2xl bg-[#111118] border border-zinc-800/80 hover:border-amber-500/60 p-4 text-left transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between overflow-hidden"
                >
                  {/* Category Thumbnail Preview */}
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-zinc-900 mb-3">
                    <img
                      src={cat.thumbnailUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-black/30" />
                    
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                        {cat.badge || cat.group.split(' ')[0]}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2">
                      {hasCourses ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/80 text-white backdrop-blur-md">
                          {cat.courseCount} {cat.courseCount === 1 ? 'Course' : 'Courses'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/80 text-black backdrop-blur-md">
                          Upcoming Batch
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] text-zinc-400 font-medium block truncate">
                      {cat.group}
                    </span>
                    <h4 className="font-display text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs font-semibold text-amber-400/90 group-hover:text-amber-300">
                    <span>Explore Curriculum</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm text-zinc-400">No categories found matching "{search}"</p>
              <button
                onClick={() => { setSearch(''); setSelectedGroup('All'); }}
                className="text-xs text-amber-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#101018] flex items-center justify-between text-xs text-zinc-400">
          <span>{categories.length} Total Registered Tracks</span>
          <button
            onClick={() => setIsAllCategoriesModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
