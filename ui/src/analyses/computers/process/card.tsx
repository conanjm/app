import React from "react"

import {useLocation} from "react-router-dom"

import {SummaryCardProps, Analysis} from "../../types"
import {BasicSparkLines} from "../../../components/charts/summary_views"
import ComputerHeaderCard from "../computer_header/card"
import {BasicView} from "../../../components/charts/detail_views"
import {Cache} from "../../common"
import {SeriesCache, SeriesPreferenceCache, ComputerStatusCache} from "../../../cache/cache"

const TITLE = 'Process'
const URL = 'process'

class ProcessAnalysisCache extends SeriesCache {
    constructor(uuid: string, statusCache: ComputerStatusCache) {
        super(uuid, 'process', statusCache)
    }
}


class ProcessPreferenceCache extends SeriesPreferenceCache {
    constructor(uuid: string) {
        super(uuid, 'process')
    }
}


let cache = new Cache('computer', ProcessAnalysisCache, ProcessPreferenceCache)


function AnalysisSummary(props: SummaryCardProps) {
    return <BasicSparkLines title={TITLE}
                            url={URL}
                            cache={cache}
                            isTimeSeries={true}
                            uuid={props.uuid}
                            ref={props.refreshRef}
                            isChartView={true}
                            width={props.width}/>
}

function AnalysisDetails() {
    const location = useLocation()

    return <BasicView title={TITLE}
                      cache={cache}
                      location={location}
                      headerCard={ComputerHeaderCard}/>
}


let ProcessAnalysis: Analysis = {
    card: AnalysisSummary,
    view: AnalysisDetails,
    route: `${URL}`
}

export default ProcessAnalysis
