import { useMonaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { MonacoBinding } from "y-monaco";
import { useYjs } from "./hooks/useYjs";

function MonacoEditor({ value, language, options, theme, path = undefined }) {
  const node = useRef();
  const monaco = useMonaco();
  const { type, provider } = useYjs();

  const [editor, setEditor] = useState(null);
  const [model, setModel] = useState(null);
  const [binding, setBinding] = useState(null);

  useEffect(() => {
    if (monaco) {
      setModel(monaco.editor.createModel(value, language, path));
      setEditor(monaco.editor.create(node.current, options));

      monaco.editor.setTheme(theme);
    }
  }, [monaco, node, theme, options, value, language, path]);

  useEffect(() => {
    if (editor !== null && binding === null) {
      editor.setModel(model);
      setBinding(
        new MonacoBinding(type, model, new Set([editor]), provider.awareness)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binding, editor]);

  return <div ref={node} style={{ height: "100%" }} />;
}

export default MonacoEditor;
