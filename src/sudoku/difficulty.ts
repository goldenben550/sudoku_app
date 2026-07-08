import type { Difficulty } from './types'

const CLUE_RANGES: Record<Difficulty, [min: number, max: number]> = {
  easy: [40, 45],
  medium: [32, 35],
  hard: [26, 29],
}

export function randomClueTarget(difficulty: Difficulty): number {
  const [min, max] = CLUE_RANGES[difficulty]
  return min + Math.floor(Math.random() * (max - min + 1))
}

export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
