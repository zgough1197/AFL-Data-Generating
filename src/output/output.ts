import { STAT, CLUB as CLUB_NAME, Career, Club, YearBounds } from '../types'
import { SaveReturn } from './types';
import SavePlayers from './players'

const defaultYearBounds: YearBounds & { startYear: number, endYear: number } = {
    startYear: 1990,
    endYear: 2022
}

export const save = async ({clubs, players}: {clubs: Club[], players: Career[]}): Promise<SaveReturn[]> => {
    const p: Promise<SaveReturn>[] = [saveAllPlayerData(players, defaultYearBounds)]

    for (const c of clubs) {
        if (c.playerCareers.length !== 0) continue

        if (c.name === CLUB_NAME.NONE) {
            console.error(`Some clubs were not found from the data.`)
            continue
        }

        p.push(savePlayerNumbersData(c, defaultYearBounds))
        p.push(savePlayerStatDataByClub(c, defaultYearBounds))
    }

    return Promise.all(p)
}

const savePlayerNumbersData = async (club: Club, yearBounds: YearBounds): Promise<SaveReturn> => {
    const o = new SaveReturn(club.name, 'players')

    const res = await Promise.all([
        Promise.all([
            SavePlayers.byNumbers.all(club.playerCareers, club.name, yearBounds),
            SavePlayers.byNumbers.byYear(club.playerCareers, club.name, yearBounds)
        ]),
        SavePlayers.byNumbers.byDecade(club.playerCareers, club.name, yearBounds)
    ])

    res.forEach(r => {
        o.add(...r)
    })

    return o
}

const saveAllPlayerData = async (players: Career[], yearBounds: YearBounds): Promise<SaveReturn> => {
    const o = new SaveReturn('All', 'players')

    for (const stat in Object.values(STAT)) {
        const s = <STAT>stat

        const res = await Promise.all([
            SavePlayers.byStats.top50(s, players, 'All', yearBounds),
            SavePlayers.byStats.top10ByYear(s, players, 'All', yearBounds)
        ])

        o.add(...res)
    }

    return o
}

async function savePlayerStatDataByClub(club: Club, yearBounds: YearBounds): Promise<SaveReturn> {
    const o = new SaveReturn(club.name, 'players')
    
    for (const stat in Object.values(STAT)) {
        const s = <STAT>stat

        const res = await Promise.all([
            SavePlayers.byStats.top50(s, club.playerCareers, club.name, yearBounds),
            SavePlayers.byStats.top10ByYear(s, club.playerCareers, club.name, yearBounds)
        ])
        
        o.add(...res)
    }

    return o
}

const saveClubData = async (club: Club): Promise<void> => {
    // TODO: Club data
}