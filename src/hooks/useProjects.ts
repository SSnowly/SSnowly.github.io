import { useEffect, useState } from 'react'
import { projects as staticProjects, type Project } from '../data/projects'
import { githubProjectOverrides } from '../data/githubOverrides'

const GITHUB_CACHE_KEY = 'githubProjectsCacheV2'
const ONE_DAY_MS = 24 * 60 * 60 * 1000
const GITHUB_REPO_BLACKLIST = new Set([
  'ai_forum_moderator',
  'coxredirect',
  'cs-metro',
  'doj-panels',
  'fluffy_dutyzones',
  'fluffy-docs',
  'foz-hud',
  'modrinthmanager',
])

type GithubCachePayload = {
  fetchedAt: string
  projects: Project[]
}

function mergeProjects(staticOnes: Project[], fromGithub: Project[]): Project[] {
  if (fromGithub.length === 0) return staticOnes

  const githubUrls = new Set(
    fromGithub
      .map((p) => p.githubUrl)
      .filter((url): url is string => Boolean(url)),
  )

  const filteredStatic = staticOnes.filter((p) => {
    if (!p.githubUrl) return true
    return !githubUrls.has(p.githubUrl)
  })

  return [...filteredStatic, ...fromGithub]
}

function applyGithubOverrides(project: Project): Project {
  if (!project.githubUrl) return project

  const slug = project.githubUrl.split('/').slice(-1)[0]?.toLowerCase() ?? ''
  const override = githubProjectOverrides[slug]
  if (!override) return project

  return { ...project, ...override }
}

export function useProjects() {
  const [allProjects, setAllProjects] = useState<Project[]>(staticProjects)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let cancelled = false

    const load = async () => {
      try {
        const cachedRaw = window.localStorage.getItem(GITHUB_CACHE_KEY)
        if (cachedRaw) {
          const cached: GithubCachePayload = JSON.parse(cachedRaw)
          const age = Date.now() - new Date(cached.fetchedAt).getTime()
          if (age < ONE_DAY_MS && cached.projects?.length) {
            const filteredCached = cached.projects
              .filter(
                (p) =>
                  !p.githubUrl ||
                  !GITHUB_REPO_BLACKLIST.has(
                    p.githubUrl.split('/').slice(-1)[0]?.toLowerCase() ?? '',
                  ),
              )
              .map(applyGithubOverrides)
              .slice(0, 6)

            if (!cancelled) {
              setAllProjects(mergeProjects(staticProjects, filteredCached))
            }
            return
          }
        }

        const response = await fetch(
          'https://api.github.com/users/SSnowly/repos?per_page=100',
        )
        if (!response.ok) {
          return
        }

        const repos: any[] = await response.json()

        const githubProjects: Project[] = repos
          .filter(
            (repo) => !repo.fork && !GITHUB_REPO_BLACKLIST.has(String(repo.name).toLowerCase()),
          )
          .slice(0, 6)
          .map((repo) => {
            const language = typeof repo.language === 'string' ? repo.language : ''

            const tech: string[] = []
            if (language) tech.push(language)

            const base: Project = {
              id: `github-${repo.id}`,
              name: repo.name,
              descriptionSerious: repo.description || 'GitHub repository',
              descriptionPlayful: repo.description || 'GitHub repository',
              tech,
              githubUrl: repo.html_url,
              liveUrl: repo.homepage || undefined,
              pinned: false,
            }

            return applyGithubOverrides(base)
          })

        const payload: GithubCachePayload = {
          fetchedAt: new Date().toISOString(),
          projects: githubProjects,
        }

        window.localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(payload))

        if (!cancelled) {
          setAllProjects(mergeProjects(staticProjects, githubProjects))
        }
      } catch {
        // ignore network / JSON errors, keep static projects
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return allProjects
}

