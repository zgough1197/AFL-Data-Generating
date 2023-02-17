import { writeFile, mkdir } from 'fs/promises'
import { QuizData } from '../output/types'

const verifyDirs = async (dir: string): Promise<void> => {
    return mkdir(dir, {recursive: true}).then(() => {})
}

export const saveTxt = async (dir: string, fileName: string, data: string): Promise<void> => {
    await writeFile(dir + fileName + '.txt', data, 'utf8')
}

export const saveForSporlce = async (folder: string = '', filename: string, data: QuizData): Promise<void> => {
    const dir = `./data/${folder.split('/').filter(d => d != '').join('/')}/`

    await verifyDirs(dir)
    await saveTxt(dir, filename, data.output)
}