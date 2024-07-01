import Dexie from "dexie";
import type {
  InsertType,
  EntityTable,
  IDType,
  Collection,
  WhereClause,
} from "dexie";
import { INamespace } from "protobufjs";

export interface DataFile {
  id: number;
  name: string;
  fileHandle: FileSystemFileHandle;
  definitionId: string;
  messageId: string;
}

export interface ProtoDefinition {
  id: string;
  name: string;
  fileHandle: FileSystemFileHandle;
  content: string;
  package?: string;
  imports: string[];
  unresolvedImports: string[];
  unresolvedImportCount: number;
  types: string[];
  descriptor: INamespace;
}

type BetterEntityTable<
  T,
  TKeyPropName extends keyof T = never,
  TInsertType = InsertType<T, TKeyPropName>
> = Omit<EntityTable<T, TKeyPropName, TInsertType>, "where"> & {
  where(query: { [key in keyof T]?: T[key] }): Collection<
    T,
    IDType<T, TKeyPropName>,
    TInsertType
  >;
  where(index: keyof T): WhereClause<T, IDType<T, TKeyPropName>, TInsertType>;
};

export const db = new Dexie("protolens") as Dexie & {
  definitions: BetterEntityTable<ProtoDefinition, "id">;
  dataFiles: BetterEntityTable<DataFile, "id">;
};

db.version(1).stores({
  dataFiles: "id++",
  definitions: "id, package, unresolvedImportCount",
});
