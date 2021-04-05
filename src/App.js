import { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { MonacoBinding } from "y-monaco";
import { options } from "./editorOptions";
import { useYjs } from "./hooks/useYjs";

function App() {
  const monaco = useMonaco();
  const { type, provider } = useYjs();

  useEffect(() => {
    if (monaco && provider !== null && type !== null) {
      const editor = monaco.editor.create(
        document.getElementById("monaco-editor"),
        { ...options, language: "javascript" }
      );
      monaco.editor.setTheme("vs-dark");
      new MonacoBinding(
        type,
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );
    }
  }, [monaco, provider, type]);

  return <div id="monaco-editor" style={{ height: "100vh" }}></div>;
}

export default App;
