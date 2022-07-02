import { configureStore } from '@reduxjs/toolkit';
import { likeReducer } from './Reducers/PostReducer';

import { allUsersReducer, postOfFollowingReducer, userReducer } from './Reducers/UserReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        postOfFollowing: postOfFollowingReducer,
        allUsers: allUsersReducer,
        like: likeReducer
    },
});

export default store;