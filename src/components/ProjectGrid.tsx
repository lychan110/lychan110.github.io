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

const CATEGORIES = ['all', 'work', 'academic', 'personal'] as const;

const HEADERS = [
    { label: '№',      mobile: true  },
    { label: '',       mobile: false }, // thumbnail col
    { label: 'TITLE',  mobile: true  },
    { label: 'META',   mobile: true  }, // year over status, right-aligned
] as const;

const STATUS_SYMBOL: Record<string, { symbol: string; color: string }> = {
    complete: { symbol: '●', color: 'var(--color-ink)' },
    ongoing:  { symbol: '◐', color: '#2E8CA6' },
    archived: { symbol: '○', color: '#6B6762' },
};

// Category-keyed accent tint for swatches (theme-aware via RGB-channel tokens).
const TINT: Record<string, string> = {
    work:     '--c-ochre',
    academic: '--c-teal',
    personal: '--c-sage',
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
                className="flex flex-wrap items-center gap-2 py-[20px] border-b"
                style={{ borderTop: '1px solid var(--color-ink)', borderBottom: '1px solid var(--color-rule)' }}
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
                className="project-ledger-row items-end"
                style={{ padding: '0 12px 10px 12px', borderBottom: '1px solid var(--color-rule)' }}
            >
                {HEADERS.map(({ label, mobile }) => (
                    <span
                        key={label || 'thumb'}
                        className={`font-mono opacity-50${label === 'META' ? ' text-right' : ''}${mobile ? '' : ' hidden md:block'}`}
                        style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}
                    >
                        {label === 'META' ? (
                            <>
                                <div>YEAR</div>
                                <div>STATUS</div>
                            </>
                        ) : (
                            label
                        )}
                    </span>
                ))}
            </div>

            {/* ── Rows ── */}
            {filtered.length === 0 ? (
                <p
                    className="font-mono text-center py-16 opacity-50"
                    style={{ fontSize: 12, letterSpacing: '0.1em' }}
                >
                    No records in this drawer — try another category.
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
        <div
            role="link"
            tabIndex={0}
            onClick={() => { window.location.href = `/projects/${p.slug}`; }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = `/projects/${p.slug}`;
                }
            }}
            className="ledger-row-link block no-underline text-ink"
        >
            <div
                className="project-ledger-row items-start"
                style={{ padding: '22px 12px', borderBottom: '1px solid var(--color-rule)' }}
            >
                {/* № */}
                <span
                    className="font-mono opacity-50 pt-[6px]"
                    style={{ fontSize: 10, letterSpacing: '0.1em' }}
                >
                    {String(index + 1).padStart(3, '0')}
                </span>

                {/* Thumbnail — hidden on mobile */}
                <div
                    className="hidden md:flex items-center justify-center overflow-hidden"
                    style={{
                        width: 64, height: 64,
                        border: '1px solid var(--color-rule)',
                        background: `rgb(var(${TINT[p.category] ?? '--c-teal'}) / var(--swatch-alpha))`,
                        flexShrink: 0,
                    }}
                >
                    {p.image ? (
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span
                            className="font-display italic"
                            style={{ fontSize: 30, color: `rgb(var(${TINT[p.category] ?? '--c-teal'}) / 0.8)` }}
                        >
                            {p.title.charAt(0)}
                        </span>
                    )}
                </div>

                {/* Title + summary */}
                <div className="min-w-0">
                    <div
                        className="font-display font-medium row-title leading-[1] mb-[6px]"
                        style={{ fontSize: 24, letterSpacing: '-0.3px' }}
                    >
                        {p.title}
                    </div>
                    <div
                        className="font-body opacity-75 max-w-[460px]"
                        style={{ fontSize: 13, lineHeight: 1.5 }}
                    >
                        {p.summary}
                    </div>
                    {/* Tags — inline mono line (replaces the standalone column) */}
                    {p.tags.length > 0 && (
                        <div
                            className="font-mono opacity-60 mt-[8px]"
                            style={{ fontSize: 10, lineHeight: 1.6, letterSpacing: '0.05em' }}
                        >
                            {p.tags.map(t => (
                                <span key={t} className="mr-[12px]">#{t}</span>
                            ))}
                        </div>
                    )}
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

                {/* Meta block — year over status, right-aligned */}
                <div
                    className="flex flex-col items-end gap-[8px] min-w-0"
                    style={{ paddingTop: 6 }}
                >
                    <span
                        className="font-mono"
                        style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.1em' }}
                    >
                        {year}
                    </span>
                    <span
                        className="font-mono flex items-center gap-[6px]"
                        style={{ fontSize: 11 }}
                    >
                        <span style={{ color: status.color }}>{status.symbol}</span>
                        <span className="opacity-70 hidden sm:inline">{p.status}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
