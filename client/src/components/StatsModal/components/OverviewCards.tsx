import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Card,
  Flex,
  Grid,
  Icon,
  Text,
  colorWithOpacity,
  surface
} from '@lifeforge/ui'

// Helper to parse play time into hours/minutes/seconds
function parsePlayTime(seconds: number): {
  hours: number
  minutes: number
  seconds: number
} {
  const hours = Math.floor(seconds / 3600)

  const minutes = Math.floor((seconds % 3600) / 60)

  const secs = seconds % 60

  return { hours, minutes, seconds: secs }
}

interface OverviewCardsProps {
  totalBoards: number
  currentStreak: number
  longestStreak: number
  totalPlayTime: number
  daysPlayed: number
}

function OverviewCards({
  totalBoards,
  currentStreak,
  longestStreak,
  totalPlayTime,
  daysPlayed
}: OverviewCardsProps) {
  const { t } = useModuleTranslation()

  return (
    <Grid gap="md" templateCols={{ base: 1, sm: 2, md: 3 }}>
      {/* Total Boards */}
      <Card
        bg={surface.light}
        gap="sm"
        p={{ base: 'sm', sm: 'lg' }}
        pb="lg"
        r="lg"
      >
        <Flex
          align={{ base: 'center', sm: 'start' }}
          direction={{ base: 'row', sm: 'column' }}
          gap="sm"
          width="100%"
        >
          <Box
            shadow
            bg={{ base: 'bg-50', dark: colorWithOpacity('bg-700', '50%') }}
            p={{ base: 'sm', sm: 'md' }}
            r="lg"
          >
            <Icon
              color="blue-500"
              icon="tabler:layout-grid"
              size={{ base: '1.5rem', sm: '1.875rem' }}
            />
          </Box>
          <Text color="muted" size="lg" whiteSpace="nowrap">
            {t('stats.totalBoards')}
          </Text>
        </Flex>
        <Text mt="sm" size="4xl" weight="semibold" whiteSpace="nowrap">
          {totalBoards}
        </Text>
      </Card>

      {/* Streak Counter */}
      <Card
        bg={surface.light}
        gap="sm"
        p={{ base: 'sm', sm: 'lg' }}
        pb="lg"
        r="lg"
      >
        <Flex
          align={{ base: 'center', sm: 'start' }}
          direction={{ base: 'row', sm: 'column' }}
          gap="sm"
          width="100%"
        >
          <Box
            shadow
            bg={{ base: 'bg-50', dark: colorWithOpacity('bg-700', '50%') }}
            p={{ base: 'sm', sm: 'md' }}
            r="lg"
          >
            <Icon
              color="orange-500"
              icon="tabler:flame"
              size={{ base: '1.5rem', sm: '1.875rem' }}
            />
          </Box>
          <Text color="muted" size="lg" whiteSpace="nowrap">
            {t('stats.streak')}
          </Text>
        </Flex>
        <Text mt="sm" size="4xl" weight="semibold" whiteSpace="nowrap">
          {currentStreak}
          <Text color="muted" pl="xs" size="xl" weight="normal">
            {t('stats.days')}
          </Text>
        </Text>
        <Text color="muted">
          {t('stats.bestStreak')}: {longestStreak} {t('stats.days')}
        </Text>
      </Card>

      {/* Total Play Time */}
      <Card
        bg={surface.light}
        gap="sm"
        p={{ base: 'sm', sm: 'lg' }}
        pb="lg"
        r="lg"
      >
        <Flex
          align={{ base: 'center', sm: 'start' }}
          direction={{ base: 'row', sm: 'column' }}
          gap="sm"
          width="100%"
        >
          <Box
            shadow
            bg={{ base: 'bg-50', dark: colorWithOpacity('bg-700', '50%') }}
            p={{ base: 'sm', sm: 'md' }}
            r="lg"
          >
            <Icon
              color="purple-500"
              icon="tabler:clock-play"
              size={{ base: '1.5rem', sm: '1.875rem' }}
            />
          </Box>
          <Text color="muted" size="lg" whiteSpace="nowrap">
            {t('stats.totalTime')}
          </Text>
        </Flex>
        <Text mt="sm" size="4xl" weight="semibold" whiteSpace="nowrap">
          {(() => {
            const time = parsePlayTime(totalPlayTime)

            if (time.hours > 0) {
              return (
                <>
                  {time.hours}
                  <Text color="muted" pl="xs" size="xl" weight="normal">
                    {t('stats.hours')}
                  </Text>{' '}
                  {time.minutes}
                  <Text color="muted" pl="xs" size="xl" weight="normal">
                    {t('stats.minutes')}
                  </Text>
                </>
              )
            } else if (time.minutes > 0) {
              return (
                <>
                  {time.minutes}
                  <Text color="muted" pl="xs" size="xl" weight="normal">
                    {t('stats.minutes')}
                  </Text>
                </>
              )
            } else {
              return (
                <>
                  {time.seconds}
                  <Text color="muted" pl="xs" size="xl" weight="normal">
                    {t('stats.seconds')}
                  </Text>
                </>
              )
            }
          })()}
        </Text>
        <Text color="muted">
          {daysPlayed} {t('stats.daysPlayed')}
        </Text>
      </Card>
    </Grid>
  )
}

export default OverviewCards
