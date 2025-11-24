import * as Y from "yjs";
import { encodeAwarenessUpdate, applyAwarenessUpdate } from "y-protocols/awareness";
import { encodeStateAsUpdate, applyUpdate } from "yjs";

export function setupYjsSync(ydoc, awareness, ws) {
  // 문서 업데이트 수신
  ws.onmessage = (event) => {
    const data = new Uint8Array(event.data);

    // 첫 번째 바이트로 update 타입 구분
    const messageType = data[0];

    // 0: document update
    if (messageType === 0) {
      applyUpdate(ydoc, data.slice(1));
    }

    // 1: awareness update
    else if (messageType === 1) {
      applyAwarenessUpdate(awareness, data.slice(1), ws);
    }
  };

  // 문서 변경 → 서버로 전송
  ydoc.on("update", (update) => {
    const msg = new Uint8Array([0, ...update]);
    ws.send(msg);
  });

  // awareness 변경 → 서버로 전송
  awareness.on("update", ({ added, updated, removed }) => {
    const update = encodeAwarenessUpdate(awareness, [...added, ...updated, ...removed]);
    const msg = new Uint8Array([1, ...update]);
    ws.send(msg);
  });
}