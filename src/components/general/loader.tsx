"use client"
import { lineSpinner } from 'ldrs'

lineSpinner.register()

const Loader = () => {
    return <l-line-spinner
        size="40"
        stroke="3"
        speed="1"
        color="orange"
    ></l-line-spinner>
}

export default Loader