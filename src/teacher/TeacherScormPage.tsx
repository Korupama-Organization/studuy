import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';

type NavItem = {
  label: string;
  icon: IconName;
  active?: boolean;
};

type Chapter = {
  number: number;
  title: string;
  duration: string;
  status: 'Complete' | 'In Progress';
  resources: Array<'Video' | 'Slides' | 'PDF' | 'Images'>;
  active?: boolean;
};

type UploadTile = {
  id: 'video' | 'slides' | 'pdf' | 'images';
  title: string;
  subtitle: string;
  icon: IconName;
  accept: string;
  multiple?: boolean;
};

type IconName =
  | 'arrow-left'
  | 'book-open'
  | 'download'
  | 'plus'
  | 'grid'
  | 'file'
  | 'gear'
  | 'tag'
  | 'eye'
  | 'video'
  | 'slides'
  | 'pdf'
  | 'image'
  | 'quiz'
  | 'spark'
  | 'check-circle';

const navItems: NavItem[] = [
  { label: 'Chapters', icon: 'book-open', active: true },
  { label: 'Course Info', icon: 'file' },
  { label: 'Settings', icon: 'gear' },
  { label: 'Metadata', icon: 'tag' },
  { label: 'Preview Course', icon: 'eye' },
];

const chapters: Chapter[] = [
  {
    number: 1,
    title: 'Introduction to the Course',
    duration: '15 min',
    status: 'Complete',
    resources: ['Video', 'Slides'],
    active: true,
  },
  {
    number: 2,
    title: 'Core Concepts',
    duration: '30 min',
    status: 'In Progress',
    resources: ['Video', 'PDF'],
  },
];

const uploadTiles: UploadTile[] = [
  {
    id: 'video',
    title: 'Upload Video',
    subtitle: 'Lecture recording, walkthroughs, or instructor intro',
    icon: 'video',
    accept: 'video/*',
  },
  {
    id: 'slides',
    title: 'Upload Slides',
    subtitle: 'Decks for guided learning and structured delivery',
    icon: 'slides',
    accept: '.ppt,.pptx,.key,.pdf',
  },
  {
    id: 'pdf',
    title: 'Upload PDF',
    subtitle: 'Handouts, readings, or printable support material',
    icon: 'pdf',
    accept: '.pdf',
  },
  {
    id: 'images',
    title: 'Upload Images',
    subtitle: 'Screenshots, diagrams, and chapter visuals',
    icon: 'image',
    accept: 'image/*',
    multiple: true,
  },
];

const fieldClassName =
  'w-full rounded-xl border border-[#D8DEE9] bg-white px-4 py-3 text-sm text-[#2E3440] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition focus:border-[#88C0D0] focus:ring-4 focus:ring-[#88C0D0]/20 placeholder:text-[#94A3B8]';

function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  const commonProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'arrow-left':
      return (
        <svg {...commonProps}>
          <path d="M15 18l-6-6 6-6" />
          <path d="M9 12h10" />
        </svg>
      );
    case 'book-open':
      return (
        <svg {...commonProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 17H20V4.5A2.5 2.5 0 0 0 17.5 2H8a4 4 0 0 0-4 4v13.5" />
          <path d="M8 2v15" />
        </svg>
      );
    case 'download':
      return (
        <svg {...commonProps}>
          <path d="M12 3v11" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...commonProps}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="5" height="5" rx="1" />
          <rect x="15" y="4" width="5" height="5" rx="1" />
          <rect x="4" y="15" width="5" height="5" rx="1" />
          <rect x="15" y="15" width="5" height="5" rx="1" />
        </svg>
      );
    case 'file':
      return (
        <svg {...commonProps}>
          <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
          <path d="M14 2v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </svg>
      );
    case 'gear':
      return (
        <svg {...commonProps}>
          <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.96 19.35a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.96a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c0 .68.4 1.3 1.04 1.56H21a2 2 0 1 1 0 4h-.09c-.68 0-1.3.4-1.56 1.04z" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...commonProps}>
          <path d="m20 13-7 7-9-9V4h7z" />
          <path d="M7 7h.01" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...commonProps}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'video':
      return (
        <svg {...commonProps}>
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="m16 10 5-3v10l-5-3" />
        </svg>
      );
    case 'slides':
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="16" height="11" rx="2" />
          <path d="M12 15v5" />
          <path d="M8 20h8" />
        </svg>
      );
    case 'pdf':
      return (
        <svg {...commonProps}>
          <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
          <path d="M14 2v5h5" />
          <path d="M8.5 14h2.5a1.5 1.5 0 0 0 0-3H8.5v6" />
          <path d="M14 11v6" />
          <path d="M14 17h2" />
        </svg>
      );
    case 'image':
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="m21 15-4.5-4.5L8 19" />
        </svg>
      );
    case 'quiz':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.2 9a3 3 0 0 1 5.1 2.1c0 2-2.3 2.5-2.3 4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...commonProps}>
          <path d="M12 3v4" />
          <path d="M12 17v4" />
          <path d="M3 12h4" />
          <path d="M17 12h4" />
          <path d="m5.6 5.6 2.8 2.8" />
          <path d="m15.6 15.6 2.8 2.8" />
          <path d="m18.4 5.6-2.8 2.8" />
          <path d="m8.4 15.6-2.8 2.8" />
        </svg>
      );
    case 'check-circle':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.4 2.5 4.6-5" />
        </svg>
      );
    default:
      return null;
  }
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
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

