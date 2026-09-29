import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Flex,
  Grid,
  Text,
  Widget,
  colorWithOpacity,
  surface
} from '@lifeforge/ui'

import { DIFFICULTY_COLORS } from '@/constants/constants'
import { formatTime } from '@/utils/time'

interface DifficultyStat {
  difficulty: string
  bestTime: number | null
}

interface BestTimesProps {
  stats: DifficultyStat[]
}

function BestTimes({ stats }: BestTimesProps) {
  const { t } = useModuleTranslation()

  const statsWithBestTime = stats.filter(stat => stat.bestTime !== null)

  return (
    <Widget
      bg={surface.light}
      icon="tabler:trophy"
      namespace={false}
      title={t('stats.bestTimes')}
    >
      <Grid gap="sm" templateCols={{ base: 1, md: 2, lg: 3 }}>
        {statsWithBestTime.map(stat => (
          <Flex
            key={stat.difficulty}
            align="center"
            bg={{
              base: colorWithOpacity('bg-200', '50%'),
              dark: colorWithOpacity('bg-700', '50%')
            }}
            justify="between"
            p="sm"
            r="lg"
          >
            <Flex align="center" gap="sm">
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
            <Text
              size="lg"
              style={{ fontFamily: 'monospace' }}
              weight="semibold"
            >
              {formatTime(stat.bestTime!)}
            </Text>
          </Flex>
        ))}
        {statsWithBestTime.length === 0 && (
          <Box py="md" style={{ gridColumn: '1 / -1' }}>
            <Text align="center" color="muted" display="block" size="sm">
              {t('stats.noBestTimes')}
            </Text>
          </Box>
        )}
      </Grid>
    </Widget>
  )
}

export default BestTimes
