import { createContext, Dispatch } from "react"
import { InitialStateType, initialState, Action } from "@/redux/vis"
const VisContext = createContext<{
  state: InitialStateType
  dispatch: Dispatch<Action>
}>({ state: initialState, dispatch: () => null })
export default VisContext
