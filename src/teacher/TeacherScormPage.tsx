import axios from 'axios';
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { requestUploadUrl, saveScormCourse } from './courseApi';

const DRAFT_KEY = 'teacher-scorm-draft-v2';
const fieldClassName =
  'w-full rounded-xl border border-[#D8DEE9] bg-white px-4 py-3 text-sm text-[#2E3440] outline-none transition focus:border-[#88C0D0] focus:ring-4 focus:ring-[#88C0D0]/20 placeholder:text-[#94A3B8]';
const textAreaClassName = `${fieldClassName} min-h-28 resize-y`;

type Section = 'chapters' | 'course-info' | 'settings' | 'metadata' | 'preview';
type ContentType = 'video' | 'slides' | 'pdf' | 'images';

type UploadTile = {
  id: ContentType;
  title: string;
  subtitle: string;
  accept: string;
  multiple?: boolean;
};

type Asset = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  fileUrl?: string;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed';
  uploadProgress: number;
  errorMessage?: string;
};

type Question = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
};

type Chapter = {
  id: string;
  order: number;
  title: string;
  description: string;
  durationMinutes: number;
  content: Record<ContentType, Asset[]>;
  questions: Question[];
};

type Draft = {
  courseInfo: {
    title: string;
    subtitle: string;
    description: string;
    category: string;
    level: string;
    language: string;
    estimatedHours: string;
  };
  settings: {
    navigationMode: 'linear' | 'free';
    passScore: number;
    allowRetakes: boolean;
    trackTimeSpent: boolean;
  };
  metadata: {
    identifier: string;
    version: string;
    author: string;
    keywords: string;
    notes: string;
  };
  chapters: Chapter[];
  updatedAt: string | null;
};

type Notice = { tone: 'info' | 'success' | 'warning'; title: string; message: string };

const uploadTiles: UploadTile[] = [
  { id: 'video', title: 'Upload Video', subtitle: 'Lecture recording, walkthroughs, or instructor intro', accept: 'video/*' },
  { id: 'slides', title: 'Upload Slides', subtitle: 'Decks for guided learning and structured delivery', accept: '.ppt,.pptx,.pdf,.key' },
  { id: 'pdf', title: 'Upload PDF', subtitle: 'Handouts, readings, or printable support material', accept: '.pdf' },
  { id: 'images', title: 'Upload Images', subtitle: 'Screenshots, diagrams, and chapter visuals', accept: 'image/*', multiple: true },
];

const sectionLabels: Record<Section, string> = {
  chapters: 'Chapters',
  'course-info': 'Course Info',
  settings: 'Settings',
  metadata: 'Metadata',
  preview: 'Preview Course',
};

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const createQuestion = (): Question => {
  const a = createId('option');
  const b = createId('option');
  return {
    id: createId('question'),
    prompt: '',
    options: [
      { id: a, text: 'Option A' },
      { id: b, text: 'Option B' },
    ],
    correctOptionId: a,
    explanation: '',
  };
};

const createAssetFromFile = (file: File): Asset => ({
  id: createId('asset'),
  name: file.name,
  size: file.size,
  type: file.type || 'application/octet-stream',
  uploadedAt: new Date().toISOString(),
  uploadStatus: 'pending',
  uploadProgress: 0,
});

const createChapter = (order: number): Chapter => ({
  id: createId('chapter'),
  order,
  title: order === 1 ? 'Introduction to the Course' : '',
  description: '',
  durationMinutes: 15,
  content: { video: [], slides: [], pdf: [], images: [] },
  questions: [],
});

const createInitialDraft = (): Draft => {
  const chapterOne = createChapter(1);
  chapterOne.description = 'Welcome learners and explain what they should expect from the course.';
  chapterOne.content.video = [{
    id: createId('asset'),
    name: 'intro-video.mp4',
    size: 48_000_000,
    type: 'video/mp4',
    uploadedAt: new Date().toISOString(),
    fileUrl: 'https://demo-bucket.s3.filebase.com/courses/demo-course/intro-video.mp4',
    uploadStatus: 'uploaded',
    uploadProgress: 100,
  }];
  chapterOne.content.slides = [{
    id: createId('asset'),
    name: 'overview-slides.pdf',
    size: 3_500_000,
    type: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    fileUrl: 'https://demo-bucket.s3.filebase.com/courses/demo-course/overview-slides.pdf',
    uploadStatus: 'uploaded',
    uploadProgress: 100,
  }];
  chapterOne.questions = [createQuestion()];
  chapterOne.questions[0].prompt = 'What should learners understand after the introduction?';
  chapterOne.questions[0].options[0].text = 'The overall course structure and goals';
  chapterOne.questions[0].options[1].text = 'Only the final exam answers';

  const chapterTwo = createChapter(2);
  chapterTwo.title = 'Core Concepts';
  chapterTwo.description = 'Break down the essential concepts and supporting materials.';
  chapterTwo.durationMinutes = 30;
  chapterTwo.content.pdf = [{
    id: createId('asset'),
    name: 'concept-notes.pdf',
    size: 820_000,
    type: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    fileUrl: 'https://demo-bucket.s3.filebase.com/courses/demo-course/concept-notes.pdf',
    uploadStatus: 'uploaded',
    uploadProgress: 100,
  }];

  return {
    courseInfo: {
      title: 'Data Analysis Foundations',
      subtitle: 'A practical introduction to modern analysis workflows',
      description: 'Guide students through the building blocks of data analysis with lectures, slides, activities, and assessments.',
      category: 'Data & Analytics',
      level: 'Beginner',
      language: 'English',
      estimatedHours: '4',
    },
    settings: { navigationMode: 'linear', passScore: 80, allowRetakes: true, trackTimeSpent: true },
    metadata: { identifier: 'course-data-analysis-foundations', version: '1.0.0', author: 'Teacher Team', keywords: 'data analysis, fundamentals', notes: 'Frontend-first draft mode.' },
    chapters: [chapterOne, chapterTwo],
    updatedAt: null,
  };
};

