import {create} from 'zustand'

const usePropertyChatStore = create((set)=>({
    selectedProperty : null,
    editSelectedProperty: (id: string) =>
    set((state:any) => ({ ...state, selectedProperty: id })),
}))


export default usePropertyChatStore