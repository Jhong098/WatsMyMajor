import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
	withRouter
} from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import { toggleSideBar, setCourse, createSnack } from './actions/index';
import './stylesheets/App.css';
import AppBar from './components/AppBar';
import SideBar from './components/SideBar';
import Dashboard from './components/Dashboard';
import MyCourseView from './components/MyCourseContainer';
import CourseListView from './components/CourseListContainer';

let styles = {
	marginLeft: 0,
	transition: 'all 1s ease-in-out'
}

class App extends Component {

	static propTypes = {
		onToggleSideBar: PropTypes.func.isRequired,
		selectCourseHandler: PropTypes.func.isRequired,
		onUndoSnack: PropTypes.func.isRequired
	};

  constructor(props) {
    super(props);

		const {
			view,
			sideBarOpen,
			snack,
			onToggleSideBar,
			selectCourseHandler,
			onUndoSnack
		} = props;

    this.state = {
			subject: '',
			catalogNumber: '',
      message: null,
      fetching: true,
			hasSnack: false,
			view,
			sideBarOpen,
			snackAutoHideDuration: 2000,
			snackOpen: false,
			snack
    };

		this.getView = this.getView.bind(this);
		this.handleRequestClose = this.handleRequestClose.bind(this);
		this.handleActionClick = this.handleActionClick.bind(this);
		this.searchCourseHandler = this.searchCourseHandler.bind(this);
		this.onToggleSideBar = onToggleSideBar;
		this.selectCourseHandler = selectCourseHandler;
		this.onUndoSnack = onUndoSnack;
	}

	getView() {
		const marginLeft = (this.state.sideBarOpen) ? '256px' : 0;
		const transition = (this.state.sideBarOpen)
													? 'all 0.3s ease-in-out'
													: 'all 0.225s ease-out';
		styles = Object.assign({}, styles, { marginLeft, transition });

		return (
			<div style={styles}>
				<Switch>
					<Route exact path='/' component={Dashboard} />
					<Route path='/my-courses' component={MyCourseView} />
					<Route path='/courses/:subject/:catalogNumber' component={CourseListView} />
				</Switch>
			</div>
		);
	}

	componentWillReceiveProps(nextProps) {
	  if (nextProps.view !== this.state.view ||
				nextProps.sideBarOpen !== this.state.sideBarOpen) {
			this.setState(nextProps);
		}

		if (nextProps.snack !== this.state.snack) {
			this.setState({
				snackOpen: true,
				snack: nextProps.snack
			});
		}
	}

	handleRequestClose() {
		this.setState({ snackOpen: false });
	}

	handleActionClick() {
		this.setState({ snackOpen: false });
		this.state.snack.handleActionClick();
		this.props.onUndoSnack(this.state.snack.undoMsg);
	}

	searchCourseHandler(subject, catalogNumber) {
		this.props.history.push(`/courses/${subject}/${catalogNumber}`);
		this.state.selectCourseHandler(subject, catalogNumber);
	}

  render() {
    return (
			<Router>
				<div className="App">
					<AppBar
						toggleSideBar={this.onToggleSideBar}
						searchCourseHandler={this.searchCourseHandler}
					/>
					<SideBar open={this.state.sideBarOpen} />
					{this.getView()}
					<Snackbar
						open={this.state.snackOpen}
						message={this.state.snack.msg}
						action={this.state.snack.actionMsg}
						autoHideDuration={this.state.snackAutoHideDuration}
						onActionClick={this.handleActionClick}
						onRequestClose={this.handleRequestClose}
					/>
				</div>
			</Router>
    );
  }

}

const mapStateToProps = ({ view, sideBarOpen, snack }) => {
	return { view, sideBarOpen, snack };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleSideBar: () => {
      dispatch(toggleSideBar());
    },
		selectCourseHandler: (subject, catalogNumber) => {
			dispatch(setCourse(subject, catalogNumber));
		},
		onUndoSnack: (msg) => {
			dispatch(createSnack(msg));
		}
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
