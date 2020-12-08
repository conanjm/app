import React, {useEffect, useRef, useState} from "react"

import {List} from "../components/lists/list"
import {EmptyRunsList} from "../components/lists/empty_runs_list"
import {LabLoader} from "../components/utils/loader"
import {RunListItemModel} from "../models/run_list"
import CACHE from "../cache/cache"
import HamburgerMenuBar from "../components/utils/hamburger_menu"
import Search from "../components/utils/search"
import {DeleteButton, EditButton, RefreshButton} from "../components/utils/util_buttons"

import './runs_list_view.scss'


function RunsListView() {
    const [isLoading, setIsLoading] = useState(true)
    const [runs, setRuns] = useState<RunListItemModel[]>([])
    const [labMlToken, setLabMlToken] = useState('')

    const [isEditMode, setIsEditMode] = useState(false)

    const runListCache = CACHE.getRunsList()
    const inputElement = useRef(null) as any

    useEffect(() => {
        async function load() {
            let currentRunsList = await runListCache.getRunsList(null)
            if (currentRunsList) {
                setRuns(currentRunsList.runs)
                setLabMlToken(currentRunsList.labml_token)
                setIsLoading(false)
            }
        }

        load().then()
    }, [runListCache])


    useEffect(() => {
        document.title = "LabML: Experiments"
    }, [labMlToken])

    function runsFilter(run: RunListItemModel, search: string) {
        let re = new RegExp(search.toLowerCase(), "g")
        let name = run.name.toLowerCase()
        let comment = run.comment.toLowerCase()

        return (name.search(re) !== -1 || comment.search(re) !== -1)
    }

    function onInputChange() {
        async function load() {
            if (inputElement.current) {
                let search = inputElement.current.value
                let currentRunsList = await runListCache.getRunsList(null)
                let currentRuns = currentRunsList.runs

                currentRuns = currentRuns.filter((run) => runsFilter(run, search))
                setRuns(currentRuns)
            }
        }

        load().then()
    }

    let runsDeleteSet = new Set<string>()

    function onDelete() {
        async function load() {
            let currentRunsList = await runListCache.getRunsList(null)
            let currentRuns = currentRunsList.runs

            let res: RunListItemModel[] = []
            for (let run of currentRuns) {
                if (!runsDeleteSet.has(run.run_uuid)) {
                    res.push(run)
                }
            }

            setRuns(res)
            runListCache.deleteRuns(res, Array.from(runsDeleteSet)).then()
            setIsEditMode(false)
        }

        load().then()
        onInputChange()
    }

    function onItemClick(e: any, UUID: string) {
        if (runsDeleteSet.has(UUID)) {
            runsDeleteSet.delete(UUID)
        } else {
            runsDeleteSet.add(UUID)
        }
    }

    function onEdit() {
        setIsEditMode(true)
    }

    function onRefresh() {
        async function load() {
            let currentRunsList = await runListCache.getRunsList(null, true)
            if (currentRunsList) {
                setRuns(currentRunsList.runs)
            }
        }

        load().then()
    }

    return <div>
        <HamburgerMenuBar title={'Experiments'}>
            <div className={'mb-2 float-right d-flex'}>
                {runs.length > 0 && isEditMode && <DeleteButton onButtonClick={onDelete}/>}
                {runs.length > 0 && !isEditMode && <EditButton onButtonClick={onEdit}/>}
                {runs.length > 0 && <RefreshButton onButtonClick={onRefresh}/>}
            </div>
        </HamburgerMenuBar>
        {(() => {
            if (isLoading) {
                return <LabLoader/>
            } else if (inputElement.current === null && runs.length === 0) {
                return <EmptyRunsList/>
            } else {
                return <div className={'runs-list'}>
                    <Search inputElement={inputElement} onInputChange={onInputChange}/>
                    <List items={runs} onItemClick={onItemClick} isEditMode={isEditMode} itemKey={'run'}/>
                </div>
            }
        })()}
    </div>
}

export default RunsListView