import { writeFile, mkdir } from 'fs/promises'
import { QuizData } from './types'

const verifyDirs = async (dir: string): Promise<void> => {
    return mkdir(dir, {recursive: true}).then(() => {})
}

export const saveTxt = async (dir: string, fileName: string, data: string): Promise<void> => {
    await writeFile(dir + fileName + '.txt', data, 'utf8')
}

export const saveForSporlce = async (club: string, filename: string, data: QuizData, folder: string = ''): Promise<void> => {
    const dir = `./data/${club}/${folder.split('/').filter(d => d != '').join('/')}/`

    await verifyDirs(dir)
    await saveTxt(dir, filename, data.output)
    
    console.log(`Wrote ${data.length} player records to '${filename}' file for ${club}. Ready for sporcle import.`)
}