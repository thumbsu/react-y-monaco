import { FC, useEffect, useRef, useState } from 'react'
import { ProviderType, useYjs } from '../hooks/useYjs'
import type { Uri, editor } from 'monaco-editor'

import { MonacoBinding } from 'y-monaco'
import { useMonaco } from '@monaco-editor/react'

export interface IMonacoEditorProps {
  roomName: string
  value?: string
  language?: string
  path?: Uri
  options?: any
  theme?: string
}

const MonacoEditor: FC<IMonacoEditorProps> = ({
  roomName,
  language,
  path,
  options,
  theme,
  value = '',
}) => {
  const node = useRef<HTMLDivElement | null>(null)
  const monaco = useMonaco()
  const { type, provider } = useYjs({ roomName, providerType: ProviderType.WEBRTC })

  const [model, setModel] = useState<editor.ITextModel | null>(null)
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null)
  const [binding, setBinding] = useState(null)

  useEffect(() => {
    if (monaco && node !== null) {
      const el: any = node.current
      setModel(monaco.editor.createModel(value, language, path))
      setEditor(monaco.editor.create(el, { ...options, theme }))
    }
  }, [monaco, node, theme, options, value, language, path])

  useEffect(() => {
    if (editor !== null && binding === null && provider !== null) {
      editor.setModel(model)
      setBinding(new MonacoBinding(type, model, new Set([editor]), provider.awareness))
    }
  }, [binding, editor, provider])

  return <div ref={node} style={{ height: '100%' }} />
}

export default MonacoEditor
