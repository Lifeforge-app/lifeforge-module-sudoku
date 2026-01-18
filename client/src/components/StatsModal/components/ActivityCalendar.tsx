import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import {
  EmptyStateScreen,
  Listbox,
  ListboxOption,
  Widget,
  WithQuery
} from 'lifeforge-ui'
import { cloneElement, useState } from 'react'
import { ActivityCalendar as ReactActivityCalendar } from 'react-activity-calendar'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import { anyColorToHex, usePersonalization } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

function ActivityCalendar() {
  const { t } = useTranslation('apps.sudoku')

  const { derivedTheme, derivedThemeColor: themeColor } = usePersonalization()

  const [year, setYear] = useState(new Date().getFullYear())

  const dataQuery = useQuery(
    forgeAPI.sessions.getActivities
      .input({
        year: year.toString()
      })
      .queryOptions({
        refetchInterval: 60 * 1000
      })
  )

  return (
    <Widget
      className="component-bg-lighter"
      icon="tabler:activity"
      namespace="apps.sudoku"
      title={t('stats.activityCalendar')}
    >
      <WithQuery query={dataQuery}>
        {({ data: activities, firstYear }) =>
          activities.length > 0 ? (
            <>
              <Listbox
                buttonContent={<span>{year}</span>}
                className="dark:bg-bg-800 md:hidden"
                value={year}
                onChange={setYear}
              >
                {Array(new Date().getFullYear() - firstYear + 1)
                  .fill(0)
                  .map((_, index) => (
                    <ListboxOption
                      key={index}
                      label={`${firstYear + index}`}
                      value={firstYear + index}
                    />
                  ))}
              </Listbox>
              <div className="mt-4 flex w-full gap-8">
                <div className="h-60 w-full min-w-0">
                  <ReactActivityCalendar
                    showWeekdayLabels
                    blockMargin={5}
                    blockSize={16}
                    colorScheme="dark"
                    data={activities}
                    labels={{
                      totalCount: `${activities.reduce((a, b) => a + b.count, 0)} ${t('stats.puzzlesCompleted')} {{year}}`
                    }}
                    maxLevel={4}
                    renderBlock={(block, activity) =>
                      cloneElement(block, {
                        'data-tooltip-id': 'sudoku-activity-tooltip',
                        'data-tooltip-html': `${activity.count} ${t('stats.puzzlesOn')} ${activity.date}`
                      } as unknown as Record<string, unknown>)
                    }
                    theme={{
                      dark: [
                        derivedTheme === 'dark'
                          ? 'rgb(38, 38, 38)'
                          : 'rgb(229, 229, 229)',
                        anyColorToHex(themeColor) || '#a9d066'
                      ]
                    }}
                  />
                </div>
                <div className="hidden space-y-2 md:block">
                  {Array(new Date().getFullYear() - firstYear + 1)
                    .fill(0)
                    .map((_, index) => (
                      <button
                        key={index}
                        className={clsx(
                          'flex items-start gap-2 rounded-lg p-4 px-8 font-medium sm:px-12',
                          year === firstYear + index
                            ? 'bg-bg-200 text-bg-800 dark:bg-bg-700/50 dark:text-bg-50 font-semibold'
                            : 'text-bg-500 hover:bg-bg-100 dark:hover:bg-bg-700/50'
                        )}
                        onClick={() => {
                          setYear(firstYear + index)
                        }}
                      >
                        <span>{firstYear + index}</span>
                      </button>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <EmptyStateScreen
              icon="tabler:calendar-off"
              message={{
                id: 'activities',
                namespace: 'apps.sudoku'
              }}
            />
          )
        }
      </WithQuery>
      <Tooltip className="z-9999" id="sudoku-activity-tooltip" />
    </Widget>
  )
}

export default ActivityCalendar
