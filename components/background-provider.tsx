"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"
import { z } from "zod"

import type { BackgroundStyle } from "@/components/animated/animated-backgrounds"

const backgroundStyles = [
  "matrix",
  "circuit",
  "pixel-rain",
  "ascii-waves",
  "binary-grid",
  "terminal-glitch",
] as const

const backgroundSchema = z.object({
  style: z.enum(backgroundStyles),
  autoRotate: z.boolean(),
})

type BackgroundState = z.infer<typeof backgroundSchema>

const STORAGE_KEY = "raise-me.background"

const defaultState: BackgroundState = {
  style: "matrix",
  autoRotate: true,
}

type BackgroundContextValue = {
  style: BackgroundStyle
  autoRotate: boolean
  setStyle: (style: BackgroundStyle) => void
  setAutoRotate: (value: boolean) => void
  toggleAutoRotate: () => void
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null)

const readStoredState = (): BackgroundState => {
  if (typeof window === "undefined") {
    return defaultState
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultState
    }

    const parsed = backgroundSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : defaultState
  } catch {
    return defaultState
  }
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BackgroundState>(defaultState)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setState(readStoredState())
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [isReady, state])

  useEffect(() => {
    if (!state.autoRotate) return

    const interval = window.setInterval(() => {
      setState((prev) => {
        const currentIndex = backgroundStyles.indexOf(prev.style)
        const nextIndex =
          currentIndex === -1 ? 0 : (currentIndex + 1) % backgroundStyles.length
        return { ...prev, style: backgroundStyles[nextIndex] }
      })
    }, 3000)

    return () => window.clearInterval(interval)
  }, [state.autoRotate])

  const updateState = useCallback(
    (updater: (prev: BackgroundState) => BackgroundState) => {
      setState((prev) => {
        const next = updater(prev)
        const parsed = backgroundSchema.safeParse(next)
        return parsed.success ? parsed.data : prev
      })
    },
    []
  )

  const setStyle = useCallback(
    (style: BackgroundStyle) => {
      updateState((prev) => ({ ...prev, style }))
    },
    [updateState]
  )

  const setAutoRotate = useCallback(
    (value: boolean) => {
      updateState((prev) => ({ ...prev, autoRotate: value }))
    },
    [updateState]
  )

  const toggleAutoRotate = useCallback(() => {
    updateState((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))
  }, [updateState])

  const value = useMemo<BackgroundContextValue>(
    () => ({
      style: state.style,
      autoRotate: state.autoRotate,
      setStyle,
      setAutoRotate,
      toggleAutoRotate,
    }),
    [setAutoRotate, setStyle, state.autoRotate, state.style, toggleAutoRotate]
  )

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (!context) {
    throw new Error("useBackground must be used within BackgroundProvider")
  }
  return context
}
