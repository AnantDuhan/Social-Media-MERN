import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from './Reducers/UserReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default store;