function TeacherScormPage() {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string[]>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const openFilePicker = (tileId: UploadTile['id']) => {
    fileInputRefs.current[tileId]?.click();
  };

  const handleFileChange = (
    tileId: UploadTile['id'],
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      setUploadedFiles((current) => ({
        ...current,
        [tileId]: files.map((file) => file.name),
      }));
    }

    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-[#ECEFF4] text-[#2E3440]">
      <header className="sticky top-0 z-20 border-b border-[#D8DEE9] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-[#4C566A] transition hover:border-[#D8DEE9] hover:bg-[#ECEFF4]"
              aria-label="Go back"
            >
              <Icon name="arrow-left" className="h-4 w-4" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FA] text-[#5E81AC] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <Icon name="book-open" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[1.375rem] font-semibold tracking-[-0.02em] text-[#2E3440]">
                Create Course
              </p>
              <p className="text-sm text-[#4C566A]">
                Build your course content
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-[#D8DEE9] bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#2E3440] transition hover:border-[#C5D1DE] hover:bg-white"
            >
              Save Draft
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#88C0D0] px-4 py-2 text-sm font-semibold text-[#1F2937] shadow-[0_10px_30px_rgba(136,192,208,0.35)] transition hover:-translate-y-0.5 hover:bg-[#7AB6C8]"
            >
              <Icon name="download" className="h-4 w-4" />
              Generate SCORM 
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1280px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-5 self-start rounded-[1.25rem] border border-[#D8DEE9] bg-white p-4 shadow-[0_18px_50px_rgba(94,129,172,0.08)]">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  item.active
                    ? 'bg-[#5E81AC] text-white shadow-[0_10px_30px_rgba(94,129,172,0.28)]'
                    : 'text-[#2E3440] hover:bg-[#F4F7FB]'
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`h-4 w-4 ${item.active ? 'text-white' : 'text-[#4C566A]'}`}
                />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-[#D8DEE9] pt-5">
            <div className="rounded-2xl border border-[#88C0D0] bg-[#EAF8FC] p-4">
              <p className="text-sm font-medium text-[#2E3440]">Course Progress</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#D8DEE9]">
                <div className="h-full w-1/4 rounded-full bg-[#5E81AC]" />
              </div>
              <p className="mt-3 text-xs text-[#4C566A]">1 of 4 sections completed</p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[1.35rem] border border-[#D8DEE9] bg-white p-5 shadow-[0_18px_50px_rgba(94,129,172,0.08)] sm:p-6">
            <SectionHeader
              title="Course Chapters"
              description="Organize your course content into chapters"
              action={
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5E81AC] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#53749C]"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Add Chapter
                </button>
              }
            />

            <div className="mt-5 space-y-3">
              {chapters.map((chapter) => (
                <article
                  key={chapter.number}
                  className={`rounded-2xl border p-5 transition ${
                    chapter.active
                      ? 'border-[#5E81AC] bg-[#F8FBFF] shadow-[0_10px_30px_rgba(94,129,172,0.08)]'
                      : 'border-[#D8DEE9] bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FA] text-[#5E81AC]">
                        <Icon name="grid" className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-medium text-[#4C566A]">Chapter {chapter.number}</span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              chapter.status === 'Complete'
                                ? 'bg-[#DCFCE7] text-[#008236]'
                                : 'bg-[#FEF3C7] text-[#9A6700]'
                            }`}
                          >
                            {chapter.status}
                          </span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-[#2E3440]">{chapter.title}</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {chapter.resources.map((resource) => (
                            <span
                              key={resource}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#ECEFF4] px-3 py-1 text-xs font-medium text-[#2E3440]"
                            >
                              <Icon
                                name={
                                  resource === 'Video'
                                    ? 'video'
                                    : resource === 'Slides'
                                      ? 'slides'
                                      : resource === 'PDF'
                                        ? 'pdf'
                                        : 'image'
                                }
                                className="h-3.5 w-3.5"
                              />
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <span className="text-sm font-medium text-[#4C566A]">{chapter.duration}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-[#D8DEE9] bg-white p-5 shadow-[0_18px_50px_rgba(94,129,172,0.08)] sm:p-6">
            <SectionHeader
              title="Chapter Details"
              description="Add content and information for this chapter"
            />

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2E3440]" htmlFor="chapter-title">
                  Chapter Title *
                </label>
                <input
                  id="chapter-title"
                  className={fieldClassName}
                  defaultValue="Introduction to Data Analysis"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2E3440]" htmlFor="chapter-description">
                  Description
                </label>
                <textarea
                  id="chapter-description"
                  className={`${fieldClassName} min-h-28 resize-y`}
                  defaultValue="Brief description of what students will learn in this chapter, key takeaways, and the expected outcome after completion."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2E3440]" htmlFor="chapter-duration">
                    Duration (minutes)
                  </label>
                  <input
                    id="chapter-duration"
                    className={fieldClassName}
                    defaultValue="15"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2E3440]" htmlFor="chapter-order">
                    Order
                  </label>
                  <input id="chapter-order" className={fieldClassName} defaultValue="1" />
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#D8DEE9] pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#2E3440]">Chapter Content</h3>
                <p className="mt-1 text-sm text-[#4C566A]">
                  Choose the content blocks you want to add to this chapter.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 md:[grid-auto-rows:1fr]">
                {uploadTiles.map((tile) => (
                  <div key={tile.id} className="h-full">
                    <input
                      ref={(element) => {
                        fileInputRefs.current[tile.id] = element;
                      }}
                      type="file"
                      accept={tile.accept}
                      multiple={tile.multiple}
                      className="hidden"
                      onChange={(event) => handleFileChange(tile.id, event)}
                    />
                    <button
                      type="button"
                      aria-pressed={Boolean(uploadedFiles[tile.id]?.length)}
                      onClick={() => openFilePicker(tile.id)}
                      className={`group flex h-full min-h-[196px] w-full flex-col items-center justify-center rounded-2xl border px-6 py-7 text-center transition ${
                        uploadedFiles[tile.id]?.length
                          ? 'border-[#88C0D0] bg-[#88C0D0] text-[#1E293B] shadow-[0_18px_40px_rgba(136,192,208,0.28)]'
                          : 'border-[#D8DEE9] bg-[#ECEFF4] text-[#2E3440] hover:border-[#B8C6D8] hover:bg-[#E6ECF5]'
                      }`}
                    >
                      <div
                        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full ${
                          uploadedFiles[tile.id]?.length
                            ? 'bg-white/35 text-[#1E293B]'
                            : 'bg-white text-[#5E81AC] shadow-[0_8px_20px_rgba(94,129,172,0.12)]'
                        }`}
                      >
                        <Icon name={tile.icon} className="h-5 w-5" />
                      </div>
                      <p className="text-base font-semibold">{tile.title}</p>
                      <p
                        className={`mt-2 max-w-[18rem] text-sm leading-6 ${
                          uploadedFiles[tile.id]?.length ? 'text-[#27485A]' : 'text-[#4C566A]'
                        }`}
                      >
                        {tile.subtitle}
                      </p>
                      <p
                        className={`mt-3 text-xs font-medium ${
                          uploadedFiles[tile.id]?.length ? 'text-[#27485A]' : 'text-[#5E81AC]'
                        }`}
                      >
                        {uploadedFiles[tile.id]?.length
                          ? `${uploadedFiles[tile.id].length} file${uploadedFiles[tile.id].length > 1 ? 's' : ''} selected`
                          : `Click to upload${tile.multiple ? ' files' : ''}`}
                      </p>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-[1.35rem] border border-[#D8DEE9] p-4 sm:p-5">
              <SectionHeader
                title="Quiz / Assessment"
                description="Add quiz questions to test student understanding"
                action={
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5E81AC] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#53749C]"
                  >
                    <Icon name="plus" className="h-4 w-4" />
                    Add Question
                  </button>
                }
              />

              <div className="mt-5 rounded-2xl border-2 border-dashed border-[#D6DFEA] bg-[#FBFCFE] px-6 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#5E81AC]/20 bg-white text-[#5E81AC] shadow-[0_15px_35px_rgba(94,129,172,0.12)]">
                  <Icon name="check-circle" className="h-7 w-7" />
                </div>
                <p className="mx-auto mt-4 max-w-xl text-sm text-[#4C566A]">
                  No questions yet. Add your first question to create a quiz for this chapter.
                </p>
                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#D8DEE9] bg-white px-4 py-2 text-sm font-medium text-[#2E3440] transition hover:border-[#C5D1DE] hover:bg-[#F8FAFC]"
                >
                  <Icon name="spark" className="h-4 w-4 text-[#5E81AC]" />
                  Add First Question
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[#D8DEE9] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="rounded-xl border border-[#D8DEE9] bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#2E3440] transition hover:border-[#C5D1DE] hover:bg-white"
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-xl bg-[#5E81AC] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#53749C]"
              >
                Save Chapter
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TeacherScormPage;
