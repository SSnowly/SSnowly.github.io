import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { workExperience, education } from '../data/experience'
import { useProjects } from '../hooks/useProjects'
import { User, FolderGit2, Briefcase, GraduationCap, Mail, Github, ExternalLink } from 'lucide-react'

type SectionId = 'intro' | 'projects' | 'experience' | 'education' | 'contact'

const sections: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] =
  [
    { id: 'intro', label: 'Intro', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Contact', icon: Mail },
  ]

export function PlayfulView() {
  const [activeId, setActiveId] = useState<SectionId>('intro')
  const [activeBoxes, setActiveBoxes] = useState<number[]>([])
  const [gridHeight, setGridHeight] = useState(0)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    intro: null,
    projects: null,
    experience: null,
    education: null,
    contact: null,
  })
  const projects = useProjects()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) {
          const id = visible.target.id as SectionId
          setActiveId(id)
        }
      },
      { threshold: 0.4 }
    )

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const count = 6
      const indices = new Set<number>()
      while (indices.size < count) {
        indices.add(Math.floor(Math.random() * 2000))
      }
      setActiveBoxes(Array.from(indices))
    }, 380)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight
        setGridHeight(height)
      }
    }
    const timeoutId = setTimeout(updateHeight, 0)
    window.addEventListener('resize', updateHeight)
    const observer = new MutationObserver(updateHeight)
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true, attributes: true })
    }
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateHeight)
      observer.disconnect()
    }
  }, [])

  const handleNavClick = (id: SectionId) => {
    const target = sectionRefs.current[id]
    if (!target) return

    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleProjectSpin = () => {
    if (!projects.length || spinning) return

    setSpinning(true)
    let ticks = 0
    const totalTicks = 18 + Math.floor(Math.random() * 10)

    const spinInterval = setInterval(() => {
      ticks += 1
      setCurrentProjectIndex((prev) => {
        if (!projects.length) return 0
        return (prev + 1) % projects.length
      })

      if (ticks >= totalTicks) {
        clearInterval(spinInterval)
        setSpinning(false)
      }
    }, 80)
  }

  return (
    <div ref={containerRef} className="relative bg-[#050509] text-zinc-50">
      <div ref={gridRef} className="absolute top-0 left-0 right-0 grid grid-cols-20 gap-[1px] pointer-events-none z-0 w-full" style={{ height: `${gridHeight}px`, gridTemplateRows: `repeat(${Math.ceil(gridHeight / (window.innerHeight / 20))}, 1fr)` }}>
        {Array.from({ length: Math.ceil(gridHeight / (window.innerHeight / 20)) * 20 || 400 }).map((_, i) => (
          <div
            key={i}
            className={`transition-colors duration-800 ${
              activeBoxes.includes(i) ? 'bg-orange-500/40' : 'bg-zinc-900/30'
            }`}
          />
        ))}
      </div>

      <aside className="fixed inset-y-0 left-0 z-30 flex items-center px-4">
        <nav className="flex flex-col items-start justify-center gap-3">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeId === section.id

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavClick(section.id)}
                  className="group relative flex items-center gap-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center">
                    <div
                      className={`flex items-center justify-center rounded-full bg-orange-400 transition-all duration-200 ${
                        isActive ? 'h-6 w-6' : 'h-4 w-4 group-hover:h-9 group-hover:w-9'
                      }`}
                    >
                      <Icon
                        className={`text-white transition-all duration-200 ${
                          isActive
                            ? 'h-4 w-4 opacity-100'
                            : 'h-0 w-0 opacity-0 group-hover:h-4 group-hover:w-4 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className="ml-2 origin-left scale-x-0 transform rounded-full bg-orange-500/90 px-3 py-1 text-left text-[10px] font-medium text-white opacity-0 transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100"
                  >
                    {section.label}
                  </div>
                </button>
              )
            })}
        </nav>
      </aside>

      <section
        id="intro"
        ref={(el) => {
          sectionRefs.current.intro = el
        }}
        className="relative z-10 flex min-h-screen items-center justify-center"
      >
        <div className="relative z-10 mx-auto max-w-2xl space-y-4 text-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="text-orange-300">{profile.name}</span>
              <span className="text-zinc-300"> builds things for the web.</span>
            </h1>
            <p className="mt-3 text-sm text-zinc-300/80">
              Junior dev, high curiosity. Shipping small things fast, then
              obsessing over the details when it matters.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-zinc-200/80">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 ring-1 ring-orange-500/40">
              <User className="h-3.5 w-3.5 text-orange-300" />
              <span>{profile.title}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 ring-1 ring-orange-500/20">
              <GraduationCap className="h-3.5 w-3.5 text-orange-300" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="relative w-full">
        <div className="flex w-full flex-col gap-24 px-6 py-10 sm:py-14 md:px-10">

          <section
            id="projects"
            ref={(el) => {
              sectionRefs.current.projects = el
            }}
            className="relative scroll-mt-24 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
                  <FolderGit2 className="h-4 w-4 text-orange-300" />
                  <span>Projects, but less serious</span>
                </h2>
                <p className="mt-1 text-xs text-zinc-300/80">
                  Same repos as the serious tab, but let the roulette decide what to show off.
                </p>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-2xl bg-black/40 p-4 text-xs text-zinc-300/85">
                No projects wired up yet. Add entries to{' '}
                <span className="font-mono text-orange-300">projects</span> in your data
                file and they will pop up here with playful copy.
              </div>
            ) : (
              <div className="rounded-2xl bg-black/30 p-4 text-xs text-zinc-200/85">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleProjectSpin}
                    disabled={spinning}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-600/70 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-orange-200 disabled:opacity-60"
                  >
                    {spinning ? 'Spinning…' : 'Spin'}
                  </button>
                </div>

                {projects.length > 0 && (
                  <div className="mt-6 flex items-stretch justify-center gap-4 md:gap-6">
                    {projects.length > 1 && (() => {
                      const prevProject = projects[(currentProjectIndex - 1 + projects.length) % projects.length]
                      return (
                        <div className="hidden max-w-[200px] flex-1 rounded-2xl bg-black/60 overflow-hidden text-[10px] text-zinc-400 blur-[2px] md:block">
                          {prevProject.imageUrl && (
                            <img src={prevProject.imageUrl} alt={prevProject.name} className="w-full h-24 object-cover" />
                          )}
                          <div className="px-3 py-3">
                            <div className="font-mono text-[10px] text-orange-300/70">
                              {prevProject.name}
                            </div>
                            <p className="mt-1 line-clamp-3 text-[10px] leading-relaxed text-zinc-400/90">
                              {prevProject.descriptionPlayful || prevProject.descriptionSerious}
                            </p>
                          </div>
                        </div>
                      )
                    })()}

                    <div className="max-w-sm flex-1 rounded-2xl bg-black/80 overflow-hidden text-[11px] text-zinc-100 shadow-[0_0_26px_rgba(0,0,0,0.9)]">
                      {projects[currentProjectIndex].imageUrl && (
                        <img src={projects[currentProjectIndex].imageUrl} alt={projects[currentProjectIndex].name} className="w-full h-40 object-cover" />
                      )}
                      <div className="px-4 py-4">
                        <h3 className="text-sm font-semibold text-orange-300">
                          {projects[currentProjectIndex].name}
                        </h3>
                        <p className="mt-2 leading-relaxed text-zinc-200/90">
                          {projects[currentProjectIndex].descriptionPlayful ||
                            projects[currentProjectIndex].descriptionSerious}
                        </p>
                        {projects[currentProjectIndex].tech.length > 0 && (
                          <p className="mt-2 text-[10px] text-orange-200/80">
                            stack: {projects[currentProjectIndex].tech.join(' · ')}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-3">
                          {projects[currentProjectIndex].githubUrl && (
                            <a
                              href={projects[currentProjectIndex].githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-zinc-300"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {projects[currentProjectIndex].liveUrl && (
                            <a
                              href={projects[currentProjectIndex].liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-zinc-300"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {projects.length > 2 && (() => {
                      const nextProject = projects[(currentProjectIndex + 1) % projects.length]
                      return (
                        <div className="hidden max-w-[200px] flex-1 rounded-2xl bg-black/60 overflow-hidden text-[10px] text-zinc-400 blur-[2px] md:block">
                          {nextProject.imageUrl && (
                            <img src={nextProject.imageUrl} alt={nextProject.name} className="w-full h-24 object-cover" />
                          )}
                          <div className="px-3 py-3">
                            <div className="font-mono text-[10px] text-orange-300/70">
                              {nextProject.name}
                            </div>
                            <p className="mt-1 line-clamp-3 text-[10px] leading-relaxed text-zinc-400/90">
                              {nextProject.descriptionPlayful || nextProject.descriptionSerious}
                            </p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}
          </section>

          <section
            id="experience"
            ref={(el) => {
              sectionRefs.current.experience = el
            }}
            className="relative scroll-mt-24 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-orange-300" />
              <h2 className="text-sm font-semibold text-zinc-50">Timeline of doing stuff</h2>
            </div>
            {workExperience.length === 0 && education.length === 0 ? (
              <div className="rounded-2xl bg-black/40 p-4 text-xs text-zinc-300/85">
                No entries yet. Add entries to{' '}
                <span className="font-mono text-orange-300">workExperience</span> or{' '}
                <span className="font-mono text-orange-300">education</span> in your data file.
              </div>
            ) : (
              (() => {
                const timelineItems: Array<{
                  id: string
                  period: string
                  groupKey: string
                  type: 'work' | 'education'
                  data: typeof workExperience[0] | typeof education[0]
                }> = [
                  ...workExperience.map((job) => ({
                    id: job.id,
                    period: job.period,
                    groupKey: job.period.includes('Present') ? 'present' : job.period,
                    type: 'work' as const,
                    data: job,
                  })),
                  ...education.map((item) => ({
                    id: item.id,
                    period: item.period,
                    groupKey: item.period.includes('Present') ? 'present' : item.period,
                    type: 'education' as const,
                    data: item,
                  })),
                ]

                const groupedByPeriod = timelineItems.reduce(
                  (acc, item) => {
                    if (!acc[item.groupKey]) {
                      acc[item.groupKey] = []
                    }
                    acc[item.groupKey].push(item)
                    return acc
                  },
                  {} as Record<string, typeof timelineItems>
                )

                const sortedPeriods = Object.keys(groupedByPeriod).sort((a, b) => {
                  if (a === 'present') return -1
                  if (b === 'present') return 1
                  const aEnd = a.split(' - ')[1] || '0'
                  const bEnd = b.split(' - ')[1] || '0'
                  return bEnd.localeCompare(aEnd)
                })

                return (
                  <div className="relative mt-4 text-xs text-zinc-200/85">
                    {/* Mobile: simple stacked cards, similar to contact section */}
                    <div className="space-y-3 md:hidden">
                      {sortedPeriods.map((period) => {
                        const items = groupedByPeriod[period]
                        return items.map((item) => {
                          const isWork = item.type === 'work'
                          const base = item.data as typeof workExperience[0] & typeof education[0]
                          return (
                            <div
                              key={item.id}
                              className="rounded-2xl bg-black/40 p-4 text-[11px] text-zinc-200/85"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <p className="font-semibold text-zinc-50">
                                  {isWork ? base.role : base.school}
                                </p>
                                <span className="text-[10px] text-zinc-500">
                                  {period === 'present' ? 'Present' : period}
                                </span>
                              </div>
                              <div className="mt-1 flex flex-wrap items-baseline gap-2 text-[10px] text-zinc-400">
                                <span>
                                  {isWork ? base.company : base.degree}
                                </span>
                                {base.location && (
                                  <span className="text-zinc-500/90">· {base.location}</span>
                                )}
                              </div>
                              {base.summary && (
                                <p className="mt-2 text-[11px] leading-relaxed text-zinc-300/90">
                                  {base.summary}
                                </p>
                              )}
                            </div>
                          )
                        })
                      })}
                    </div>

                    {/* Desktop: current alternating timeline layout */}
                    <div className="hidden md:block">
                      <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 border-l border-zinc-700/70" />
                      <div className="space-y-6">
                        {sortedPeriods.map((period) => {
                          const items = groupedByPeriod[period]
                          return (
                            <div
                              key={period}
                              className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start"
                            >
                              <div className="space-y-3 md:pr-4 md:text-right">
                                {items
                                  .filter((_, idx) => idx % 2 === 0)
                                  .map((item) => (
                                    <div key={item.id} className="space-y-1">
                                      {item.type === 'work' ? (
                                        <>
                                          <div className="flex flex-wrap items-baseline justify-end gap-2">
                                            <p className="text-[11px] font-semibold text-zinc-50">
                                              {(item.data as typeof workExperience[0]).role}
                                            </p>
                                            <span className="text-[10px] text-zinc-400">
                                              · {(item.data as typeof workExperience[0]).company}
                                            </span>
                                          </div>
                                          {(item.data as typeof workExperience[0]).location && (
                                            <p className="text-[10px] text-zinc-400/90 text-right">
                                              {(item.data as typeof workExperience[0]).location}
                                            </p>
                                          )}
                                          {(item.data as typeof workExperience[0]).summary && (
                                            <p className="text-[11px] leading-relaxed text-zinc-300/90 text-right">
                                              {(item.data as typeof workExperience[0]).summary}
                                            </p>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex flex-wrap items-baseline justify-end gap-2">
                                            <p className="text-[11px] font-semibold text-zinc-50">
                                              {(item.data as typeof education[0]).school}
                                            </p>
                                            <span className="text-[10px] text-zinc-400">
                                              · {(item.data as typeof education[0]).degree}
                                            </span>
                                          </div>
                                          {(item.data as typeof education[0]).location && (
                                            <p className="text-[10px] text-zinc-400/90 text-right">
                                              {(item.data as typeof education[0]).location}
                                            </p>
                                          )}
                                          {(item.data as typeof education[0]).summary && (
                                            <p className="text-[11px] leading-relaxed text-zinc-300/90 text-right">
                                              {(item.data as typeof education[0]).summary}
                                            </p>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  ))}
                              </div>
                              <div className="flex items-center justify-center md:flex-col md:items-center md:gap-1">
                                <span className="text-[10px] font-mono text-zinc-500/80">
                                  {period === 'present' ? 'Present' : period}
                                </span>
                                <div className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.9)]" />
                              </div>
                              <div className="space-y-3">
                                {items
                                  .filter((_, idx) => idx % 2 === 1)
                                  .map((item) => (
                                    <div key={item.id} className="space-y-1">
                                      {item.type === 'work' ? (
                                        <>
                                          <div className="flex flex-wrap items-baseline gap-2">
                                            <p className="text-[11px] font-semibold text-zinc-50">
                                              {(item.data as typeof workExperience[0]).role}
                                            </p>
                                            <span className="text-[10px] text-zinc-400">
                                              · {(item.data as typeof workExperience[0]).company}
                                            </span>
                                          </div>
                                          {(item.data as typeof workExperience[0]).location && (
                                            <p className="text-[10px] text-zinc-400/90">
                                              {(item.data as typeof workExperience[0]).location}
                                            </p>
                                          )}
                                          {(item.data as typeof workExperience[0]).summary && (
                                            <p className="text-[11px] leading-relaxed text-zinc-300/90">
                                              {(item.data as typeof workExperience[0]).summary}
                                            </p>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex flex-wrap items-baseline gap-2">
                                            <p className="text-[11px] font-semibold text-zinc-50">
                                              {(item.data as typeof education[0]).school}
                                            </p>
                                            <span className="text-[10px] text-zinc-400">
                                              · {(item.data as typeof education[0]).degree}
                                            </span>
                                          </div>
                                          {(item.data as typeof education[0]).location && (
                                            <p className="text-[10px] text-zinc-400/90">
                                              {(item.data as typeof education[0]).location}
                                            </p>
                                          )}
                                          {(item.data as typeof education[0]).summary && (
                                            <p className="text-[11px] leading-relaxed text-zinc-300/90">
                                              {(item.data as typeof education[0]).summary}
                                            </p>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })()
            )}
          </section>

          <section
            id="contact"
            ref={(el) => {
              sectionRefs.current.contact = el
            }}
            className="relative scroll-mt-24 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-orange-300" />
              <h2 className="text-sm font-semibold text-zinc-50">Contact</h2>
            </div>
            <div className="rounded-2xl bg-black/40 p-4 text-xs text-zinc-200/85">
              <p className="text-[11px] text-zinc-300/90">
                Prefer{' '}
                <span className="font-mono text-orange-300">email</span> for work,{' '}
                <span className="font-mono text-orange-300">GitHub</span> for code.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.links.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-[11px] text-zinc-100"
                >
                  <Mail className="h-3.5 w-3.5 text-orange-300" />
                  <span>{profile.links.email}</span>
                </a>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-[11px] text-zinc-100"
                >
                  <Github className="h-3.5 w-3.5 text-orange-300" />
                  <span>@{profile.handle}</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

