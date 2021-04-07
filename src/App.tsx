import MonacoEditor from './MonacoEditor'
import { options } from './editorOptions'

function App() {
  return (
    <>
      <div style={{ height: '100vh' }}>
        <MonacoEditor
          value="// some code"
          language="javascript"
          options={options}
          theme="vs-dark"
        />
      </div>
    </>
  )
}

export default App
