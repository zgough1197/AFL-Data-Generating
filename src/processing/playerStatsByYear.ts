import { getPlayerStatsPageFromYear } from '../io/getPage'
import { PlayerYearFromSource } from '../types'

export const getPlayerStatsFromYear = (y: string): Promise<PlayerYearFromSource[]> => {
    return getPlayerStatsPageFromYear(y).then(res => res.data.replaceAll('&nbsp;','0')).then(txt => {
        const yearRegex = /((?:19|20)\d\d) Player Stats/mi
        const tableRegex = /\<table.+?\<a href.*?>([a-zA-Z ]+?)\<.+?<tbody>(.+?)<\/tbody>.*?\/table\>/gm
        const playerRegex = /<tr>.*?<a .*?<\/tr>/gm
        const statRegex = /<td.*?>(?:<a href=".*\/([a-zA-Z0-9\-_]*?)\.html".*?>)?([0-9a-zA-Z,.\-; ]+?)(?:<\/a>)?<\/td>/gm

        const out: PlayerYearFromSource[] = []

        const year: RegExpMatchArray = txt.match(yearRegex)

        const tables = [...txt.matchAll(tableRegex)]
        tables.forEach((t: RegExpMatchArray) => {
            const club = t[1]
            const playersData = [...t[2].matchAll(playerRegex)]
            playersData.forEach((p: RegExpMatchArray) => {
                const statEntries = [...p[0].matchAll(statRegex)]

                out.push(new PlayerYearFromSource(club, year, statEntries))
            })
        })

        return out
    })
}
