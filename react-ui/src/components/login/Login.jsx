import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import FacebookLogin from 'react-facebook-login';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { setUser } from '../../actions';

const styles = {
  viewContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  container: {
    margin: '60px auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  title: {
    fontSize: 40,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 17,
    color: '#888e99',
    marginTop: 10,
  },
  formContainer: {
    display: 'flex',
    margin: 'auto',
    marginTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 40,
  },
  body: {
    width: '100%',
    flex: 1,
  },
  loginButton: {
    width: '100%',
    marginTop: 20,
  },
  loginText: {
    color: 'white',
  },
  footer: {
    marginTop: 40,
  }
};

// const responseFacebook = (response) => {
//   console.log(response);
// };
//
//
// <FacebookLogin
//   appId={process.env.REACT_APP_FACEBOOK_APP_ID}
//   autoLoad={true}
//   fields="name,email,picture"
//   callback={responseFacebook}
// />

class Login extends Component {

  static propTypes = {
    onSetUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      usernameError: '',
      passwordError: ''
    }

    this.onLogin = this.onLogin.bind(this);
  }

  removeErrors() {
    this.setState({ usernameError: '', passwordError: '' });
  }

  async onLogin(ev) {
    ev.preventDefault();
    const username = this.refs.username.getValue();
    const password = this.refs.password.getValue();

    if (!username || !password) {
      const errMessage = 'This field is required';
      const errors = {}
      if (!username) errors.usernameError = errMessage;
      if (!password) errors.passwordError = errMessage;

      this.setState(errors);
      return;
    }

    try {
      const response = await fetch('/users/auth/login', {
  			method: 'POST',
  			body: JSON.stringify({
  				username,
          password
  			}),
  			headers: {
  	      'content-type': 'application/json'
  	    }
  		});
      if (!response.ok) {
        const { code } = await response.json();
        const ERROR_USERNAME_NOT_FOUND = 101;
        const ERROR_WRONG_PASSWORD = 105;
        const ERROR_SERVER_ERROR = 400;

        switch (code) {
          case ERROR_USERNAME_NOT_FOUND:
            this.setState({ usernameError: 'Username not found' });
            return;
          case ERROR_WRONG_PASSWORD:
            this.setState({ passwordError: 'Wrong password' });
            return;
          case ERROR_SERVER_ERROR:
            alert('Failed to create account. Please contact an administrator.');
            return;
          default:
            alert('Failed to create account. Please contact an administrator.');
            return;
        }
      } else {
        const user = await response.json();
        this.props.onSetUser(username, user);
        this.props.history.push("/");
      }
    } catch (err) {
      alert('Failed to create account. Please contact an administrator.');
      console.error(err);
    }
  }

  render() {
    return  (
      <div style={styles.viewContainer}>
        <div style={styles.container}>
          <div style={styles.header}>
            <img src="images/logo.png" alt="logo" style={styles.logo} />
            <span style={styles.title}>Welcome back!</span>
            <span style={styles.subtitle}>Log in to see your courses.</span>
          </div>
          <Paper style={styles.formContainer} zDepth={2} rounded={false}>
            <form style={styles.body}>
              <TextField
                hintText="e.g. Ferigoose123"
                floatingLabelText="Username"
                errorText={this.state.usernameError}
                ref="username"
              /><br />
              <TextField
                hintText="*********"
                floatingLabelText="Password"
                type="password"
                errorText={this.state.passwordError}
                ref="password"
              /><br />
              <RaisedButton
                label="Sign in"
                backgroundColor="#3ec16b"
                style={styles.loginButton}
                labelStyle={styles.loginText}
                onClick={this.onLogin}
                type="submit"
              />
            </form>
          </Paper>
          <div style={styles.footer}>
            Don't have an account yet? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSetUser: (username, user) => {
    dispatch(setUser(username, user));
  }
});

export default connect(null, mapDispatchToProps)(Login);
