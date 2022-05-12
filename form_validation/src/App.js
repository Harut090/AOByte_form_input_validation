import "./App.css";
import { Component } from "react";
import Schema from "./Schema";
import ErrorMessage from "./ErrorMessage";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
      email: "",
      firstName: "",
      passport: "",
      phoneNumber: "",
      website: "",
      errors: {},
    };
  }

  onClick = (event) => {
    event.preventDefault();

    const passportValidator = (extra, message = "Default error message") => {
      return {
        validate: (value) => {
          return value.length >= 3;
        },
        message,
      };
    };
    const schema = new Schema({
      firstName: {
        type: "string",
        validators: ["min:3"],
        message: "The field must contain min {min} letters",
      },
      email: {
        type: "string",
        validators: "email",
      },
      age: {
        type: "numeric",
        validators: ["required"],
      },
      passport: {
        type: "string",
        validators: ["max:9", passportValidator],
        message: "Invalid passport number",
      },
      website: {
        type: "string",
        validators: ["url"],
      },
      phoneNumber: {
        type: "string",
        validators: "phone",
      },
    });
    let errors = schema.validate(this.state);
    this.setState({ ...this.state, errors: errors });
    console.log(this.state.errors);
    if (!Object.keys(errors).length) {
      alert("all fields are ok!");
    }
  };

  onChange = (event) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div className="App">
        <form>
          <h1>Form input validation</h1>
          <input
            type="number"
            placeholder="Age"
            name="age"
            onChange={this.onChange}
          />
          <ErrorMessage errors={this.state.errors.age} />
          <input
            type="text"
            placeholder="firstName"
            name="firstName"
            onChange={this.onChange}
          />
          <ErrorMessage errors={this.state.errors.firstName} />
          <input
            type="text"
            placeholder="email"
            name="email"
            onChange={this.onChange}
          />
          <ErrorMessage errors={this.state.errors.email} />
          <input
            type="password"
            placeholder="passport"
            name="passport"
            onChange={this.onChange}
          />
          <ErrorMessage errors={this.state.errors.passport} />
          <input
            type="number"
            placeholder=" phoneNumber"
            name="phoneNumber"
            onChange={this.onChange}
          />
          <ErrorMessage errors={this.state.errors.phoneNumber} />
          <input
            type="text"
            placeholder="website"
            name="website"
            onChange={this.onChange}
          />
          <ErrorMessage errors={this.state.errors.website} />

          <button onClick={this.onClick}>check</button>
        </form>
      </div>
    );
  }
}

export default App;
