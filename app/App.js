import React from 'react'
import {
  AragonApp,
  Button,
  Text,
  Card,
  AppBar,
  AppView,
  BaseStyles,

  observe
} from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'
import { Observable } from 'rxjs'
import {markdown} from 'markdown';
import {save as ipfsSave} from './ipfs-util';

const AppContainer = styled(AragonApp)`

`
// Alternative: <iframe src="https://ipfs.io/ipfs/QmSrCRJmzE4zE1nAfWPbzVfanKQNBhp7ZWmMnEdbiLvYNh/mdown#sample.md" />

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    }
    this.onClick = this.onClick.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  onClick() {
    this.setState({ editing: !this.state.editing });
  }
  onSave(text) {
    if (text === false) {
      this.setState({editing: false})
      return
    }
    ipfsSave(text).then(hex => {
      const onUpdated = () => this.setState({editing: false})
      this.props.app.edit(hex).subscribe(onUpdated)
    })
  }
  render () {
    const shouldHide = (editing) => (editing?{display:'none'}:{})
    const SpacedBlock = styled.div`
      margin-top: 30px;
      &:first-child {
        margin-top: 0;
      }
    `
    const Title = styled.h1`
      margin-top: 10px;
      margin-bottom: 20px;
      font-weight: 600;
    `
    const {editing} = this.state
    const {observable} = this.props
    return (
      <AppContainer>
        <BaseStyles />
        <AppView title="DAO Wiki">
        <div>
          <div style={shouldHide(editing)}>
            <SpacedBlock>
              <Title>View Main Page</Title>
              <ObservedViewPanel observable={observable} callback={this.onClick} />
            </SpacedBlock>
          </div>
          <div style={shouldHide(!editing)}>
            <SpacedBlock>
              <Title>Edit Main Page</Title>
              <ObservedEditPanel editing={editing} observable={observable} handleSubmit={this.onSave} />
            </SpacedBlock>
          </div>
        </div>
        </AppView>
      </AppContainer>
    )
  }
}

class EditPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.text === this.props.text)
      this.setState({...newProps})
  }

  handleChange(event) {
    this.setState({text: event.target.value});
  }

  handleSubmit(event) {
    this.props.handleSubmit(this.state.text);
    event.preventDefault();
  }

  handleCancel(event) {
    this.props.handleSubmit(false)
  }

  render() {
    const textareaStyle = {
      width: '100%',
      height: 'inherit'
    }
    return (
        <form onSubmit={this.handleSubmit}>
          <Button mode="strong" onClick={this.handleSubmit}>Save</Button>
          <Button type="button" onClick={this.handleCancel}>Cancel</Button>
          <Card width="100%" >
            <textarea value={this.state.text} onChange={this.handleChange} style={textareaStyle} />
          </Card>
        </form>

    );
  }
}

const text = `
# This is a DAO wiki

This is a censorship resistant wiki, that stores the content on IPFS and saves
its state on the blockchain. If you are a token holder, you can edit it.
`

const obs = observe((state$) => state$, {hash: 'no hash', text})

const ResetStyle = styled.div`
font: 9pt/1.5em sans-serif;
padding: 25px;

pre, code, tt {
font: 1em/1.5em 'Andale Mono', 'Lucida Console', monospace;
}
h1, h2, h3, h4, h5, h6, b, strong {
font-weight: bold;
}
h1 {
font-size:1.5em
}
em, i, dfn {
font-style: italic;
}
p, code, pre, kbd {
margin:0 0 1.5em 0;
}
blockquote {
margin:0 1.5em 1.5em 1.5em;
}
cite {
font-style: italic;
}
li ul, li ol {
margin:0 1.5em;
}
ul, ol {
margin:0 1.5em 1.5em 1.5em;
}
ul {
list-style-type:disc;
}
ol {
list-style-type:decimal;
}
del {
text-decoration: line-through;
}
pre {
margin:1.5em 0;
white-space:pre;
}
`
const ObservedViewPanel = obs(
    ({hash, text, callback}) =>
    <div>

    <Button mode="strong" onClick={callback}>Edit</Button>
    <Card width="100%">
      <ResetStyle dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }}></ResetStyle>
    </Card>
    <Text.Block>{hash}</Text.Block>
    </div>
  )

const ObservedEditPanel = obs(EditPanel)
