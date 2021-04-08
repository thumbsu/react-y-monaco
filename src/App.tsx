import { Route, Router } from 'react-router'

import Playground from './Playground'
import { createBrowserHistory } from 'history'

const defaultHistory = createBrowserHistory()

function App({ history = defaultHistory }) {
  return (
    <>
      <Router history={history}>
        <Route exact path="/:room" component={Playground} />
      </Router>
    </>
  )
}

export default App
