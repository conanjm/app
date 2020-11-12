import React from "react";

import {useLocation} from "react-router-dom";

import {SeriesCardProps} from "../../types";
import {BasicView, BasicCard} from "../basic/card";
import {Analysis, Cache} from "../basic/analysis";
import {AnalysisCache, StatusCache, AnalysisPreferenceCache} from "../../../cache/cache";

const TITLE = 'Gradients - L2 Norm'
const URL = 'gradients'

class GradientAnalysisCache extends AnalysisCache {
    constructor(uuid: string, statusCache: StatusCache) {
        super(uuid, 'gradients', statusCache);
    }

}

class GradientPreferenceCache extends AnalysisPreferenceCache {
    constructor(uuid: string) {
        super(uuid, 'gradients');
    }
}


let cache = new Cache(GradientAnalysisCache, GradientPreferenceCache)


function AnalysisSummary(props: SeriesCardProps) {
    return <BasicCard title={TITLE}
                      uuid={props.uuid}
                      url={URL}
                      cache={cache}
                      ref={props.refreshRef}
                      isChartView={false}
                      width={props.width}/>

}

function AnalysisDetails() {
    const location = useLocation()

    return <BasicView title={TITLE}
                      cache={cache}
                      location={location}/>
}

let gradientAnalysis: Analysis = {
    card: AnalysisSummary,
    view: AnalysisDetails,
    route: `/${URL}`
}

export default gradientAnalysis