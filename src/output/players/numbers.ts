import { Career, YearBounds } from '../../types'
import { QuizData, IFileWritten, STATUS } from '../types'
import { fileNameFromYears, undefOrInf, withFileWritten } from '../utils'
import { saveForSporlce } from '../../io/fs'

const pathPrefix = 'players/<club>/numbers/'

const getAll = (players: Career[], {startYear = -Infinity}: YearBounds): QuizData => {
    const outputData = new QuizData()

    players.forEach(p => {
        if (p.debutYear >= startYear || p.activeYears.includes(startYear)) {
            outputData.add(p.activeYearsString, p.info, p.numbersOverTimeString)
        }
    })

    outputData.sort({byHint: true, group: true})

    return outputData
}

export const all = async (players: Career[], club: string, {startYear = -Infinity}: YearBounds): Promise<IFileWritten> => {
    const f = fileNameFromYears('All', {startYear})
    const d = pathPrefix.replace('<club>', club)

    return withFileWritten(f, d, players.length, async () => {
        await saveForSporlce(f, d, getAll(players, {startYear}))
    })
}

const getByYear = (players: Career[], {startYear = -Infinity, endYear = Infinity, forYear}: YearBounds): QuizData => {
    const outputData = new QuizData()

    players.forEach(p => {
        p.numbersByYear.forEach(n => {
            if (n.year === forYear || (n.year >= startYear && n.year <= endYear)) {
                outputData.add(n.year, p.info, n.number)
            }
        })
    })

    outputData.sort({byHint: true, group: true})

    return outputData
}

export const byYear = async (players: Career[], club: string, yearBounds: YearBounds): Promise<IFileWritten> => {
    const f = fileNameFromYears('By-Year', yearBounds)
    const d = pathPrefix.replace('<club>', club)

    return withFileWritten(f, d, players.length, async () => {
        await saveForSporlce(f, d, getByYear(players, yearBounds))
    })
}

export const byDecade = async (players: Career[], club: string, {startYear, endYear}: YearBounds): Promise<IFileWritten[]> => {
    if (undefOrInf(startYear) || undefOrInf(endYear)) return [{
        filename: 'By-Decade-Files',
        fullPath: pathPrefix.replace('<club>', club),
        status: STATUS.ERROR,
        error: 'Year bounds were not defined'
    }]

    startYear = startYear || 2010
    endYear = endYear || 2010
    
    const bounds: YearBounds[] = []

    let s: number = startYear
    for (var i = startYear; i <= endYear; i ++) {
        if (i % 10 === 0) {
            s = i

            if (i === endYear) {
                bounds.push({
                    forYear: i
                })
            }

            continue
        } else if (i % 10 === 9 || i === endYear) {
            bounds.push({
                startYear: s,
                endYear: i
            })
        }
    }

    return Promise.all(bounds.map((yb: YearBounds): Promise<IFileWritten> => {
        return byYear(players, club, yb)
    }))
}