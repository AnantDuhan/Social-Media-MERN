import { configureStore } from '@reduxjs/toolkit';

import { likeReducer, myPostsReducer, userPostsReducer } from './Reducers/PostReducer';
import { allUsersReducer, postOfFollowingReducer, userProfileReducer, userReducer } from './Reducers/UserReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        postOfFollowing: postOfFollowingReducer,
        allUsers: allUsersReducer,
        like: likeReducer,
        myPosts: myPostsReducer,
        userProfile: userProfileReducer,
        userPosts: userPostsReducer,
    },
});

export default store;