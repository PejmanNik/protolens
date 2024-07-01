import { Grid, Stack, styled } from "@mui/joy";
import { LoadProtoDataFile } from "./LoadProtoDataFile";
import { DefinitionsError } from "./DefinitionsError";
import { LoadProtoDefinitions } from "./LoadProtoDefinitions";
import { RecentLoadedProtoData } from "./RecentLoadedProtoData";

const Container = styled("div")`
  place-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  display: flex;
  padding: 2rem;
`;

function Loader() {
  return (
    <Container>
      <Grid
        container
        spacing={1}
        sx={{
          flexGrow: 0,
          width: "110%",
          marginTop: "5rem",
        }}
      >
        <Grid xs={12} paddingBlockEnd={1} sx={{ height: "21rem" }}>
          <Stack spacing={2}>
            <LoadProtoDataFile />
            <DefinitionsError />
          </Stack>
        </Grid>

        <Grid xs={12} md={6} sx={{ height: "inherit" }}>
          <RecentLoadedProtoData />
        </Grid>
        <Grid xs={12} md={6} sx={{ height: "inherit" }}>
          <LoadProtoDefinitions />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Loader;
