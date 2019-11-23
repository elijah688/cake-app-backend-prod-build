let io;

module.exports = {
    init: (server) =>{
      io = require('socket.io')(server);
      return io;
    },
    getIO: () =>{
        if(io) {
            return io;            
        }
        else {
            const error = new Error('Socket io. not initialized');
            throw error;
        }
    }
}