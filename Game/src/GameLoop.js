import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StatusBar, StyleSheet, Image} from 'react-native';
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import LadyBug from "./LadyBug";
import Physics from "./Physics";
import Constants from "./Constants";
import Images from "../assets/Images/Images";
import common from "./Common";

export default class GameLoop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRunning: false,
            score: 0
        };

        this.gameEngine = null;
        this.entities = null;
    }

    setupWorld = () => {
        let engine = Matter.Engine.create({ enableSleep: false });
        let world = engine.world;
        world.gravity.y = 0;

        let box = Matter.Bodies.rectangle(Constants.MAX_WIDTH/2, Constants.MAX_HEIGHT/2, Constants.HIT_BOX_WIDTH,
            Constants.HIT_BOX_HEIGHT);

        let xPos = common.getXPos();
        let xPosTop = common.getXPos();

        let antBottom1 = Matter.Bodies.rectangle(xPos[0], 0, Constants.HIT_BOX_WIDTH, Constants.HIT_BOX_HEIGHT,
            {friction: 0, frictionAir: 0});
        let antBottom2 = Matter.Bodies.rectangle(xPos[1], 0, Constants.HIT_BOX_WIDTH, Constants.HIT_BOX_HEIGHT,
            {friction: 0, frictionAir: 0});
        let antBottom3 = Matter.Bodies.rectangle(xPos[2], 0, Constants.HIT_BOX_WIDTH, Constants.HIT_BOX_HEIGHT,
            {friction: 0, frictionAir: 0});
        let antBottom4 = Matter.Bodies.rectangle(xPos[3], 0, Constants.HIT_BOX_WIDTH, Constants.HIT_BOX_HEIGHT,
            {friction: 0, frictionAir: 0});
        let antTop1 = Matter.Bodies.rectangle(xPosTop[0], 0 - Constants.HALF_HEIGHT, Constants.HIT_BOX_WIDTH,
            Constants.HIT_BOX_HEIGHT, {friction: 0, frictionAir: 0});
        let antTop2 = Matter.Bodies.rectangle(xPosTop[1], 0 - Constants.HALF_HEIGHT, Constants.HIT_BOX_WIDTH,
            Constants.HIT_BOX_HEIGHT, {friction: 0, frictionAir: 0});
        let antTop3 = Matter.Bodies.rectangle(xPosTop[2], 0 - Constants.HALF_HEIGHT, Constants.HIT_BOX_WIDTH,
            Constants.HIT_BOX_HEIGHT, {friction: 0, frictionAir: 0});
        let antTop4 = Matter.Bodies.rectangle(xPosTop[3], 0 - Constants.HALF_HEIGHT, Constants.HIT_BOX_WIDTH,
            Constants.HIT_BOX_HEIGHT, {friction: 0, frictionAir: 0});


        Matter.World.add(world, [box, antBottom1, antBottom2, antBottom3, antBottom4, antTop1, antTop2, antTop3, antTop4]);

        Matter.Events.on(engine, 'collisionStart', (event) => {
            this.gameEngine.dispatch({ type: 'game-over'});
        });

        return { physics: {engine: engine, world: world},
            box: {body: box, height: Constants.BUG_SIZE, width: Constants.BUG_SIZE, image: Images.ladybug, renderer: LadyBug},
            antBottom1: {body: antBottom1, height: Constants.DEFAULT_SIZE_ENEMIES, width: Constants.DEFAULT_SIZE_ENEMIES,
                image: Images.ant, score: false, renderer: LadyBug},
            antBottom2: {body: antBottom2, height: Constants.DEFAULT_SIZE_ENEMIES, width: Constants.DEFAULT_SIZE_ENEMIES,
                image: Images.ant, renderer: LadyBug},
            antBottom3: {body: antBottom3, height: Constants.DEFAULT_SIZE_ENEMIES, width: Constants.DEFAULT_SIZE_ENEMIES,
                image: Images.ant, renderer: LadyBug},
            antBottom4: {body: antBottom4, height: Constants.DEFAULT_SIZE_ENEMIES, width: Constants.DEFAULT_SIZE_ENEMIES,
                image: Images.ant, renderer: LadyBug},
            antTop1: {body: antTop1, height: Constants.DEFAULT_SIZE_ENEMIES, width: Constants.DEFAULT_SIZE_ENEMIES,
                image: Images.ant, score: false, renderer: LadyBug},
            antTop2: {body: antTop2, height: Constants.DEFAULT_SIZE_ENEMIES, width: Constants.DEFAULT_SIZE_ENEMIES,
                image: Images.ant, renderer: LadyBug},
            antTop3: {body: antTop3, height: Constants.DEFAULT_SIZE_ENEMIES, width: Constants.DEFAULT_SIZE_ENEMIES,
                image: Images.ant, renderer: LadyBug},
            antTop4: {body: antTop4, height: Constants.DEFAULT_SIZE_ENEMIES, width: Constants.DEFAULT_SIZE_ENEMIES,
                image: Images.ant, renderer: LadyBug},
        };
    };

    onEvent = (e) => {
        if(e.type === 'game-over') {
            this.setState({
                isRunning: false
            })
        } else if(e.type === 'scored') {
            this.setState({
                score: this.state.score + 1
            })
        }
    };

    reset = () => {
        this.gameEngine.swap(this.setupWorld());
        this.setState( {
            isRunning: true,
            score: 0
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Image source={Images.bark} style={styles.backgroundImage} resizeMode="stretch" />
                <GameEngine
                    ref={(ref) => { this.gameEngine = ref; }}
                    style={styles.container}
                    running={this.state.isRunning}
                    onEvent={this.onEvent}
                    systems={[Physics]}
                    entities={this.entities}
                />
                <Text style={styles.text}> {this.state.score} </Text>
                    <StatusBar hidden={true}/>
                {!this.state.isRunning && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
                    <Image source={Images.treeBackGround} style={{height: Constants.MAX_HEIGHT, }}/>
                    <View style={styles.fullScreen}>
                        <Text style={styles.text}>Play</Text>
                    </View>
                </TouchableOpacity>}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_HEIGHT
    }, fullScreenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    }, fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.7,
        justifyContent: 'center',
        alignItems: 'center'
    }, text: {
        color: 'white',
        fontSize: 48,
    }
});
