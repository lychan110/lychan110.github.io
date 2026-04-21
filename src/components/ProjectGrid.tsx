import { useState, useMemo } from 'react';

interface Project {
    slug: string;
    title: string;
    summary: string;
    category: 'personal' | 'academic' | 'work';
    tags: string[];
    status: string;
    date: string;
    paper_url?: string;
    repo_url?: string;
    demo_url?: string;
    image?: string;
    featured: boolean;
}

interface Props {
    projects: Project[];
}

const CATEGORY_LABELS: Record<string, string> = {
    all:      'All',
    personal: 'Personal',
    academic: 'Academic',
    work:     'Professional',
};

const STATUS_COLORS: Record<string, string> = {
    complete: 'text-teal',
    ongoing:  'text-paper/60',
    archived: 'text-muted',
};

export default function ProjectGrid({ projects }: Props) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeTag, setActiveTag]           = useState<string | null>(null);

    // Collect all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        projects.forEach(p => p.tags.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [projects]);

    const filtered = useMemo(() => {
        return projects.filter(p => {
            const catMatch = activeCategory === 'all' || p.category === activeCategory;
            const tagMatch = !activeTag || p.tags.includes(activeTag);
            return catMatch && tagMatch;
        });
    }, [projects, activeCategory, activeTag]);

    return (
        <div>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`tag ${activeCategory === cat ? 'active' : ''}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Tag filters */}
            <div className="flex flex-wrap gap-1.5 mb-10">
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        className={`tag text-[10px] ${activeTag === tag ? 'active' : ''}`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Count */}
            <p className="font-mono text-2xs text-muted tracking-widest uppercase mb-6">
                {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((project, i) => (
                    <ProjectCard key={project.slug} project={project} index={i} />
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="text-muted text-sm py-16 text-center font-mono">
                    No projects match this filter.
                </p>
            )}
        </div>
    );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const [open, setOpen] = useState(false);

    const links = [
        project.paper_url && { label: 'Paper',  href: project.paper_url },
        project.repo_url  && { label: 'Repo',   href: project.repo_url  },
        project.demo_url  && { label: 'Demo',   href: project.demo_url  },
    ].filter(Boolean) as { label: string; href: string }[];

    return (
        <>
            {/* Card */}
            <div
                className="project-card p-5 flex flex-col gap-3"
                style={{ animationDelay: `${index * 60}ms` }}
                onClick={() => setOpen(true)}
            >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                    <span className={`font-mono text-2xs tracking-widest uppercase ${STATUS_COLORS[project.status] || 'text-muted'}`}>
                        {project.category}
                    </span>
                    <span className="font-mono text-2xs text-muted">
                        {project.date.slice(0, 4)}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl text-paper leading-tight">
                    {project.title}
                </h3>

                {/* Summary */}
                <p className="text-muted text-sm leading-relaxed flex-1">
                    {project.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-1">
                    {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag pointer-events-none text-[10px]">
                            {tag}
                        </span>
                    ))}
                    {project.tags.length > 3 && (
                        <span className="tag pointer-events-none text-[10px] text-muted">
                            +{project.tags.length - 3}
                        </span>
                    )}
                </div>

                {/* Link row */}
                {links.length > 0 && (
                    <div className="flex gap-3 mt-1 pt-3 border-t border-ink-3">
                        {links.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener"
                                onClick={e => e.stopPropagation()}
                                className="font-mono text-2xs tracking-widest uppercase
                                           text-teal hover:text-paper transition-colors"
                            >
                                {label} ↗
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal drawer */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-end md:items-center
                               justify-center bg-ink/80 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-ink-2 border border-ink-3 rounded-t md:rounded
                                   w-full md:max-w-2xl max-h-[80vh] overflow-y-auto p-8
                                   animate-fade-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <span className="font-mono text-2xs tracking-widest uppercase text-teal">
                                    {project.category} · {project.date.slice(0, 4)}
                                </span>
                                <h2 className="font-display text-3xl text-paper mt-1">
                                    {project.title}
                                </h2>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-muted hover:text-paper font-mono text-sm mt-1"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-paper/70 leading-relaxed mb-6">
                            {project.summary}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                            {project.tags.map(tag => (
                                <span key={tag} className="tag text-[10px]">{tag}</span>
                            ))}
                        </div>

                        {links.length > 0 && (
                            <div className="flex gap-4">
                                {links.map(({ label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener"
                                        className="font-mono text-2xs tracking-widest uppercase
                                                   text-teal border border-teal/40 px-4 py-2
                                                   hover:bg-teal/10 transition-colors"
                                    >
                                        {label} ↗
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Link to full project detail page */}
                        <div className="mt-6 pt-6 border-t border-ink-3">
                            <a
                                href={`/projects/${project.slug}`}
                                className="font-mono text-2xs tracking-widest uppercase
                                           text-teal border border-teal/40 px-4 py-2
                                           hover:bg-teal/10 transition-colors inline-block"
                            >
                                Full Details →
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
