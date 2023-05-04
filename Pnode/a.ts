interface Animal {
    name: string
}
interface Bear extends Animal {
    honey: boolean
}
const bear = getBear()
bear.name
bear.honey

