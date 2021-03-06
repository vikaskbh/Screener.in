"use strict";
var React = require('react');
var Link = require('react-router').Link;
var api = require('../api.js');
var Utils = require('../components/utils.js');
var Icon = require('../components/icon.jsx');
var Alert = require('../components/alerts.jsx');


class Profile extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      form: {__html: '<h3>Loading...</h3>'},
      saved: false,
      errors: false
    };
  }

  componentDidMount() {
    if(!window.loggedIn)
      return (window.location = '/register/');
    Utils.setTitle('Profile');
    var url = '/users/' + window.userId + '.html';
    this._req = api.rawGet(url).then(resp => {
      this.setState({
        form: {__html: resp}
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    var data = Utils.getFormData(this.refs.form);
    var url = ['users', window.userId];
    api.patch(url, data).then(
      () => this.setState({saved: true, errors: false}),
      resp => this.setState({errors: resp, saved: false})
    );
  }

  render() {
    var saved = this.state.saved && <h3>Changes Saved</h3>;
    return <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <h2 className="page-header">My Account</h2>
        {saved}

        <p>
          <a
            className="btn btn-default"
            href="/password_change/">
            Change Password
          </a> <Link
            className="btn btn-info"
            to="/alerts/">
            Manage Email Alerts
          </Link>
        </p>

        <form onSubmit={this.handleSubmit} ref="form">
          <Alert errors={this.state.errors} />
          <input
            type="hidden"
            name="csrfmiddlewaretoken"
            value={api.getCsrf()}
          />
          <div dangerouslySetInnerHTML={this.state.form} />
          <button
            className="btn btn-primary"
            onClick={this.handleSubmit}>
            <Icon name="floppy-disk" /> Save Changes
          </button>
        </form>
      </div>
    </div>;
  }
}


module.exports = Profile;
