// Bio / CV data. Edit this file to update the About section without touching components.
// Talks and experience are defined here for future use; only bio, education, and awards
// are currently rendered by About.astro.

export const bio: string[] = [
    'Research scientist working at the intersection of machine learning, physics-based simulation, and engineering design. PhD from Northwestern in computational metamaterials; now building ML and simulation workflows for industrial design problems.',
    'Outside work: tinkering with desktop and mobile tooling, and writing fantasy fiction.',
];

export interface Education {
    school: string;
    degree: string;
    years: string;
    note: string;
}

export const education: Education[] = [
    {
        school: 'Northwestern University',
        degree: 'Ph.D. Mechanical Engineering',
        years:  '2016 – 2021',
        note:   'IDEAL Group · Advisor: Prof. Wei Chen',
    },
    {
        school: 'NC State University',
        degree: 'B.S. Mechanical Engineering (Honors)',
        years:  '2011 – 2015',
        note:   'Minor Mathematics · Summa Cum Laude',
    },
];

export interface Award {
    title: string;
    year: string;
}

export const awards: Award[] = [
    { title: 'NSF Graduate Research Fellowship',                          year: '2018' },
    { title: 'Paper of Distinction — ASME IDETC DAC',                     year: '2020' },
    { title: 'Paper of Distinction — ASME IDETC DAC',                     year: '2017' },
    { title: 'Predictive Science & Engineering Design Fellowship, Northwestern', year: '2017' },
    { title: 'Walter P. Murphy Fellowship, Northwestern',                 year: '2016' },
];

export interface Experience {
    title: string;
    dates: string;
    summary: string;
}

export const experience: Experience[] = [
    {
        title:   'Generative Design Intern — Siemens Corporate Technology',
        dates:   'June – September 2018',
        summary: 'Accelerated topology optimization for large-scale industrial problems (US Patent Pending); implemented as Python software.',
    },
];

export interface Talk {
    title: string;
    venue: string;
    location?: string;
    date: string;
}

export const talks: Talk[] = [
    {
        title: 'METASET: An Automated Data Selection Method for Scalable Data-Driven Design of Metamaterials',
        venue: 'Design Automation Conference at ASME IDETC/CIE',
        date:  'August 18, 2020',
    },
    {
        title:    'A Spectral Shape Descriptor Based Approach for Data-Driven Metamaterials Design Optimization',
        venue:    '15th U.S. National Congress on Computational Mechanics',
        location: 'Austin, TX',
        date:     'July 29, 2019',
    },
];