const normalizeAsset = (asset: Asset): Asset => ({
  ...asset,
  uploadStatus: asset.uploadStatus ?? (asset.fileUrl ? 'uploaded' : 'pending'),
  uploadProgress: asset.uploadProgress ?? (asset.fileUrl ? 100 : 0),
  fileUrl: asset.fileUrl,
  errorMessage: asset.errorMessage,
});

const normalizeDraft = (draft: Draft): Draft => ({
  ...draft,
  chapters: draft.chapters.map((chapter) => ({
    ...chapter,
    content: {
      video: chapter.content.video.map(normalizeAsset),
      slides: chapter.content.slides.map(normalizeAsset),
      pdf: chapter.content.pdf.map(normalizeAsset),
      images: chapter.content.images.map(normalizeAsset),
    },
  })),
});

const assetCount = (chapter: Chapter) => Object.values(chapter.content).reduce((total, assets) => total + assets.length, 0);
const chapterComplete = (chapter: Chapter) => chapter.title.trim() && chapter.description.trim() && assetCount(chapter) > 0;
const fileSize = (size: number) => (size >= 1_000_000 ? `${(size / 1_000_000).toFixed(1)} MB` : size >= 1_000 ? `${(size / 1_000).toFixed(1)} KB` : `${size} B`);

function CardHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[#2E3440]">{title}</h2>
        <p className="mt-1 text-sm text-[#4C566A]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#2E3440]">{label}</span>
      {children}
    </label>
  );
}

