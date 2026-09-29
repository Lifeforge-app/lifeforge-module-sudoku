import { memo } from 'react'

import { Box, Flex } from '@lifeforge/ui'

function GridDividers() {
  return (
    <>
      <Flex
        height="100%"
        justify="evenly"
        left="0"
        position="absolute"
        style={{ pointerEvents: 'none' }}
        top="0"
        width="100%"
      >
        <Box bg="bg-500" height="100%" width={{ base: '1px', sm: '2px' }} />
        <Box bg="bg-500" height="100%" width={{ base: '1px', sm: '2px' }} />
      </Flex>
      <Flex
        direction="column"
        height="100%"
        justify="evenly"
        left="0"
        position="absolute"
        style={{ pointerEvents: 'none' }}
        top="0"
        width="100%"
      >
        <Box bg="bg-500" height={{ base: '1px', sm: '2px' }} width="100%" />
        <Box bg="bg-500" height={{ base: '1px', sm: '2px' }} width="100%" />
      </Flex>
    </>
  )
}

export default memo(GridDividers)
