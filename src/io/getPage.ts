import axios from 'axios'

export const getPlayerStatsPageFromYear = (y: string) => {
    return axios.get(`https://afltables.com/afl/stats/${y}.html`)
}