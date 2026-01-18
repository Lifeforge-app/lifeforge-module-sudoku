import type { SudokuBoard } from '@'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Button, GoBackButton, WithQuery } from 'lifeforge-ui'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useReactToPrint } from 'react-to-print'
import { useNavigate, useParams } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import Board from '../../components/Board'

function Print() {
  const { t } = useTranslation('apps.sudoku')

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
    <div className="flex flex-1 flex-col">
      <GoBackButton onClick={() => navigate('/sudoku')} />

      <WithQuery query={sessionQuery}>
        {() => (
          <>
            {/* Print Controls */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-medium">
                  {t('headers.printPreview')}
                </h1>
                <p className="text-bg-500 mt-1">
                  {t('difficulties.' + difficulty)} • {boards.length}{' '}
                  {boards.length === 1 ? 'board' : 'boards'}
                  {createdDate &&
                    ` • ${dayjs(createdDate).format('DD MMM YYYY')}`}
                </p>
              </div>
              <Button
                icon="tabler:printer"
                loading={fontQuery.isLoading}
                variant="primary"
                onClick={() => handlePrint()}
              >
                {t('buttons.print')}
              </Button>
            </div>

            {/* Print Content */}
            <div
              ref={printRef}
              className={`grid gap-4 ${
                boards.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
              }`}
              style={{ fontFamily: 'Rubik, sans-serif' }}
            >
              {boards.map((board, index) => (
                <div key={index} className="break-inside-avoid">
                  <Board
                    boardCount={boards.length}
                    data={board}
                    showSolution={false}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </WithQuery>
    </div>
  )
}

export default Print
