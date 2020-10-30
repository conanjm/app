export function formatTime(time: number): string {
    let date = new Date(time * 1000)
    let timeStr = date.toTimeString().substr(0, 8)
    let dateStr = date.toDateString()
    return `on ${dateStr} at ${timeStr}`
}


export function getTimeDiff(timestamp: number): string {
    let timeDiff = (Date.now() / 1000 - timestamp / 1000)

    if (timeDiff < 60) {
        return `${Math.round(timeDiff)} secs ago`
    } else if (timeDiff < 600) {
        return `${Math.floor(timeDiff / 60)} minutes and ${Math.round(timeDiff % 60)} secs ago`
    } else {
        return formatTime(timestamp)
    }
}

