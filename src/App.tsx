import { useEffect, useState } from 'react'
import { ModeSplitScreen } from './components/ModeSplitScreen'
import { SeriousView } from './components/SeriousView'
import { PlayfulView } from './components/PlayfulView'

type Mode = 'serious' | 'playful'

const PREFERRED_MODE_KEY = 'preferredMode'

function App() {
  const [mode, setMode] = useState<Mode>('serious')
  const [hasChosenMode, setHasChosenMode] = useState(false)
  const [showSplit, setShowSplit] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [overlayOpaque, setOverlayOpaque] = useState(false)
  const [overlayHasTransition, setOverlayHasTransition] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem(PREFERRED_MODE_KEY) as Mode | null
    if (stored === 'serious' || stored === 'playful') {
      setMode(stored)
      setHasChosenMode(true)
      setShowSplit(false)
    } else {
      setShowSplit(true)
    }
  }, [])

  const handleModeChange = (next: Mode) => {
    setMode(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PREFERRED_MODE_KEY, next)
    }
  }

  const handleOpenSplit = () => {
    if (showSplit) return

    setOverlayVisible(true)
    setOverlayHasTransition(true)
    setOverlayOpaque(false)

    setTimeout(() => {
      setOverlayOpaque(true)
    }, 0)

    setTimeout(() => {
      setShowSplit(true)
      setOverlayVisible(false)
    }, 400)
  }

  const handleModeChosenFromSplit = (next: Mode) => {
    setOverlayVisible(true)
    setOverlayHasTransition(false)
    setOverlayOpaque(true)
    setHasChosenMode(true)

    setTimeout(() => {
      handleModeChange(next)
      setShowSplit(false)
      setOverlayHasTransition(true)
      setOverlayOpaque(false)
    }, 150)

    // Remove overlay after fade duration
    setTimeout(() => {
      setOverlayVisible(false)
    }, 1000)
  }

  return (
    <div
      className={`flex min-h-screen flex-col bg-[var(--professional-bg-primary)] text-[var(--professional-text-secondary)] ${
        mode === 'playful' ? 'playful' : ''
      }`}
    >
      {mode === 'serious' && !showSplit && !overlayOpaque && (
        <header className="border-b border-[var(--professional-border)]
 bg-[var(--professional-bg-primary)] backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="text-sm font-medium text-[var(--professional-text-primary)]">Karsay Attila</div>
            {hasChosenMode && (
              <button
                type="button"
                onClick={handleOpenSplit}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--professional-border)] text-[var(--professional-text-tertiary)] transition hover:border-[var(--professional-accent)]
 hover:text-[var(--professional-text-primary)]"
                aria-label="Change view"
              >
                <span className="text-lg leading-none">⇄</span>
              </button>
            )}
          </div>
        </header>
      )}

      {mode === 'playful' && hasChosenMode && !showSplit && !overlayOpaque && (
        <button
          type="button"
          onClick={handleOpenSplit}
          className="fixed right-4 top-4 z-40 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--professional-border)] bg-[var(--professional-bg-primary)]/80 text-[var(--professional-text-tertiary)] transition hover:border-[var(--professional-accent)] hover:text-[var(--professional-text-primary)]"
          aria-label="Change view"
        >
          <span className="text-lg leading-none">⇄</span>
        </button>
      )}

      <main
        className={
          mode === 'playful'
            ? 'flex w-full flex-1 flex-col p-0'
            : 'mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6'
        }
      >
        {!hasChosenMode || showSplit ? (
          <div className="h-[60vh]" />
        ) : mode === 'serious' ? (
          <SeriousView />
        ) : (
          <PlayfulView />
        )}
      </main>

      {overlayVisible && (
        <div
          className={`pointer-events-none fixed inset-0 z-50 bg-black ${
            overlayHasTransition ? 'transition-opacity duration-[400ms]' : ''
          } ${overlayOpaque ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {!showSplit && !overlayOpaque && (
        <footer className="mt-auto border-t border-[var(--footer-border)]
bg-[var(--footer-bg)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-xs text-[var(--footer-text)]">
            <span>Built with React, Vite & Bun</span>
            <a
              href="https://github.com/SSnowly"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--footer-link-muted)] hover:text-[var(--footer-link)]"
            >
              github.com/SSnowly
            </a>
          </div>
        </footer>
      )}

      {showSplit || !hasChosenMode ? (
        <ModeSplitScreen initialMode={mode} onModeChosen={handleModeChosenFromSplit} />
      ) : null}
    </div>
  )
}

export default App
