import { DEVELOPMENT, PRODUCTION } from './webpack.const';

export const chooseMode = mode => {
    if (mode === PRODUCTION) {
        console.warn(mode, PRODUCTION);
        console.warn('Current mode is production!');
        return true;
    } else if (mode === DEVELOPMENT) {
        console.warn('Current mode is development!');
        return false;
    } else {
        console.warn('Current mode is development!');
        return false;
    }
};