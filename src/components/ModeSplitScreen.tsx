import { useEffect, useRef, useState } from 'react'

type Mode = 'serious' | 'playful'

type ModeSplitScreenProps = {
  initialMode: Mode
  onModeChosen: (mode: Mode) => void
}

export function ModeSplitScreen({ initialMode, onModeChosen }: ModeSplitScreenProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [splitRatio, setSplitRatio] = useState(0.5)
  const [dragging, setDragging] = useState(false)
  const [exiting, setExiting] = useState(false)
  const dragOffsetRef = useRef(0)
  const lastXRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const velocityRef = useRef(0)

  useEffect(() => {
    if (initialMode === 'serious') {
      setSplitRatio(0.55)
    } else {
      setSplitRatio(0.45)
    }
  }, [initialMode])

  useEffect(() => {
    if (!dragging) return

    const SOFT_THRESHOLD = 0.3
    const HARD_THRESHOLD = 0.7

    const finishDrag = (currentRatio: number) => {
      const chosen: Mode = currentRatio >= 0.5 ? 'serious' : 'playful'
      const targetRatio = chosen === 'serious' ? 1.5 : -0.5

      setSplitRatio(targetRatio)

      const slideDuration = 220
      const fadeDuration = 220

      setTimeout(() => {
        setExiting(true)
        setTimeout(() => {
          onModeChosen(chosen)
        }, fadeDuration)
      }, slideDuration)
    }

    const handleMove = (event: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left - dragOffsetRef.current

      const now = performance.now()
      if (lastXRef.current != null && lastTimeRef.current != null) {
        const dx = x - lastXRef.current
        const dt = now - lastTimeRef.current || 1
        const v = dx / dt
        velocityRef.current = v * 0.5 + velocityRef.current * 0.5
      }
      lastXRef.current = x
      lastTimeRef.current = now

      const ratio = x / rect.width
      const clamped = Math.min(0.9, Math.max(0.1, ratio))
      setSplitRatio(clamped)

       const offset = Math.abs((clamped - 0.5) * 2)
       if (offset > HARD_THRESHOLD) {
         setDragging(false)
         finishDrag(clamped)
       }
    }

    const handleUp = () => {
      setDragging(false)

      const velocity = velocityRef.current
      velocityRef.current = 0
      lastXRef.current = null
      lastTimeRef.current = null

      const offset = Math.abs((splitRatio - 0.5) * 2)
      const VELOCITY_THRESHOLD = 0.003

      if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
        const chosen: Mode = velocity > 0 ? 'serious' : 'playful'
        const targetRatio = chosen === 'serious' ? 1.5 : -0.5
        setSplitRatio(targetRatio)

        const slideDuration = 220
        const fadeDuration = 220

        setTimeout(() => {
          setExiting(true)
          setTimeout(() => {
            onModeChosen(chosen)
          }, fadeDuration)
        }, slideDuration)
      } else {
        if (offset < SOFT_THRESHOLD) {
          return
        }
        finishDrag(splitRatio)
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [dragging, onModeChosen, splitRatio])

  const angleDeg = 24
  const barWidth = 4
  const bandWidth = 18 // how wide the diagonal band is, in vw-ish %

  const splitPercent = splitRatio * 100
  const leftClip = `polygon(0 0, ${splitPercent - bandWidth}% 0, ${
    splitPercent + bandWidth
  }% 100%, 0 100%)`
  const rightClip = `polygon(${splitPercent - bandWidth}% 0, 100% 0, 100% 100%, ${
    splitPercent + bandWidth
  }% 100%)`

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 select-none bg-[var(--professional-bg-primary)] text-[var(--professional-text-secondary)] transition-opacity duration-300 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[var(--professional-bg-primary)]" />

      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="absolute top-8 left-1/2 z-20 -translate-x-1/2 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[var(--professional-text-secondary)]0">
            Choose your reality
          </p>
          <p className="mt-3 text-sm text-[var(--professional-text-tertiary)]">
            Drag the tilted bar. Release on the side you want.
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 bg-gradient-to-br from-[var(--professional-bg-primary)] via-[var(--professional-bg-secondary)] to-[var(--professional-bg-tertiary)]"
            style={{
              clipPath: leftClip,
              transition: dragging ? 'none' : 'clip-path 220ms ease-out',
            }}
          >
            <div className="flex h-full flex-col justify-between px-10 py-16">
              <div className="max-w-xs">
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--professional-text-secondary)]0">
                  Serious
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--professional-text-secondary)]">
                  Recruiter friendly layout
                </h2>
                <p className="mt-3 text-xs text-[var(--professional-text-tertiary)]">
                  Compact GitHub-style overview. Projects and stack first,
                  jokes later.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] text-[var(--professional-text-tertiary)]">
                <span className="rounded-full bg-[var(--professional-bg-tertiary)]/80 px-3 py-1">
                  Pinned projects
                </span>
                <span className="rounded-full bg-[var(--professional-bg-tertiary)]/80 px-3 py-1">
                  Tech stack
                </span>
                <span className="rounded-full bg-[var(--professional-bg-tertiary)]/80 px-3 py-1">
                  Timeline
                </span>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 bg-gradient-to-bl from-[var(--professional-bg-tertiary)] via-[var(--professional-bg-primary)] to-[var(--professional-bg-secondary)]"
            style={{
              clipPath: rightClip,
              transition: dragging ? 'none' : 'clip-path 220ms ease-out',
            }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(249,115,22,0.45),transparent_65%)] opacity-80 mix-blend-screen" />
            </div>
            <div className="relative flex h-full flex-col items-end justify-between px-10 py-16">
              <div className="max-w-xs text-right">
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--professional-text-secondary)]/80">
                  Playful
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--professional-text-secondary)]">
                  Same data, different vibe
                </h2>
                <p className="mt-3 text-xs text-[var(--professional-text-secondary)]">
                  Less Serious, no loss of information.
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2 text-[10px] text-[var(--professional-text-secondary)]/90">
                <span className="rounded-full bg-[var(--professional-border)]/60 px-3 py-1">
                  Less Serious
                </span>
                <span className="rounded-full bg-[var(--professional-border)]/40 px-3 py-1">
                  Soft animations
                </span>
                <span className="rounded-full bg-[var(--professional-border)]/30 px-3 py-1">
                  Same projects
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          role="slider"
          aria-label="Choose between serious and playful views"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(splitRatio * 100)}
          onMouseDown={(event) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const currentX = splitRatio * rect.width
            dragOffsetRef.current = event.clientX - rect.left - currentX
            setDragging(true)
          }}
          className="pointer-events-auto relative"
          style={{
            transform: `translateX(${(splitRatio - 0.5) * 100}vw) rotate(${-angleDeg-2}deg)`,
            transition: dragging ? 'none' : 'transform 200ms ease-out',
            cursor: dragging ? 'grabbing' as const : 'grab',
          }}
        >
          <div
            className="rounded-full bg-[var(--professional-text-secondary)]/90 shadow-[0_0_40px_rgba(201,209,217,0.7)]"
            style={{
              width: `${barWidth}px`,
              height: '150vh',
            }}
          />
        </div>
      </div>
    </div>
  )
}

