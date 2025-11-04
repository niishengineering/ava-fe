import {create} from 'zustand'

const useUserStore = create((set)=>({
    user:null,
    editUser: (data:{}) =>
    set((state:any) => ({ ...state, user: data })),
}))

export default useUserStore