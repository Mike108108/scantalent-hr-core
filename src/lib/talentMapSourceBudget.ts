import type { TalentMapSectionKey } from './talentMapSections'

export type SectionSourceRole = 'primary' | 'supporting' | 'context_only'

export type SectionSourceBudget = {
  primaryMax: number
  supportingMax: number
  contextMax: number
  totalMax: number
}

export const SECTION_SOURCE_BUDGETS: Record<TalentMapSectionKey, SectionSourceBudget> = {
  work_mode_and_entry: {
    primaryMax: 5,
    supportingMax: 7,
    contextMax: 3,
    totalMax: 15,
  },
  decision_style: {
    primaryMax: 4,
    supportingMax: 7,
    contextMax: 3,
    totalMax: 14,
  },
  main_talents: {
    primaryMax: 7,
    supportingMax: 8,
    contextMax: 4,
    totalMax: 19,
  },
  work_environment: {
    primaryMax: 5,
    supportingMax: 7,
    contextMax: 3,
    totalMax: 15,
  },
  communication: {
    primaryMax: 5,
    supportingMax: 6,
    contextMax: 3,
    totalMax: 14,
  },
  risks: {
    primaryMax: 6,
    supportingMax: 8,
    contextMax: 4,
    totalMax: 18,
  },
  management: {
    primaryMax: 5,
    supportingMax: 8,
    contextMax: 4,
    totalMax: 17,
  },
  development_potential: {
    primaryMax: 6,
    supportingMax: 8,
    contextMax: 4,
    totalMax: 18,
  },
}

export const DIGEST_CHAR_LIMITS: Record<SectionSourceRole, number> = {
  primary: 900,
  supporting: 650,
  context_only: 300,
}

export const SECTION_DIGEST_TOTAL_MAX = 12000
export const SECTION_DIGEST_TOTAL_TARGET = 9000

export type BudgetApplicationResult<T> = {
  selected: T[]
  omitted: T[]
}

export function applySectionBudget<T extends { source_role: SectionSourceRole }>(
  rankedItems: T[],
  budget: SectionSourceBudget,
): BudgetApplicationResult<T> {
  const selected: T[] = []
  const omitted: T[] = []

  let primaryCount = 0
  let supportingCount = 0
  let contextCount = 0

  for (const item of rankedItems) {
    if (selected.length >= budget.totalMax) {
      omitted.push(item)
      continue
    }

    switch (item.source_role) {
      case 'primary':
        if (primaryCount >= budget.primaryMax) {
          omitted.push(item)
          continue
        }
        primaryCount += 1
        selected.push(item)
        break
      case 'supporting':
        if (supportingCount >= budget.supportingMax) {
          omitted.push(item)
          continue
        }
        supportingCount += 1
        selected.push(item)
        break
      case 'context_only':
        if (contextCount >= budget.contextMax) {
          omitted.push(item)
          continue
        }
        contextCount += 1
        selected.push(item)
        break
    }
  }

  return { selected, omitted }
}
