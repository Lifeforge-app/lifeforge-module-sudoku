import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Flex, Stack, Text, Widget, surface } from '@lifeforge/ui'

import { DIFFICULTY_COLORS } from '@/constants/constants'

interface TimeDistributionData {
  under2min: number
  under5min: number
  under10min: number
  under20min: number
  over20min: number
}

interface DifficultyStat {
  difficulty: string
  totalBoards: number
  timeDistribution: TimeDistributionData
}

interface TimeDistributionProps {
  stats: DifficultyStat[]
}

const SEGMENTS = [
  { key: 'under2min', bg: 'green-500', label: '<2m', title: '<2min' },
  { key: 'under5min', bg: 'teal-500', label: '2-5m', title: '2-5min' },
  { key: 'under10min', bg: 'yellow-500', label: '5-10m', title: '5-10min' },
  { key: 'under20min', bg: 'orange-500', label: '10-20m', title: '10-20min' },
  { key: 'over20min', bg: 'red-500', label: '>20m', title: '>20min' }
] as const

const LEGEND = [
  { bg: 'green-500', label: '<2min' },
  { bg: 'teal-500', label: '2-5min' },
  { bg: 'yellow-500', label: '5-10min' },
  { bg: 'orange-500', label: '10-20min' },
  { bg: 'red-500', label: '>20min' }
] as const

function TimeDistribution({ stats }: TimeDistributionProps) {
  const { t } = useModuleTranslation()

  const statsWithBoards = stats.filter(stat => stat.totalBoards > 0)

  return (
    <Widget
      bg={surface.light}
      icon="tabler:chart-histogram"
      namespace={false}
      title={t('stats.timeDistribution')}
    >
      <Stack gap="md">
        {statsWithBoards.map(stat => {
          const dist = stat.timeDistribution

          const total =
            dist.under2min +
            dist.under5min +
            dist.under10min +
            dist.under20min +
            dist.over20min

          return (
            <Box key={stat.difficulty}>
              <Flex align="center" gap="sm" mb="sm">
                <Box
                  height="0.75rem"
                  r="md"
                  style={{
                    backgroundColor: DIFFICULTY_COLORS[stat.difficulty]
                  }}
                  width="0.75rem"
                />
                <Text
                  color={{ base: 'bg-800', dark: 'bg-100' }}
                  transform="capitalize"
                  weight="medium"
                >
                  {t(`difficulties.${stat.difficulty}`)}
                </Text>
                <Text color="muted" size="sm">
                  ({stat.totalBoards} {t('stats.completed').toLowerCase()})
                </Text>
              </Flex>
              <Flex height="1.5rem" overflow="hidden" r="full">
                {SEGMENTS.map(({ key, bg, label, title }) => {
                  const value = dist[key]

                  if (value <= 0) return null

                  return (
                    <Flex
                      key={key}
                      centered
                      bg={bg}
                      style={{ width: `${(value / total) * 100}%` }}
                      title={title}
                    >
                      {value > 1 && (
                        <Text
                          color="bg-50"
                          style={{ fontSize: '10px' }}
                          weight="bold"
                        >
                          {label}
                        </Text>
                      )}
                    </Flex>
                  )
                })}
              </Flex>
            </Box>
          )
        })}
        {stats.length === 0 && (
          <Text align="center" color="muted" size="sm">
            {t('stats.noTimeData')}
          </Text>
        )}
      </Stack>
      {/* Legend */}
      <Flex gap="md" justify="center" mt="md" wrap="wrap">
        {LEGEND.map(({ bg, label }) => (
          <Flex key={label} align="center" gap="sm">
            <Box bg={bg} height="0.75rem" r="md" width="0.75rem" />
            <Text color="muted">{label}</Text>
          </Flex>
        ))}
      </Flex>
    </Widget>
  )
}

export default TimeDistribution
