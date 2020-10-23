import {LineChart, SparkLines} from "./components";
import React, {useCallback, useEffect, useState} from "react";
import {Run, SeriesModel, Status} from "../../../models/run";
import useWindowDimensions from "../../../utils/window_dimensions";
import {defaultSeriesToPlot} from "./utils";
import RunHeaderCard from "../../run_header/card"
import CACHE from "../../../cache/cache";
import {LabLoader} from "../../../components/loader";


export function getChart(track: SeriesModel[] | null, plotIdx: number[] | null, width: number, onSelect?: ((i: number) => void)) {
    if (track != null) {
        if (track.length === 0) {
            return null
        }
        let series = track as SeriesModel[]
        if (plotIdx == null) {
            plotIdx = defaultSeriesToPlot(series)
        }
        return <LineChart key={1} series={series} width={width} plotIdx={plotIdx} onSelect={onSelect}/>
    } else {
        return <LabLoader isLoading={true}/>
    }
}


export function getSparkLines(track: SeriesModel[] | null, plotIdx: number[] | null, width: number, onSelect?: ((i: number) => void)) {
    if (track != null) {
        if (track.length === 0) {
            return null
        }
        let series = track as SeriesModel[]
        if (plotIdx == null) {
            plotIdx = defaultSeriesToPlot(series)
        }
        return <SparkLines series={series} width={width} plotIdx={plotIdx} onSelect={onSelect}/>
    } else {
        return <LabLoader isLoading={true}/>
    }
}


interface TrackViewProps {
    runUUID: string
    track: SeriesModel[] | null
    name: string
}

export function BasicView(props: TrackViewProps) {
    const runCache = CACHE.get(props.runUUID)
    const [run, setRun] = useState(null as unknown as Run)
    const [status, setStatus] = useState(null as unknown as Status)

    const [plotIdx, setPlotIdx] = useState(null as unknown as number[])
    const {width: windowWidth} = useWindowDimensions()
    const actualWidth = Math.min(800, windowWidth)

    useEffect(() => {
        async function load() {
            setRun(await runCache.getRun())
            setStatus(await runCache.getStatus())
        }

        load().then()
    })

    let toggleChart = useCallback((idx: number) => {
        if (plotIdx[idx] >= 0) {
            plotIdx[idx] = -1
        } else {
            plotIdx[idx] = Math.max(...plotIdx) + 1
        }
        setPlotIdx(new Array<number>(...plotIdx))
    }, [plotIdx])


    if (props.track != null && props.track.length > 0 && plotIdx == null) {
        setPlotIdx(defaultSeriesToPlot(props.track))
    }

    let chart = getChart(props.track, plotIdx, actualWidth, toggleChart)


    return <div className={'page'} style={{width: actualWidth}}>
        <RunHeaderCard.RunView run={run} status={status}/>
        <h2 className={'header text-center'}>{props.name}</h2>
        <div className={'labml-card'}>{chart}</div>
    </div>
}
