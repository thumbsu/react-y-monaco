import * as Y from "yjs";
import { useEffect, useState } from "react";
import { WebrtcProvider } from "y-webrtc";

export function useYjs() {
  const [ydoc, setYdoc] = useState(null);
  const [provider, setProvider] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    if (ydoc === null) {
      setYdoc(new Y.Doc());
    }
  }, [ydoc]);

  useEffect(() => {
    if (ydoc !== null && provider === null) {
      setProvider(new WebrtcProvider("monaco", ydoc));
    }
  }, [ydoc, provider]);

  useEffect(() => {
    if (ydoc !== null && type === null) {
      setType(ydoc.getText("monaco"));
    }
  }, [type, ydoc]);

  return { type, provider };
}
