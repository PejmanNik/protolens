import { RouterProvider, createHashRouter } from "react-router-dom";
import Loader from "./Loader";
import FileViewer from "./FileViewer";
import GlobalStyles from "@mui/joy/GlobalStyles";
import { CssVarsProvider, extendTheme } from "@mui/joy";

const router = createHashRouter([
  {
    path: "/",
    element: <Loader />,
  },
  {
    path: "/:fileId",
    element: <FileViewer />,
  },
]);

function App() {
  return (
    <CssVarsProvider
      theme={extendTheme({
        components: {
          JoyList: {
            styleOverrides: {
              root: {
                "--ListItemDecorator-size": "1.5rem",
              },
            },
          },
        },
      })}
    >
      <GlobalStyles
        styles={{
          svg: {
            color: "var(--Icon-color)",
            margin: "var(--Icon-margin)",
            fontSize: "var(--Icon-fontSize, 24px)",
            width: "0.75em",
            height: "0.75em",
          },
        }}
      />
      <RouterProvider router={router} />
    </CssVarsProvider>
  );
}

export default App;
