import { useState, useMemo } from 'react';

interface Project {
    slug: string;
    title: string;
    summary: string;
    category: 'personal' | 'academic' | 'work';
    tags: string[];
    status: 'complete' | 'ongoing' | 'archived';
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

const CATEGORIES = ['all', 'academic', 'personal', 'work'] as const;

const STATUS_SYMBOL: Record<string, { symbol: string; color: string }> = {
    complete: { symbol: '●', color: '#1E1E1C' },
    ongoing:  { symbol: '◐', color: '#2E8CA6' },
    archived: { symbol: '○', color: '#6B6762' },
};

function pad3(n: number) {
    return String(n).padStart(3, '0');
}

export default function ProjectGrid({ projects }: Props) {
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const filtered = useMemo(() =>
        projects.filter(p => activeCategory === 'all' || p.category === activeCategory),
        [projects, activeCategory]
    );

    return (
        <div>
            {/* ── Filter bar ── */}
            <div
                className="flex items-center gap-2 py-[20px] border-b"
                style={{ borderTop: '1px solid #1E1E1C', borderBottom: '1px solid rgba(30,30,28,0.14)' }}
            >
                <span
                    className="font-mono mr-[6px] opacity-55"
                    style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                    Category →
                </span>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`pill${activeCategory === cat ? ' active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
                <span
                    className="ml-auto font-mono opacity-55"
                    style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                    {pad3(filtered.length)} records
                </span>
            </div>

            {/* ── Column headers ── */}
            <div
                className="grid items-end pb-[10px] border-b"
                style={{
                    gridTemplateColumns: '36px 72px 2fr 1fr 60px 100px',
                    gap: 20,
                    padding: '0 12px 10px 12px',
                    borderBottom: '1px solid rgba(30,30,28,0.14)',
                }}
            >
                {['№', '', 'TITLE', 'TAGS', 'YEAR', 'STATUS'].map(h => (
                    <span
                        key={h}
                        className="font-mono opacity-50"
                        style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}
                    >
                        {h}
                    </span>
                ))}
            </div>

            {/* ── Rows ── */}
            {filtered.length === 0 ? (
                <p
                    className="font-mono text-center py-16 opacity-50"
                    style={{ fontSize: 12, letterSpacing: '0.1em' }}
                >
                    No projects match this filter.
                </p>
            ) : (
                filtered.map((p, i) => (
                    <LedgerRow key={p.slug} project={p} index={i} />
                ))
            )}
        </div>
    );
}

function LedgerRow({ project: p, index }: { project: Project; index: number }) {
    const year = p.date.slice(0, 4);
    const status = STATUS_SYMBOL[p.status] ?? STATUS_SYMBOL.complete;
    const links = [
        p.paper_url && { label: 'Paper', href: p.paper_url },
        p.repo_url  && { label: 'Repo',  href: p.repo_url  },
        p.demo_url  && { label: 'Demo',  href: p.demo_url  },
    ].filter(Boolean) as { label: string; href: string }[];

    return (
        <a
            href={`/projects/${p.slug}`}
            className="ledger-row-link block no-underline text-ink"
        >
            <div
                className="grid items-start"
                style={{
                    gridTemplateColumns: '36px 72px 2fr 1fr 60px 100px',
                    gap: 20,
                    padding: '22px 12px',
                    borderBottom: '1px solid rgba(30,30,28,0.14)',
                }}
            >
                {/* № */}
                <span
                    className="font-mono opacity-50 pt-[6px]"
                    style={{ fontSize: 10, letterSpacing: '0.1em' }}
                >
                    {String(index + 1).padStart(3, '0')}
                </span>

                {/* Thumbnail placeholder */}
                <div
                    style={{
                        width: 64, height: 64,
                        border: '1px solid rgba(30,30,28,0.14)',
                        background: '#DFDCD7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    {p.image ? (
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span
                            className="font-mono opacity-30"
                            style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                        >
                            {p.category.slice(0, 3)}
                        </span>
                    )}
                </div>

                {/* Title + summary */}
                <div>
                    <div
                        className="font-display font-medium row-title leading-[1] mb-[6px]"
                        style={{ fontSize: 30, letterSpacing: '-0.3px' }}
                    >
                        {p.title}
                    </div>
                    <div
                        className="font-body opacity-75 max-w-[460px]"
                        style={{ fontSize: 13, lineHeight: 1.5 }}
                    >
                        {p.summary}
                    </div>
                    {/* Resource links */}
                    {links.length > 0 && (
                        <div className="flex gap-2 mt-[8px]">
                            {links.map(({ label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener"
                                    onClick={e => e.stopPropagation()}
                                    className="resource-pill"
                                >
                                    {label} ↗
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div
                    className="font-mono opacity-75"
                    style={{ fontSize: 10, lineHeight: 1.7, letterSpacing: '0.05em' }}
                >
                    {p.tags.map(t => <div key={t}>#{t}</div>)}
                </div>

                {/* Year */}
                <span
                    className="font-mono pt-[6px]"
                    style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.1em' }}
                >
                    {year}
                </span>

                {/* Status */}
                <div
                    className="font-mono flex items-center gap-[6px] pt-[6px]"
                    style={{ fontSize: 11 }}
                >
                    <span style={{ color: status.color }}>{status.symbol}</span>
                    <span className="opacity-70">{p.status}</span>
                </div>
            </div>
        </a>
    );
}
