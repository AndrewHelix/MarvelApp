import { Component } from "react/cjs/react.development";

class ErrorBoundary extends Component {
  state = {
    error: false,
  }

  componentDidCatch(err, errInfo) {
    console.log(err, errInfo)
    this.setState({error: true})
  }

  render() {
    if (this.state.error) {
      return <h2>Error...</h2>
    }

    return this.props.children;
  }
}

export default ErrorBoundary;