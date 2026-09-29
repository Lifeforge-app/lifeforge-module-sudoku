import { useQuery } from '@tanstack/react-query'
import { cloneElement, useState } from 'react'
import { ActivityCalendar as ReactActivityCalendar } from 'react-activity-calendar'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  EmptyStateScreen,
  Flex,
  Listbox,
  ListboxOption,
  Stack,
  Text,
  Tooltip,
  Widget,
  WithQuery,
  anyColorToHex,
  colorWithOpacity,
  surface,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function ActivityCalendar() {
  const { t } = useModuleTranslation()
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
      bg={surface.light}
      icon="tabler:activity"
      namespace={false}
      title={t('stats.activityCalendar')}
    >
      <WithQuery query={dataQuery}>
        {({ data: activities, firstYear }) =>
          activities.length > 0 ? (
            <>
              <Listbox
                bg={{ ...surface.defaultInteractive, dark: 'bg-800' }}
                display={{ base: 'flex', md: 'none' }}
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
              <Flex gap="2xl" mt="md" width="100%">
                <Box height="15rem" minWidth="0" width="100%">
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
                        'data-tooltip-content': `${activity.count} ${t('stats.puzzlesOn')} ${activity.date}`
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
                </Box>
                <Stack
                  display={{ base: 'none', md: 'flex' }}
                  gap="sm"
                  maxWidth="max-content"
                >
                  {Array(new Date().getFullYear() - firstYear + 1)
                    .fill(0)
                    .map((_, index) => {
                      const isActive = year === firstYear + index

                      return (
                        <Flex
                          key={index}
                          align="start"
                          as="button"
                          bg={
                            isActive
                              ? {
                                  base: 'bg-200',
                                  dark: colorWithOpacity('bg-700', '50%')
                                }
                              : {
                                  hover: 'bg-100',
                                  darkHover: colorWithOpacity('bg-700', '50%')
                                }
                          }
                          gap="sm"
                          p="md"
                          px={{ base: '2xl', sm: '3xl' }}
                          r="lg"
                          type="button"
                          onClick={() => {
                            setYear(firstYear + index)
                          }}
                        >
                          <Text
                            color={
                              isActive
                                ? { base: 'bg-800', dark: 'bg-50' }
                                : 'muted'
                            }
                            weight={isActive ? 'semibold' : 'medium'}
                          >
                            {firstYear + index}
                          </Text>
                        </Flex>
                      )
                    })}
                </Stack>
              </Flex>
            </>
          ) : (
            <EmptyStateScreen
              icon="tabler:calendar-off"
              message={{
                id: 'activities'
              }}
            />
          )
        }
      </WithQuery>
      <Tooltip id="sudoku-activity-tooltip" />
    </Widget>
  )
}

export default ActivityCalendar
