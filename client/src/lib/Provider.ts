import EventEmitter from 'events';
import { createContext } from 'react'
export const EventContext = createContext<any>(null)
export const eventBus:EventEmitter=new EventEmitter();
//export const ContainerContext = createContext<any>(null)
