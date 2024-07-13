import { db } from "../db";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { unknownMessageType } from "../constant";
import { useAtomValue } from "jotai";
import { filterAtom } from "./state";
import { CancellationToken, FileDecoder } from "./FileDecoder";
import { errorToString } from "../utils";
import { INamespace } from "protobufjs";

export function useFileDecoder(fileId: number) {
  const filter = useAtomValue(filterAtom);
  const [reload, setReload] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState([] as unknown[]);
  const [isLoading, setIsLoading] = useState(true);
  const cancellationToken = useRef(new CancellationToken());
  const fileDecoderRef = useRef<FileDecoder>();

  const fetchNextPage = useCallback(async () => {
    if (!fileDecoderRef.current) return;

    setIsLoading(true);

    try {
      const newItems = await fileDecoderRef.current.read(
        cancellationToken.current
      );

      // the decoder is busy with another read
      if (newItems.busy) return;

      startTransition(() => {
        setIsLoading(false);
        setHasNextPage(!newItems.done);
        setItems((x) =>
          newItems.value.length === 0 ? x : [...x, ...newItems.value]
        );
      });
    } catch (e) {
      console.error(e);
      setError(errorToString(e));
      setIsLoading(false);
      return;
    }
  }, [setItems]);

  const readDataFile = useCallback(async () => {
    const dataFile = await db.dataFiles.get(fileId);
    if (!dataFile) {
      throw new Error("Missing data file");
    }
    const state = await dataFile.fileHandle.queryPermission({
      mode: "read",
    });
    if (state !== "granted") {
      await dataFile.fileHandle.requestPermission({ mode: "read" });
    }

    return dataFile;
  }, [fileId]);

  useEffect(() => {
    let isUnmounted = false;
    const load = async () => {
      try {
        const dataFile = await readDataFile();
        const file = await dataFile.fileHandle.getFile();
        const reader = file.stream().getReader();

        const descriptor = await getMessageDescriptor(
          dataFile.definitionId,
          dataFile.messageId
        );

        const decoder = new FileDecoder(
          reader,
          dataFile.messageId,
          descriptor,
          filter
        );

        setError(null);
        setItems([]);
        cancellationToken.current = new CancellationToken();
        if (isUnmounted) {
          return decoder;
        }

        fileDecoderRef.current = decoder;
        await fetchNextPage();
        return decoder;
      } catch (e) {
        console.error(e);
        setError(errorToString(e));
        setIsLoading(false);
      }
    };

    const promise = load();

    return () => {
      isUnmounted = true;
      promise.then((x) => {
        x?.terminate();
      });
    };
  }, [filter, fileId, setError, reload, fetchNextPage, readDataFile]);

  return useMemo(
    () => ({
      items,
      error,
      hasNextPage,
      isLoading,
      fetchNextPage,
      cancel: () => cancellationToken.current.cancel(),
      reload: () => readDataFile().then(() => setReload((x) => x + 1)),
    }),
    [items, error, hasNextPage, isLoading, fetchNextPage, setReload, readDataFile]
  );
}

async function getMessageDescriptor(
  definitionId: string,
  messageId: string
): Promise<INamespace> {
  if (messageId == unknownMessageType.id) {
    return {};
  }
  const definition = await db.definitions.get(definitionId);
  if (!definition) {
    throw new Error("Missing definition file");
  }

  return definition.descriptor;
}
