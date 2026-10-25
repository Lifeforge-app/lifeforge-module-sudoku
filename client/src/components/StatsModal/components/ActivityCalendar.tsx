import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  ActivityCalendar,
  EmptyStateScreen,
  Flex,
  Listbox,
  ListboxOption,
  Stack,
  Text,
  Widget,
  WithQuery,
  colorWithOpacity,
  surface
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function SudokuActivityCalendar() {
  const { t } = useModuleTranslation()
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
        {({ data: activities, firstYear }) => {
          if (activities.length === 0) {
            return (
              <EmptyStateScreen
                icon="tabler:calendar-off"
                message={{
                  id: 'activities'
                }}
              />
            )
          }

          return (
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
                <ActivityCalendar
                  blockMargin={5}
                  blockSize={16}
                  data={activities}
                  height="15rem"
                  labels={{
                    totalCount: `${activities.reduce((a, b) => a + b.count, 0)} ${t('stats.puzzlesCompleted')} {{year}}`
                  }}
                  maxLevel={4}
                  tooltipContent={activity =>
                    `${activity.count} ${t('stats.puzzlesOn')} ${activity.date}`
                  }
                />
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
          )
        }}
      </WithQuery>
    </Widget>
  )
}

export default SudokuActivityCalendar
