import debug from 'debug';
 
const BASE = process.env.REACT_APP_APP_NAME;
const COLOURS = {
  trace: process.env.REACT_APP_LOG_COLOURS_TRACE,
  info: process.env.REACT_APP_LOG_COLOURS_INFO,
  warn: process.env.REACT_APP_LOG_COLOURS_WARN,
  error: process.env.REACT_APP_LOG_COLOURS_ERROR
}; 

class Log {
  generateMessage(level, message, source) {

    // Set the prefix which will cause debug to enable the message
    const namespace = `${BASE}:${level}`;
    const createDebug = debug(namespace.toString());
    
    // Set the colour of the message based on the level
    createDebug.color = COLOURS[level];
    
    if(source) { createDebug(source, message); }
    else { createDebug(message); }
  }
  
  trace(message, source) {
    return this.generateMessage('trace', message, source);
  }
  
  info(message, source) {
    return this.generateMessage('info', message, source);
  }
  
  warn(message, source) {
    return this.generateMessage('warn', message, source);
  }
  
  error(message, source) {
    return this.generateMessage('error', message, source);
  }
}

export default new Log();