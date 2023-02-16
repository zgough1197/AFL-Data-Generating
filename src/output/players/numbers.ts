import { saveForSporlce } from '../fs'
import { Career, YearBounds } from '../../types'
import { QuizData } from '../types'
import { filePathFromParams } from '../utils'

const prefix = 'players/numbers/'

export const all = async (players: Career[], club: string, {startYear = -Infinity}: YearBounds): Promise<void> => {
    const outputData = new QuizData()

    players.forEach(p => {
        if (p.debutYear >= startYear || p.activeYears.includes(startYear)) {
            outputData.add(p.activeYearsString, p.info, p.numbersOverTimeString)
        }
    })

    outputData.sort({byHint: true, group: true})

    await saveForSporlce(
        club,
        filePathFromParams('All', {startYear}),
        outputData,
        prefix
    )
}

export const byYear = async (players: Career[], club: string, {startYear = -Infinity, endYear = Infinity}: YearBounds): Promise<void> => {
    const outputData = new QuizData()

    players.forEach(p => {
        p.numbersByYear.forEach(n => {
            if (n.year >= startYear && n.year <= endYear) {
                outputData.add(n.year, p.info, n.number)
            }
        })
    })

    outputData.sort({byHint: true, group: true})

    await saveForSporlce(
        club,
        filePathFromParams('By-Year'),
        outputData,
        prefix
    )
}

export const byYearSplit = async (players: Career[], club: string, {startYear = -Infinity, endYear = Infinity}: YearBounds): Promise<void> => {
    for (var i = startYear; i <= endYear; i += 10) {
        const s = i, e = i + 9 <= endYear ? i + 9 : endYear
        const outputData = new QuizData()

        players.forEach(p => {
            p.numbersByYear.forEach(n => {
                if (n.year >= s && n.year <= e) {
                    outputData.add(n.year, p.info, n.number)
                }
            })
        })

        outputData.sort({byHint: true, group: true})

        await saveForSporlce(
            club,
            filePathFromParams('By-Year', {startYear: s, endYear: e}),
            outputData,
            'players/byDecade'
        )
    }
}