const EVENT_ERROR = 'error'
const EVENT_OPEN = 'open'
const EVENT_RESET = 'reset'
const EVENT_TEAM = 'team'
const EVENT_WIN = 'win'

function $(selectors) {
    return document.querySelector(selectors)
}

function $$(selectors) {
    return Array.from(document.querySelectorAll(selectors))
}

function getElements(teamList) {
    const marqueeLetters = $$('.marquee__letter')

    const teams = teamList.reduce((teams, team) => {
        teams[team.name] = $(`.points__team--${team.name}`)
        return teams
    }, {})

    return {
        marqueeLetters,
        teams,
    }
}

function parseTextContent(element) {
    return JSON.parse(element.textContent)
}

class Main {
    elements = {}
    htmlClassList = document.documentElement.classList
    messagesConnectionErrors = 0
    teamList = []
    teamMap = {}
    winner = null

    constructor(teamMap) {
        console.debug('constructor', teamMap)

        this.teamMap = teamMap ?? {}
        this.teamList = Object.values(this.teamMap)
        this.elements = getElements(this.teamList)

        this.setupMessages()
    }

    async animate(team) {
        console.debug('update', team)

        const random = (min, max) => {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        const shoot = (angle, scalar) => {
            confetti({
                particleCount: random(5, 10),
                angle: random(angle - 5, angle + 5),
                spread: random(35, 55),
                startVelocity: random(35, 55),
                colors: ['#FFFFFF', team.colorAsHex, team.colorAsHex],
                scalar,
            })
        }

        for (let index = 0; index < 9; index++) {
            setTimeout(shoot, random(0, 200), index * 22.5, random(28, 32) / 10)

            setTimeout(
                shoot,
                random(100, 300),
                index * 22.5,
                random(18, 22) / 10,
            )
        }

        this.htmlClassList.add('goal', `goal--${team.name}`)

        setTimeout(() => {
            this.elements.teams[team.name].textContent = team.points
        }, 150)

        await new Promise((resolve) => {
            this.elements.marqueeLetters
                .at(-1)
                .addEventListener('animationend', resolve)
        })

        this.htmlClassList.remove('goal', `goal--${team.name}`)
    }

    setupMessages() {
        console.debug('setupMessages')
        const messages = new EventSource('event-stream')

        const error = (event) => {
            console.error('event-stream', event)
            ++this.messagesConnectionErrors

            messages.removeEventListener(EVENT_ERROR, error)
            messages.removeEventListener(EVENT_OPEN, open)
            messages.removeEventListener(EVENT_RESET, reset)
            messages.removeEventListener(EVENT_TEAM, team)
            messages.removeEventListener(EVENT_WIN, win)
            messages.close()

            setTimeout(
                () => this.setupMessages(),
                this.messagesConnectionErrors * 3000,
            )
        }

        const open = (event) => {
            console.debug('event-stream', event)
            this.messagesConnectionErrors = 0
        }

        const reset = (event) => {
            console.debug('event-stream', event)
            this.reset(JSON.parse(event.data))
        }

        const team = (event) => {
            console.debug('event-stream', event)
            this.update(JSON.parse(event.data))
        }

        const win = (event) => {
            console.debug('event-stream', event)
            this.win(JSON.parse(event.data))
        }

        messages.addEventListener(EVENT_ERROR, error)
        messages.addEventListener(EVENT_OPEN, open)
        messages.addEventListener(EVENT_RESET, reset)
        messages.addEventListener(EVENT_TEAM, team)
        messages.addEventListener(EVENT_WIN, win)
    }

    reset(teams) {
        console.debug('reset', teams)
        this.winner = null
        this.htmlClassList.remove('win')

        teams.forEach((team) => {
            this.htmlClassList.remove(`win--${team.name}`)
            this.update(team)
        })
    }

    update(team) {
        console.debug('update', team)
        const incremented = this.teamMap[team.name].points < team.points
        this.teamMap[team.name].points = team.points

        if (incremented) {
            this.animate(this.teamMap[team.name])
        } else {
            this.elements.teams[team.name].textContent = team.points
        }
    }

    win(team) {
        console.debug('win', team)
        this.winner = team
        this.htmlClassList.add('win', `win--${team.name}`)
    }
}

new Main(parseTextContent($('#serialized-team-map')))
