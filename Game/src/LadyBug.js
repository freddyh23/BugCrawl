import React, { Component } from 'react';
import { Image } from 'react-native';

const LadyBug = (props) => {
    const height = props.height;
    const width = props.width;
    const x = props.body.position.x - width/2;
    const y = props.body.position.y - height/2;
    return (
        <Image
            style={{
                position: 'absolute',
                top: y,
                left: x,
                width: width,
                height: height
            }}
            resizeMode="stretch"
            source={props.image}
        />
    );
};

export default LadyBug;
