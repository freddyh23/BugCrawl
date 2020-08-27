import React from 'react';
import Matter from 'matter-js';
import Constants from "./Constants";
import common from "./Common";

const Physics = (entities, {touches, time, dispatch}) => {

    let engine = entities.physics.engine;
    let ladyBug = entities.box.body;

    //Move ants back to top of the screen after they disappear in the bottom
    if(entities["antBottom1"].body.position.y > Constants.MAX_HEIGHT) {
        let xPos = common.getXPos();
        entities["antBottom1"].score = false;
        for (let i = 1; i <= 4; i++) {

            Matter.Body.setPosition(entities[("antBottom" + i)].body, {x: xPos[i-1], y: 0});
            Matter.Body.setVelocity(entities[("antBottom" + i)].body, {x: 0, y: 0});

        }
    } else if(entities["antTop1"].body.position.y > Constants.MAX_HEIGHT) {
        let xPosTop = common.getXPos();
        entities["antTop1"].score = false;
        for (let i = 1; i <= 4; i++) {

            Matter.Body.setPosition(entities[("antTop" + i)].body, {x: xPosTop[i-1], y: 0});
            Matter.Body.setVelocity(entities[("antTop" + i)].body, {x: 0, y: 0});

        }
    }

    //Start to move the ants
    if(entities["antBottom1"].body.velocity.y === 0) {
        for (let i = 1; i <= 4; i++) {
            Matter.Body.setVelocity(entities[("antBottom" + i)].body, {x: 0, y: 5});
        }
    } else if(entities["antTop1"].body.velocity.y === 0) {
        for (let i = 1; i <= 4; i++) {
            Matter.Body.setVelocity(entities[("antTop" + i)].body, {x: 0, y: 5});
        }
    }

    //Allows the ladybug to move from left edge to right edge
    if(ladyBug.position.x <= 0 - (Constants.BUG_SIZE/2) && ladyBug.velocity.x < 0) {
        Matter.Body.setPosition(ladyBug, {x: Constants.MAX_WIDTH, y: ladyBug.position.y});
    } else if (ladyBug.position.x > Constants.MAX_WIDTH + (Constants.BUG_SIZE/2) && ladyBug.velocity.x > 0) {
        Matter.Body.setPosition(ladyBug, {x: 0, y: ladyBug.position.y});
    }

    //After the ants pass the ladybug, the score increases
    if(entities["antTop1"].body.position.y > ladyBug.position.y + Constants.BUG_SIZE && entities["antTop1"].score === false) {
        entities["antTop1"].score = true;
        dispatch({ type: 'scored'})
    } else if(entities["antBottom1"].body.position.y > ladyBug.position.y + + Constants.BUG_SIZE && entities["antBottom1"].score === false) {
        entities["antBottom1"].score = true;
        dispatch({ type: 'scored'})
    }

    //determines how the ladybug move. Move to the left if tapped on the left side of the app or move to the right if
    //tapped on the right side of the screen
    touches.filter(t => t.type === "press").forEach(t => {
        if (t.event.pageX < Constants.HALF_WIDTH) {
            Matter.Body.setVelocity(ladyBug, {x: -4, y: 0});
        } else {
            Matter.Body.setVelocity(ladyBug, {x: 4, y: 0});
        }
    });

    Matter.Engine.update(engine, time.delta);

    return entities
};

export default Physics;
