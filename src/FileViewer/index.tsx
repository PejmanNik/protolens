import { useParams } from "react-router-dom";
import { Alert, styled, Typography } from "@mui/joy";
import { Header } from "./Header";
import { RowLists } from "./RowLists";
import { useEffect } from "react";
import { useResetAtoms } from "./useResetAtoms";

const Container = styled("div")`
  --Icon-fontSize: 13px;
  justify-items: left;
  width: 100%;
  height: 100vh;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

function FileViewer() {
  const reset = useResetAtoms();
  const fileId = Number.parseInt(useParams().fileId ?? "0");

  useEffect(() => {
    return () => reset();
  }, [reset]);

  if (!fileId || isNaN(fileId) || fileId <= 0) {
    return (
      <Container>
        <Alert color="danger">
          <Typography level="h4" color="danger">
            File id is not valid
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Header fileId={fileId} />
      <RowLists fileId={fileId} />
    </Container>
  );
}

export default FileViewer;
