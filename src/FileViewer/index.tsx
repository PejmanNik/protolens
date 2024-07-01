import { useParams } from "react-router-dom";
import { styled } from "@mui/joy";
import { Header } from "./Header";
import { RowLists } from "./RowLists";
import { FileLoadingError } from "./FileLoadingError";
import { useResetAtom } from "jotai/utils";
import { collapsedRowsAtom } from "./state";
import { useEffect } from "react";

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
  const reset = useResetAtom(collapsedRowsAtom);
  const fileId = Number.parseInt(useParams().fileId ?? "0");

  useEffect(() => {
    return () => reset();
  }, [reset]);

  if (!fileId || isNaN(fileId) || fileId <= 0) {
    return <FileLoadingError error="File id is missing" />;
  }

  return (
    <Container>
      <Header fileId={fileId} />
      <RowLists fileId={fileId} />
    </Container>
  );
}

export default FileViewer;