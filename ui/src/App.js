import React from 'react'
import {
  createHashRouter,
  RouterProvider,
  Link,
} from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import MainPage from './pages/MainPage'
import ErrorPage from './pages/ErrorPage'


// Hack to get react-router working wit MUI https://mui.com/material-ui/guides/routing/
const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <Link ref={ref} to={href} {...other} />
});

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
})


const router = createHashRouter([
  {
    path: "/",
    element: <><MainPage /></>,
    errorElement: <ErrorPage />,
  },
])

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
