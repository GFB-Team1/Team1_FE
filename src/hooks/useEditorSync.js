import { useEffect } from "react";
import * as awarenessProtocol from "y-protocols/awareness";
import { setupYjsSync } from "../yjs/sync";
import { createYDoc } from "../yjs/createYDoc";
import { useRoomStore } from "@/stores/roomStore";

export function useEditorSync(editor) {
  const ws = useRoomStore((s) => s.websocket);
  const setYDoc = useRoomStore((s) => s.setYDoc);

  useEffect(() => {
    if (!ws || !editor) return;

    const ydoc = createYDoc();
    const awareness = new awarenessProtocol.Awareness(ydoc);

    setupYjsSync(ydoc, awareness, ws);

    // Tiptap <-> Y.js 연결
    const type = ydoc.getText("content");
    editor.commands.setContent(type.toString());

    type.observe(() => {
      editor.commands.setContent(type.toString());
    });

    setYDoc(ydoc);

  }, [ws, editor, setYDoc]);
}