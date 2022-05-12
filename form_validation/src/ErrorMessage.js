import "./App.css";
import { Component } from "react";
class ErrorMessage extends Component {
  render() {
    return (
      this.props.errors &&
      this.props.errors.map((message, index) => {
        return (
          <span key={"errorMessage" + index} className="show-error-massage">
            {message}
          </span>
        );
      })
    );
  }
}
export default ErrorMessage;
