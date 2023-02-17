import { YearBounds } from '../types'
import { IFileWritten, STATUS } from './types'

export const undefOrInf = (n?: number): boolean => {
    return n == undefined || n === Infinity || n === -Infinity
}

export const fileNameFromYears = (fileName: string, {forYear: f, startYear: s, endYear: e}: YearBounds = {}) => {
    let o: string
    if (!undefOrInf(s) && !undefOrInf(e)) {
        o = s + '-' + e
    } else if (!undefOrInf(s)) {
        o = 'Post-' + s
    } else if (!undefOrInf(e)) {
        o = 'Pre-' + e
    } else {
        o = 'All'
    }
    return `${fileName}-${f || o}`
}

export const withFileWritten = async (fullPath: string, filename: string, recordsWritten: number, fn: () => Promise<void>): Promise<IFileWritten> => {
    return fn().then((res) => {
        return {
            status: STATUS.OK,
            filename,
            fullPath,
            recordsWritten
        }
    }).catch((e) => {
        return {
            status: STATUS.ERROR,
            error: String(e),
            filename,
            fullPath,
        }
    })
}