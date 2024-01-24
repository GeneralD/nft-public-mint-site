import { createBrowserRouter } from "react-router-dom"
import Root from "../features/root/Root"
import PublicMint from "../features/public-mint/PublicMint"

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