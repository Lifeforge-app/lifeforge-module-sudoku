import { memo } from 'react'

import {
  Box,
  Flex,
  Grid,
  Text,
  Transition,
  colorWithOpacity
} from '@lifeforge/ui'

import {
  type CellContentProps,
  NUMBERS
} from '../../../../../../constants/constants'

function CellContent({
  cellValue,
  isOriginal,
  isSelected,
  isThemeDark,
  highlightedNumber,
  hasViolation,
  isIncorrect,
  cellCandidates
}: CellContentProps) {
  // Render main value (original or user input)
  if (cellValue) {
    const isHighlighted = highlightedNumber === cellValue

    const hasError = hasViolation || isIncorrect

    return (
      <Transition property="all">
        <Text
          asChild
          color={
            isSelected
              ? isThemeDark
                ? 'bg-50'
                : 'bg-900'
              : hasError
                ? { base: 'red-600', dark: 'red-400' }
                : isOriginal
                  ? { base: 'bg-800', dark: 'bg-100' }
                  : { base: 'custom-600', dark: 'custom-400' }
          }
          size={{ sm: 'lg' }}
          weight="medium"
        >
          <Flex
            centered
            as="span"
            bg={
              isSelected
                ? hasError
                  ? 'red-500'
                  : 'primary'
                : isHighlighted
                  ? hasError
                    ? colorWithOpacity('red-500', '20%')
                    : colorWithOpacity('primary', '20%')
                  : undefined
            }
            height="85%"
            position="relative"
            r="full"
            width="85%"
          >
            {cellValue}
          </Flex>
        </Text>
      </Transition>
    )
  }

  // Render candidates
  if (cellCandidates.size > 0) {
    // Check if any candidate matches the highlighted number
    const hasHighlightedCandidate =
      highlightedNumber !== null &&
      cellCandidates.has(Number(highlightedNumber))

    return (
      <Box
        bg={
          isSelected || hasHighlightedCandidate
            ? colorWithOpacity('primary', '20%')
            : undefined
        }
        height="85%"
        position="relative"
        r="full"
        style={{ padding: '0.125rem' }}
        width="85%"
      >
        <Grid height="100%" templateCols={3} templateRows={3} width="100%">
          {NUMBERS.map(num => {
            const hasCandidate = cellCandidates.has(num)

            const isHighlighted = highlightedNumber === String(num)

            return (
              <Transition key={num} property="all">
                <Text
                  asChild
                  color={
                    hasCandidate
                      ? isHighlighted
                        ? 'primary'
                        : 'muted'
                      : undefined
                  }
                  leading="none"
                  weight={hasCandidate && isHighlighted ? 'bold' : undefined}
                >
                  <Flex
                    centered
                    as="span"
                    style={{ fontSize: 'clamp(0.5rem, 2vw, 0.75rem)' }}
                  >
                    {hasCandidate ? num : ''}
                  </Flex>
                </Text>
              </Transition>
            )
          })}
        </Grid>
      </Box>
    )
  }

  // Empty selected cell
  if (isSelected) {
    return (
      <Flex
        centered
        bg={colorWithOpacity('primary', '20%')}
        height="85%"
        position="relative"
        r="full"
        width="85%"
      />
    )
  }

  return null
}

export default memo(CellContent)
