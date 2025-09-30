import moment from 'moment';



export const avatar = require('./images/avatar.jpeg');

export const header = require('./images/header.png');
export const demo_1 = require('./images/demo_image_1.png');
export const demo_2 = require('./images/demo_image_2.png');
export const demo_3 = require('./images/demo_image_3.png');

export const right_arrow = require('./images/right_arrow.png');
export const back_button = require('./images/arrow_left.png');




export const STATE_COLORS = {
    SWEEPING: '#754AE2',
    MOPPING: '#FFCC00',
    SCRUBBING: '#12B76A',
    OTHER: '#E6F0FF',
    IDLE: '#ADADAD',
    
  };

  export const STATE_TEXT_COLOR = {
    IDLE: '#111827',
    SWEEPING: '#5925DC',
    MOPPING: '#9C7C00',
    SCRUBBING: '#0B7041',
    OTHER: '#0065FF',
  };

 
  export const getStateColor = (state) => {
    return STATE_COLORS[state?.toUpperCase()] || STATE_COLORS.IDLE; 
  };

  export const getStateTextColor = (state) => {
    return STATE_TEXT_COLOR[state?.toUpperCase()] || STATE_TEXT_COLOR.IDLE; 
  };

  export const formatDuration = (duration) => {
    if (duration < 60) {
      return `${duration}s`;
    } else if (duration < 3600) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}m ${seconds}s`;
    } else {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  export const calculateEndTime = (startTime: string, durationInSeconds: number): string => {
    return moment
      .utc(startTime)
      .subtract(durationInSeconds, 'seconds') // subtract seconds instead of minutes
      .format('h:mm A');
  };