// Enums
export enum STAT {
    gm = 'games',
    di = 'disposals',
    ki = 'kicks',
    hb = 'handballs',
    gl = 'goals',
    bd = 'behinds',
    mk = 'marks',
    ho = 'hitouts',
    tk = 'tackles'
}

export enum CLUB {
    ADEL = 'Adelaide',
    BRIS = 'Brisbane Lions',
    CARL = 'Carlton',
    COLL = 'Collingwood',
    ESS = 'Essendon',
    FITZ = 'Fitzroy',
    FOOT = 'Footscray',
    FRE = 'Fremantle',
    GEEL = 'Geelong',
    GC = 'Gold Coast',
    GWS = 'Greater Western Sydney',
    HAW = 'Hawthorn',
    MEL = 'Melbourne',
    NM = 'North Melbourne',
    PA = 'Port Adelaide',
    RICH = 'Richmond',
    STK = 'St Kilda',
    SYD = 'Sydney',
    UNIV = 'University',
    WC = 'West Coast',
    BD = 'Western Bulldogs',
    NONE = ''
}

// Interfaces
interface IHasPlayerInfo {
    readonly ID: string
    readonly info: PlayerInfo
}

interface IHasClubName {
    name: CLUB
}

interface IHasYear {
    readonly year: number
}

interface IHasPlayerNumber {
    readonly number:  number
}

export interface YearBounds {
    forYear?: number,
    startYear?: number,
    endYear?: number
}

// Types
type PlayerNumberWithYear = IHasYear & IHasPlayerNumber

type AllStats = {
    readonly [key in STAT]: number
}

type AllStatsWithYear = AllStats & IHasYear

// Classes
export class Club implements IHasClubName {
    private _name: CLUB
    private _players: Career[] = []
    
    constructor(clubName: CLUB) {
        this._name = clubName
    }

    get name() {
        return this._name
    }

    add(p: Career) {
        if (!this._players.includes(p)) {
            this._players.push(p)
        }
    }

    get players(): IHasPlayerInfo[] {
        return this._players.map(p => p.info)
    }

    get playerCareers(): Career[] {
        return this._players.map(p => p.forClub(this._name))
    }
}

export class PlayerInfo implements IHasPlayerInfo {
    private readonly _id: string
    private readonly _f: string
    private readonly _l: string

    constructor(s: string, id: string) {
        this._id = id
        if (s.includes(',')) {
            const [l, f] = s.split(',')
            this._f = f
            this._l = l
        } else {
            const [f, ...l] = s.split(' ')
            this._f = f
            this._l = l.join(' ')
        }

        this._f = this._f.trim()
        this._l = this._l.trim()
    }

    get name() {
        return this._f + ' ' + this._l
    }

    get ID() {
        return this._id
    }

    get info() {
        return this
    }

    get lastfirst() {
        return this._l + ', ' + this._f
    }

    get nameAsSporcleAnswer() {
        return this.name + '/' + this._l
    }
}

export class PlayerYear {
    private _info: PlayerInfo
    private _year: number
    private _club: CLUB
    private _number: number
    private _stats: AllStats
    
    constructor(info: PlayerInfo, y: number, c: CLUB, n: number, s: AllStats) {
        this._info = info
        this._year = y
        this._club = c
        this._number = n
        this._stats = s
    }

    get name(): string {
        return this._info.name
    }

    get ID(): string {
        return this._info.ID
    }

    get info() :PlayerInfo {
        return this._info
    }

    get year(): number {
        return this._year
    }

    get club(): CLUB {
        return this._club
    }

    get number(): number {
        return this._number
    }

    get stats(): AllStats {
        return this._stats
    }

    get yearStats(): AllStatsWithYear {
        return {year: this._year, ...this._stats}
    }

    getStatByName(stat: STAT) {
        return this._stats[stat]
    }
}

