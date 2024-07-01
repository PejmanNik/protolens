import { Root } from "protobufjs";
import { db } from "../db";
import { useCallback, useEffect, useRef, useState } from "react";
import { decodeFileStream } from "./protobufDecoder";
import { unknownMessageType } from "../constant";
import { RawMessageType } from "./RawMessageType";

export function useFileDecoder(fileId: number) {
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, _setError] = useState<string | null>(null);
  const [items, setItems] = useState([] as unknown[]);
  const readerRef = useRef<AsyncGenerator<unknown, void, unknown>>();

  const setError = useCallback((e: unknown) => {
    console.error(e);
    if (e instanceof Error) {
      _setError(e.message);
    } else if (typeof e === "string") {
      _setError(e);
    } else {
      _setError("unknown error");
    }
  }, []);

  const fetchNextPage = useCallback(async () => {
    if (!readerRef.current) return;

    try {
      let isDone = false;
      const nextPage: unknown[] = [];
      for (let i = 0; i < 50; i++) {
        const item = await readerRef.current.next();

        if (item.value) {
          nextPage.push(item.value);
        }
        if (item.done) {
          isDone = true;
          break;
        }
      }

      setItems((i) => [...i, ...nextPage]);
      setHasNextPage(!isDone);
    } catch (e: unknown) {
      setError(e);
    }
  }, [setError]);

  useEffect(() => {
    const load = async () => {
      if (readerRef.current) return;
      const dataFile = await db.dataFiles.get(fileId);
      if (!dataFile) {
        throw new Error("Missing data file");
      }
      await dataFile.fileHandle.requestPermission({ mode: "read" });
      const file = await dataFile.fileHandle.getFile();

      if (dataFile.messageId == unknownMessageType.id) {
        readerRef.current = decodeFileStream(
          new RawMessageType(),
          file.stream()
        );
      } else {
        const definition = await db.definitions.get(dataFile.definitionId);
        if (!definition) {
          throw new Error("Missing definition file");
        }

        const type = Root.fromJSON(definition.descriptor).lookupType(
          dataFile.messageId
        );

        readerRef.current = decodeFileStream(type, file.stream());
      }

      await fetchNextPage();
    };

    if (!readerRef.current) {
      load().catch(setError);
    }
  }, [fileId, fetchNextPage, setError]);

  return {
    items,
    error,
    hasNextPage,
    fetchNextPage,
  };
}
