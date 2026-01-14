export type WorkEntry = {
  id: string
  company: string
  role: string
  period: string
  location?: string
  summary?: string
}

export type EducationEntry = {
  id: string
  school: string
  degree: string
  period: string
  location?: string
  summary?: string
}

export const workExperience: WorkEntry[] = [
  {
    id: '1',
    company: 'Obsidian Servers',
    role: 'Junior Website Developer',
    period: '2026 - Present',
    location: 'Budapest, Hungary',
    summary: 'Developing custom addons and maintaining the billing system and control panel infrastructure.',
  },
  {
    id: '2',
    company: 'Self-Employed',
    role: 'Website Developer',
    period: '2022 - Present',
    location: 'Budapest, Hungary',
    summary: 'Creating websites for small businesses and individuals.',
  },
  
]

export const education: EducationEntry[] = [
  {
    id: '1',
    school: 'Móra Ferenc Elementary School ',
    degree: 'Primary Education',
    period: '2015 - 2024',
    location: 'Budapest, Hungary',
    summary: '',
  },
]

