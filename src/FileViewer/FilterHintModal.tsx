import { Modal, ModalClose, Sheet, Table, Typography } from "@mui/joy";

export interface FilterHintModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

export function FilterHintModal({ open, onClose }: FilterHintModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      aria-labelledby="JSONPath-Syntax-Guide"
      aria-describedby="JSONPath-Syntax"
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 800,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          JSONPath Syntax Guide
        </Typography>
        <p>
          This guide provides a brief overview of JSONPath syntax for querying
          JSON data.
        </p>
        <Table>
          <thead>
            <tr>
              <th style={{width:'10%'}}>Syntax</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>$</td>
              <td>The root object/element</td>
              <td>$.store</td>
            </tr>
            <tr>
              <td>@</td>
              <td>The current object/element</td>
              <td>@.price</td>
            </tr>
            <tr>
              <td>. or []</td>
              <td>Child operator</td>
              <td>$.store.book[0].title or $.store.book[0]['title']</td>
            </tr>
            <tr>
              <td>..</td>
              <td>Recursive descent</td>
              <td>$.store..price</td>
            </tr>
            <tr>
              <td>*</td>
              <td>Wildcard (all elements)</td>
              <td>$.store.book[*].author</td>
            </tr>
            <tr>
              <td>?</td>
              <td>Filter expression</td>
              <td>{"$.store.book[?(@.price < 10)]"}</td>
            </tr>
            <tr>
              <td>?</td>
              <td>Filter length of root property expression</td>
              <td>{"$[?(@root.store.length< 10)]"}</td>
            </tr>
            <tr>
              <td>?</td>
              <td>Filter by RegEx expression</td>
              <td>{"$.store.book[?(@.name.match(/blind watchmaker/))]"}</td>
            </tr>
          </tbody>
        </Table>
        <Typography textColor="text.tertiary" mt={1}>
          For more details, visit the{" "}
          <a
            href="https://github.com/JSONPath-Plus/JSONPath"
            target="_blank"
            rel="noopener noreferrer"
          >
            JSONPath documentation
          </a>
          .
        </Typography>
      </Sheet>
    </Modal>
  );
}
