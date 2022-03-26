import React from 'react';
import {connect } from 'react-redux';
import {createStream} from '../../actions';
import StreamForm from '../StreamForm';

class StreamCreate extends React.Component {

    onSubmit = (formValues) => {
        const { id } = this.props.match.params;

        this.props.createStream(id, formValues);
    }

    render(){
        return (<div>
            <h3>Create new Session</h3>
            <StreamForm onSubmit={this.onSubmit}/>
        </div>);
    }
};


export default connect(null,{createStream})(StreamCreate)