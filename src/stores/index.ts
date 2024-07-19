import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

export * from './modules/config'
export * from './modules/raid'
export * from './modules/dungeon'
export * from './modules/user'
export * from './modules/shop'
export * from './modules/decklist'
export * from './modules/bounty'
export * from './modules/event'
