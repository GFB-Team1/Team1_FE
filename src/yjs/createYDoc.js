import * as Y from "yjs";

export function createYDoc() {
  const ydoc = new Y.Doc();

  // text 타입 생성
  ydoc.getText("content");

  return ydoc;
}