export default function TeacherScormPage() {
  const initialDraft = normalizeDraft(createInitialDraft());
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [activeSection, setActiveSection] = useState<Section>('chapters');
  const [activeChapterId, setActiveChapterId] = useState(initialDraft.chapters[0].id);
  const [notice, setNotice] = useState<Notice | null>({ tone: 'info', title: 'Frontend draft mode', message: 'This page now behaves like a working SCORM builder on the frontend with local persistence and mock generation.' });
  const [isDirty, setIsDirty] = useState(false);
  const [savedCourseAt, setSavedCourseAt] = useState<string | null>(null);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [uploadSummary, setUploadSummary] = useState<{ total: number; completed: number } | null>(null);
  const fileInputRefs = useRef<Record<ContentType, HTMLInputElement | null>>({ video: null, slides: null, pdf: null, images: null });
  const pendingFilesRef = useRef<Record<string, File>>({});
  const draftRef = useRef<Draft>(initialDraft);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const parsed = normalizeDraft(JSON.parse(saved) as Draft);
      if (parsed.chapters?.length) {
        setDraft(parsed);
        draftRef.current = parsed;
        setActiveChapterId(parsed.chapters[0].id);
        setNotice({ tone: 'info', title: 'Draft restored', message: 'A saved draft was loaded from local storage.' });
      }
    } catch {
      setNotice({ tone: 'warning', title: 'Saved draft could not be restored', message: 'A fresh draft was loaded because local storage contained invalid data.' });
    }
  }, []);

  const updateDraft = (updater: (current: Draft) => Draft) => {
    setDraft((current) => {
      const nextDraft = { ...updater(current), updatedAt: new Date().toISOString() };
      draftRef.current = nextDraft;
      return nextDraft;
    });
    setIsDirty(true);
  };

  const activeChapter = draft.chapters.find((chapter) => chapter.id === activeChapterId) ?? draft.chapters[0];
  const validations = [
    { label: 'Course basics', description: 'Add title, category, and description.', complete: Boolean(draft.courseInfo.title.trim() && draft.courseInfo.category.trim() && draft.courseInfo.description.trim()), targetSection: 'course-info' as Section },
    { label: 'Chapter content', description: 'At least one chapter should include content and description.', complete: draft.chapters.some((chapter) => Boolean(chapterComplete(chapter))), targetSection: 'chapters' as Section },
    { label: 'Delivery settings', description: 'Define pass score and navigation.', complete: draft.settings.passScore > 0, targetSection: 'settings' as Section },
    { label: 'SCORM metadata', description: 'Provide identifier, version, and author.', complete: Boolean(draft.metadata.identifier.trim() && draft.metadata.version.trim() && draft.metadata.author.trim()), targetSection: 'metadata' as Section },
  ];
  const completedSections = validations.filter((item) => item.complete).length;

  const updateChapter = (chapterId: string, updater: (chapter: Chapter) => Chapter) => {
    updateDraft((current) => ({ ...current, chapters: current.chapters.map((chapter) => chapter.id === chapterId ? updater(chapter) : chapter) }));
  };

  const updateAssetState = (
    chapterId: string,
    contentType: ContentType,
    assetId: string,
    updater: (asset: Asset) => Asset,
  ) => {
    setDraft((current) => {
      const nextDraft: Draft = {
        ...current,
        chapters: current.chapters.map((chapter) =>
          chapter.id === chapterId
            ? {
                ...chapter,
                content: {
                  ...chapter.content,
                  [contentType]: chapter.content[contentType].map((asset) =>
                    asset.id === assetId ? updater(asset) : asset,
                  ),
                },
              }
            : chapter,
        ),
      };

      draftRef.current = nextDraft;
      return nextDraft;
    });
  };

  const buildCourseId = (currentDraft: Draft) =>
    currentDraft.metadata.identifier.trim() || slugify(currentDraft.courseInfo.title || 'untitled-course');

  const addChapter = () => {
    const chapter = createChapter(draft.chapters.length + 1);
    updateDraft((current) => ({ ...current, chapters: [...current.chapters, chapter] }));
    setActiveChapterId(chapter.id);
    setActiveSection('chapters');
  };

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setIsDirty(false);
    setNotice({ tone: 'success', title: 'Draft saved locally', message: 'The SCORM draft is saved in local storage so you can continue before backend integration.' });
  };

  const saveCourse = async () => {
    const incomplete = validations.find((item) => !item.complete);
    if (incomplete) {
      setActiveSection(incomplete.targetSection);
      setNotice({ tone: 'warning', title: 'Save blocked', message: `${incomplete.label} still needs attention before the course can be prepared for upload.` });
      return;
    }

    const currentDraft = draftRef.current;
    const courseId = buildCourseId(currentDraft);
    const assetsToUpload = currentDraft.chapters.flatMap((chapter) =>
      (Object.entries(chapter.content) as Array<[ContentType, Asset[]]>).flatMap(([contentType, assets]) =>
        assets
          .filter((asset) => !asset.fileUrl)
          .map((asset) => ({
            chapterId: chapter.id,
            chapterOrder: chapter.order,
            contentType,
            asset,
          })),
      ),
    );

    try {
      setIsSavingCourse(true);
      setUploadSummary({
        total: assetsToUpload.length,
        completed: 0,
      });
      setNotice({
        tone: 'info',
        title: 'Uploading course files',
        message:
          assetsToUpload.length > 0
            ? 'Uploading selected files directly to Filebase. Please keep this page open.'
            : 'No new files need uploading. Saving course data to the backend now.',
      });

      let completedUploads = 0;

      for (const item of assetsToUpload) {
        const localFile = pendingFilesRef.current[item.asset.id];

        if (!localFile) {
          throw new Error(`Missing local file for ${item.asset.name}. Please reselect the file and try again.`);
        }

        updateAssetState(item.chapterId, item.contentType, item.asset.id, (asset) => ({
          ...asset,
          uploadStatus: 'uploading',
          uploadProgress: 0,
          errorMessage: undefined,
        }));

        const { uploadUrl, fileUrl } = await requestUploadUrl({
          fileName: localFile.name,
          fileType: localFile.type || item.asset.type,
          courseId,
        });

        await axios.put(uploadUrl, localFile, {
          headers: {
            'Content-Type': localFile.type || item.asset.type,
          },
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) {
              return;
            }

            const uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);

            updateAssetState(item.chapterId, item.contentType, item.asset.id, (asset) => ({
              ...asset,
              uploadStatus: 'uploading',
              uploadProgress,
              errorMessage: undefined,
            }));
          },
        });

        updateAssetState(item.chapterId, item.contentType, item.asset.id, (asset) => ({
          ...asset,
          fileUrl,
          uploadStatus: 'uploaded',
          uploadProgress: 100,
          errorMessage: undefined,
        }));

        delete pendingFilesRef.current[item.asset.id];
        completedUploads += 1;
        setUploadSummary({
          total: assetsToUpload.length,
          completed: completedUploads,
        });
      }

      const draftAfterUploads = draftRef.current;
      const payload = {
        courseId,
        courseInfo: draftAfterUploads.courseInfo,
        settings: draftAfterUploads.settings,
        metadata: {
          ...draftAfterUploads.metadata,
          identifier: courseId,
        },
        chapters: draftAfterUploads.chapters.map((chapter) => ({
          order: chapter.order,
          title: chapter.title,
          description: chapter.description,
          durationMinutes: chapter.durationMinutes,
          assets: (Object.entries(chapter.content) as Array<[ContentType, Asset[]]>).flatMap(
            ([contentType, assets]) =>
              assets.map((asset) => ({
                contentType,
                fileName: asset.name,
                fileType: asset.type,
                fileSize: asset.size,
                fileUrl: asset.fileUrl || '',
                uploadedAt: asset.uploadedAt,
              })),
          ),
          questions: chapter.questions.map((question) => ({
            prompt: question.prompt,
            explanation: question.explanation,
            options: question.options.map((option) => option.text),
            correctOptionId: question.correctOptionId,
          })),
        })),
      };

      const response = await saveScormCourse(payload);
      const freshDraft = normalizeDraft(createInitialDraft());

      setDraft(freshDraft);
      draftRef.current = freshDraft;
      pendingFilesRef.current = {};
      localStorage.removeItem(DRAFT_KEY);
      setActiveChapterId(freshDraft.chapters[0].id);
      setActiveSection('chapters');
      setSavedCourseAt(new Date().toISOString());
      setIsDirty(false);
      setNotice({
        tone: 'success',
        title: 'Course saved successfully',
        message: response.message || 'All files were uploaded to Filebase and the course was saved to studuy-api.',
      });
      setUploadSummary(null);
    } catch (error) {
      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.error || error.message
          : error instanceof Error
            ? error.message
            : 'Course upload failed. Please try again.';

      setUploadSummary(null);
      setNotice({
        tone: 'warning',
        title: 'Upload failed',
        message,
      });
    } finally {
      setIsSavingCourse(false);
    }
  };

  const openPicker = (contentType: ContentType) => {
    fileInputRefs.current[contentType]?.click();
  };

  const handleFiles = (contentType: ContentType, event: ChangeEvent<HTMLInputElement>) => {
    if (!activeChapter) return;
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const assets = files.map((file) => {
      const asset = createAssetFromFile(file);
      pendingFilesRef.current[asset.id] = file;
      return asset;
    });

    updateChapter(activeChapter.id, (chapter) => ({
      ...chapter,
      content: {
        ...chapter.content,
        [contentType]: [
          ...chapter.content[contentType],
          ...assets,
        ],
      },
    }));

    event.target.value = '';
  };

  const removeAsset = (contentType: ContentType, assetId: string) => {
    if (!activeChapter) return;
    delete pendingFilesRef.current[assetId];
    updateChapter(activeChapter.id, (chapter) => ({
      ...chapter,
      content: {
        ...chapter.content,
        [contentType]: chapter.content[contentType].filter((asset) => asset.id !== assetId),
      },
    }));
  };

  const addQuestion = () => {
    if (!activeChapter) return;
    updateChapter(activeChapter.id, (chapter) => ({
      ...chapter,
      questions: [...chapter.questions, createQuestion()],
    }));
  };

  const updateQuestion = (questionId: string, updater: (question: Question) => Question) => {
    if (!activeChapter) return;
    updateChapter(activeChapter.id, (chapter) => ({
      ...chapter,
      questions: chapter.questions.map((question) =>
        question.id === questionId ? updater(question) : question,
      ),
    }));
  };

  const removeQuestion = (questionId: string) => {
    if (!activeChapter) return;
    updateChapter(activeChapter.id, (chapter) => ({
      ...chapter,
      questions: chapter.questions.filter((question) => question.id !== questionId),
    }));
  };

  const addOption = (questionId: string) => {
    updateQuestion(questionId, (question) => ({
      ...question,
      options: [
        ...question.options,
        { id: createId('option'), text: `Option ${String.fromCharCode(65 + question.options.length)}` },
      ],
    }));
  };

  const removeOption = (questionId: string, optionId: string) => {
    updateQuestion(questionId, (question) => {
      if (question.options.length <= 2) return question;
      const options = question.options.filter((option) => option.id !== optionId);
      return {
        ...question,
        options,
        correctOptionId:
          question.correctOptionId === optionId ? options[0]?.id ?? '' : question.correctOptionId,
      };
    });
  };

  function formatTimestamp(updatedAt: string | null): ReactNode {
    if (!updatedAt) return 'Never';
    const date = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
  return (
    <div className="min-h-screen bg-[#ECEFF4] text-[#2E3440]">
      <header className="sticky top-0 z-20 border-b border-[#D8DEE9] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[1.375rem] font-semibold tracking-[-0.02em] text-[#2E3440]">
              Create SCORM Course
            </p>
            <p className="text-sm text-[#4C566A]">
              Fully functional frontend authoring flow before backend packaging is connected
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={isSavingCourse} onClick={saveDraft} className="rounded-xl border border-[#D8DEE9] bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#2E3440] disabled:cursor-not-allowed disabled:opacity-60">
              Save Draft
            </button>
            <button type="button" disabled={isSavingCourse} onClick={saveCourse} className="rounded-xl bg-[#88C0D0] px-4 py-2 text-sm font-semibold text-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60">
              {isSavingCourse ? 'Uploading...' : 'Save Course'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1280px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-5 self-start rounded-[1.25rem] border border-[#D8DEE9] bg-white p-4 shadow-[0_18px_50px_rgba(94,129,172,0.08)]">
          <nav className="space-y-2">
            {(Object.keys(sectionLabels) as Section[]).map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeSection === section ? 'bg-[#5E81AC] text-white' : 'text-[#2E3440] hover:bg-[#F4F7FB]'
                }`}
              >
                {sectionLabels[section]}
              </button>
            ))}
          </nav>

          <div className="border-t border-[#D8DEE9] pt-5">
            <div className="rounded-2xl border border-[#88C0D0] bg-[#EAF8FC] p-4">
              <p className="text-sm font-medium text-[#2E3440]">Course Progress</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#D8DEE9]">
                <div className="h-full rounded-full bg-[#5E81AC]" style={{ width: `${(completedSections / 4) * 100}%` }} />
              </div>
              <p className="mt-3 text-xs text-[#4C566A]">{completedSections} of 4 sections ready</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8DEE9] bg-[#FBFCFE] p-4">
            <h3 className="text-sm font-semibold text-[#2E3440]">Draft Health</h3>
            <div className="mt-3 space-y-2 text-sm text-[#4C566A]">
              <div className="flex items-center justify-between"><span>Status</span><span className={`font-semibold ${isDirty ? 'text-[#9A6700]' : 'text-[#008236]'}`}>{isDirty ? 'Unsaved changes' : 'Saved locally'}</span></div>
              <div className="flex items-center justify-between"><span>Assets</span><span className="font-semibold text-[#2E3440]">{draft.chapters.reduce((total, chapter) => total + assetCount(chapter), 0)}</span></div>
              <div className="flex items-center justify-between"><span>Questions</span><span className="font-semibold text-[#2E3440]">{draft.chapters.reduce((total, chapter) => total + chapter.questions.length, 0)}</span></div>
              <div className="flex items-center justify-between"><span>Last Update</span><span className="font-semibold text-[#2E3440]">{formatTimestamp(draft.updatedAt)}</span></div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {notice ? (
            <div className={`rounded-2xl border px-4 py-4 ${notice.tone === 'success' ? 'border-[#B7E1C2] bg-[#F0FDF4]' : notice.tone === 'warning' ? 'border-[#F3D7A6] bg-[#FFF9E8]' : 'border-[#BFE2EC] bg-[#EFFBFE]'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#2E3440]">{notice.title}</p>
                  <p className="mt-1 text-sm text-[#4C566A]">{notice.message}</p>
                </div>
                <button type="button" onClick={() => setNotice(null)} className="rounded-lg px-2 py-1 text-sm text-[#4C566A]">Close</button>
              </div>
            </div>
          ) : null}

          {uploadSummary && isSavingCourse ? (
            <div className="rounded-2xl border border-[#BFE2EC] bg-[#EFFBFE] px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#2E3440]">Direct upload in progress</p>
                  <p className="mt-1 text-sm text-[#4C566A]">
                    Uploaded {uploadSummary.completed} of {uploadSummary.total} new file{uploadSummary.total === 1 ? '' : 's'} directly to Filebase.
                  </p>
                </div>
                <div className="h-2 w-full max-w-52 overflow-hidden rounded-full bg-[#D8DEE9]">
                  <div
                    className="h-full rounded-full bg-[#5E81AC] transition-all"
                    style={{
                      width:
                        uploadSummary.total > 0
                          ? `${(uploadSummary.completed / uploadSummary.total) * 100}%`
                          : '100%',
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'chapters' ? (
            <section className="space-y-6">
              <div className="rounded-[1.35rem] border border-[#D8DEE9] bg-white p-5 shadow-[0_18px_50px_rgba(94,129,172,0.08)] sm:p-6">
                <CardHeader
                  title="Course Chapters"
                  description="Manage chapter order, choose an active chapter, and keep the course structure organized."
                  action={<button type="button" onClick={addChapter} className="rounded-xl bg-[#5E81AC] px-4 py-2 text-sm font-semibold text-white">Add Chapter</button>}
                />

                <div className="mt-5 space-y-3">
                  {draft.chapters.map((chapter, index) => (
                    <div key={chapter.id} className={`rounded-2xl border p-5 ${chapter.id === activeChapter?.id ? 'border-[#5E81AC] bg-[#F8FBFF]' : 'border-[#D8DEE9] bg-white'}`}>
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <button type="button" onClick={() => setActiveChapterId(chapter.id)} className="flex-1 text-left">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-medium text-[#4C566A]">Chapter {chapter.order}</span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${chapterComplete(chapter) ? 'bg-[#DCFCE7] text-[#008236]' : assetCount(chapter) || chapter.description ? 'bg-[#FEF3C7] text-[#9A6700]' : 'bg-[#ECEFF4] text-[#4C566A]'}`}>{chapterComplete(chapter) ? 'Complete' : assetCount(chapter) || chapter.description ? 'In Progress' : 'Draft'}</span>
                          </div>
                          <h3 className="mt-2 text-lg font-semibold text-[#2E3440]">{chapter.title || 'Untitled Chapter'}</h3>
                          <p className="mt-3 text-sm text-[#4C566A]">{chapter.durationMinutes} min • {assetCount(chapter)} assets • {chapter.questions.length} questions</p>
                        </button>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => updateDraft((current) => { const next = [...current.chapters]; if (index === 0) return current; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return { ...current, chapters: next.map((item, position) => ({ ...item, order: position + 1 })) }; })} className="rounded-xl border border-[#D8DEE9] px-3 py-2 text-xs font-medium text-[#2E3440]">Up</button>
                          <button type="button" onClick={() => updateDraft((current) => { const next = [...current.chapters]; if (index === next.length - 1) return current; [next[index + 1], next[index]] = [next[index], next[index + 1]]; return { ...current, chapters: next.map((item, position) => ({ ...item, order: position + 1 })) }; })} className="rounded-xl border border-[#D8DEE9] px-3 py-2 text-xs font-medium text-[#2E3440]">Down</button>
                          <button type="button" onClick={() => { const copy = { ...chapter, id: createId('chapter'), title: `${chapter.title || 'Untitled Chapter'} Copy`, order: draft.chapters.length + 1, content: { video: [...chapter.content.video], slides: [...chapter.content.slides], pdf: [...chapter.content.pdf], images: [...chapter.content.images] }, questions: chapter.questions.map((question) => ({ ...question, id: createId('question'), options: question.options.map((option) => ({ ...option, id: createId('option') })) })) }; updateDraft((current) => ({ ...current, chapters: [...current.chapters, copy] })); setActiveChapterId(copy.id); }} className="rounded-xl border border-[#D8DEE9] px-3 py-2 text-xs font-medium text-[#2E3440]">Duplicate</button>
                          <button type="button" onClick={() => { if (draft.chapters.length === 1) return; if (!window.confirm(`Delete "${chapter.title || 'Untitled Chapter'}"?`)) return; updateDraft((current) => { const remaining = current.chapters.filter((item) => item.id !== chapter.id).map((item, position) => ({ ...item, order: position + 1 })); setActiveChapterId(remaining[0].id); return { ...current, chapters: remaining }; }); }} className="rounded-xl border border-[#F1C8C8] px-3 py-2 text-xs font-medium text-[#B91C1C]">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeChapter ? (
                <div className="rounded-[1.35rem] border border-[#D8DEE9] bg-white p-5 shadow-[0_18px_50px_rgba(94,129,172,0.08)] sm:p-6">
                  <CardHeader title={`Chapter Details${activeChapter.title ? `: ${activeChapter.title}` : ''}`} description="Edit the active chapter, attach content, and build a quiz flow." />

                  <div className="mt-6 space-y-4">
                    <Field label="Chapter Title"><input className={fieldClassName} value={activeChapter.title} onChange={(event) => updateChapter(activeChapter.id, (chapter) => ({ ...chapter, title: event.target.value }))} placeholder="e.g., Introduction to Data Analysis" /></Field>
                    <Field label="Description"><textarea className={textAreaClassName} value={activeChapter.description} onChange={(event) => updateChapter(activeChapter.id, (chapter) => ({ ...chapter, description: event.target.value }))} placeholder="What should students learn in this chapter?" /></Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Duration (minutes)"><input type="number" min="1" className={fieldClassName} value={activeChapter.durationMinutes} onChange={(event) => updateChapter(activeChapter.id, (chapter) => ({ ...chapter, durationMinutes: Math.max(1, Number(event.target.value) || chapter.durationMinutes) }))} /></Field>
                      <Field label="Order"><input type="number" min="1" max={draft.chapters.length} className={fieldClassName} value={activeChapter.order} onChange={(event) => { const requested = Math.max(1, Number(event.target.value) || activeChapter.order); updateDraft((current) => { const chapters = [...current.chapters]; const currentIndex = chapters.findIndex((chapter) => chapter.id === activeChapter.id); const [chapter] = chapters.splice(currentIndex, 1); chapters.splice(Math.min(requested - 1, chapters.length), 0, chapter); return { ...current, chapters: chapters.map((item, position) => ({ ...item, order: position + 1 })) }; }); }} /></Field>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#D8DEE9] pt-6">
                    <div className="mb-4"><h3 className="text-lg font-semibold text-[#2E3440]">Chapter Content</h3><p className="mt-1 text-sm text-[#4C566A]">Upload one or more content types. Each card opens the native file picker.</p></div>
                    <div className="grid gap-3 md:grid-cols-2 md:[grid-auto-rows:1fr]">
                      {uploadTiles.map((tile) => {
                        const count = activeChapter.content[tile.id].length;
                        return (
                          <div key={tile.id} className="h-full">
                            <input ref={(element) => { fileInputRefs.current[tile.id] = element; }} type="file" accept={tile.accept} multiple={tile.multiple} className="hidden" onChange={(event) => handleFiles(tile.id, event)} />
                            <button type="button" onClick={() => openPicker(tile.id)} className={`flex h-full min-h-[196px] w-full flex-col items-center justify-center rounded-2xl border px-6 py-7 text-center transition ${count > 0 ? 'border-[#88C0D0] bg-[#88C0D0] text-[#1E293B] shadow-[0_18px_40px_rgba(136,192,208,0.28)]' : 'border-[#D8DEE9] bg-[#ECEFF4] text-[#2E3440] hover:border-[#B8C6D8] hover:bg-[#E6ECF5]'}`}>
                              <div className="mb-3 rounded-full bg-white/80 px-4 py-3 text-sm font-semibold">{tile.title.replace('Upload ', '')}</div>
                              <p className="text-base font-semibold">{tile.title}</p>
                              <p className={`mt-2 max-w-[18rem] text-sm leading-6 ${count > 0 ? 'text-[#27485A]' : 'text-[#4C566A]'}`}>{tile.subtitle}</p>
                              <p className={`mt-3 text-xs font-medium ${count > 0 ? 'text-[#27485A]' : 'text-[#5E81AC]'}`}>{count > 0 ? `${count} file${count > 1 ? 's' : ''} attached` : `Click to upload${tile.multiple ? ' files' : ''}`}</p>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                      {uploadTiles.map((tile) => (
                        <div key={tile.id} className="rounded-2xl border border-[#D8DEE9] bg-[#FBFCFE] p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div><h4 className="text-sm font-semibold text-[#2E3440]">{tile.title}</h4><p className="mt-1 text-xs text-[#4C566A]">{activeChapter.content[tile.id].length > 0 ? `${activeChapter.content[tile.id].length} file${activeChapter.content[tile.id].length > 1 ? 's' : ''} queued` : 'No files attached yet'}</p></div>
                            <button type="button" disabled={isSavingCourse} onClick={() => openPicker(tile.id)} className="rounded-lg border border-[#D8DEE9] px-3 py-2 text-xs font-medium text-[#2E3440] disabled:cursor-not-allowed disabled:opacity-60">Add More</button>
                          </div>
                          <div className="mt-4 space-y-2">
                            {activeChapter.content[tile.id].length > 0 ? activeChapter.content[tile.id].map((asset) => (
                              <div key={asset.id} className="rounded-xl border border-[#E6ECF2] bg-white px-3 py-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[#2E3440]">{asset.name}</p>
                                    <p className="mt-1 text-xs text-[#4C566A]">{fileSize(asset.size)} • {new Date(asset.uploadedAt).toLocaleDateString()}</p>
                                    <p className={`mt-1 text-xs font-medium ${
                                      asset.uploadStatus === 'uploaded'
                                        ? 'text-[#008236]'
                                        : asset.uploadStatus === 'failed'
                                          ? 'text-[#B91C1C]'
                                          : asset.uploadStatus === 'uploading'
                                            ? 'text-[#1D4ED8]'
                                            : 'text-[#9A6700]'
                                    }`}>
                                      {asset.uploadStatus === 'uploaded'
                                        ? 'Uploaded to Filebase'
                                        : asset.uploadStatus === 'failed'
                                          ? asset.errorMessage || 'Upload failed'
                                          : asset.uploadStatus === 'uploading'
                                            ? `Uploading... ${asset.uploadProgress}%`
                                            : 'Pending upload'}
                                    </p>
                                  </div>
                                  <button type="button" disabled={isSavingCourse} onClick={() => removeAsset(tile.id, asset.id)} className="rounded-lg border border-[#F1C8C8] px-3 py-2 text-xs font-medium text-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60">Remove</button>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      asset.uploadStatus === 'uploaded'
                                        ? 'bg-[#22C55E]'
                                        : asset.uploadStatus === 'failed'
                                          ? 'bg-[#EF4444]'
                                          : 'bg-[#5E81AC]'
                                    }`}
                                    style={{ width: `${asset.uploadStatus === 'failed' ? 100 : asset.uploadProgress}%` }}
                                  />
                                </div>
                                {asset.fileUrl ? (
                                  <a
                                    href={asset.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex text-xs font-medium text-[#1D4ED8] hover:underline"
                                  >
                                    Open uploaded file
                                  </a>
                                ) : null}
                              </div>
                            )) : <div className="rounded-xl border border-dashed border-[#D8DEE9] px-4 py-5 text-center text-sm text-[#94A3B8]">Uploaded files will appear here for this chapter.</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 rounded-[1.35rem] border border-[#D8DEE9] p-4 sm:p-5">
                    <CardHeader title="Quiz / Assessment" description="Build local quiz questions and correct answers for the active chapter." action={<button type="button" onClick={addQuestion} className="rounded-xl bg-[#5E81AC] px-4 py-2 text-sm font-semibold text-white">Add Question</button>} />
                    {activeChapter.questions.length > 0 ? (
                      <div className="mt-5 space-y-4">
                        {activeChapter.questions.map((question, questionIndex) => (
                          <div key={question.id} className="rounded-2xl border border-[#D8DEE9] bg-[#FBFCFE] p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div><p className="text-sm font-semibold text-[#2E3440]">Question {questionIndex + 1}</p><p className="mt-1 text-sm text-[#4C566A]">Configure the prompt, answer set, and explanation.</p></div>
                              <button type="button" onClick={() => removeQuestion(question.id)} className="rounded-xl border border-[#F1C8C8] px-3 py-2 text-sm font-medium text-[#B91C1C]">Delete</button>
                            </div>
                            <div className="mt-5 space-y-4">
                              <Field label="Prompt"><textarea className={textAreaClassName} value={question.prompt} onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, prompt: event.target.value }))} placeholder="Write the question students should answer." /></Field>
                              <Field label="Explanation"><textarea className={textAreaClassName} value={question.explanation} onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, explanation: event.target.value }))} placeholder="Optional explanation shown after answering." /></Field>
                              <div className="rounded-2xl border border-[#D8DEE9] bg-white p-4">
                                <div className="flex items-center justify-between gap-4">
                                  <div><h4 className="text-sm font-semibold text-[#2E3440]">Answer Options</h4><p className="mt-1 text-xs text-[#4C566A]">Choose the correct answer for this question.</p></div>
                                  <button type="button" onClick={() => addOption(question.id)} className="rounded-lg border border-[#D8DEE9] px-3 py-2 text-xs font-medium text-[#2E3440]">Add Option</button>
                                </div>
                                <div className="mt-4 space-y-3">
                                  {question.options.map((option) => (
                                    <div key={option.id} className="grid gap-3 rounded-xl border border-[#E6ECF2] bg-[#FBFCFE] p-3 md:grid-cols-[auto_minmax(0,1fr)_auto]">
                                      <label className="flex items-center gap-2 text-sm font-medium text-[#2E3440]">
                                        <input type="radio" name={`correct-${question.id}`} checked={question.correctOptionId === option.id} onChange={() => updateQuestion(question.id, (current) => ({ ...current, correctOptionId: option.id }))} className="h-4 w-4 border-[#94A3B8] text-[#5E81AC] focus:ring-[#88C0D0]" />
                                        Correct
                                      </label>
                                      <input className={fieldClassName} value={option.text} onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, options: current.options.map((item) => item.id === option.id ? { ...item, text: event.target.value } : item) }))} />
                                      <button type="button" onClick={() => removeOption(question.id, option.id)} className="rounded-lg border border-[#F1C8C8] px-3 py-2 text-xs font-medium text-[#B91C1C]">Remove</button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-5 rounded-2xl border-2 border-dashed border-[#D6DFEA] bg-[#FBFCFE] px-6 py-10 text-center">
                        <p className="text-sm text-[#4C566A]">No questions yet. Add your first question to make the frontend flow feel complete.</p>
                        <button type="button" onClick={addQuestion} className="mt-5 rounded-xl border border-[#D8DEE9] bg-white px-4 py-2 text-sm font-medium text-[#2E3440]">Add First Question</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {activeSection === 'course-info' ? (
            <section className="rounded-[1.35rem] border border-[#D8DEE9] bg-white p-5 shadow-[0_18px_50px_rgba(94,129,172,0.08)] sm:p-6">
              <CardHeader title="Course Info" description="Describe the course so the SCORM package has a strong learner-facing shell." />
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <Field label="Course Title"><input className={fieldClassName} value={draft.courseInfo.title} onChange={(event) => updateDraft((current) => ({ ...current, courseInfo: { ...current.courseInfo, title: event.target.value } }))} /></Field>
                <Field label="Subtitle"><input className={fieldClassName} value={draft.courseInfo.subtitle} onChange={(event) => updateDraft((current) => ({ ...current, courseInfo: { ...current.courseInfo, subtitle: event.target.value } }))} /></Field>
              </div>
              <div className="mt-4"><Field label="Description"><textarea className={textAreaClassName} value={draft.courseInfo.description} onChange={(event) => updateDraft((current) => ({ ...current, courseInfo: { ...current.courseInfo, description: event.target.value } }))} /></Field></div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                <Field label="Category"><input className={fieldClassName} value={draft.courseInfo.category} onChange={(event) => updateDraft((current) => ({ ...current, courseInfo: { ...current.courseInfo, category: event.target.value } }))} /></Field>
                <Field label="Level"><select className={fieldClassName} value={draft.courseInfo.level} onChange={(event) => updateDraft((current) => ({ ...current, courseInfo: { ...current.courseInfo, level: event.target.value } }))}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></Field>
                <Field label="Language"><input className={fieldClassName} value={draft.courseInfo.language} onChange={(event) => updateDraft((current) => ({ ...current, courseInfo: { ...current.courseInfo, language: event.target.value } }))} /></Field>
                <Field label="Estimated Hours"><input className={fieldClassName} value={draft.courseInfo.estimatedHours} onChange={(event) => updateDraft((current) => ({ ...current, courseInfo: { ...current.courseInfo, estimatedHours: event.target.value } }))} /></Field>
              </div>
            </section>
          ) : null}

          {activeSection === 'settings' ? (
            <section className="rounded-[1.35rem] border border-[#D8DEE9] bg-white p-5 shadow-[0_18px_50px_rgba(94,129,172,0.08)] sm:p-6">
              <CardHeader title="Course Settings" description="Control navigation, pass score, and learner behavior." />
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <Field label="Navigation Mode"><select className={fieldClassName} value={draft.settings.navigationMode} onChange={(event) => updateDraft((current) => ({ ...current, settings: { ...current.settings, navigationMode: event.target.value as 'linear' | 'free' } }))}><option value="linear">Linear</option><option value="free">Free Navigation</option></select></Field>
                <Field label="Pass Score (%)"><input type="number" min="1" max="100" className={fieldClassName} value={draft.settings.passScore} onChange={(event) => updateDraft((current) => ({ ...current, settings: { ...current.settings, passScore: Number(event.target.value) || 0 } }))} /></Field>
                <Field label="Tracking"><select className={fieldClassName} value={draft.settings.trackTimeSpent ? 'enabled' : 'disabled'} onChange={(event) => updateDraft((current) => ({ ...current, settings: { ...current.settings, trackTimeSpent: event.target.value === 'enabled' } }))}><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></Field>
              </div>
              <div className="mt-4 rounded-2xl border border-[#D8DEE9] bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="text-sm font-semibold text-[#2E3440]">Allow Retakes</p><p className="mt-1 text-sm text-[#4C566A]">Learners can retry quizzes or revisit chapters after completion.</p></div>
                  <button type="button" onClick={() => updateDraft((current) => ({ ...current, settings: { ...current.settings, allowRetakes: !current.settings.allowRetakes } }))} className={`relative inline-flex h-7 w-12 items-center rounded-full ${draft.settings.allowRetakes ? 'bg-[#5E81AC]' : 'bg-[#CBD5E1]'}`}><span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${draft.settings.allowRetakes ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                </div>
              </div>
            </section>
          ) : null}

          {activeSection === 'metadata' ? (
            <section className="rounded-[1.35rem] border border-[#D8DEE9] bg-white p-5 shadow-[0_18px_50px_rgba(94,129,172,0.08)] sm:p-6">
              <CardHeader title="SCORM Metadata" description="Capture export identifiers and authoring notes for the eventual packaging service." />
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <Field label="Identifier"><input className={fieldClassName} value={draft.metadata.identifier} onChange={(event) => updateDraft((current) => ({ ...current, metadata: { ...current.metadata, identifier: event.target.value } }))} /></Field>
                <Field label="Version"><input className={fieldClassName} value={draft.metadata.version} onChange={(event) => updateDraft((current) => ({ ...current, metadata: { ...current.metadata, version: event.target.value } }))} /></Field>
                <Field label="Author"><input className={fieldClassName} value={draft.metadata.author} onChange={(event) => updateDraft((current) => ({ ...current, metadata: { ...current.metadata, author: event.target.value } }))} /></Field>
              </div>
              <div className="mt-4"><Field label="Keywords"><input className={fieldClassName} value={draft.metadata.keywords} onChange={(event) => updateDraft((current) => ({ ...current, metadata: { ...current.metadata, keywords: event.target.value } }))} /></Field></div>
              <div className="mt-4"><Field label="Internal Notes"><textarea className={textAreaClassName} value={draft.metadata.notes} onChange={(event) => updateDraft((current) => ({ ...current, metadata: { ...current.metadata, notes: event.target.value } }))} /></Field></div>
            </section>
          ) : null}

          {activeSection === 'preview' ? (
            <section className="space-y-6">
              <div className="rounded-[1.35rem] border border-[#D8DEE9] bg-white p-5 shadow-[0_18px_50px_rgba(94,129,172,0.08)] sm:p-6">
                <CardHeader title="Preview and Readiness" description="Review the local draft, run pre-upload checks, upload files directly to Filebase, and then save course data to studuy-api." action={<button type="button" disabled={isSavingCourse} onClick={saveCourse} className="rounded-xl bg-[#88C0D0] px-4 py-2 text-sm font-semibold text-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60">{isSavingCourse ? 'Uploading...' : 'Save Course'}</button>} />
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-[#D8DEE9] bg-[#F8FAFC] p-4"><p className="text-sm text-[#4C566A]">Chapters</p><p className="mt-2 text-3xl font-semibold text-[#2E3440]">{draft.chapters.length}</p></div>
                  <div className="rounded-2xl border border-[#D8DEE9] bg-[#F8FAFC] p-4"><p className="text-sm text-[#4C566A]">Assets</p><p className="mt-2 text-3xl font-semibold text-[#2E3440]">{draft.chapters.reduce((total, chapter) => total + assetCount(chapter), 0)}</p></div>
                  <div className="rounded-2xl border border-[#D8DEE9] bg-[#F8FAFC] p-4"><p className="text-sm text-[#4C566A]">Quiz Questions</p><p className="mt-2 text-3xl font-semibold text-[#2E3440]">{draft.chapters.reduce((total, chapter) => total + chapter.questions.length, 0)}</p></div>
                  <div className="rounded-2xl border border-[#D8DEE9] bg-[#F8FAFC] p-4"><p className="text-sm text-[#4C566A]">Last Saved</p><p className="mt-2 text-sm font-semibold text-[#2E3440]">{formatTimestamp(draft.updatedAt)}</p></div>
                </div>
                <div className="mt-6 rounded-2xl border border-[#D8DEE9] bg-[#FBFCFE] p-4">
                  <h3 className="text-sm font-semibold text-[#2E3440]">Readiness Checklist</h3>
                  <div className="mt-4 space-y-3">
                    {validations.map((item) => (
                      <button key={item.label} type="button" onClick={() => setActiveSection(item.targetSection)} className={`flex w-full items-start justify-between gap-4 rounded-xl border px-4 py-3 text-left ${item.complete ? 'border-[#C6E7D2] bg-[#F0FDF4]' : 'border-[#F3D7A6] bg-[#FFF9E8]'}`}>
                        <div><p className="text-sm font-semibold text-[#2E3440]">{item.label}</p><p className="mt-1 text-sm text-[#4C566A]">{item.description}</p></div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.complete ? 'bg-[#DCFCE7] text-[#008236]' : 'bg-[#FEF3C7] text-[#9A6700]'}`}>{item.complete ? 'Ready' : 'Needs work'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-[#D8DEE9] bg-white p-5 shadow-[0_18px_50px_rgba(94,129,172,0.08)] sm:p-6">
                <CardHeader title="Course Preview" description="A learner-facing summary of the authored draft before backend packaging." />
                <div className="mt-6 rounded-3xl bg-[linear-gradient(135deg,#5E81AC_0%,#88C0D0_100%)] p-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">{draft.courseInfo.category || 'Course Category'}</p>
                  <h3 className="mt-3 text-3xl font-semibold">{draft.courseInfo.title || 'Untitled Course'}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90">{draft.courseInfo.description || 'Add a course description to populate this preview.'}</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/90">
                    <span className="rounded-full bg-white/15 px-3 py-1">{draft.courseInfo.level}</span>
                    <span className="rounded-full bg-white/15 px-3 py-1">{draft.courseInfo.language}</span>
                    <span className="rounded-full bg-white/15 px-3 py-1">{draft.courseInfo.estimatedHours} hours</span>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {draft.chapters.map((chapter) => (
                    <div key={chapter.id} className="rounded-2xl border border-[#D8DEE9] bg-[#FBFCFE] p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex items-center gap-2"><span className="rounded-full bg-[#EEF4FA] px-3 py-1 text-xs font-semibold text-[#5E81AC]">Chapter {chapter.order}</span><span className="text-sm text-[#4C566A]">{chapter.durationMinutes} min</span></div>
                          <h4 className="mt-2 text-lg font-semibold text-[#2E3440]">{chapter.title || 'Untitled Chapter'}</h4>
                          <p className="mt-2 text-sm leading-6 text-[#4C566A]">{chapter.description || 'No chapter description yet.'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {uploadTiles.filter((tile) => chapter.content[tile.id].length > 0).length > 0 ? uploadTiles.filter((tile) => chapter.content[tile.id].length > 0).map((tile) => <span key={tile.id} className="rounded-full bg-[#ECEFF4] px-3 py-1 text-xs font-medium text-[#2E3440]">{tile.title.replace('Upload ', '')}</span>) : <span className="rounded-full bg-[#FEE2E2] px-3 py-1 text-xs font-medium text-[#991B1B]">No uploaded content</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {savedCourseAt ? <div className="mt-6 rounded-2xl border border-[#B7E1EC] bg-[#EDF9FC] p-4"><p className="text-sm font-semibold text-[#2E3440]">Last Saved Course</p><p className="mt-1 text-sm text-[#4C566A]">{new Date(savedCourseAt).toLocaleString()}</p><p className="mt-2 text-xs text-[#4C566A]">Files were uploaded directly to Filebase first, then the final course payload was saved to studuy-api.</p></div> : null}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
