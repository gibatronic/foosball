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
    teamList = []
    teamMap = {}

    constructor(teamMap) {
        this.teamMap = teamMap ?? {}
        this.teamList = Object.values(this.teamMap)
        this.elements = getElements(this.teamList)

        return new EventSource('event-stream').addEventListener(
            'message',
            ({ data }) => this.update(JSON.parse(data)),
        )
    }

    async animate(team) {
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

        document.documentElement.classList.add('goal', `goal--${team.name}`)

        setTimeout(() => {
            this.elements.teams[team.name].textContent = team.points
        }, 150)

        await new Promise((resolve) => {
            this.elements.marqueeLetters
                .at(-1)
                .addEventListener('animationend', resolve)
        })

        document.documentElement.classList.remove('goal', `goal--${team.name}`)
    }

    update(team) {
        const incremented = this.teamMap[team.name].points < team.points
        this.teamMap[team.name].points = team.points

        if (incremented) {
            this.animate(this.teamMap[team.name])
        } else {
            this.elements.teams[team.name].textContent = team.points
        }
    }
}

new Main(parseTextContent($('#serialized-team-map')))
