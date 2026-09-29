import type { SudokuBoard } from '@'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useReactToPrint } from 'react-to-print'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Button,
  Flex,
  GoBackButton,
  Grid,
  PrintArea,
  Text,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import Board from '../../components/Board'

function Print() {
  const { t } = useModuleTranslation()
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const printRef = useRef<HTMLDivElement>(null)

  const sessionQuery = useQuery({
    ...forgeAPI.sessions.get.input({ id: sessionId! }).queryOptions(),
    enabled: !!sessionId
  })

  const fontQuery = useQuery(
    forgeAPI.getGoogleFont({ family: 'Rubik' }).queryOptions()
  )

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    fonts: fontQuery.data?.items?.length
      ? [
          {
            family: fontQuery.data.items[0].family,
            source: fontQuery.data.items[0].files.regular || ''
          }
        ]
      : [],
    documentTitle: `Sudoku - ${sessionQuery.data?.session.created ? dayjs(sessionQuery.data.session.created).format('DD MMM YYYY') : 'Session'}`
  })

  const boards: SudokuBoard[] =
    sessionQuery.data?.entries.map(entry => entry.board as SudokuBoard) || []

  const difficulty = sessionQuery.data?.entries[0]?.difficulty || 'unknown'

  const createdDate = sessionQuery.data?.session.created

  return (
    <Flex direction="column" flex="1">
      <GoBackButton onClick={() => navigate('/sudoku')} />

      <WithQuery query={sessionQuery}>
        {() => (
          <>
            {/* Print Controls */}
            <Flex align="center" justify="between" mb="lg">
              <Box>
                <Text as="h1" size="2xl" weight="medium">
                  {t('headers.printPreview')}
                </Text>
                <Text as="p" color="muted" mt="xs">
                  {t('difficulties.' + difficulty)} • {boards.length}{' '}
                  {boards.length === 1 ? 'board' : 'boards'}
                  {createdDate &&
                    ` • ${dayjs(createdDate).format('DD MMM YYYY')}`}
                </Text>
              </Box>
              <Button
                icon="tabler:printer"
                loading={fontQuery.isLoading}
                variant="primary"
                onClick={() => handlePrint()}
              >
                {t('buttons.print')}
              </Button>
            </Flex>

            <Box overflow="auto" width="100%">
              <Box
                minHeight={{ base: '277mm', lg: 'auto', print: 'auto' }}
                width={{ base: '190mm', lg: '100%' }}
              >
                <PrintArea contentRef={printRef}>
                  <Grid
                    gap={{ base: 'md', print: 'none' }}
                    style={{
                      fontFamily: 'Rubik, sans-serif',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}
                    templateCols={boards.length === 1 ? 1 : 2}
                    width={{
                      base: '100%',
                      print: boards.length > 4 ? '97%' : '100%'
                    }}
                  >
                    {boards.map((board, index) => (
                      <Box key={index} style={{ breakInside: 'avoid' }}>
                        <Board
                          boardCount={boards.length}
                          data={board}
                          showSolution={false}
                        />
                      </Box>
                    ))}
                  </Grid>
                </PrintArea>
              </Box>
            </Box>
          </>
        )}
      </WithQuery>
    </Flex>
  )
}

export default Print
