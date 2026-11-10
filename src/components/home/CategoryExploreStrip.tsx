import React from 'react';
import { useApp } from '../../context/AppContext';
import { CourseCategory } from '../../types';
import { ChevronRight, Sparkles, BookOpen, Layers } from 'lucide-react';

export const CategoryExploreStrip: React.FC = () => {
  const { categories, openCategoryView, setIsAllCategoriesModalOpen } = useApp();

  // Show active categories sorted by order
  const activeCategories = categories.filter((c) => c.isActive !== false);

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>Explore by Category</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {activeCategories.length} Tracks
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Structured syllabus tracks curated by Er. Alifer Sir
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAllCategoriesModalOpen(true)}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-amber-400/5 group"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative -mx-3 sm:mx-0 px-3 sm:px-0">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory focus:outline-none">
          {activeCategories.map((cat: CourseCategory) => {
            const hasCourses = (cat.courseCount ?? 0) > 0;
            return (
              <button
                key={cat.id}
                onClick={() => openCategoryView(cat)}
                className="group relative flex-shrink-0 w-44 sm:w-52 h-60 rounded-2xl overflow-hidden bg-[#101016] border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 text-left snap-start shadow-md hover:shadow-amber-500/10 flex flex-col justify-between"
              >
                {/* Background Artwork */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.thumbnailUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-75"
                    loading="lazy"
                  />
                  {/* Atmospheric Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/70 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 p-3 flex items-start justify-between gap-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {cat.badge || cat.group.split(' ')[0]}
                  </span>
                  {hasCourses ? (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                      {cat.courseCount} {cat.courseCount === 1 ? 'Batch' : 'Batches'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Soon</span>
                    </span>
                  )}
                </div>

                {/* Bottom Title & Details */}
                <div className="relative z-10 p-3 space-y-1">
                  <span className="text-[10px] text-zinc-400 font-medium block truncate">
                    {cat.group}
                  </span>
                  <h4 className="font-display text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed opacity-80 pt-0.5">
                    {cat.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-amber-400/90 font-medium group-hover:text-amber-300">
                    <span>Explore Track</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
