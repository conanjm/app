import React from 'react'
import Lottie from 'lottie-react-web'
import animation from '../assets/lottie/Chemical.json'


function PageNotFound() {
    return <div className={'container text-center mt-5'}>
        <h1 className={'display-1 text-danger'}>404</h1>
        <h1 className={'text-primary'}>ERROR - LAB EXPLOSION</h1>
        <Lottie style={{width: 500, margin: '0 auto'}}
                options={{
                    animationData: animation
                }}
        />
    </div>
}

export default PageNotFound
