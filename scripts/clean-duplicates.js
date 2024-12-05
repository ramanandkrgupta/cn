const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanupDuplicates() {
  try {
    // Clean up UserLike duplicates
    const allLikes = await prisma.userLike.findMany()
    const uniqueCombos = new Map()
    const duplicates = []

    allLikes.forEach(like => {
      const key = `${like.userId}-${like.postId}`
      if (uniqueCombos.has(key)) {
        duplicates.push(like.id)
      } else {
        uniqueCombos.set(key, like.id)
      }
    })

    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate likes. Removing...`)
      await prisma.userLike.deleteMany({
        where: {
          id: {
            in: duplicates
          }
        }
      })
      console.log('Duplicate likes removed successfully')
    } else {
      console.log('No duplicate likes found')
    }

    // Clean up UserSettings duplicates
    const allSettings = await prisma.userSettings.findMany()
    const userSettingsMap = new Map()
    const duplicateSettings = []

    allSettings.forEach(setting => {
      if (userSettingsMap.has(setting.userId)) {
        // Keep the most recently updated setting
        const existing = userSettingsMap.get(setting.userId)
        if (setting.updatedAt > existing.updatedAt) {
          duplicateSettings.push(existing.id)
          userSettingsMap.set(setting.userId, setting)
        } else {
          duplicateSettings.push(setting.id)
        }
      } else {
        userSettingsMap.set(setting.userId, setting)
      }
    })

    if (duplicateSettings.length > 0) {
      console.log(`Found ${duplicateSettings.length} duplicate settings. Removing...`)
      await prisma.userSettings.deleteMany({
        where: {
          id: {
            in: duplicateSettings
          }
        }
      })
      console.log('Duplicate settings removed successfully')
    } else {
      console.log('No duplicate settings found')
    }

  } catch (error) {
    console.error('Error cleaning up duplicates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDuplicates() 