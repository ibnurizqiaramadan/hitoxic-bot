const socketUrl = document.querySelector(`meta[name="socket-url"]`).getAttribute('content')
const guildId = document.querySelector(`meta[name="guild-id"]`).getAttribute('content')
const thumbnail = document.getElementById(`current-thumbnail`)
const trackAuthor = document.getElementById(`track-author`)
const trackTitle = document.getElementById(`track-title`)
const trackprogress = document.getElementById(`track-progress`)
const timeCurrent = document.getElementById(`time-current`)
const timeEnd = document.getElementById(`time-end`)
const queueContent = document.getElementById(`queue-content`)
const btnShuffle = document.getElementById(`btn-shuffle`)
const btnPlayPause = document.getElementById(`btn-play-pause`)
const btnNext = document.getElementById(`btn-next`)
const btnPrevious = document.getElementById(`btn-previous`)
const btnRepeat = document.getElementById(`btn-repeat`)
const inputSearch = document.getElementById(`input-search`)
const nowPlayingTitle = document.getElementById(`nowplaying-title`)
const nowPlayingDuration = document.getElementById(`nowplaying-duration`)
const totalQueue = document.getElementById(`total-queue`)
const totalDuration = document.getElementById(`total-duration`)
const inputQueue = document.getElementById(`input-queue`)
const queueMessage = document.getElementById(`queue-message`)
const btnAdd = document.getElementById(`btn-add`)
const socket = io(socketUrl)
const setStatus = function(status) {
    if (!status.paused) btnPlayPause.setAttribute("class", "fas fa-pause bg-light text-dark track-paused")
    if (status.paused) btnPlayPause.setAttribute("class", "fas fa-play bg-light text-dark")
    if (status.repeat != 0) btnRepeat.setAttribute("class", "fas fa-redo-alt btn text-white bg-active")
    if (status.repeat == 0) btnRepeat.setAttribute("class", "fas fa-redo-alt btn text-white")
}
const trackItemSelected = function(position) {
    console.log(`position`, position);
    socket.emit('clientTrackSelected', {
        guild: guildId,
        position: position
    })
    // playlistContent.classList.add('disabled')
}
const updateQueue = function(queue) {
    let html = '', totalSeconds = 0
    // console.log(`update queue`);
    queue.forEach((track, i) => {
        totalSeconds += getTimeToSecond(track.duration)
        html += `
            <tr class="w-100 track-item" data-track-number="${i+1}" onclick="trackItemSelected(${i+1})" data-title="${track.title.toLowerCase() } ${track.author.toLowerCase()}">
                <td class="px-2 text-end">${i+1}</td>
                <td class="d-flex align-items-center"><img class="img img-fluid playlist-thumbnail my-2 rounded"
                        src="${track.thumbnail}"
                        alt="thumbnail">
                    <div class="track-info mx-2">
                        <p class="author">${track.author}</p>
                        <p class="title">${track.title}</p>
                    </div>
                </td>
                <td class="p-2 text-center">${track.duration}</td>
            </tr>
        `
    })
    // console.log(totalSeconds);
    totalQueue.innerText = `Queue - ${queue.length} tracks`
    totalDuration.innerText = getSecondToTime(totalSeconds)
    queueContent.innerHTML = html
}
const filterQueue = function(text) {
    const queue = document.querySelectorAll(`tr[data-title]`)
    const search = text.trim().toLowerCase()
    console.log(search);
    if (search == '') {
        queue.forEach((track, i) => {
            track.classList.remove('d-none')
        })
        totalQueue.innerText = `Queue - ${queue.length} tracks`
        return
    }
    const queueSelected = document.querySelectorAll(`tr[data-title]:not(tr[data-title*="${search}"])`)
    queue.forEach((track, i) => {
        track.classList.remove('d-none')
    })
    queueSelected.forEach((track, i) => {
        track.classList.add('d-none')
    })
    totalQueue.innerText = `Filtered ${queue.length - queueSelected.length} from ${queue.length} tracks`
}

let __dragged = false

const getTimeToSecond = function(duration) {
    const time = duration.split(':')
    let seconds = 0
    let index_ = time.length
    for (let index = 0; index < time.length; index++) {
        seconds += parseInt(time[index_-1]) * ((60 ** index) == 0 ? 1 : (60 ** index) )
        index_--
    }
    return seconds
}

const getSecondToTime = function(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2,'0'),
    m = Math.floor(seconds % 3600 / 60).toString().padStart(2,'0'),
    s = Math.floor(seconds % 60).toString().padStart(2,'0');
    return time = (h == '00' ? '' : h + ':') + m + ':' + s;
}

socket.on('connect', () => {
    // console.log(`Connected`)
    socket.emit('join', guildId)
    __dragged = false
})

socket.on('receivePlayRepeatStatus', status => {
    setStatus(status)
})

socket.on('startNewTrack', data => {
    thumbnail.setAttribute("style", `
        background-image: url(${data.track.thumbnail});
        background-repeat: no-repeat;
        background-position: left;
        background-size: cover;
    `)
    trackAuthor.innerText = data.track.author
    trackTitle.innerText = data.track.title
    nowPlayingTitle.innerText = `${data.track.author} - ${data.track.title}`
    nowPlayingDuration.innerText = data.track.duration
    // console.log(data.track);
    updateQueue(data.queue)
    filterQueue(inputSearch.value)
})

socket.on('receiveTime', data => {
    const end_ = getTimeToSecond(data.end)
    const current = getTimeToSecond(data.current)
    if (__dragged == true) return
    if (current > end_) return
    trackprogress.max = end_
    trackprogress.value = current
    timeCurrent.innerText = data.current
    timeEnd.innerText = data.end
})

inputSearch.addEventListener("keyup", function(e) {
    filterQueue(this.value)
})

trackprogress.addEventListener("mousedown", function(e) {
    __dragged = true
})

trackprogress.addEventListener("mouseup", function(e) {
    __dragged = false
    socket.emit('clientSeek', {
        guild: guildId, 
        seek: this.value * 1000
    })
})

trackprogress.addEventListener("input", function(e) {
    const time = getSecondToTime(this.value)
    timeCurrent.innerText = time
})

btnAdd.addEventListener("click", function(e) {
    if (inputQueue.value.trim() == '') return
    const query = inputQueue.value.trim()
    socket.emit('clientInputQuery', {
        guild: guildId,
        query: query
    })
    queueMessage.innerText = `Processing query . . .`
    queueMessage.classList.remove('d-none')
})

socket.on('receiveStatus', data => {
    updateQueue(data.queue)
    setStatus(data.track)
    filterQueue(inputSearch.value)
})

socket.on('receiveQueue', data => {
    updateQueue(data)
    filterQueue(inputSearch.value)
})

socket.on('receiveQueueMessage', message => {
    queueMessage.innerText = message
    inputQueue.value = ''
    setTimeout(() => {
        queueMessage.classList.add('d-none')
    }, 3000);
})

btnShuffle.addEventListener("click", function(e) {
    socket.emit('clientShuffleQueue', guildId)
})

btnNext.addEventListener("click", function(e) {
    socket.emit('clientNextQueue', guildId)
})

btnPlayPause.addEventListener("click", function(e) {
    socket.emit('clientPlayPause', guildId)
})

btnRepeat.addEventListener("click", function(e) {
    socket.emit('clientRepeat', guildId)
})

btnPrevious.addEventListener("click", function(e) {
    socket.emit('clientPreviousQueue', guildId)
})

setInterval(() => {
    socket.emit('clientGetTime', guildId)
}, 500);