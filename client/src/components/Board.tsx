import { Bordered, Box, Flex, Grid, Text } from '@lifeforge/ui'

import type { SudokuBoard } from '..'

function Board({
  data,
  showSolution,
  boardCount
}: {
  data: SudokuBoard
  showSolution?: boolean
  boardCount: number
}) {
  return (
    <Box aspectRatio="1" p="md" width="100%">
      <Bordered
        asChild
        borderColor={{ base: 'bg-800', dark: 'bg-100', print: 'black' }}
        borderWidth="3px"
      >
        <Grid height="100%" position="relative" templateCols={9} width="100%">
          {Array(9)
            .fill(0)
            .map((_, j) => (
              <Bordered
                key={j}
                asChild
                borderColor={{ base: 'bg-500', print: 'bg-400' }}
                borderSide={![2, 5, 8].includes(j) ? 'right' : 'none'}
              >
                <Grid height="100%" templateRows={9} width="100%">
                  {Array(9)
                    .fill(0)
                    .map((_, k) => (
                      <Bordered
                        key={k}
                        asChild
                        borderColor={{ base: 'bg-500', print: 'bg-400' }}
                        borderSide={![2, 5, 8].includes(k) ? 'bottom' : 'none'}
                      >
                        <Flex centered height="100%" width="100%">
                          {(() => {
                            const target = showSolution
                              ? data.solution
                              : data.mission

                            const value = target[k * 9 + j]

                            const isSolutionEmpty =
                              showSolution && data.mission[k * 9 + j] === '0'

                            return (
                              <Text
                                align="center"
                                color={isSolutionEmpty ? 'primary' : undefined}
                                display={
                                  isSolutionEmpty
                                    ? { print: 'none' }
                                    : undefined
                                }
                                size={{
                                  print: boardCount === 1 ? '3xl' : 'base'
                                }}
                                weight="medium"
                              >
                                {value !== '0' && value}
                              </Text>
                            )
                          })()}
                        </Flex>
                      </Bordered>
                    ))}
                </Grid>
              </Bordered>
            ))}
          <Flex
            height="100%"
            justify="evenly"
            left="0"
            position="absolute"
            top="0"
            width="100%"
          >
            {Array(2)
              .fill(0)
              .map((_, j) => (
                <Box
                  key={j}
                  bg={{ base: 'bg-800', dark: 'bg-100', print: 'black' }}
                  height="100%"
                  width="2px"
                />
              ))}
          </Flex>
          <Flex
            direction="column"
            height="100%"
            justify="evenly"
            left="0"
            position="absolute"
            top="0"
            width="100%"
          >
            {Array(2)
              .fill(0)
              .map((_, j) => (
                <Box
                  key={j}
                  bg={{ base: 'bg-800', dark: 'bg-100', print: 'black' }}
                  height="2px"
                  width="100%"
                />
              ))}
          </Flex>
        </Grid>
      </Bordered>
    </Box>
  )
}

export default Board
