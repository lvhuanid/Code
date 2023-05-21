interface Animal {
    name: string
}
interface Bear extends Animal {
    honey: boolean
}
const getBear = () => {
    return { name:'', honey: ''}
};
const bear = getBear()
bear.name
bear.honey

