import { PlayerInfo } from '../types'

interface IQuizDataSortOptions {
    byClue?: boolean,
    byAns?: boolean,
    byHint?: boolean,
    descending?: boolean,
    group?: boolean,
}

export const combineQuizData = (...toCombine: QuizData[]): QuizData => {
    const outpoutQuizData = new QuizData()

    toCombine.forEach(oQD => {
        outpoutQuizData.import(oQD)
    })

    return outpoutQuizData
}

export class QuizData {
    private readonly _data: QuizDataRow[] = []

    add(c: string|number, a: string|number|PlayerInfo, h?: string|number): void {
        this._data.push(new QuizDataRow(c, a, h))
    }

    private addRow(dr: QuizDataRow): void {
        this._data.push(dr)
    }

    import(oQD: QuizData): void {
        oQD._data.forEach(oQDR => {
            this.addRow(oQDR)
        })
    }

    sort({byClue = false, byAns = true, byHint = false, descending = false, group = false}: IQuizDataSortOptions): void {
        if (byAns) {
            this.sortByAns(descending)
        }

        if (byClue) {
            this.sortByClue(descending)
        }

        if (byHint) {
            this.sortByHint(descending)
        }

        if (group) {
            this.sortByClue(false)
        }
    }

    private sortFn(a: number|string, b: number|string, descending: boolean): number {
        if (a > b) {
            return descending ? -1 : 1
        }

        if (a < b) {
            return descending ? 1 : -1
        }

        return 0
    }

    private sortByClue(descending: boolean) {
        this._data.sort((a, b) => this.sortFn(a.forSort.c, b.forSort.c, descending))
    }

    private sortByAns(descending: boolean) {
        this._data.sort((a, b) => this.sortFn(a.forSort.a, b.forSort.a, descending))
    }

    private sortByHint(descending: boolean) {
        this._data.sort((a, b) => this.sortFn(a.forSort.h, b.forSort.h, descending))
    }

    trimFrom(keep: number): void {
        const valAt = this._data[keep]
        while(this._data[keep + 1]?.guessFrom === valAt.guessFrom) {
            keep++
        }
        this._data.splice(keep)
    }

    get output(): string {
        return this._data.map(r => r.output).join('\n')
    }

    get length(): number {
        return this._data.length
    }
}

export class QuizDataRow {
    private _clue:string | number
    private _answer:string |number | PlayerInfo
    private _hint:string | number

    constructor(c: string|number, a: string|number|PlayerInfo, h?: string|number) {
        this._clue = c
        this._answer = a
        this._hint = h ?? ''
    }

    get guessFrom() {
        return String(this._clue) + String(this._hint)
    }

    get forSort() {
        const a = this._answer instanceof PlayerInfo ? this._answer.lastfirst : this._answer
        return {
            c: this._clue, 
            a: a, 
            h: this._hint
        }
    }

    get output(): string {
        const c = String(this._clue)
        const h = String(this._hint)

        let a: string

        if (typeof this._answer === 'number' || typeof this._answer === 'string') {
            a = String(this._answer)
        } else {
            a = this._answer.nameAsSporcleAnswer
        }
        
        if (h !== '') {
            return `${c}\t${a}\t${h}`
        }
        return `${c}\t${a}`
    }
}