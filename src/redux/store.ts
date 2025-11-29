// import { configureStore } from '@reduxjs/toolkit';
// import { workspaceApi } from './apis/workspaceApi';
// import { rtkQueryErrorLogger } from './middleware';

// export const store = configureStore({
//   reducer: {
//     [workspaceApi.reducerPath]: workspaceApi.reducer,
//   },
//   // Thêm api middleware và error logger middleware
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(workspaceApi.middleware, rtkQueryErrorLogger),
// });