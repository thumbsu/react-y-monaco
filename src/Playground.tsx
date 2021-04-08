import MonacoEditor from './components/MonacoEditor'
import { RouteComponentProps } from 'react-router'
import { options } from './editorOptions'

const Playground = ({ match }: RouteComponentProps) => {
  // @ts-ignore
  const { room } = match.params

  return (
    <div style={{ height: '100vh' }}>
      <div></div>
      <MonacoEditor roomName={room} language="javascript" options={options} theme="vs-dark" />
    </div>
  )
}

export default Playground
