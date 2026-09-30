import { Fragment } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Bordered,
  Box,
  Flex,
  Grid,
  Stack,
  Text,
  Widget,
  colorWithOpacity,
  surface
} from '@lifeforge/ui'

import { DIFFICULTY_COLORS } from '@/constants/constants'
import { formatTime } from '@/utils/time'

interface DifficultyStat {
  difficulty: string
  totalBoards: number
  avgTime: number | null
  bestTime: number | null
}

interface DetailedStatsProps {
  stats: DifficultyStat[]
}

function DetailedStats({ stats }: DetailedStatsProps) {
  const { t } = useModuleTranslation()

  return (
    <Widget
      bg={surface.light}
      icon="tabler:list-details"
      namespace={false}
      title={t('stats.byDifficulty')}
    >
      {/* Mobile: Cards */}
      <Flex direction="column" display={{ base: 'flex', md: 'none' }} gap="sm">
        {stats.map(stat => (
          <Box
            key={stat.difficulty}
            bg={{
              base: colorWithOpacity('bg-200', '50%'),
              dark: colorWithOpacity('bg-700', '50%')
            }}
            p="sm"
            r="lg"
          >
            <Flex align="center" gap="sm" mb="sm">
              <Box
                height="0.75rem"
                r="full"
                style={{ backgroundColor: DIFFICULTY_COLORS[stat.difficulty] }}
                width="0.75rem"
              />
              <Text
                color={{ base: 'bg-800', dark: 'bg-100' }}
                transform="capitalize"
                weight="medium"
              >
                {t(`difficulties.${stat.difficulty}`)}
              </Text>
            </Flex>
            <Stack gap="xs">
              <Flex justify="between">
                <Text color="muted" size="sm">
                  {t('stats.played')}
                </Text>
                <Text
                  color={{ base: 'bg-800', dark: 'bg-100' }}
                  size="sm"
                  weight="semibold"
                >
                  {stat.totalBoards}
                </Text>
              </Flex>
              <Flex justify="between">
                <Text color="muted" size="sm">
                  {t('stats.avgTime')}
                </Text>
                <Text
                  as="code"
                  color={{ base: 'bg-600', dark: 'bg-400' }}
                  size="sm"
                >
                  {stat.avgTime ? formatTime(stat.avgTime) : '-'}
                </Text>
              </Flex>
              <Flex justify="between">
                <Text color="muted" size="sm">
                  {t('stats.bestTime')}
                </Text>
                <Text as="code" color="yellow-500" size="sm">
                  {stat.bestTime ? formatTime(stat.bestTime) : '-'}
                </Text>
              </Flex>
            </Stack>
          </Box>
        ))}
      </Flex>

      {/* Desktop: Grid */}
      <Box display={{ base: 'none', md: 'block' }} overflowX="auto">
        <Grid templateCols={4} width="100%">
          <Bordered
            asChild
            borderColor={{ base: 'bg-200', dark: 'bg-700' }}
            borderSide="bottom"
            borderWidth="2px"
          >
            <Text color="muted" display="block" px="sm" py="md" weight="medium">
              {t('stats.difficulty')}
            </Text>
          </Bordered>
          <Bordered
            asChild
            borderColor={{ base: 'bg-200', dark: 'bg-700' }}
            borderSide="bottom"
            borderWidth="2px"
          >
            <Text
              align="center"
              color="muted"
              display="block"
              py="md"
              weight="medium"
            >
              {t('stats.played')}
            </Text>
          </Bordered>
          <Bordered
            asChild
            borderColor={{ base: 'bg-200', dark: 'bg-700' }}
            borderSide="bottom"
            borderWidth="2px"
          >
            <Text
              align="center"
              color="muted"
              display="block"
              py="md"
              weight="medium"
            >
              {t('stats.avgTime')}
            </Text>
          </Bordered>
          <Bordered
            asChild
            borderColor={{ base: 'bg-200', dark: 'bg-700' }}
            borderSide="bottom"
            borderWidth="2px"
          >
            <Text
              align="center"
              color="muted"
              display="block"
              py="md"
              weight="medium"
            >
              {t('stats.bestTime')}
            </Text>
          </Bordered>

          {stats.map((stat, index) => {
            const isLast = index === stats.length - 1

            return (
              <Fragment key={stat.difficulty}>
                <Bordered
                  asChild
                  borderColor={{
                    base: 'bg-200',
                    dark: colorWithOpacity('bg-700', '50%')
                  }}
                  borderSide={isLast ? 'none' : 'bottom'}
                >
                  <Flex align="center" gap="sm" px="sm" py="md">
                    <Box
                      height="0.75rem"
                      r="full"
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
                  </Flex>
                </Bordered>
                <Bordered
                  asChild
                  borderColor={{
                    base: 'bg-200',
                    dark: colorWithOpacity('bg-700', '50%')
                  }}
                  borderSide={isLast ? 'none' : 'bottom'}
                >
                  <Text
                    align="center"
                    color={{ base: 'bg-800', dark: 'bg-100' }}
                    display="block"
                    py="md"
                    weight="semibold"
                  >
                    {stat.totalBoards}
                  </Text>
                </Bordered>
                <Bordered
                  asChild
                  borderColor={{
                    base: 'bg-200',
                    dark: colorWithOpacity('bg-700', '50%')
                  }}
                  borderSide={isLast ? 'none' : 'bottom'}
                >
                  <Text
                    align="center"
                    as="code"
                    color={{ base: 'bg-600', dark: 'bg-400' }}
                    display="block"
                    py="md"
                  >
                    {stat.avgTime ? formatTime(stat.avgTime) : '-'}
                  </Text>
                </Bordered>
                <Bordered
                  asChild
                  borderColor={{
                    base: 'bg-200',
                    dark: colorWithOpacity('bg-700', '50%')
                  }}
                  borderSide={isLast ? 'none' : 'bottom'}
                >
                  <Text
                    align="center"
                    as="code"
                    color="yellow-500"
                    display="block"
                    py="md"
                  >
                    {stat.bestTime ? formatTime(stat.bestTime) : '-'}
                  </Text>
                </Bordered>
              </Fragment>
            )
          })}
        </Grid>
      </Box>
    </Widget>
  )
}

export default DetailedStats
