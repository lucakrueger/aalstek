const textAnimation = (from, to, duration, ...timeOffsets) => {
    let titleWords = document
        .getElementById('titleWords')
        .getElementsByTagName('span')

    if (from != '') {
        for (let word of titleWords) word.classList.add(from)
    }

    const nextWord = (index) => {
        setTimeout(
            () => {
                if (index >= titleWords.length) return

                if (from != '') titleWords[index].classList.remove(from)
                titleWords[index].classList.add(to)

                nextWord(index + 1)
            },
            index >= timeOffsets.length
                ? timeOffsets[index] + duration
                : timeOffsets[timeOffsets.length - 1] + duration,
        )
    }

    nextWord(0)
}

const elapsed = (duration, ...timeOffsets) => {
    let sum = 0

    for (let time of timeOffsets) sum += time + duration

    return sum
}

const textAnimationBack = (from, to, duration, after, wait, ...timeOffsets) => {
    textAnimation(from, to, duration, ...timeOffsets)

    setTimeout(
        () => {
            textAnimation(to, from, duration, ...timeOffsets)
        },
        wait == true ? after + elapsed(duration, ...timeOffsets) : after,
    )
}

const after = (time, callback) => {
    setTimeout(() => {
        callback()
    }, time)
}

const every = (time, callback) => {
    setTimeout(
        () => {
            callback()
            every(time, callback)
        },
        typeof time == 'function' ? time() : time,
    )
}
