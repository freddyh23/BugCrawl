import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StatusBar, StyleSheet, Image, AsyncStorage} from 'react-native';
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import LadyBug from "./LadyBug";
import Physics from "./Physics";
import Constants from "./Constants";
import Images from "../assets/Images/Images";
import SoundEffects from "../assets/Sounds/SoundEffects";
import common from "./Common";
import {AdMobBanner} from "expo-ads-admob";
import { Audio } from 'expo-av';


export default class GameLoop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRunning: false,
            highScore: 0,
            score: 0
        };

        this.loadScore();
        this.gameEngine = null;
        this.entities = null;
        // this.scoring = null;
    }

    componentDidMount = async () => {
        Audio.setAudioModeAsync({
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
            playsInSilentModeIOS: true,
        });

        this.scoring = new Audio.Sound();
        this.crashing = new Audio.Sound();

        const ScoringStatus = {
            shouldPlay: false
        };
        const ScoringStatus1 = {
            shouldPlay: false
        };

        this.scoring.loadAsync(SoundEffects.scoring, ScoringStatus, false);
        this.crashing.loadAsync(SoundEffects.crash, ScoringStatus1, false);
    };

    saveScore = async () => {
        try {
            await AsyncStorage.setItem("highScore", this.state.score.toString());
        } catch (err) {
            console.log(err)
        }
    };

    loadScore = async () => {
      try {
          let highScore = await AsyncStorage.getItem("highScore");

          if(highScore !== null) {
              this.setState({
                  highScore: parseInt(highScore)
              });
          } else  {
              this.setState({
                  highScore: 0
              });
          }
      } catch(e) {
          console.log(e)
      }
    };

    setupWorld = () => {
        let engine = Matter.Engine.create({ enableSleep: false });
        let world = engine.world;
        world.gravity.y = 0;

        let box = Matter.Bodies.rectangle(Constants.MAX_WIDTH/2, Constants.MAX_HEIGHT/1.5, Constants.HIT_BOX_WIDTH,
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
            if(this.state.score > this.state.highScore) {
                this.saveScore();
                this.setState({
                    highScore: this.state.score
                });

            }
            this.setState({
                isRunning: false
            })
            this.crashing.setPositionAsync(0);
            this.crashing.playAsync();

        } else if(e.type === 'scored') {
            this.setState({
                score: this.state.score + 1
            })
            this.scoring.setPositionAsync(0);
            this.scoring.playAsync();
            // this.scoring.setPositionAsync(0);
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

                    <StatusBar hidden={true}/>
                {!this.state.isRunning && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
                    <Image source={Images.treeBackGround} style={{height: Constants.MAX_HEIGHT, width: Constants.MAX_WIDTH}}/>
                    <View style={styles.fullScreen}>
                        <Text style={styles.text}>Play</Text>
                        <Text style={styles.text}>High Score: {this.state.highScore}</Text>
                    </View>
                </TouchableOpacity>}
                <View style={{position: 'absolute', top: 50, left: 0, height: 100, alignItems:'center', flex: 1,  width: Constants.MAX_WIDTH}} >
                    <Text style={styles.scoreText}> {this.state.score} </Text>
                </View>

                <View style={{position: 'absolute', top: Constants.MAX_HEIGHT - 50, left: 0, right: 0,
                    bottom: 0, alignItems:'center', flex: 1,  width: Constants.MAX_WIDTH}}>
                    <AdMobBanner
                        bannerSize="fullBanner"
                        adUnitID="ca-app-pub-3078836171735632/1720567829"
                        servePersonalizedAds
                        onDidFailToReceiveAdWithError={(e) => {
                            console.log(e);
                        }}
                    />
                </View>
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
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_HEIGHT,
        backgroundColor: 'black',
        opacity: 0.7,
        justifyContent: 'center',
        alignItems: 'center'
    }, text: {
        color: 'white',
        fontSize: 48,
    }, scoreText: {
        // position: 'absolute',
        // top: Constants.MAX_HEIGHT - 120,
        color: 'white',
        fontSize: 50,
    }
});
