import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import StreamCreate from './streams/StreamCreate';
import StreamEdit from './streams/StreamEdit';
import StreamList from './streams/StreamList';
import StreamDelete from './streams/StreamDelete';
import StreamShow from './streams/StreamShow';
import Header from './Header';
import history from '../history';
import Canva from './Canva';
import WelcomeView from './WelcomeView';
import Game from './Game';
import {ContentWrap} from './contentStyles';
import './App.css'

const App = () =>{
    // return(<Canva/>);
    // return <div className='title'>Hi</div>
    // return <ContentWrap>
    //     <h1>Hi</h1>
    // </ContentWrap>;
    return (<div className='App'>
        <Router history={history}>
            <Route path="/" exact component={WelcomeView}/>
            <Route path="/play" exact component={Game}/>
        </Router>
    </div>
    
    
    // <div className="ui container">
    //             <Router history={history}>
    //                 <div>
    //                     <Header/>
    //                     <Switch>
    //                         <Route path="/" exact component={StreamList}/>
    //                         {/* <Route path="/streams/new" exact component={Canva}/> */}
    //                         <Route path="/streams/new" exact component={StreamCreate}/>

    //                         <Route path="/streams/wait/:id" exact component={StreamEdit}/>
    //                         <Route path="/streams/delete/:id" exact component={StreamDelete}/>
    //                         <Route path="/streams/:id" exact component={StreamShow}/>
    //                     </Switch>
    //                 </div>
    //             </Router>
    //         </div>
        );
};

export default App;