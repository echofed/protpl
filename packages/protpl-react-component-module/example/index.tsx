import React from 'react'
import ReactDOM from 'react-dom'
import TextScroll from '../src/index'
import { Mode } from '../src/interface'

class App extends React.Component {

  data: string[] = [
    '还是上面的例子，我们将transition属性合并，并扩展几个浏览器，如下CSS代码：',
  ]
  render() {
    return (
        <div>
          <TextScroll text={this.data} mode={Mode.horizontal} speed={6000} />
        </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
