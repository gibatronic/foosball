export const _ = 0
export const X = 1

// prettier-ignore
const digitZero = [
    X, X, X,
    X, _, X,
    X, _, X,
    X, _, X,
    X, X, X,
] as const

// prettier-ignore
const digitOne = [
    _, X, _,
    X, X, _,
    _, X, _,
    _, X, _,
    _, X, _,
] as const

// prettier-ignore
const digitTwo = [
    X, X, X,
    _, _, X,
    X, X, X,
    X, _, _,
    X, X, X,
] as const

// prettier-ignore
const digitThree = [
    X, X, X,
    _, _, X,
    X, X, X,
    _, _, X,
    X, X, X,
] as const

// prettier-ignore
const digitFour = [
    X, _, X,
    X, _, X,
    X, X, X,
    _, _, X,
    _, _, X,
] as const

// prettier-ignore
const digitFive = [
    X, X, X,
    X, _, _,
    X, X, X,
    _, _, X,
    X, X, X,
] as const

// prettier-ignore
const digitSix = [
    X, X, X,
    X, _, _,
    X, X, X,
    X, _, X,
    X, X, X,
] as const

// prettier-ignore
const digitSeven = [
    X, X, X,
    X, _, X,
    _, _, X,
    _, _, X,
    _, _, X,
] as const

// prettier-ignore
const digitEight = [
    X, X, X,
    X, _, X,
    X, X, X,
    X, _, X,
    X, X, X,
] as const

// prettier-ignore
const digitNine = [
    X, X, X,
    X, _, X,
    X, X, X,
    _, _, X,
    X, X, X,
] as const

// prettier-ignore
const digitTen = [
    X, _, X,
    X, _, X,
    _, X, _,
    X, _, X,
    X, _, X,
] as const

export const digits = [
    digitZero,
    digitOne,
    digitTwo,
    digitThree,
    digitFour,
    digitFive,
    digitSix,
    digitSeven,
    digitEight,
    digitNine,
    digitTen,
] as const
