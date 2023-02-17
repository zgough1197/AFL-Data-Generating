import { Career, STAT, YearBounds } from '../../types'
import { combineQuizData, QuizData, IFileWritten } from '../types'
import { fileNameFromYears, withFileWritten } from '../utils'
import { saveForSporlce } from '../../io/fs'

const pathPrefix = 'players/<club>/stats/'

const getTop50 = (statType: STAT, players: Career[], yearBounds: YearBounds): QuizData => {
    const outputData = new QuizData()

    players.forEach(p => {
        outputData.add(p.getStat(statType, {tally: true, ...yearBounds}), p.name.asSporcleAnswer)
    })

    outputData.sort({byClue: true, descending: true})
    outputData.trimFrom(50)

    return outputData
}

export const top50 = async (statType: STAT, players: Career[], club: string, yearBounds: YearBounds): Promise<IFileWritten> => {
    const f = fileNameFromYears('Top-50' + statType, yearBounds)
    const d = pathPrefix.replace('<club>', club)

    return withFileWritten(f, d, players.length, async () => {
        await saveForSporlce(f, d, getTop50(statType, players, yearBounds))
    })
}

const getTop10ByYear = (statType: STAT, players: Career[], {forYear, startYear = -Infinity, endYear = Infinity}: YearBounds): QuizData => {
    const years = []

    for (var i = startYear; i <= endYear; i++) {
        if(forYear == undefined || i === forYear) {
            years.push(i)
        }
    }

    return combineQuizData(...years.map((y: number): QuizData => {
        const d = new QuizData()

        players.forEach(p => {
            d.add(y, p.info, p.getStat(statType, {forYear: y}))
        })

        d.sort({byHint: true, descending: true})
        d.trimFrom(10)

        return d
    }))
}

export const top10ByYear = async (statType: STAT, players: Career[], club: string, yearBounds: YearBounds): Promise<IFileWritten> => {
    const f = fileNameFromYears(`Top-10-${statType}-By-Year`, yearBounds)
    const d = pathPrefix.replace('<club>', club)

    return withFileWritten(f, d, players.length, async () => {
        await saveForSporlce(f, d, getTop10ByYear(statType, players, yearBounds))
    })
}
