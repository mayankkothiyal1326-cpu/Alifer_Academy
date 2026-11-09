import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lecture } from '../../types';
import { BRAND_ASSETS } from '../../data/constants';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  FileText, 
  Download, 
  ThumbsUp, 
  Share2, 
  Send, 
  Image as ImageIcon, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Settings,
  HelpCircle
} from 'lucide-react';

export const VideoPlayerModal: React.FC = () => {
  const { 
    activeLecture, 
    closeLecture, 
    updateLectureProgress, 
    submitLectureQuery, 
    openPdfViewer, 
    addDownload,
    openLecture
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoQuality, setVideoQuality] = useState('1080p');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Ask a Query form state
  const [queryText, setQueryText] = useState('');
  const [queryImage, setQueryImage] = useState<string | null>(null);
  const [querySubmitting, setQuerySubmitting] = useState(false);

  const lecture = activeLecture?.lecture;
  const course = activeLecture?.course;

  // Restore timestamp on lecture change
  useEffect(() => {
    if (lecture && videoRef.current) {
      if (lecture.lastWatchedSeconds && lecture.lastWatchedSeconds > 0) {
        videoRef.current.currentTime = lecture.lastWatchedSeconds;
        setCurrentTime(lecture.lastWatchedSeconds);
      } else {
        videoRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      setIsPlaying(false);
    }
  }, [lecture?.id]);

  if (!activeLecture || !lecture || !course) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);
    // Periodically save progress
    if (Math.floor(curr) % 5 === 0) {
      updateLectureProgress(course.id, lecture.id, Math.floor(curr), false);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || lecture.durationMinutes * 60);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const handleQualityChange = (quality: string) => {
    setVideoQuality(quality);
    setShowQualityMenu(false);
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('video-player-container');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handlePictureInPicture = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Find previous and next lecture in course
  const allLectures: Lecture[] = [];
  course.modules.forEach(m => m.chapters.forEach(ch => ch.lectures.forEach(l => allLectures.push(l))));
  const currentIndex = allLectures.findIndex(l => l.id === lecture.id);
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;

  // Image file handler for query
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQueryImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim() && !queryImage) return;

    setQuerySubmitting(true);
    submitLectureQuery(course.id, lecture.id, queryText.trim(), queryImage || undefined);
    setQueryText('');
    setQueryImage(null);
    setQuerySubmitting(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Discrete 10-step speed options requested
  const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
  // Video quality options requested
  const QUALITY_OPTIONS = ['Auto', '144p', '240p', '360p', '480p', '720p HD', '1080p Full HD'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white animate-in fade-in duration-150 overflow-y-auto">
      {/* Top Bar */}
      <div className="h-14 bg-[#09090d] border-b border-zinc-800 px-4 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={closeLecture}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Close lecture player"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate">
              {lecture.title}
            </h2>
            <p className="text-[10px] text-zinc-400 truncate">
              {course.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {prevLecture && (
            <button
              onClick={() => openLecture(prevLecture, course)}
              className="px-2.5 py-1 text-[11px] font-medium bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-300"
            >
              Prev
            </button>
          )}
          {nextLecture && (
            <button
              onClick={() => openLecture(nextLecture, course)}
              className="px-2.5 py-1 text-[11px] font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto p-3 sm:p-5 flex-1 flex flex-col space-y-6">
        {/* 1. VIDEO PLAYER CONTAINER */}
        <div
          id="video-player-container"
          className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl group"
        >
          <video
            ref={videoRef}
            src={lecture.videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              updateLectureProgress(course.id, lecture.id, Math.floor(duration), true);
              if (autoplay && nextLecture) {
                openLecture(nextLecture, course);
              }
            }}
            onClick={togglePlay}
          />

          {/* Center Play Button Overlay on Pause */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-xl shadow-amber-500/30 transform group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-black translate-x-0.5" />
              </div>
            </div>
          )}

          {/* YouTube-Style On-Screen Video Controls */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-6 flex flex-col gap-2 transition-opacity">
            {/* Scrubber timeline */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-zinc-700 accent-amber-400 rounded-lg cursor-pointer transition-all hover:h-1.5"
              />
            </div>

            {/* Bottom button controls */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlay} 
                  className="p-1 hover:text-amber-400 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                {/* 10s back and 10s forward */}
                <button 
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime -= 10;
                  }}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime += 10;
                  }}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Forward 10s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Mute */}
                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="p-1 text-zinc-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Time counter */}
                <span className="font-mono text-[11px] text-zinc-300 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration || lecture.durationMinutes * 60)}
                </span>
              </div>

              {/* Right Settings: Separate Speed and Quality Menus */}
              <div className="flex items-center gap-2 relative">
                {/* 1. SEPARATE PLAYBACK SPEED MENU */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSpeedMenu(!showSpeedMenu);
                      setShowQualityMenu(false);
                    }}
                    className="px-2 py-1 bg-zinc-900/90 hover:bg-zinc-800 rounded border border-zinc-700 text-[11px] font-mono text-amber-300 flex items-center gap-1"
                    title="Playback Speed"
                  >
                    <span>Speed:</span>
                    <span className="font-bold">{playbackSpeed}x</span>
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute right-0 bottom-9 w-44 bg-[#121218] border border-amber-500/30 rounded-xl p-2.5 shadow-2xl z-30 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block pb-1 border-b border-zinc-800">
                        Playback Speed (10 Steps)
                      </span>
                      <div className="grid grid-cols-2 gap-1 text-[11px] font-mono max-h-56 overflow-y-auto">
                        {SPEED_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSpeedChange(s)}
                            className={`px-2 py-1.5 rounded text-left flex items-center justify-between transition-colors ${
                              playbackSpeed === s 
                                ? 'bg-amber-400 text-black font-bold' 
                                : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <span>{s}x</span>
                            {playbackSpeed === s && <CheckCircle className="w-3 h-3 text-black" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. SEPARATE VIDEO QUALITY MENU */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowQualityMenu(!showQualityMenu);
                      setShowSpeedMenu(false);
                    }}
                    className="px-2 py-1 bg-zinc-900/90 hover:bg-zinc-800 rounded border border-zinc-700 text-[11px] font-mono text-cyan-300 flex items-center gap-1"
                    title="Video Quality"
                  >
                    <span>Quality:</span>
                    <span className="font-bold">{videoQuality}</span>
                  </button>

                  {showQualityMenu && (
                    <div className="absolute right-0 bottom-9 w-44 bg-[#121218] border border-cyan-500/30 rounded-xl p-2.5 shadow-2xl z-30 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block pb-1 border-b border-zinc-800">
                        Video Quality
                      </span>
                      <div className="space-y-1 text-[11px] font-mono">
                        {QUALITY_OPTIONS.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQualityChange(q)}
                            className={`w-full px-2.5 py-1.5 rounded text-left flex items-center justify-between transition-colors ${
                              videoQuality === q 
                                ? 'bg-cyan-500 text-black font-bold' 
                                : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <span>{q}</span>
                            {videoQuality === q && <CheckCircle className="w-3 h-3 text-black" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePictureInPicture}
                  className="hidden sm:inline p-1 text-zinc-400 hover:text-white"
                  title="Picture in Picture"
                >
                  PiP
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-1 text-zinc-300 hover:text-white"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LECTURE TITLE & DESCRIPTION */}
        <div className="bg-[#101016] border border-zinc-800/90 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-amber-400">
                {course.title} · Chapter Lecture #{lecture.order}
              </span>
              <h1 className="font-display text-base sm:text-xl font-bold text-white">
                {lecture.title}
              </h1>
            </div>

            {/* Like & Share Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                  liked 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{liked ? 'Liked' : 'Like'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Lecture Description & Key Timestamps */}
          <div className="space-y-2 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-3">
            <p>{lecture.description}</p>

            {lecture.timestamps && lecture.timestamps.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                  Key Chapter Timestamps
                </span>
                <div className="flex flex-wrap gap-2">
                  {lecture.timestamps.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const parts = t.time.split(':').map(Number);
                        const s = parts[0] * 60 + parts[1];
                        if (videoRef.current) {
                          videoRef.current.currentTime = s;
                          videoRef.current.play();
                          setIsPlaying(true);
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-zinc-800 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{t.time}</span>
                      <span className="text-zinc-400 font-sans">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. TEACHER INFORMATION (Standalone Dedicated Section) */}
        <div className="bg-[#101016] border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-black shadow-lg shadow-amber-500/20">
              <img
                src={BRAND_ASSETS.teacherPortrait}
                alt={BRAND_ASSETS.leadInstructor.name}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {BRAND_ASSETS.leadInstructor.name}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Founder & Lead Educator
                </span>
              </div>
              <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                {BRAND_ASSETS.leadInstructor.credentials}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-xl">
                Dedicated mentor guiding thousands of engineering & science aspirants with conceptual depth and shortcut techniques.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-zinc-800/80 pt-2 sm:pt-0 shrink-0">
            <span className="text-[10px] text-zinc-400">Total Mentored</span>
            <span className="text-sm font-bold font-mono text-white">50,000+ Students</span>
          </div>
        </div>

        {/* 4. LECTURE RESOURCES (View Notes, Download Notes PDF, Download Study Material) */}
        <div className="bg-[#101016] border border-amber-500/20 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="font-display text-sm font-bold text-white tracking-wide">
                Lecture Notes & Study Resources
              </h3>
            </div>
            <span className="text-xs text-zinc-400">
              {lecture.resources.length} Downloadable Materials
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lecture.resources.map((res) => (
              <div
                key={res.id}
                className="p-3.5 bg-zinc-950/60 border border-zinc-800 rounded-xl flex flex-col justify-between gap-3 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-zinc-100 truncate">
                      {res.title}
                    </h5>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      PDF Document · {res.fileSize} {res.pages ? `· ${res.pages} Pages` : ''}
                    </p>
                  </div>
                </div>

                {/* Direct Action Options: View Notes, Download Notes PDF, Download Study Material */}
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                  <button
                    onClick={() => openPdfViewer({
                      title: res.title,
                      courseName: course.title,
                      pages: res.pages || 12,
                    })}
                    className="flex-1 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-semibold text-center border border-zinc-800 transition-colors"
                  >
                    View Notes
                  </button>
                  <button
                    onClick={() => addDownload({
                      title: res.title,
                      courseName: course.title,
                      type: 'pdf',
                      fileSize: res.fileSize,
                      totalPages: res.pages || 12,
                      localPath: `/storage/${encodeURIComponent(res.title)}.pdf`,
                    })}
                    className="flex-1 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold flex items-center justify-center gap-1 border border-amber-500/30 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => addDownload({
                      title: `${lecture.title} - Complete Formula Sheet & Material`,
                      courseName: course.title,
                      type: 'notes',
                      fileSize: '4.8 MB',
                      totalPages: 18,
                      localPath: `/storage/${encodeURIComponent(lecture.title)}_Material.pdf`,
                    })}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                    title="Download Study Material Package"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ASK A QUERY (Directly below lecture resources) */}
        <div className="bg-[#101016] border border-zinc-800/90 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display text-sm font-bold text-white tracking-wide">
                Ask a Query on This Lecture
              </h3>
            </div>
            <span className="text-xs text-zinc-400">
              {lecture.queries.length} Queries Posted
            </span>
          </div>

          {/* Submit Query Form */}
          <form onSubmit={handleSubmitQuery} className="space-y-3 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800">
            <textarea
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Ask Er. Alifer Sir or the academy tutors about this concept or problem..."
              rows={3}
              className="w-full bg-[#111116] border border-zinc-700/80 rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/80 transition-colors resize-none"
            />

            {/* Attached Image Preview if any */}
            {queryImage && (
              <div className="relative inline-block border border-amber-500/40 rounded-lg overflow-hidden">
                <img src={queryImage} alt="Uploaded query snippet" className="h-20 w-auto object-cover" />
                <button
                  type="button"
                  onClick={() => setQueryImage(null)}
                  className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-zinc-300 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Attach question photo / diagram</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={querySubmitting || (!queryText.trim() && !queryImage)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Query</span>
              </button>
            </div>
          </form>

          {/* Previous Queries List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Discussion & Answered Queries
            </h4>

            {lecture.queries.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500 bg-zinc-900/40 rounded-xl">
                No questions asked on this lecture yet. Be the first to ask!
              </div>
            ) : (
              lecture.queries.map((q) => (
                <div key={q.id} className="p-3.5 bg-zinc-950/50 rounded-xl border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{q.studentName}</span>
                      <span className="text-[10px] text-zinc-500">{q.timestamp}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      q.status === 'answered' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {q.status === 'answered' ? 'Answered' : 'Pending Review'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200">{q.question}</p>

                  {/* Teacher's response if answered */}
                  {q.teacherReply && (
                    <div className="mt-2 p-3 bg-amber-950/20 rounded-lg border-l-2 border-amber-400 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-amber-300">
                          {q.teacherReply.author}
                        </span>
                        <span className="text-[10px] text-zinc-500">{q.teacherReply.timestamp}</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {q.teacherReply.text}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 6. RECOMMENDED & RELATED LECTURES */}
        <div className="space-y-3 pt-2">
          <h4 className="font-display text-sm font-bold text-white">
            Up Next In This Course
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allLectures.filter(l => l.id !== lecture.id).slice(0, 4).map((rel) => (
              <div
                key={rel.id}
                onClick={() => openLecture(rel, course)}
                className="p-3 bg-[#111117] hover:bg-[#161622] border border-zinc-800 hover:border-amber-500/30 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-zinc-100 truncate">
                      {rel.title}
                    </h5>
                    <span className="text-[10px] text-zinc-400">
                      {rel.durationMinutes} mins · {rel.resources.length} Notes
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
