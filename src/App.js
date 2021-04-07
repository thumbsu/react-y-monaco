import { Fragment } from "react";
import { options } from "./editorOptions";
import MonacoEditor from "./MonacoEditor";

function App() {
  return (
    <Fragment>
      <div style={{ height: "100vh" }}>
        <MonacoEditor
          value="// some code"
          language="javascript"
          options={options}
          theme="vs-dark"
        />
      </div>
    </Fragment>
  );
}

export default App;
