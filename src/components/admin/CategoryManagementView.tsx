import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseCategory, Course, CategoryGroup } from '../../types';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  BookOpen, 
  ChevronRight, 
  ArrowLeft, 
  AlertTriangle, 
  Check, 
  Eye, 
  EyeOff, 
  DollarSign, 
  FileText, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  Upload,
  Clock
} from 'lucide-react';

export const CategoryManagementView: React.FC = () => {
  const { 
    categories, 
    courses, 
    addCategory, 
    updateCategory, 
    toggleCategoryActive, 
    reorderCategories, 
    deleteCategory,
    addCourse,
    updateCourse,
    deleteCourse,
    toggleCoursePublished,
    updateCoursePrice,
    addLectureResource
  } = useApp();

  // Selected Category for Category-Wise Course Management Drilldown
  const [drilldownCategory, setDrilldownCategory] = useState<CourseCategory | null>(null);

  // Search categories
  const [searchCategory, setSearchCategory] = useState('');

  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
  // Category Form State
  const [catName, setCatName] = useState('');
  const [catGroup, setCatGroup] = useState<CategoryGroup>('Competitive Examinations');
  const [catDesc, setCatDesc] = useState('');
  const [catThumb, setCatThumb] = useState('/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg');
  const [catBadge, setCatBadge] = useState('');
  const [catOrder, setCatOrder] = useState<number>(1);
  const catFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Containment Warning Modal State (when user attempts to delete a category that contains courses)
  const [containmentAlert, setContainmentAlert] = useState<{
    categoryName: string;
    courseCount: number;
    courses: Course[];
  } | null>(null);

  // Course Modal State inside Drilldown
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const courseFileInputRef = React.useRef<HTMLInputElement | null>(null);
  
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState('2499');
  const [courseOriginalPrice, setCourseOriginalPrice] = useState('4999');
  const [courseLevel, setCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [courseDuration, setCourseDuration] = useState('1 Year');
  const [courseHours, setCourseHours] = useState('65');
  const [courseLectures, setCourseLectures] = useState('48');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseThumb, setCourseThumb] = useState('/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg');

  // Quick Price Edit in Drilldown
  const [quickPriceEditCourseId, setQuickPriceEditCourseId] = useState<string | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<number>(0);

  // PDF / Lecture Resource Quick Add Modal
  const [selectedCourseForResource, setSelectedCourseForResource] = useState<Course | null>(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourcePages, setResourcePages] = useState('14');
  const [resourceSize, setResourceSize] = useState('3.5 MB');
  const [resourceAddedSuccess, setResourceAddedSuccess] = useState(false);

  // Filter categories by search
  const filteredCategories = categories.filter((c) => {
    return (
      !searchCategory.trim() ||
      c.name.toLowerCase().includes(searchCategory.toLowerCase()) ||
      c.group.toLowerCase().includes(searchCategory.toLowerCase()) ||
      c.description.toLowerCase().includes(searchCategory.toLowerCase())
    );
  });

  // Reorder helper
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const list = [...categories];
    const [moved] = list.splice(index, 1);
    list.splice(newIdx, 0, moved);

    const orderedIds = list.map((c) => c.id);
    await reorderCategories(orderedIds);
  };

  // Open Create Category Modal
  const handleOpenCreateCategory = () => {
    setEditingCategoryId(null);
    setCatName('');
    setCatGroup('Competitive Examinations');
    setCatDesc('');
    setCatThumb('/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg');
    setCatBadge('New Track');
    setCatOrder(categories.length + 1);
    setShowCategoryModal(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (cat: CourseCategory) => {
    setEditingCategoryId(cat.id);
    setCatName(cat.name);
    setCatGroup(cat.group);
    setCatDesc(cat.description);
    setCatThumb(cat.thumbnailUrl);
    setCatBadge(cat.badge || '');
    setCatOrder(cat.order);
    setShowCategoryModal(true);
  };

  // Save Category Form (Create or Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategoryId) {
      await updateCategory(editingCategoryId, {
        name: catName.trim(),
        group: catGroup,
        description: catDesc.trim(),
        thumbnailUrl: catThumb,
        badge: catBadge.trim(),
        order: Number(catOrder),
      });
      // If we are currently drilling down into this category, update its state
      if (drilldownCategory && drilldownCategory.id === editingCategoryId) {
        setDrilldownCategory((prev) => (prev ? { ...prev, name: catName.trim(), group: catGroup } : null));
      }
    } else {
      await addCategory({
        name: catName.trim(),
        group: catGroup,
        description: catDesc.trim(),
        thumbnailUrl: catThumb,
        badge: catBadge.trim(),
        order: Number(catOrder),
        isActive: true,
      });
    }

    setShowCategoryModal(false);
  };

  // Safe Category Deletion with Containment Check
  const handleDeleteCategoryRequest = (cat: CourseCategory) => {
    const associatedCourses = courses.filter((c) => c.categoryId === cat.id);
    if (associatedCourses.length > 0) {
      // Containment Violation!
      setContainmentAlert({
        categoryName: cat.name,
        courseCount: associatedCourses.length,
        courses: associatedCourses,
      });
      return;
    }

    // Category is safe to delete
    if (window.confirm(`Are you sure you want to permanently delete category "${cat.name}"? This action cannot be undone.`)) {
      deleteCategory(cat.id);
      if (drilldownCategory && drilldownCategory.id === cat.id) {
        setDrilldownCategory(null);
      }
    }
  };

  // Open Course Modal inside Drilldown
  const handleOpenCreateCourse = () => {
    if (!drilldownCategory) return;
    setEditingCourseId(null);
    setCourseTitle('');
    setCoursePrice('2499');
    setCourseOriginalPrice('4999');
    setCourseLevel('Intermediate');
    setCourseDuration('1 Year');
    setCourseHours('60');
    setCourseLectures('40');
    setCourseDesc(`Comprehensive curriculum for ${drilldownCategory.name} curated by Er. Alifer Sir.`);
    setCourseThumb(drilldownCategory.thumbnailUrl);
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCoursePrice(course.price.toString());
    setCourseOriginalPrice(course.originalPrice.toString());
    setCourseLevel(course.level);
    setCourseDuration(course.duration || '1 Year');
    setCourseHours((course.durationHours || 60).toString());
    setCourseLectures(course.totalLectures.toString());
    setCourseDesc(course.description);
    setCourseThumb(course.thumbnailUrl);
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drilldownCategory || !courseTitle.trim()) return;

    if (editingCourseId) {
      await updateCourse(editingCourseId, {
        title: courseTitle.trim(),
        price: Number(coursePrice),
        originalPrice: Number(courseOriginalPrice),
        level: courseLevel,
        duration: courseDuration || '1 Year',
        durationHours: Number(courseHours),
        totalLectures: Number(courseLectures),
        description: courseDesc.trim(),
        thumbnailUrl: courseThumb,
        bannerUrl: courseThumb,
      });
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: courseTitle.trim(),
        categoryId: drilldownCategory.id,
        categoryName: drilldownCategory.name,
        categoryGroup: drilldownCategory.group,
        category: 'Mathematics',
        isPublished: true,
        isActive: true,
        instructor: {
          name: 'Er. Alifer Sir',
          title: 'Founder & Academic Director',
          avatarUrl: '/assets/aistudio/IMG-20261106-WA0003_3c0fea6c.jpg',
          experience: '8+ Years Teaching Pedagogy',
          bio: 'Academic director at Alifer Academy.',
        },
        thumbnailUrl: courseThumb,
        bannerUrl: courseThumb,
        price: Number(coursePrice),
        originalPrice: Number(courseOriginalPrice),
        rating: 4.9,
        reviewCount: 1,
        duration: courseDuration || '1 Year',
        durationType: 'duration',
        durationHours: Number(courseHours),
        totalLectures: Number(courseLectures),
        totalNotes: 15,
        totalTests: 8,
        level: courseLevel,
        language: 'Bilingual (Hinglish + English Notes)',
        description: courseDesc.trim(),
        features: [
          'Full Syllabus Video Lectures in High Definition',
          'Downloadable Hand-Written Lecture Notes (PDF)',
          'Chapter-wise Practice Tests with Solutions',
          'Direct Ask-a-Query Doubt Clearing Support',
        ],
        isEnrolled: false,
        progressPercent: 0,
        modules: [],
      };
      addCourse(newCourse);
    }

    setShowCourseModal(false);
  };

  const handleQuickPriceSave = (courseId: string) => {
    if (quickPriceValue > 0) {
      updateCoursePrice(courseId, quickPriceValue);
      setQuickPriceEditCourseId(null);
    }
  };

  const handleAddResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForResource || !resourceTitle.trim()) return;

    // Attach to first lecture if available
    const targetLectureId = selectedCourseForResource.modules?.[0]?.chapters?.[0]?.lectures?.[0]?.id || 'lec-gen-1';

    addLectureResource(selectedCourseForResource.id, targetLectureId, {
      id: `res-${Date.now()}`,
      title: resourceTitle.trim(),
      type: 'pdf',
      fileSize: resourceSize || '3.5 MB',
      pages: Number(resourcePages) || 12,
    });

    setResourceAddedSuccess(true);
    setTimeout(() => {
      setResourceAddedSuccess(false);
      setSelectedCourseForResource(null);
      setResourceTitle('');
    }, 1500);
  };

  // ==========================================
  // RENDER DRILL-DOWN: CATEGORY-WISE COURSE MANAGEMENT
  // ==========================================
  if (drilldownCategory) {
    const drilldownCourses = courses.filter((c) => c.categoryId === drilldownCategory.id);

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#12121a] border border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrilldownCategory(null)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back to Categories</span>
            </button>

            <div className="h-4 w-px bg-zinc-700 hidden sm:block" />

            <div>
              <span className="text-[11px] text-zinc-400 font-medium block">
                Manage Categories &gt; {drilldownCategory.group}
              </span>
              <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{drilldownCategory.name}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {drilldownCourses.length} {drilldownCourses.length === 1 ? 'Course' : 'Courses'}
                </span>
              </h3>
            </div>
          </div>

          <button
            onClick={handleOpenCreateCourse}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course to {drilldownCategory.name}</span>
          </button>
        </div>

        {/* Courses in this Category */}
        <div className="space-y-3.5">
          {drilldownCourses.map((course) => {
            const isPublished = course.isPublished !== false;
            return (
              <div
                key={course.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#12121a] border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-20 sm:w-32 sm:h-22 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-zinc-800">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isPublished ? 'bg-emerald-500/90 text-white' : 'bg-zinc-700 text-zinc-300'
                      }`}>
                        {isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {course.level}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {course.durationHours} hrs · {course.totalLectures} lectures · {course.totalNotes} notes
                      </span>
                    </div>

                    <h4 className="font-display text-sm sm:text-base font-bold text-white line-clamp-1">
                      {course.title}
                    </h4>

                    {/* Inline Price Editor */}
                    <div className="flex items-center gap-2 pt-0.5">
                      {quickPriceEditCourseId === course.id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-zinc-400">₹</span>
                          <input
                            type="number"
                            value={quickPriceValue}
                            onChange={(e) => setQuickPriceValue(Number(e.target.value))}
                            className="w-24 bg-black border border-amber-500 rounded-lg px-2 py-0.5 text-xs text-white"
                            autoFocus
                          />
                          <button
                            onClick={() => handleQuickPriceSave(course.id)}
                            className="p-1 rounded-lg bg-emerald-500 text-black text-xs font-bold"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setQuickPriceEditCourseId(null)}
                            className="p-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-white">
                            ₹{course.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-zinc-500 line-through">
                            ₹{course.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => {
                              setQuickPriceEditCourseId(course.id);
                              setQuickPriceValue(course.price);
                            }}
                            className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                          >
                            <DollarSign className="w-2.5 h-2.5" />
                            <span>Edit Price</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Course Quick Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                  {/* Publish / Unpublish Toggle */}
                  <button
                    onClick={() => toggleCoursePublished(course.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                      isPublished
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {isPublished ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Unpublished</span>
                      </>
                    )}
                  </button>

                  {/* Add Resource */}
                  <button
                    onClick={() => setSelectedCourseForResource(course)}
                    className="py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Add PDF</span>
                  </button>

                  {/* Edit Course */}
                  <button
                    onClick={() => handleOpenEditCourse(course)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Edit Course Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Course */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete course "${course.title}"?`)) {
                        deleteCourse(course.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {drilldownCourses.length === 0 && (
            <div className="p-8 sm:p-12 rounded-3xl bg-[#101016] border border-dashed border-zinc-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-base font-bold text-white">
                  No courses in {drilldownCategory.name}
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  This category currently displays the professional "Curriculum Under Final Review" empty state on the student application.
                </p>
              </div>
              <button
                onClick={handleOpenCreateCourse}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110"
              >
                + Create First Course for {drilldownCategory.name}
              </button>
            </div>
          )}
        </div>

        {/* Modal: Add or Edit Course inside Drilldown */}
        {showCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#12121a] border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
              <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>
                  {editingCourseId ? 'Edit Course' : `Add Course to ${drilldownCategory.name}`}
                </span>
              </h3>

              <form onSubmit={handleSaveCourse} className="space-y-3.5">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Course Title</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. UPSC IAS Mathematics Optional Paper I & II"
                    required
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Batch Price (₹)</label>
                    <input
                      type="number"
                      value={coursePrice}
                      onChange={(e) => setCoursePrice(e.target.value)}
                      required
                      className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={courseOriginalPrice}
                      onChange={(e) => setCourseOriginalPrice(e.target.value)}
                      required
                      className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Level</label>
                    <select
                      value={courseLevel}
                      onChange={(e: any) => setCourseLevel(e.target.value)}
                      className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Duration (e.g. 1 Year, 6 Months)</label>
                    <input
                      type="text"
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      placeholder="e.g. 1 Year"
                      className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Total Lectures</label>
                    <input
                      type="number"
                      value={courseLectures}
                      onChange={(e) => setCourseLectures(e.target.value)}
                      className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Course Description</label>
                  <textarea
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Direct Thumbnail Selection from Device & Preview */}
                <div className="p-3 bg-black/50 border border-amber-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-400">
                      Course Thumbnail (1 Course = 1 Thumbnail)
                    </label>
                    <button
                      type="button"
                      onClick={() => courseFileInputRef.current?.click()}
                      className="text-[11px] px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-semibold flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Choose from Device</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={courseFileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            setCourseThumb(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />

                  <div className="flex items-center gap-3">
                    <div className="w-24 aspect-video rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                      <img src={courseThumb} alt="" className="w-full h-full object-cover" />
                    </div>
                    <input
                      type="text"
                      value={courseThumb}
                      onChange={(e) => setCourseThumb(e.target.value)}
                      placeholder="Or enter image URL"
                      className="flex-1 bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCourseModal(false)}
                    className="py-2 px-3.5 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110"
                  >
                    {editingCourseId ? 'Save Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quick Add Resource Modal */}
        {selectedCourseForResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-[#12121a] border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Add Handwritten PDF Notes</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Course: <span className="text-white font-medium">{selectedCourseForResource.title}</span>
              </p>

              {resourceAddedSuccess ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>PDF Document successfully added to course curriculum!</span>
                </div>
              ) : (
                <form onSubmit={handleAddResourceSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Handout / Notes Title</label>
                    <input
                      type="text"
                      value={resourceTitle}
                      onChange={(e) => setResourceTitle(e.target.value)}
                      placeholder="e.g. Chapter 1 Theorems & Formula Sheet (PDF)"
                      required
                      className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Page Count</label>
                      <input
                        type="number"
                        value={resourcePages}
                        onChange={(e) => setResourcePages(e.target.value)}
                        className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Estimated Size</label>
                      <input
                        type="text"
                        value={resourceSize}
                        onChange={(e) => setResourceSize(e.target.value)}
                        placeholder="3.5 MB"
                        className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCourseForResource(null)}
                      className="py-2 px-3.5 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20"
                    >
                      Add to Course
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER PRIMARY CATEGORY MANAGEMENT VIEW
  // ==========================================
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Manage Categories</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {categories.length} Total
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Create, reorder, edit, activate/deactivate, and drill down to manage category-specific courses
          </p>
        </div>

        <button
          onClick={handleOpenCreateCategory}
          className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Category</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          placeholder="Search categories (e.g. UPSC IAS Maths, CSAT, 12th Foundation)..."
          className="w-full bg-[#12121a] border border-zinc-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      {/* Categories Table / Cards List */}
      <div className="space-y-3">
        {filteredCategories.map((cat, idx) => {
          const associatedCourses = courses.filter((c) => c.categoryId === cat.id);
          const courseCount = associatedCourses.length;

          return (
            <div
              key={cat.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                cat.isActive !== false
                  ? 'bg-[#12121a] border-zinc-800 hover:border-amber-500/40'
                  : 'bg-[#0c0c12] border-zinc-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Reordering Controls */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveOrder(idx, 'up')}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 text-zinc-300 hover:text-white"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] font-mono text-zinc-400">{cat.order || idx + 1}</span>
                  <button
                    disabled={idx === categories.length - 1}
                    onClick={() => handleMoveOrder(idx, 'down')}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 text-zinc-300 hover:text-white"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Category Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-zinc-800 relative">
                  <img
                    src={cat.thumbnailUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Category Info */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {cat.group}
                    </span>
                    {cat.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        {cat.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {courseCount} {courseCount === 1 ? 'Batch' : 'Batches'}
                    </span>
                  </div>

                  <h4 className="font-display text-sm sm:text-base font-bold text-white truncate">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                {/* DRILL DOWN INTO COURSES */}
                <button
                  onClick={() => setDrilldownCategory(cat)}
                  className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Manage Courses ({courseCount})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>

                {/* Active / Inactive Toggle */}
                <button
                  onClick={() => toggleCategoryActive(cat.id)}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                    cat.isActive !== false
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                  }`}
                  title="Toggle Active / Inactive"
                >
                  {cat.isActive !== false ? 'Active' : 'Inactive'}
                </button>

                {/* Edit Category */}
                <button
                  onClick={() => handleOpenEditCategory(cat)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  title="Edit Category"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete Category with Containment Check */}
                <button
                  onClick={() => handleDeleteCategoryRequest(cat)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-[#101016] border border-zinc-800 p-6 space-y-2">
            <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No categories found matching "{searchCategory}".</p>
          </div>
        )}
      </div>

      {/* ==========================================
          CONTAINMENT WARNING MODAL
          Prevents accidental deletion of categories containing courses
         ========================================== */}
      {containmentAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#161622] border border-rose-500/50 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-scaleUp text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                Cannot Delete Category
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                The category <strong className="text-amber-300">"{containmentAlert.categoryName}"</strong> contains{' '}
                <strong className="text-white">{containmentAlert.courseCount} active course(s)</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-zinc-800 space-y-1.5 max-h-36 overflow-y-auto">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Associated Courses:
              </span>
              {containmentAlert.courses.map((c) => (
                <div key={c.id} className="text-xs text-zinc-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="truncate">{c.title}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-zinc-400">
              To delete this category, first open <strong className="text-zinc-200">Manage Courses</strong> and delete or reassign its courses to another category.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setContainmentAlert(null)}
                className="py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          CATEGORY CREATE / EDIT MODAL
         ========================================== */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#12121a] border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
            <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{editingCategoryId ? 'Edit Category' : 'Create New Course Category'}</span>
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3.5">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Category Name</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. UPSC IAS Maths, NDA, CSAT..."
                  required
                  className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Category Group</label>
                  <select
                    value={catGroup}
                    onChange={(e: any) => setCatGroup(e.target.value)}
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Competitive Examinations">Competitive Examinations</option>
                    <option value="Higher Education">Higher Education</option>
                    <option value="School Foundation">School Foundation</option>
                    <option value="Skill & Career">Skill & Career</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={catBadge}
                    onChange={(e) => setCatBadge(e.target.value)}
                    placeholder="e.g. UPSC Optional, 12th Boards"
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Description / Syllabus Scope</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Detailed breakdown of syllabus, exam pattern, and coverage..."
                  rows={3}
                  className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Category Thumbnail Upload & Preview */}
              <div className="space-y-2 p-3 bg-black/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">
                    Category Thumbnail Artwork
                  </label>
                  <button
                    type="button"
                    onClick={() => catFileInputRef.current?.click()}
                    className="text-[11px] px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-semibold flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload from Device</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={catFileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                          setCatThumb(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <div className="w-24 aspect-video rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                    <img src={catThumb} alt="" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={catThumb}
                    onChange={(e) => setCatThumb(e.target.value)}
                    placeholder="Or enter image URL"
                    className="flex-1 bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="py-2 px-3.5 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110"
                >
                  {editingCategoryId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
