import React from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  BookOpen,
  Award,
  Sun,
  TreePine,
  Layers,
  ArrowRight,
  Sparkles,
  Coffee,
  GraduationCap,
  Building2,
  Cpu,
  Clock,
  ChevronRight,
  ShieldCheck,
  Footprints,
  FileText,
} from 'lucide-react';

interface HomePageProps {
  onNavigateToMap: (destinationId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToMap }) => {
  // Key department blocks mapped to campus navigation node IDs
  const campusBlocks = [
    {
      id: 'dept-data-eng',
      name: 'Data Engineering Block',
      telugu: 'డేటా ఇంజనీరింగ్ బ్లాక్',
      category: 'New Academic Block',
      desc: 'State-of-the-art multi-story block housing Artificial Intelligence, Machine Learning, Data Science labs, and modern smart seminar halls.',
      icon: Cpu,
      color: 'bg-indigo-600',
      tag: 'New Block',
    },
    {
      id: 'dept-cse-central',
      name: 'CSE Block (Computer Science)',
      telugu: 'సి.ఎస్.ఇ బ్లాక్',
      category: 'Department Block',
      desc: 'Primary computer center with high-speed computing clusters, coding innovation cells, and software development workstations.',
      icon: Layers,
      color: 'bg-blue-600',
      tag: 'Core Dept',
    },
    {
      id: 'dept-mech',
      name: 'Mechanical Dept & Workshops',
      telugu: 'మెకానికల్ విభాగం & వర్క్‌షాప్',
      category: 'Engineering & Labs',
      desc: 'Heavy mechanical testing, CAD/CAM design centers, fluid mechanics labs, and foundational engineering workshops.',
      icon: Building2,
      color: 'bg-amber-600',
      tag: 'Workshops',
    },
    {
      id: 'dept-ece',
      name: 'ECE Department Block',
      telugu: 'ఇ.సి.ఇ విభాగం',
      category: 'Department Block',
      desc: 'Advanced electronics, VLSI design facilities, robotics testing ground, and digital signal processing research labs.',
      icon: Sparkles,
      color: 'bg-purple-600',
      tag: 'Core Dept',
    },
    {
      id: 'dept-civil-eee-chem',
      name: 'Civil, EEE & Chemical Block',
      telugu: 'సివిల్, ఈ.ఈ.ఈ & కెమికల్ బ్లాక్',
      category: 'Academic Complex',
      desc: 'Major multi-departmental wing equipped with high-voltage testing labs, structural engineering facilities, and chemical process labs.',
      icon: Building2,
      color: 'bg-teal-600',
      tag: 'Academic',
    },
    {
      id: 'library-pg',
      name: 'Central Library & PG Block',
      telugu: 'కేంద్ర గ్రంథాలయం',
      category: 'Library & Research',
      desc: 'Extensive repository with over 50,000+ volumes, IEEE digital access journals, quiet reading halls, and post-graduate centers.',
      icon: BookOpen,
      color: 'bg-emerald-600',
      tag: 'Knowledge Center',
    },
    {
      id: 'central-admin',
      name: 'Central Administrative Block',
      telugu: 'పరిపాలనా భవనం',
      category: 'Administration',
      desc: 'Office of the Principal, Academic Dean, Admissions cell, Examination section, and official student registry services.',
      icon: Award,
      color: 'bg-slate-700',
      tag: 'Admin',
    },
    {
      id: 'canteen',
      name: 'Campus Canteen & Cafeteria',
      telugu: 'క్యాంటీన్',
      category: 'Food & Dining',
      desc: 'Spacious food court serving freshly prepared meals, south Indian tiffins, snacks, and refreshing beverages for students and staff.',
      icon: Coffee,
      color: 'bg-orange-600',
      tag: 'Student Life',
    },
  ];

  const quickStats = [
    { label: 'Green Campus', value: '43+ Acres', icon: TreePine, desc: 'Eco-friendly lush landscape' },
    { label: 'Academic Excellence', value: 'NAAC "A"', icon: ShieldCheck, desc: 'Autonomous accreditation' },
    { label: 'Engineering Programs', value: '10+ Depts', icon: GraduationCap, desc: 'UG, PG & Research wings' },
    { label: 'Clean Energy', value: '100% Solar', icon: Sun, desc: 'Rooftop solar powered grid' },
  ];

  const scrollToNavigateSection = () => {
    const el = document.getElementById('navigate-campus-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden pb-20 md:pb-0">
      {/* =========================================================
          1. TOP NAVIGATION / APP BAR
         ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand & Crest */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
              MVGR
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                MVGR College of Engineering
              </h1>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Maharaj Vijayaram Gajapathi Raj • Autonomous
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollToNavigateSection}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Explore Campus
            </button>
            <button
              type="button"
              onClick={() => onNavigateToMap()}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              title="Open Interactive Campus Map"
            >
              <Compass className="w-4 h-4" />
              <span>Navigate Campus</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          2. HERO SECTION
         ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white pt-10 pb-16 sm:py-20">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Autonomous Institution • NAAC 'A' Grade • NBA Accredited</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Maharaj Vijayaram Gajapathi Raj College of Engineering
            </h2>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal mb-6">
              Often known as <span className="font-semibold text-white">MVGR (MJ College)</span>, our premier engineering institution was founded in 1997 under the royal aegis of the <span className="font-semibold text-white">MANSAS Trust</span>. Located on a sprawling 43+ acre green campus in Vizianagaram, we blend royal heritage, advanced technological research, and sustainable education.
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateToMap()}
                className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                <span>Navigate Through Campus</span>
                <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={scrollToNavigateSection}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-semibold text-sm sm:text-base rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-blue-300" />
                <span>Scroll to Campus Map Guide</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10 pt-8 border-t border-white/10">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-xs"
                >
                  <Icon className="w-5 h-5 text-blue-300 mb-1.5" />
                  <div className="text-lg sm:text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-200">{stat.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">{stat.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          3. WHAT THE COLLEGE IS & WHAT IT IS ABOUT
         ========================================================= */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>About MVGR College of Engineering</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                A Legacy of Royal Philanthropy, Visionary Education &amp; Modern Innovation
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Maharaj Vijayaram Gajapathi Raj (MVGR) College of Engineering was established in 1997 by the <strong>Maharajah Alak Narayan Society of Arts and Science (MANSAS)</strong>, founded by the visionary philanthropist <strong>Dr. P.V.G. Raju</strong>, the revered Raja Saheb of Vizianagaram.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Today, MVGR stands as an <strong>Autonomous Institution</strong> permanently affiliated with JNTU-GV. The campus integrates extensive engineering disciplines—from foundational branches like Civil and Mechanical to frontier domains like <strong>Data Engineering, Artificial Intelligence, and Computer Science</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Solar Powered Green Campus</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-normal">
                    Equipped with extensive rooftop solar panel arrays across academic blocks, producing clean energy to meet campus demands.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                    <TreePine className="w-4 h-4 text-emerald-600" />
                    <span>Serene Natural Environment</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-normal">
                    Lush tree-lined walking avenues, cricket oval, open auditoriums, pond, and peaceful Umamaheswara Temple on campus.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Campus Identity</span>
                    <h4 className="text-lg font-bold text-white">Quick Facts &amp; Heritage</h4>
                  </div>
                  <Building2 className="w-6 h-6 text-blue-300" />
                </div>

                <ul className="space-y-3 text-xs text-blue-100">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Full Name:</strong> Maharaj Vijayaram Gajapathi Raj College of Engineering (Autonomous)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Trust &amp; Founder:</strong> MANSAS Trust (founded by Dr. P.V.G. Raju garu)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Location:</strong> Chintalavalasa, Vizianagaram, Andhra Pradesh - 535005</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Affiliation:</strong> JNTU-GV, Approved by AICTE, Accredited by NAAC 'A'</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Campus Span:</strong> 43+ verdant acres with walking avenues and sports facilities</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToMap('central-admin')}
                    className="w-full py-2 px-3 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl transition-colors text-center shadow-xs"
                  >
                    View Admin Block on Map →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. CAMPUS BLOCKS & DEPARTMENTS DIRECTORY
         ========================================================= */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Ground Truth Locations
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Explore Departments &amp; Campus Landmarks
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Tap on any block to open the interactive map with directions directly to that building.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToMap()}
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800"
            >
              <span>View Full Campus Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {campusBlocks.map((block) => {
              const Icon = block.icon;
              return (
                <div
                  key={block.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl ${block.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {block.tag}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                      {block.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium mb-1.5">{block.telugu}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {block.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateToMap(block.id)}
                    className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-blue-200/70"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                    <span>Navigate Here</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. "NAVIGATE THROUGH CAMPUS" (Primary User Requirement)
             When scrolling down, prominently show this section and
             click redirects to the map navigation page!
         ========================================================= */}
      <section
        id="navigate-campus-section"
        className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Call to Action */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>Interactive Ground Truth Map</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Navigate Through Campus
                </h3>

                <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                  Lost on campus or searching for your next class? Use our real-time walking pathfinder to calculate optimal walking routes, step counts, and walking time estimates across all blocks, departments, workshops, and facilities.
                </p>

                {/* Features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>Accurate Google Satellite ground truth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <span>Turn-by-turn walking directions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span>Live step counts &amp; calorie estimates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    <span>Interactive walk simulator animation</span>
                  </div>
                </div>

                {/* BIG REDIRECT BUTTON */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => onNavigateToMap()}
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group cursor-pointer"
                  >
                    <Compass className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Navigate Through Campus</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Column: Quick Route Starters */}
              <div className="lg:col-span-5 bg-white/10 rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Footprints className="w-4 h-4 text-emerald-400" />
                    <span>Popular Route Shortcuts</span>
                  </h4>
                  <span className="text-[10px] text-blue-200 font-medium">One-Tap Route</span>
                </div>
                <p className="text-xs text-slate-300">
                  Tap any preset below to launch the map with an instant route plotted from the Main Gate:
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToMap('dept-data-eng')}
                    className="w-full p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-xl text-left text-xs transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-200">Main Gate → Data Engineering</div>
                        <div className="text-[10px] text-slate-300">~270m • 3.5 min walk</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToMap('dept-cse-central')}
                    className="w-full p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-xl text-left text-xs transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-200">Main Gate → CSE Block</div>
                        <div className="text-[10px] text-slate-300">~380m • 4.8 min walk</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToMap('library-pg')}
                    className="w-full p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-xl text-left text-xs transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-200">Main Gate → Central Library</div>
                        <div className="text-[10px] text-slate-300">~420m • 5.3 min walk</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToMap('canteen')}
                    className="w-full p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-xl text-left text-xs transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-200">Main Gate → Canteen &amp; Dining</div>
                        <div className="text-[10px] text-slate-300">~490m • 6.2 min walk</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. FOOTER
         ========================================================= */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-200">
              Maharaj Vijayaram Gajapathi Raj College of Engineering (Autonomous)
            </p>
            <p className="text-slate-500 mt-0.5">
              Vijayaram Nagar campus, Chintalavalasa, Vizianagaram, Andhra Pradesh - 535005
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateToMap()}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Launch Campus Map</span>
            </button>
          </div>
        </div>
      </footer>

      {/* =========================================================
          7. STICKY MOBILE BOTTOM NAVIGATION BAR
             Guarantees premier mobile UX with 1-tap navigation to map!
         ========================================================= */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl">
        <button
          type="button"
          onClick={() => onNavigateToMap()}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 active:from-blue-700 active:to-indigo-800 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Compass className="w-5 h-5 animate-spin-slow" />
          <span>Navigate Through Campus</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
