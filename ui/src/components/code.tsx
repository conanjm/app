import React from "react";
import {LabLoader} from "./loader"
import {Footer} from './footer'


interface CodeProps {
    labMlToken: string | null
}

function Tab() {
    return <span>
        &nbsp;&nbsp;&nbsp;&nbsp;
    </span>
}

export function Code(props: CodeProps) {
    return <div>
        <LabLoader isLoading={true}/>
        <div className={'text-center'}>
            <h5 className={'text-dark mt-5'}>Your experiment list is empty</h5>
            <p className={'text-secondary'}>Run the below code snippet to generate a sample experiment </p>
        </div>
        <div className={'mt-3 bg-light container-sm mb-3'}>
            <code className={"text-secondary"}>
                <p>
                    import numpy as np <br/>
                    from labml import tracker, experiment
                </p>
                <p className={'mt-3'}>
                    conf = {"{'batch_size': 20}"}<br/>
                    n = 0
                </p>
                <p className={'mt-3'}>
                    <span>
                        def train():<br/>
                     </span>
                    <span>
                        <Tab/>global n<br/>
                        <Tab/>n += 1<br/>
                        <Tab/>return 0.999 ** n + np.random.random() / 10, 1 - .999 ** n + np.random.random() / 10
                    </span>
                </p>
                <p className={'mt-3'}>
                    <span className={'font-weight-bolder text-dark'}>
                        with experiment.record(name='sample', exp_conf=conf, web_api={props.labMlToken}, comment='test'):<br/>
                    </span>
                    <span>
                        <Tab/>for i in range(100000):<br/>
                    </span>
                    <span>
                       <Tab/><Tab/>loss, accuracy = train()<br/>
                    </span>
                    <span className={'font-weight-bolder text-dark'}>
                        <Tab/><Tab/>tracker.save(i, {"loss': loss, 'accuracy': accuracy"})<br/>
                    </span>
                </p>
            </code>
        </div>
        <Footer/>
    </div>
}