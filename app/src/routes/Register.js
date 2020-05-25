import React, { Component } from 'react';
import { Message, Container, Header, Input, Button } from 'semantic-ui-react';
import { gql, graphql } from 'react-apollo';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: ''
    };
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: ''
    });

    const { username, email, password } = this.state;
    const response = await this.props.mutate({
      variables: { username, email, password }
    });
    const { ok, errors } = response.data.register;

    if (ok) {
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err['passwordError'] = 'too long..';
        err[`${path}Error`] = message;
      });

      this.setState(err);
    }

    console.log(response);
  };

  render() {
    const { username, email, password, usernameError, emailError, passwordError } = this.state;
    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Container text>
        <Header as="h2">Register</Header>

        <Input
          name="username"
          error={!!usernameError}
          onChange={this.onChange}
          value={username}
          placeholder="Username"
          fluid
        />
        <Input
          name="email"
          error={!!emailError}
          onChange={this.onChange}
          value={email}
          placeholder="Email"
          fluid
        />
        <Input
          name="password"
          error={!!passwordError}
          onChange={this.onChange}
          value={password}
          placeholder="Password"
          fluid
          type="password"
        />
        <Button onClick={this.onSubmit}>Submit</Button>
        {usernameError || emailError || passwordError ? (
          <Message error header="There was some errors with your submission" list={errorList} />
        ) : null}
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      user {
        id
        username
        email
      }
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerMutation)(Register);