export class PlayerYearFromSource extends PlayerYear {
    constructor(club: string, year: RegExpMatchArray, rm: RegExpMatchArray[]) {
        const parseRegex = (d: RegExpMatchArray[], i: number): number => {
            return Number(d[i][2])
        }

        const y = Number(year[1])

        const n = parseRegex(rm, 0)

        let clubOut: CLUB = CLUB.NONE

        Object.values(CLUB).forEach(c => {
            if(String(c) == club) clubOut = c
        })

        const IDAndName = rm[1]

        const info = new PlayerInfo(IDAndName[2], IDAndName[1])
        
        const s = {
            [STAT.gm]: parseRegex(rm, 2),
            [STAT.ki]: parseRegex(rm, 3),
            [STAT.mk]: parseRegex(rm, 4),
            [STAT.hb]: parseRegex(rm, 5),
            [STAT.di]: parseRegex(rm, 6),
            [STAT.gl]: parseRegex(rm, 8),
            [STAT.bd]: parseRegex(rm, 9),
            [STAT.ho]: parseRegex(rm, 10),
            [STAT.tk]: parseRegex(rm, 11)
        }

        super(info, y, clubOut, n, s)
    }
}

export class Career implements IHasPlayerInfo {
    private readonly _info: PlayerInfo
    private _years: PlayerYear[] = []

    constructor(info: PlayerInfo) {
        this._info = info
    }

    // Add data
    addPlayerYear(py: PlayerYear): void {
        this._years.push(py)
    }

    // Export
    private yearsForClub(club: CLUB): PlayerYear[] {
        return this._years.filter(y => y.club === club)
    }

    forClub(club: CLUB): Career {
        return new CareerAtClub(this._info, this.yearsForClub(club), club)
    }

    // Get native data
    get name() {
        return {
            full: this._info.name,
            asSporcleAnswer: this._info.nameAsSporcleAnswer
        }
    }

    get ID(): string {
        return this._info.ID
    }
    
    get info(): PlayerInfo {
        return this._info
    }

    get activeYears(): number[] {
        return this._years.map(y => y.year)
    }

    // Years played
    get activeYearsString(): string {
        if (this.activeYears.length === 1) return String(this.activeYears[0])
        return `${Math.min(...this.activeYears)}-${Math.max(...this.activeYears)}`
    }

    get debutYear(): number {
        return Math.min(...this.activeYears)
    }

    // Player numbers
    get uniqueNumbersInOrder(): number[] {
        return this._years.map(y => y.number).filter((y, i, a) => i === 0 || y != a[i-1] )
    }

    get numbersByYear(): PlayerNumberWithYear[] {
        return this._years.map(y => ({year: y.year, number: y.number}))
    }

    get numbersOverTimeString(): string {
        return this.uniqueNumbersInOrder.join(' -> ')
    }

    // Stats
    getStats({ forYear, startYear = -Infinity, endYear = Infinity }: YearBounds): AllStatsWithYear[] {
        let years = this._years.filter(s => s.year >= startYear && s.year <= endYear)

        if (forYear != undefined) {
            years = years.filter(s => s.year === forYear)
        }

        return years.map(y =>y.yearStats)
    }

    getStat(statName: STAT, { tally, startYear, endYear }: { tally: true, startYear?: number, endYear?: number }): number
    getStat(statName: STAT, { tally, startYear, endYear }: { tally?: false, startYear?: number, endYear?: number }): number[]
    getStat(statName: STAT, { forYear }: { forYear: number }): number
    getStat(statName: STAT, { tally = false, ...yearBounds }: { tally?: boolean, forYear?: number, startYear?: number, endYear?: number }): number|number[] {
        const stats: AllStatsWithYear[] = this.getStats(yearBounds)

        if (tally || yearBounds.forYear != undefined) {
            return stats.map(s => s[statName]).reduce((acc, curr) => acc + curr, 0)
        }
        return stats.map(s => s[statName])
    }
}

class CareerAtClub extends Career {
    private _club: CLUB

    constructor(info: PlayerInfo, years: PlayerYear[], club: CLUB) {
        super(info)

        this._club = club

        years.forEach(y => {
            this.addPlayerYear(y)
        })
    }

    get club() {
        return this._club
    }
}