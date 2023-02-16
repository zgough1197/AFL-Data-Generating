import { YearBounds } from '../types'

export const filePathFromParams = (fileName: string, {forYear: f, startYear: s, endYear: e}: YearBounds = {}) => {
    let o: string
    if (s != undefined && e != undefined) {
        o = s + '-' + e
    } else if (s != undefined) {
        o = 'Post-' + s
    } else if (e != undefined) {
        o = 'Pre-' + e
    } else {
        o = 'All'
    }
    return `${fileName}-${f || o}`
}