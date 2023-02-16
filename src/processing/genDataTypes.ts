import { Club, Career, PlayerYearFromSource } from '../types'
import { getPlayerStatsFromYear } from './playerStatsByYear'

export const getAllCareersBetween = (start: number, end: number): Promise<{clubs: Club[], players: Career[]}> => {
    const p = []

    for (var i = start; i <= end; i++) {
        p.push(getPlayerStatsFromYear(String(i)))
    }

    return Promise.all(p).then((playerYears: PlayerYearFromSource[][]) => {
        const clubs: Club[] = []
        const careers: Career[] = []

        playerYears.forEach((pyList) => {
            pyList.forEach((py) => {
                let pc: Career|undefined

                for (i = 0; i < careers.length; i++) {
                    if (careers[i].ID === py.ID) {
                        pc = careers[i]
                        break
                    }
                }
                
                if (pc == undefined) {
                    pc = new Career(py.info)

                    careers.push(pc)
                }

                pc.addPlayerYear(py)

                let c: Club|undefined

                for (i = 0; i < clubs.length; i++) {
                    if (clubs[i].name === py.club) {
                        c = clubs[i]
                        break
                    }
                }
                
                if (c == undefined) {
                    c = new Club(py.club)

                    clubs.push(c)
                }

                c.add(pc)
            })
        })

        return  {clubs: clubs, players: careers}
    })
}