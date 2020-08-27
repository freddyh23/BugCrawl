import { Dimensions } from 'react-native';

export default Constants = {
    MAX_WIDTH: Dimensions.get("screen").width,
    MAX_HEIGHT: Dimensions.get("screen").height,
    DEFAULT_SIZE_ENEMIES:  Dimensions.get("screen").width/8,
    HALF_HEIGHT: Dimensions.get("screen").height/2,
    HALF_WIDTH: Dimensions.get("screen").width/2,
    BUG_SIZE:  Dimensions.get("screen").width/8,
    HIT_BOX_WIDTH:  Dimensions.get("screen").width/16,
    HIT_BOX_HEIGHT:  Dimensions.get("screen").width/10
};
