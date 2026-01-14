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
  const [diagonalAngle, setDiagonalAngle] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const dragOffsetRef = useRef(0)
  const lastXRef = useRef<number | null>(null)
  const lastYRef = useRef<number | null>(null)
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
    const updateLayout = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      if (!mobile) {
        const bandWidth = 18
        const aspectRatio = window.innerWidth / window.innerHeight
        const horizontalChange = (2 * bandWidth / 100) * aspectRatio
        const angleRad = Math.atan(horizontalChange)
        const angleDeg = (angleRad * 180) / Math.PI
        setDiagonalAngle(angleDeg)
      }
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  useEffect(() => {
    if (!dragging) return

    const SOFT_THRESHOLD = 0.3
    const HARD_THRESHOLD = 0.7

    const finishDrag = (currentRatio: number) => {
      const chosen: Mode = isMobile
        ? (currentRatio >= 0.5 ? 'playful' : 'serious')
        : (currentRatio >= 0.5 ? 'serious' : 'playful')
      const targetRatio = isMobile
        ? (chosen === 'serious' ? -0.5 : 1.5)
        : (chosen === 'serious' ? 1.5 : -0.5)

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

    const handleMove = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
      
      let value: number
      if (isMobile) {
        const y = clientY - rect.top - dragOffsetRef.current
        const now = performance.now()
        if (lastYRef.current != null && lastTimeRef.current != null) {
          const dy = y - lastYRef.current
          const dt = now - lastTimeRef.current || 1
          const v = dy / dt
          velocityRef.current = v * 0.5 + velocityRef.current * 0.5
        }
        lastYRef.current = y
        lastTimeRef.current = now
        value = y / rect.height
      } else {
        const x = clientX - rect.left - dragOffsetRef.current
        const now = performance.now()
        if (lastXRef.current != null && lastTimeRef.current != null) {
          const dx = x - lastXRef.current
          const dt = now - lastTimeRef.current || 1
          const v = dx / dt
          velocityRef.current = v * 0.5 + velocityRef.current * 0.5
        }
        lastXRef.current = x
        lastTimeRef.current = now
        value = x / rect.width
      }

      const clamped = Math.min(0.9, Math.max(0.1, value))
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
      lastYRef.current = null
      lastTimeRef.current = null

      const offset = Math.abs((splitRatio - 0.5) * 2)
      const VELOCITY_THRESHOLD = 0.003

      if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
        const chosen: Mode = isMobile 
          ? (velocity > 0 ? 'playful' : 'serious')
          : (velocity > 0 ? 'serious' : 'playful')
        const targetRatio = isMobile
          ? (chosen === 'serious' ? -0.5 : 1.5)
          : (chosen === 'serious' ? 1.5 : -0.5)
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
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [dragging, onModeChosen, splitRatio, isMobile])

  const barWidth = 4
  const bandWidth = 18

  const splitPercent = splitRatio * 100
  const topY = Math.max(0, Math.min(100, splitPercent - bandWidth))
  const bottomY = Math.max(topY, Math.min(100, splitPercent + bandWidth))
  
  const leftClip = isMobile
    ? `polygon(0% ${topY}%, 100% ${bottomY}%, 100% 100%, 0% 100%)`
    : `polygon(0 0, ${splitPercent - bandWidth}% 0, ${
        splitPercent + bandWidth
      }% 100%, 0 100%)`
  const rightClip = isMobile
    ? `polygon(0% 0%, 100% 0%, 100% ${bottomY}%, 0% ${topY}%)`
    : `polygon(${splitPercent - bandWidth}% 0, 100% 0, 100% 100%, ${
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
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[var(--professional-text-secondary)]0 mb-2">
            Choose your reality
          </p>
          <p className="text-sm text-[var(--professional-text-tertiary)] mt-2">
            {isMobile ? 'Drag the bar up or down. Release on the side you want.' : 'Drag the tilted bar. Release on the side you want.'}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute inset-0 ${
              isMobile
                ? 'bg-gradient-to-b from-[var(--professional-bg-primary)] via-[var(--professional-bg-secondary)] to-[var(--professional-bg-tertiary)]'
                : 'bg-gradient-to-br from-[var(--professional-bg-primary)] via-[var(--professional-bg-secondary)] to-[var(--professional-bg-tertiary)]'
            }`}
            style={{
              clipPath: isMobile ? rightClip : leftClip,
              transition: dragging || isMobile ? 'none' : 'clip-path 220ms ease-out',
            }}
          >
            <div className={`flex h-full flex-col ${isMobile ? 'justify-start' : 'justify-between'} px-10 py-16`}>
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
              {!isMobile && (
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
              )}
            </div>
          </div>

          <div
            className={`absolute inset-0 ${
              isMobile
                ? 'bg-gradient-to-t from-[var(--professional-bg-tertiary)] via-[var(--professional-bg-primary)] to-[var(--professional-bg-secondary)]'
                : 'bg-gradient-to-bl from-[var(--professional-bg-tertiary)] via-[var(--professional-bg-primary)] to-[var(--professional-bg-secondary)]'
            }`}
            style={{
              clipPath: isMobile ? leftClip : rightClip,
              transition: dragging || isMobile ? 'none' : 'clip-path 220ms ease-out',
            }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className={`absolute inset-0 bg-[radial-gradient(circle_at_${isMobile ? '50%_100%' : '85%_0%'},rgba(249,115,22,0.45),transparent_65%)] opacity-80 mix-blend-screen`} />
            </div>
            <div className={`relative flex h-full flex-col items-end ${isMobile ? 'justify-end' : 'justify-between'} px-10 py-16`}>
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
              {!isMobile && (
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
              )}
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
            if (isMobile) {
              const currentY = splitRatio * rect.height
              dragOffsetRef.current = event.clientY - rect.top - currentY
            } else {
              const currentX = splitRatio * rect.width
              dragOffsetRef.current = event.clientX - rect.left - currentX
            }
            setDragging(true)
          }}
          onTouchStart={(event) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const currentY = splitRatio * rect.height
            dragOffsetRef.current = event.touches[0].clientY - rect.top - currentY
            setDragging(true)
          }}
          className="pointer-events-auto relative"
          style={{
            transform: isMobile
              ? `translateY(${(splitRatio - 0.5) * 100}vh)`
              : `translateX(${(splitRatio - 0.5) * 100}vw)`,
            transition: dragging ? 'none' : 'transform 200ms ease-out',
            cursor: dragging ? 'grabbing' as const : 'grab',
          }}
        >
          <div
            style={{
              transform: isMobile ? 'none' : `rotate(${-diagonalAngle}deg)`,
            }}
          >
            <div
              className="rounded-full bg-[var(--professional-text-secondary)]/90 shadow-[0_0_40px_rgba(201,209,217,0.7)]"
              style={{
                width: isMobile ? '150vw' : `${barWidth}px`,
                height: isMobile ? `${barWidth}px` : '150vh',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

