import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.sass";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Post from "./components/post/Post";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/post" component={Post} />
                <Route
                    path="/"
                    render={() => (
                        <div>
                            <Navbar />
                            <Home />
                        </div>
                    )}
                />
            </Switch>
        </BrowserRouter>
    );
};

export default App;
