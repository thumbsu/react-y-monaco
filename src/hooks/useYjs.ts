import * as Y from 'yjs'

import { useCallback, useEffect, useState } from 'react'

import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'

export enum ProviderType {
  WEBSOCKET,
  WEBRTC,
}

export interface IUseYjsProps {
  roomName: string
  providerType?: ProviderType
}

export function useYjs({ roomName, providerType }: IUseYjsProps) {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null)
  const [provider, setProvider] = useState<WebrtcProvider | WebsocketProvider | null>(null)
  const [type, setType] = useState<Y.Text | null>(null)

  const createProviderInstance = useCallback(() => {
    if (ydoc === null || provider !== null) return
    if (providerType === ProviderType.WEBRTC) setProvider(new WebrtcProvider(roomName, ydoc))
    else setProvider(new WebsocketProvider('ws://127.0.0.1:8000', roomName, ydoc))
  }, [ydoc, provider])

  const createYMap = useCallback(() => {
    if (ydoc === null || type !== null) return
    setType(ydoc.getText(roomName))
  }, [type, provider])

  useEffect(() => {
    if (ydoc === null) setYdoc(new Y.Doc())
    else if (ydoc !== null && provider === null) createProviderInstance()
    if (ydoc !== null && type === null) createYMap()
  }, [ydoc, provider, type])

  return { type, provider }
}
