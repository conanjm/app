import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react"

import {useHistory} from "react-router-dom"

import {getLineChart} from "./lines/chart"
import {getSparkLines} from "./sparklines/chart"
import {getSimpleLineChart} from "./simplelines/chart"
import {getTimeSeriesChart} from "./timeseries/chart"
// import InsightsList from "../insights/insights_list"
import {BarLines} from "./barlines/chart"
import {SeriesDataModel, SeriesModel} from "../../models/run"
import {LabLoader} from "../utils/loader"
import {BasicProps, CardProps} from "../../analyses/types"
import {getChartType, toPointValues} from "./utils"


import "./style.scss"


interface BasicCardProps extends BasicProps, CardProps {
    isChartView: boolean
    isTimeSeries?: boolean
    url: string
}

function SparkLinesCard(props: BasicCardProps, ref: any) {
    const [track, setTrack] = useState(null as unknown as SeriesModel[])

    const history = useHistory()

    const analysisCache = props.cache.getAnalysis(props.uuid)
    const preferenceCache = props.cache.getPreferences(props.uuid)

    const [plotIdx, setPlotIdx] = useState(null as unknown as number[])
    const [currentChart, setCurrentChart] = useState(0)

    let preference = useRef(null) as any

    useEffect(() => {
        async function load() {
            preference.current = await preferenceCache.get()

            if (preference.current) {
                setCurrentChart(preference.current.chart_type)

                let analysis_preferences = preference.current.series_preferences
                if (analysis_preferences && analysis_preferences.length > 0) {
                    setPlotIdx([...analysis_preferences])
                }
            }
        }

        load().then()
    }, [preference, preferenceCache])


    async function onRefresh() {
        let res: SeriesDataModel = await analysisCache.get(true)
        if (res) {
            setTrack(toPointValues(res.series))
        }
    }

    async function onLoad() {
        let res: SeriesDataModel = await analysisCache.get()
        if (res) {
            setTrack(toPointValues(res.series))
        }
    }

    useImperativeHandle(ref, () => ({
        refresh: () => {
            onRefresh().then()
        },
        load: () => {
            onLoad().then()
        },
        lastUpdated: analysisCache.lastUpdated,
    }))

    const chart = props.isTimeSeries ? getTimeSeriesChart : getLineChart

    return <div>{!track ?
        <div className={'labml-card labml-card-action'}>
            <h3 className={'header'}>{props.title}</h3>
            <LabLoader/>
        </div>
        : track && track.length > 0 ?
            <div className={'labml-card labml-card-action'} onClick={
                () => {
                    history.push(`/${props.url}?uuid=${props.uuid}`, history.location.pathname);
                }
            }>
                <h3 className={'header'}>{props.title}</h3>
                {props.isChartView && chart(getChartType(currentChart), track, plotIdx, props.width)}
                {getSparkLines(track, plotIdx, props.width)}
                {/*<InsightsList insightList={track.insights}/>*/}
            </div>
            : <div/>
    }
    </div>
}

function BarLinesCard(props: BasicCardProps, ref: any) {
    const [track, setTrack] = useState(null as (SeriesDataModel | null))
    const analysisCache = props.cache.getAnalysis(props.uuid)
    const history = useHistory()

    async function onRefresh() {
        setTrack(await analysisCache.get(true))
    }

    async function onLoad() {
        setTrack(await analysisCache.get())
    }

    useImperativeHandle(ref, () => ({
        refresh: () => {
            onRefresh().then()
        },
        load: () => {
            onLoad().then()
        },
        lastUpdated: analysisCache.lastUpdated
    }))

    return <div>{!track ?
        <div className={'labml-card labml-card-action'}>
            <h3 className={'header'}>{props.title}</h3>
            <LabLoader/>
        </div>
        : track && track.series.length > 0 ?
            <div className={'labml-card labml-card-action'} onClick={
                () => {
                    history.push(`/${props.url}?uuid=${props.uuid}`, history.location.pathname);
                }
            }>
                <h3 className={'header'}>{props.title}</h3>
                <BarLines width={props.width} series={track.series}/>
            </div>
            : <div/>
    }
    </div>
}

function L1L2MeanLinesCard(props: BasicCardProps, ref: any) {
    const [track, setTrack] = useState(null as (SeriesDataModel | null))
    const analysisCache = props.cache.getAnalysis(props.uuid)
    const history = useHistory()

    async function onRefresh() {
        setTrack(await analysisCache.get(true))
    }

    async function onLoad() {
        setTrack(await analysisCache.get())
    }

    useImperativeHandle(ref, () => ({
        refresh: () => {
            onRefresh().then()
        },
        load: () => {
            onLoad().then()
        },
        lastUpdated: analysisCache.lastUpdated
    }))

    return <div>{!track ?
        <div className={'labml-card labml-card-action'}>
            <h3 className={'header'}>{props.title}</h3>
            <LabLoader/>
        </div>
        : track && track.summary.length > 0 ?
            <div className={'labml-card labml-card-action'} onClick={
                () => {
                    history.push(`/${props.url}?uuid=${props.uuid}`, history.location.pathname);
                }
            }>
                <h3 className={'header'}>{props.title}</h3>
                {getSimpleLineChart(track.summary, props.width)}
            </div>
            : <div/>
    }
    </div>
}


let BasicSparkLines = forwardRef(SparkLinesCard)
let BasicBarLines = forwardRef(BarLinesCard)
let L1L2MeanLines = forwardRef(L1L2MeanLinesCard)

export {
    BasicSparkLines,
    BasicBarLines,
    L1L2MeanLines,
}