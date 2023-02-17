import { all, byYear, byDecade } from './numbers'
import { top10ByYear, top50 } from './stats';

const SavePlayers = {
    byNumbers: {
        all,
        byYear,
        byDecade
    },
    byStats: {
        top50,
        top10ByYear
    }
}

export default SavePlayers