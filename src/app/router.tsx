import { createBrowserRouter } from 'react-router-dom'

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
            }
        ]
    }
])