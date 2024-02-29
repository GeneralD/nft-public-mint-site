import { createBrowserRouter } from 'react-router-dom'

import NotFound from '../features/NotFound'
import PublicMint from '../features/PublicMint'
import Root from '../features/Root'

export default createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/mint",
                element: <PublicMint />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    }
])