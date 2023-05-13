import { configureStore } from '@reduxjs/toolkit'
import authSlice from './shared/reducers/auth-reducer'

const store = configureStore({
    reducer: {
        authSlice,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;