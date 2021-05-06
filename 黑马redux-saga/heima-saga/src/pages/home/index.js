import React from 'react';
import {
    connect
} from 'react-redux';

const Home = (props) => {
    const handleClick = (type) => {
        props.dispatch({
            type,
            user: {
                username: "zhangsan",
                password: 123456
            }
        })
    }
    const handleClickTake = () => {
        props.dispatch({
            type: "take",
        })
    }

    return (<div>
        <button onClick={ handleClick.bind(null, "takeEvery") }>点击发送takeEvery</button>
        <button onClick={ handleClick.bind(null, "takeLatest") }>点击发送takeLatest</button>
        <button onClick={ handleClick.bind(null, "throttle") }>点击发送throttle</button>
        <button onClick={ handleClickTake }>点击发送take</button>
    </div>)
}

export default connect()(Home);