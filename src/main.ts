import { YearBounds, Career, Club, STAT, CLUB } from './types'
import { getAllCareersBetween } from './processing/genDataTypes'
import SavePlayers from './output/players'

const start = 1990, end = 2022
const yb: YearBounds = {
    startYear: start,
    endYear: end
}

getAllCareersBetween(start - 25, end).then(async (res) => {
    const { clubs, players } = res

    clubs.sort((a, b) => {
        if (a.name > b.name) return 1
        if (a.name < b.name) return -1
        return 0
    })

    for (var i = 0; i < clubs.length; i++) {
        let c = clubs[i]
        try {
            console.log(`START: ${c.name}`)
            
            // await saveClubData(c)
            await savePlayerDataForClub(c)
            
            console.log(`SUCCESS: ${c.name}`)
        } catch(e) {
            console.log(`FAIL: ${c.name} (reason: ${e})`)
        }

    }
})

const savePlayerDataForClub = async (club: Club): Promise<void> => {
    const players = club.playerCareers

    // Numbers
    await SavePlayers.byNumbers.all(players, club.name, yb)
    await SavePlayers.byNumbers.byYear(players, club.name, yb)
    await SavePlayers.byNumbers.byYearSplit(players, club.name, yb)

    // Stats
    // Object.values(STAT).forEach(async s => {
    //     await SavePlayers.byStats.top50(s, players, club.name, yb)
    //     await SavePlayers.byStats.top10ByYear(s, players, club.name, yb)
    // })
}

const saveClubData = async (club: Club): Promise<void> => {
    // TODO: Club data
}