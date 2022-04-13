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
const socket = io(socketUrl)
const setStatus = function(status) {
    if (!status.paused) btnPlayPause.setAttribute("class", "fas fa-pause bg-light text-dark track-paused")
    if (status.paused) btnPlayPause.setAttribute("class", "fas fa-play bg-light text-dark")
    if (status.repeat != 0) btnRepeat.setAttribute("class", "fas fa-redo-alt btn text-white bg-active")
    if (status.repeat == 0) btnRepeat.setAttribute("class", "fas fa-redo-alt btn text-white")
}
const updateQueue = function(queue) {
    let html = ''
    // console.log(`update queue`);
    queue.forEach((track, i) => {
        html += `
            <tr class="w-100 track-item">
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
    queueContent.innerHTML = html
}

socket.on('connect', () => {
    // console.log(`Connected`)
    socket.emit('join', guildId)
})

socket.on('receivePlayRepeatStatus', status => {
    setStatus(status)
})

socket.on('startNewTrack', data => {
    // console.log(data)
    thumbnail.setAttribute("style", `
        background-image: url(${data.track.thumbnail});
        background-repeat: no-repeat;
        background-position: left;background-size: cover;
    `)
    trackAuthor.innerText = data.track.author
    trackTitle.innerText = data.track.title
    updateQueue(data.queue)
})

socket.on('receiveTime', data => {
    trackprogress.value = data.progress
    timeCurrent.innerText = data.current
    timeEnd.innerText = data.end
})

socket.on('receiveStatus', data => {
    updateQueue(data.queue)
    setStatus(data.track)
})

socket.on('receiveQueue', data => {
    updateQueue(data)
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