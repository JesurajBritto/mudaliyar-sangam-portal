import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  UserCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building,
  MapPin,
  Mail,
  Send,
  PlusCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Language, ScholarshipApplication, CareerMentor, JobOpening } from '../types';
import {
  INITIAL_SCHOLARSHIP_APPLICATIONS,
  INITIAL_CAREER_MENTORS,
  INITIAL_JOB_OPENINGS
} from '../data/youthCareerData';
import { ModuleTopNav } from './ModuleTopNav';

interface YouthCareerHubViewerProps {
  language: Language;
  onBackToHome?: () => void;
}

export const YouthCareerHubViewer: React.FC<YouthCareerHubViewerProps> = ({ language, onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'scholarships' | 'jobs'>('scholarships');
  const [scholarshipFilter, setScholarshipFilter] = useState<'all' | 'children' | 'higher_ed'>('all');
  const [scholarships, setScholarships] = useState<ScholarshipApplication[]>(INITIAL_SCHOLARSHIP_APPLICATIONS);
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOB_OPENINGS);

  // Review Application Modal (Admin)
  const [reviewApp, setReviewApp] = useState<ScholarshipApplication | null>(null);
  const [reviewForm, setReviewForm] = useState({
    approvedAmount: 0,
    adminRemarks: ''
  });

  // Post Job Modal
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    companyName: '',
    location: '',
    jobType: 'Full-time' as const,
    salaryRange: '',
    experienceRequired: '',
    description: '',
    contactEmail: ''
  });

  // Apply for Scholarship Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [applyForm, setApplyForm] = useState({
    studentName: '',
    isChildScholarship: true,
    courseDegree: 'Primary School (Classes 1 - 5)',
    collegeUniversity: '',
    yearOfStudy: 'School Student',
    academicPercentage: 92,
    annualTuitionFee: 35000,
    requestedGrantAmount: 20000,
    parentName: '',
    parentOccupation: '',
    annualFamilyIncome: 120000,
    nativeDistrict: 'Kanchipuram',
    scholarshipScheme: 'Sangam Young Talent & School Kit Endowment',
    bankAccount: ''
  });

  // Mentorship Booking Modal
  const [selectedMentor, setSelectedMentor] = useState<CareerMentor | null>(null);
  const [mentorToast, setMentorToast] = useState<string | null>(null);

  const handleScholarshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.studentName || !applyForm.courseDegree || !applyForm.collegeUniversity) {
      alert('Please fill all required academic fields.');
      return;
    }

    const newApp: ScholarshipApplication = {
      id: `sch-2024-${Math.floor(100 + Math.random() * 900)}`,
      studentName: applyForm.studentName,
      studentNameTa: applyForm.studentName,
      memberCode: applyForm.isChildScholarship
        ? `MUD-CHILD-${Math.floor(100 + Math.random() * 899)}`
        : `MUD-STU-${Math.floor(100 + Math.random() * 899)}`,
      courseDegree: applyForm.courseDegree,
      collegeUniversity: applyForm.collegeUniversity,
      yearOfStudy: applyForm.yearOfStudy,
      academicPercentage: Number(applyForm.academicPercentage),
      annualTuitionFee: Number(applyForm.annualTuitionFee),
      parentName: applyForm.parentName || 'Sangam Member Parent',
      parentOccupation: applyForm.parentOccupation || 'Agriculture / Weaver / Service',
      annualFamilyIncome: Number(applyForm.annualFamilyIncome),
      nativeDistrict: applyForm.nativeDistrict,
      applicationDate: 'Today',
      status: 'submitted',
      isChildScholarship: applyForm.isChildScholarship,
      scholarshipScheme: applyForm.scholarshipScheme,
      bankAccount: applyForm.bankAccount
    };

    setScholarships([newApp, ...scholarships]);
    setIsApplyModalOpen(false);
    setMentorToast(
      language === 'en'
        ? `Scholarship application for ${applyForm.studentName} submitted! Sangam Education Committee will verify credentials.`
        : `${applyForm.studentName} க்கான கல்வி உதவித்தொகை விண்ணப்பம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!`
    );
    setTimeout(() => setMentorToast(null), 5000);
  };

  const handleReviewApplication = (app: ScholarshipApplication) => {
    setReviewApp(app);
    setReviewForm({
      approvedAmount: app.requestedGrantAmount || 0,
      adminRemarks: app.adminRemarks || ''
    });
  };

  const submitReview = (status: 'approved' | 'rejected') => {
    if (reviewApp) {
      setScholarships(scholarships.map(app =>
        app.id === reviewApp.id
          ? {
              ...app,
              status,
              disbursedAmount: status === 'approved' ? reviewForm.approvedAmount : undefined,
              adminRemarks: reviewForm.adminRemarks
            }
          : app
      ));
      setMentorToast(`Application ${status} successfully.`);
      setTimeout(() => setMentorToast(null), 3000);
      setReviewApp(null);
    }
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobOpening = {
      id: `job-${Math.floor(100 + Math.random() * 900)}`,
      ...jobForm,
      titleTa: jobForm.title,
      founderMember: 'Current Business Member',
      postedDate: 'Today',
      status: 'pending'
    };
    setJobs([newJob, ...jobs]);
    setIsPostJobModalOpen(false);
    setMentorToast('Job posted successfully! Pending admin approval.');
    setTimeout(() => setMentorToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Consistent Module Header with Back Navigation */}
      <ModuleTopNav
        language={language}
        moduleNameEn="Youth Career & Scholarship Cell"
        moduleNameTa="இளையோர் வேலைவாய்ப்பு & உயர்கல்வி மையம்"
        badgeEn="Higher Ed Grants & Career Placements"
        badgeTa="கல்வி உதவி & வேலைவாய்ப்பு"
        subtitleEn="College scholarships, competitive exam mentorships, and verified career placement opportunities."
        subtitleTa="உயர்கல்வி உதவித்தொகை, அரசுப் பணி வழிகாட்டுதல் மற்றும் சமூக வணிக நிறுவன வேலைவாய்ப்புகள்."
        themeColor="sky"
        icon={GraduationCap}
        onBackToHome={onBackToHome}
      />

      {/* 2. Module-Specific Hero Banner (Modern Royal Blue / Sky Blue Theme) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-sky-50/90 via-white to-blue-50/50 border border-sky-200/90 shadow-[0_4px_24px_rgba(2,132,199,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight">
                {language === 'en'
                  ? 'Youth Career & Scholarship Cell'
                  : 'இளையோர் வேலைவாய்ப்பு & உயர்கல்வி அறக்கட்டளை மையம்'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed font-normal">
              {language === 'en'
                ? 'Empowering the next generation with merit-cum-means college scholarships, UPSC/Engineering mentors, and career placements in member-founded enterprises.'
                : 'சமூகத்தின் அடுத்த தலைமுறைக்கான உயர்கல்வி உதவித்தொகை, அரசுப் பணி & மென்பொருள் துறை வழிகாட்டுதல் மற்றும் வேலைவாய்ப்பு மையம்.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setApplyForm((prev) => ({
                  ...prev,
                  isChildScholarship: true,
                  courseDegree: 'Primary School (Classes 1 - 5)',
                  scholarshipScheme: 'Sangam Young Talent & School Kit Endowment'
                }));
                setIsApplyModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'Apply Scholarship' : 'கல்வி உதவிக்கு விண்ணப்பிக்க'}</span>
            </button>
          </div>
        </div>

        {/* Inner Subtabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('scholarships')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'scholarships'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-[#e8e3d8] hover:bg-stone-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Scholarship Desk & Grants' : 'கல்வி உதவித்தொகை மையம்'}</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                activeTab === 'scholarships'
                  ? 'bg-white/20 text-white'
                  : 'bg-stone-100 text-stone-800'
              }`}
            >
              {scholarships.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-[#e8e3d8] hover:bg-stone-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Community Job Openings' : 'சமூக வேலைவாய்ப்புகள்'}</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                activeTab === 'jobs'
                  ? 'bg-white/20 text-white'
                  : 'bg-stone-100 text-stone-800'
              }`}
            >
              {jobs.length}
            </span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {mentorToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{mentorToast}</span>
        </div>
      )}

      {/* Tab 1: Scholarships */}
      {activeTab === 'scholarships' && (
        <div className="space-y-4">
          {/* Filter Sub-nav */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScholarshipFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                scholarshipFilter === 'all'
                  ? 'bg-zinc-800 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              All Applications ({scholarships.length})
            </button>
            <button
              type="button"
              onClick={() => setScholarshipFilter('children')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                scholarshipFilter === 'children'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>Children's Scholarships</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20 text-[10px] font-bold">
                {scholarships.filter((s) => s.isChildScholarship).length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setScholarshipFilter('higher_ed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                scholarshipFilter === 'higher_ed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>Higher Ed & Degrees</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20 text-[10px] font-bold">
                {scholarships.filter((s) => !s.isChildScholarship).length}
              </span>
            </button>
          </div>

          {/* Applications Table */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {language === 'en' ? 'Active Scholarship Beneficiary Applications' : 'செயலில் உள்ள கல்வி உதவி விண்ணப்பங்கள்'}
              </h3>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono font-medium">100% Transparent Verification</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-bold border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="p-3 font-bold">{language === 'en' ? 'Student / Child Name' : 'மாணவர் பெயர்'}</th>
                    <th className="p-3 font-bold">{language === 'en' ? 'Standard / Degree' : 'படிப்பு / பட்டம்'}</th>
                    <th className="p-3 font-bold">{language === 'en' ? 'Academic %' : 'மதிப்பெண் %'}</th>
                    <th className="p-3 font-bold">{language === 'en' ? 'Grant Scheme & Amount' : 'உதவித்தொகை திட்டம் & தொகை'}</th>
                    <th className="p-3 font-bold">{language === 'en' ? 'Parent / District' : 'பெற்றோர் / மாவட்டம்'}</th>
                    <th className="p-3 font-bold">{language === 'en' ? 'Remarks' : 'குறிப்புகள்'}</th>
                    <th className="p-3 font-bold">{language === 'en' ? 'Status' : 'நிலை'}</th>
                    <th className="p-3 font-bold">{language === 'en' ? 'Action' : 'செயல்பாடு'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {scholarships
                    .filter((app) => {
                      if (scholarshipFilter === 'children') return app.isChildScholarship;
                      if (scholarshipFilter === 'higher_ed') return !app.isChildScholarship;
                      return true;
                    })
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-zinc-900 dark:text-white block">{app.studentName}</span>
                            {app.isChildScholarship && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                Child
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-medium">{app.memberCode}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold block text-zinc-900 dark:text-zinc-100">{app.courseDegree}</span>
                          <span className="text-[11px] text-zinc-600 dark:text-zinc-400">{app.collegeUniversity}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                            {app.academicPercentage}%
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-mono font-bold text-zinc-900 dark:text-white block">
                            ₹{app.disbursedAmount ? app.disbursedAmount.toLocaleString() : (app.requestedGrantAmount ? app.requestedGrantAmount.toLocaleString() : '0')} Grant
                          </span>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block truncate max-w-[200px]">
                            {app.scholarshipScheme || `Total Fee: ₹${app.annualTuitionFee.toLocaleString()}`}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="block font-medium text-zinc-900 dark:text-zinc-100">{app.parentName}</span>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400">{app.nativeDistrict}</span>
                        </td>
                        <td className="p-3 text-[10px] text-zinc-600 dark:text-zinc-400 max-w-[120px] truncate">
                          {app.adminRemarks || '-'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-bold inline-block uppercase tracking-wider ${
                              app.status === 'disbursed'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                                : app.status === 'approved'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                                : app.status === 'rejected'
                                ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {(app.status === 'submitted' || app.status === 'under_verification') && (
                            <button
                               type="button"
                               onClick={() => handleReviewApplication(app)}
                               className="px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-xs font-bold"
                            >
                              {language === 'en' ? 'Review' : 'மதிப்பாய்வு'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 flex items-center justify-between">
            <span className="font-semibold">
              💼 All jobs listed here are directly posted by Mudaliyar community business owners with priority consideration for member applicants.
            </span>
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 inline-block mr-1.5" />
              {language === 'en' ? 'Post a Job' : 'வேலைவாய்ப்பை பதிவிட'}
            </button>
          </div>

          <div className="space-y-3">
            {jobs.filter(j => j.status === 'approved' || j.status === 'pending').map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-indigo-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-semibold text-[10px] text-zinc-700 dark:text-zinc-300">
                      {job.jobType}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {job.salaryRange}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">• Exp: {job.experienceRequired}</span>
                    {job.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Pending Admin Approval
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? job.title : job.titleTa}
                  </h3>

                  <p className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>{job.companyName} ({job.founderMember})</span>
                  </p>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl mt-1">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  {job.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'approved' } : j))}
                      className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      Approve Job (Admin)
                    </button>
                  )}
                  <a
                    href={`mailto:${job.contactEmail}?subject=Application for ${job.title} - Mudaliyar Sangam Member`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply with Sangam Profile</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Scholarship Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {language === 'en' ? 'Apply for Educational Scholarship' : 'கல்வி உதவிக்கு விண்ணப்பிக்க'}
                  </h3>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    Mudaliyar Sangam Educational Endowment Scheme
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScholarshipSubmit} className="space-y-3 text-xs">
              {/* Category Selector */}
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Application Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setApplyForm({
                        ...applyForm,
                        isChildScholarship: true,
                        courseDegree: 'Primary School (Classes 1 - 5)',
                        scholarshipScheme: 'Sangam Young Talent & School Kit Endowment',
                        requestedGrantAmount: 15000
                      })
                    }
                    className={`p-2.5 rounded-xl text-center font-bold text-xs border transition-all cursor-pointer ${
                      applyForm.isChildScholarship
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    👶 Child Scholarship (Class 1-12)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setApplyForm({
                        ...applyForm,
                        isChildScholarship: false,
                        courseDegree: 'Undergraduate (BE / BTech / MBBS / BSc)',
                        scholarshipScheme: 'Sangam Merit-cum-Means Higher Education Grant',
                        requestedGrantAmount: 50000
                      })
                    }
                    className={`p-2.5 rounded-xl text-center font-bold text-xs border transition-all cursor-pointer ${
                      !applyForm.isChildScholarship
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    🎓 College / Higher Ed Grant
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  {applyForm.isChildScholarship ? 'Child Full Name*' : 'Student Full Name*'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={applyForm.isChildScholarship ? 'e.g. Master K. Shanmuga Priyan' : 'e.g. S. Tharun Kumar Mudaliyar'}
                  value={applyForm.studentName}
                  onChange={(e) => setApplyForm({ ...applyForm, studentName: e.target.value })}
                  className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Academic Level / Standard*</label>
                  <select
                    value={applyForm.courseDegree}
                    onChange={(e) => setApplyForm({ ...applyForm, courseDegree: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  >
                    <option value="Primary School (Classes 1 - 5)">Primary School (Classes 1 - 5)</option>
                    <option value="Middle & High School (Classes 6 - 10)">Middle & High School (Classes 6 - 10)</option>
                    <option value="Higher Secondary (+1, +2 / CBSE)">Higher Secondary (+1, +2 / CBSE)</option>
                    <option value="Undergraduate (BE / BTech / MBBS / BSc)">Undergraduate (BE / BTech / MBBS / BSc)</option>
                    <option value="Postgraduate & Research (ME / MS / MBA)">Postgraduate & Research (ME / MS / MBA)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">School / College Name*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bala Vidya Mandir, Chennai"
                    value={applyForm.collegeUniversity}
                    onChange={(e) => setApplyForm({ ...applyForm, collegeUniversity: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Academic Score (%)*</label>
                  <input
                    type="number"
                    step="0.1"
                    min={40}
                    max={100}
                    required
                    value={applyForm.academicPercentage}
                    onChange={(e) => setApplyForm({ ...applyForm, academicPercentage: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Annual Fee (₹)*</label>
                  <input
                    type="number"
                    required
                    value={applyForm.annualTuitionFee}
                    onChange={(e) => setApplyForm({ ...applyForm, annualTuitionFee: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Scholarship Endowment Scheme</label>
                <select
                  value={applyForm.scholarshipScheme}
                  onChange={(e) => setApplyForm({ ...applyForm, scholarshipScheme: e.target.value })}
                  className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                >
                  <option value="Sangam Young Talent & School Kit Endowment">
                    Sangam Young Talent & School Kit Endowment (₹15,000/yr)
                  </option>
                  <option value="Sangam Merit-cum-Means Higher Education Grant">
                    Sangam Merit-cum-Means Higher Education Grant (₹25,000 - ₹50,000/yr)
                  </option>
                  <option value="Professional Degree & Engineering Fellowship">
                    Professional Degree & Engineering Fellowship (₹50,000 - ₹75,000/yr)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Parent / Guardian Name & Occupation*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Er. S. Karthikeyan (Software Director)"
                    value={applyForm.parentName}
                    onChange={(e) => setApplyForm({ ...applyForm, parentName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Native District</label>
                  <input
                    type="text"
                    value={applyForm.nativeDistrict}
                    onChange={(e) => setApplyForm({ ...applyForm, nativeDistrict: e.target.value })}
                    className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Disbursement Bank Account Details</label>
                <input
                  type="text"
                  placeholder="e.g. SBI A/c 39201938102 (IFSC: SBIN0000845, Kanchipuram Branch)"
                  value={applyForm.bankAccount}
                  onChange={(e) => setApplyForm({ ...applyForm, bankAccount: e.target.value })}
                  className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 font-medium"
                />
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-[11px] text-zinc-600 dark:text-zinc-400">
                ✓ Member Verification: As a registered Mudaliyar Sangam member, your application will be reviewed by the Educational Endowment Trustee Committee within 5 business days.
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Review Application Modal */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Admin Review: Scholarship</h3>
            <p className="text-sm font-semibold">{reviewApp.studentName}</p>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Approved Grant Amount (₹)</label>
                <input
                  type="number"
                  value={reviewForm.approvedAmount}
                  onChange={(e) => setReviewForm({...reviewForm, approvedAmount: Number(e.target.value)})}
                  className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Admin Remarks / Notes</label>
                <textarea
                  value={reviewForm.adminRemarks}
                  onChange={(e) => setReviewForm({...reviewForm, adminRemarks: e.target.value})}
                  className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800"
                  rows={3}
                  placeholder="Add approval or rejection notes here..."
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewApp(null)}
                className="px-3 py-1.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => submitReview('rejected')}
                className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => submitReview('approved')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Post a Job Opening</h3>
              <button
                type="button"
                onClick={() => setIsPostJobModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold"
              >✕</button>
            </div>

            <form onSubmit={handleJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Job Title</label>
                <input required type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800" placeholder="e.g. Senior Accountant" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Company Name</label>
                  <input required type="text" value={jobForm.companyName} onChange={e => setJobForm({...jobForm, companyName: e.target.value})} className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Location</label>
                  <input required type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Job Type</label>
                  <select value={jobForm.jobType} onChange={e => setJobForm({...jobForm, jobType: e.target.value as any})} className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Salary Range</label>
                  <input required type="text" value={jobForm.salaryRange} onChange={e => setJobForm({...jobForm, salaryRange: e.target.value})} placeholder="e.g. ₹3L - ₹5L P.A." className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Experience</label>
                  <input required type="text" value={jobForm.experienceRequired} onChange={e => setJobForm({...jobForm, experienceRequired: e.target.value})} placeholder="e.g. 2+ Years" className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea required value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800" rows={3}></textarea>
              </div>
              <div>
                <label className="font-semibold block mb-1">Contact Email</label>
                <input required type="email" value={jobForm.contactEmail} onChange={e => setJobForm({...jobForm, contactEmail: e.target.value})} className="w-full p-2 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsPostJobModalOpen(false)} className="px-4 py-2 rounded-xl text-zinc-700 bg-zinc-100 hover:bg-zinc-200 font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer">Post Job for Approval</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
