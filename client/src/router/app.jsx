import React, { Component } from 'react';

import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from "../layouts/Admin";
import AuthLayout from "../layouts/Auth";
import CommonRouter from "../layouts/Common";
import Alert from '../components/common/Alert';

// Redux
import {Provider} from 'react-redux';
import store from '../store';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true,
            isAdmin: false,
        }
    }

    render() {
        return (
            <Provider store={store}>
                {/* <Alert /> */}
                <Switch>
                    {/* <Route path="/auth" component={AuthLayout} /> auto rename
                    <Route path="/admin" component={AdminLayout} />
                    <Route path="/" component={CommonRouter} /> */}
                    <Route path="/admin" render={props => <AdminLayout {...props} />} ></Route>
                    <Route path="/auth" render={props => <AuthLayout {...props} />}></Route>
                    <Route path="/" render={props => <CommonRouter {...props} />}></Route>
                    <Redirect from="/" to="/" /> 
                </Switch>
            </Provider>
        )
    }
}

export default App;