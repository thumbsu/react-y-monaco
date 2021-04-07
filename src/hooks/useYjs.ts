import * as Y from 'yjs'

import { useEffect, useState } from 'react'

import { WebrtcProvider } from 'y-webrtc'

export function useYjs() {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null)
  const [provider, setProvider] = useState<WebrtcProvider | null>(null)
  const [type, setType] = useState<Y.Text | null>(null)

  useEffect(() => {
    if (ydoc === null) {
      setYdoc(new Y.Doc())
    }
  }, [ydoc])

  useEffect(() => {
    if (ydoc !== null && provider === null) {
      setProvider(new WebrtcProvider('monaco', ydoc))
    }
  }, [ydoc, provider])

  useEffect(() => {
    if (ydoc !== null && type === null) {
      setType(ydoc.getText('monaco'))
    }
  }, [type, ydoc])

  return { type, provider }
}
