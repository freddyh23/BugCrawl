import React, { Component } from 'react'
import Constants from "./Constants";

class Common extends Component {
    random = () => {
        return Math.floor(Math.random() * Constants.MAX_WIDTH);
    };

    getXPos = () => {

        let xPos = this.random();
        let xPos2 = this.random();
        let diff = Constants.DEFAULT_SIZE_ENEMIES + 1
        while (xPos2 > xPos - diff && xPos2 < xPos + diff) {
            xPos2 = this.random();
        }

        let xPos3 = this.random();
        while ((xPos3 > xPos - diff && xPos3 < xPos + diff) || (xPos3 > xPos2 - diff && xPos3 < xPos2 + diff)) {
            xPos3 = this.random();
        }

        let xPos4 = this.random();
        while ((xPos4 > xPos - diff && xPos4 < xPos + diff) ||
        (xPos4 > xPos2 - diff && xPos4 < xPos2 + diff) ||
        (xPos4 > xPos3 - diff && xPos4 < xPos3 + diff)) {
            xPos4 = this.random();
        }
        return [xPos, xPos2, xPos3, xPos4];
    };
}

const common = new Common();
export default common;
