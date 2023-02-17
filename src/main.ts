import { getAllCareersBetween } from './processing/genDataTypes';
import { save, ISaveReturn } from './output'

const main = (s: number = 1990, e: number = 2022) => {
    getAllCareersBetween(s - 25, e).then(save).then((res: ISaveReturn[]) => {
        res.forEach(s => {
            console.log(s.log)
        })
    })
}

const GenerateData = () => main()

export default GenerateData 