// import { PrismaClient } from '@prisma/client'
// import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

// const prisma = new PrismaClient()

// export async function POST() {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const userId = session.user.id
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { streak: true, maxStreak: true, lastVisit: true },
//     })

//     const today = new Date().toISOString().split('T')[0]
//     const lastVisit = user?.lastVisit?.toISOString().split('T')[0]

//     let newStreak = 1
//     let newMaxStreak = user?.maxStreak || 0

//     if (lastVisit === today) {
//       return NextResponse.json({
//         streak: user.streak,
//         maxStreak: user.maxStreak,
//       })
//     }

//     const yesterday = new Date()
//     yesterday.setDate(yesterday.getDate() - 1)
//     const yesterdayStr = yesterday.toISOString().split('T')[0]

//     if (lastVisit === yesterdayStr) {
//       newStreak = (user?.streak || 0) + 1
//       newMaxStreak = Math.max(newStreak, newMaxStreak)
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         streak: newStreak,
//         maxStreak: newMaxStreak,
//         lastVisit: new Date(),
//       },
//       select: { streak: true, maxStreak: true },
//     })

//     return NextResponse.json(updatedUser)
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     )
//   }
// }
