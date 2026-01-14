import { profile } from '../data/profile'
import { education, workExperience } from '../data/experience'
import { useProjects } from '../hooks/useProjects'
import { Github, ExternalLink } from 'lucide-react'
import { SiJavascript, SiTypescript, SiNodedotjs, SiBun, SiGit, SiTailwindcss, SiReact, SiPhp } from 'react-icons/si'

export function SeriousView() {
  const projects = useProjects()
  const pinned = projects.filter((p) => p.pinned)
  const rest = projects.filter((p) => !p.pinned)

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.7fr)]">
      <section className="space-y-4">
        <div className="flex items-start gap-4 rounded-2xl border border-[var(--professional-border)]
 bg-[var(--professional-bg-secondary)]/80 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--professional-bg-tertiary)] text-lg font-semibold text-[var(--professional-text-primary)]">
            {profile.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-lg font-semibold text-[var(--professional-text-secondary)]">
                {profile.name}
              </h1>
              <span className="text-xs font-mono text-[var(--professional-text-secondary)]0">
                @{profile.handle}
              </span>
            </div>
            {profile.title && (
              <p className="text-sm text-[var(--professional-text-secondary)]">{profile.title}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--professional-text-tertiary)]">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-[var(--professional-border)] bg-[var(--professional-bg-secondary)]/80 px-2.5 py-1 hover:border-[var(--professional-accent)]
 hover:text-[var(--professional-text-primary)]"
              >
                <span className="inline-block h-3 w-3">
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="h-3 w-3 fill-current"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
                </span>
                <span>GitHub</span>
              </a>
              {profile.links.email && (
                <a
                  href={`mailto:${profile.links.email}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--professional-border)] bg-[var(--professional-bg-secondary)]/80 px-2.5 py-1 hover:border-[var(--professional-accent)]
 hover:text-[var(--professional-text-primary)]"
                >
                  <span className="inline-block h-3 w-3">
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="h-3 w-3 fill-current"
                    >
                      <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5v-9Zm1.75-.5a.75.75 0 0 0-.53.22L8 7.5l4.78-4.28a.75.75 0 0 0-.53-.22h-8.5Zm9.25 1.31-3.9 3.49 3.9 3.18v-6.67Zm-1.06 7.19-3.86-3.15L8 8.9l-.08-.06-3.86 3.16h7.88ZM3 11.47l3.9-3.48L3 4.53v6.94Z" />
                    </svg>
                  </span>
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--professional-border)] bg-[var(--professional-bg-secondary)]/70 p-4 text-xs text-[var(--professional-text-tertiary)] space-y-4">
          <div>
            <p className="font-medium text-[var(--professional-text-secondary)]">About</p>
            {profile.shortBio ? (
              <p className="mt-2 leading-relaxed">{profile.shortBio}</p>
            ) : (
              <p className="mt-2 leading-relaxed text-[var(--professional-text-secondary)]0">
                Add a short description about what you like to build and how you
                work. Keep it focused and concrete.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-[var(--professional-text-secondary)]">Tech stack</p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'js', label: 'JavaScript', Icon: SiJavascript },
                { key: 'ts', label: 'TypeScript', Icon: SiTypescript },
                { key: 'node', label: 'Node.js', Icon: SiNodedotjs },
                { key: 'bun', label: 'Bun', Icon: SiBun },
                { key: 'git', label: 'Git', Icon: SiGit },
                { key: 'tailwind', label: 'Tailwind CSS', Icon: SiTailwindcss },
                { key: 'react', label: 'React', Icon: SiReact },
                { key: 'php', label: 'PHP', Icon: SiPhp },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="group relative flex h-7 w-7 items-center justify-center rounded-full border border-[var(--professional-border)] bg-[var(--professional-bg-secondary)]/80 hover:border-[var(--professional-accent)]"
                  aria-label={item.label}
                >
                  <item.Icon className="h-4 w-4 pointer-events-none" />
                  <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--professional-bg-tertiary)] px-2 py-0.5 text-[10px] text-[var(--professional-text-primary)] opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--professional-text-primary)]">Experience</h2>
          {workExperience.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--professional-border)]
 bg-[var(--professional-bg-secondary)]/40 p-4 text-xs text-[var(--professional-text-secondary)]0">
              Add entries to <span className="font-mono">workExperience</span>{' '}
              in your data file to show your roles here.
            </div>
          ) : (
            <div className="space-y-3">
              {workExperience.map((job) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-[var(--professional-border)]
 bg-[var(--professional-bg-secondary)]/80 p-4 text-xs text-[var(--professional-text-tertiary)]"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold text-[var(--professional-text-primary)]">
                        {job.role}
                      </p>
                      <p className="text-[11px] text-[var(--professional-text-tertiary)]">
                        {job.company}
                      </p>
                    </div>
                    <p className="text-[10px] text-[var(--professional-text-secondary)]0">{job.period}</p>
                  </div>
                  {job.location && (
                    <p className="mt-1 text-[10px] text-[var(--professional-text-secondary)]0">
                      {job.location}
                    </p>
                  )}
                  {job.summary && (
                    <p className="mt-2 text-[11px] leading-relaxed text-[var(--professional-text-tertiary)]">
                      {job.summary}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--professional-text-primary)]">Education</h2>
          {education.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--professional-border)]
 bg-[var(--professional-bg-secondary)]/40 p-4 text-xs text-[var(--professional-text-secondary)]0">
              Add entries to <span className="font-mono">education</span> in
              your data file to show your studies here.
            </div>
          ) : (
            <div className="space-y-3">
              {education.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[var(--professional-border)]
 bg-[var(--professional-bg-secondary)]/80 p-4 text-xs text-[var(--professional-text-tertiary)]"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold text-[var(--professional-text-primary)]">
                        {item.school}
                      </p>
                      <p className="text-[11px] text-[var(--professional-text-tertiary)]">
                        {item.degree}
                      </p>
                    </div>
                    <p className="text-[10px] text-[var(--professional-text-secondary)]0">{item.period}</p>
                  </div>
                  {item.location && (
                    <p className="mt-1 text-[10px] text-[var(--professional-text-secondary)]0">
                      {item.location}
                    </p>
                  )}
                  {item.summary && (
                    <p className="mt-2 text-[11px] leading-relaxed text-[var(--professional-text-tertiary)]">
                      {item.summary}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--professional-text-primary)]">
              Pinned projects
            </h2>
          </div>

          {pinned.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--professional-border)]
 bg-[var(--professional-bg-secondary)]/40 p-4 text-xs text-[var(--professional-text-secondary)]0">
              No pinned projects yet. Mark items in your data as{' '}
              <span className="font-mono text-[var(--professional-text-tertiary)]">pinned: true</span> to
              show them here.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {pinned.map((project) => (
                <article
                  key={project.id}
                  className="flex flex-col rounded-xl border border-[var(--professional-border)]
bg-[var(--professional-bg-secondary)]/80 p-4 text-xs text-[var(--professional-text-tertiary)] transition hover:border-[var(--professional-text-tertiary)] hover:bg-[var(--professional-bg-secondary)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={project.githubUrl || project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-medium text-[var(--professional-text-secondary)] hover:text-[var(--professional-text-primary)]"
                    >
                      {project.name}
                    </a>
                    <div className="flex shrink-0 gap-1">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-[var(--professional-border)] p-1.5 text-[var(--professional-text-tertiary)] hover:border-[var(--professional-accent)]"
                          aria-label="View code on GitHub"
                        >
                          <Github className="h-3 w-3" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-[var(--professional-border)] p-1.5 text-[var(--professional-text-tertiary)] hover:border-[var(--professional-accent)]"
                          aria-label="View live site"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-3 text-[11px] text-[var(--professional-text-tertiary)]">
                    {project.descriptionSerious}
                  </p>
                  {project.tech.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-[var(--professional-bg-tertiary)]/80 px-2 py-0.5 text-[10px] text-[var(--professional-text-tertiary)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-[var(--professional-text-tertiary)]">
                Other projects
              </h3>
              <div className="space-y-2">
                {rest.map((project) => (
                  <article
                    key={project.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--professional-border)]
bg-[var(--professional-bg-secondary)]/60 px-3 py-2 text-xs text-[var(--professional-text-tertiary)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium text-[var(--professional-text-primary)]">
                        {project.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-[var(--professional-text-secondary)]0">
                        {project.descriptionSerious}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full border border-[var(--professional-border)] p-1 text-[var(--professional-text-tertiary)] hover:border-[var(--professional-accent)]"
                            aria-label="View code on GitHub"
                          >
                            <Github className="h-3 w-3" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full border border-[var(--professional-border)] p-1 text-[var(--professional-text-tertiary)] hover:border-[var(--professional-accent)]"
                            aria-label="View live site"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    {project.tech[0] && (
                      <span className="shrink-0 rounded-full bg-[var(--professional-bg-tertiary)]/80 px-2 py-0.5 text-[10px] text-[var(--professional-text-tertiary)]">
                        {project.tech[0]}
                      </span>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

