const Car = require('./model/car');

const publishControl = {
    setSpeed: async(car,speed)=>{
        try {
            var map = JSON.parse(speed);
            const value = map.speed;
            await Car.updateOne({code:car},{currentSpeed:value});
            console.log(`speed updated to ${value}`);
        } catch (error) {
            console.error(error.msg);
        }
        
    },
    setLocation: async(car,location)=>{
        try {
            console.log(location);
            var value = JSON.parse(location);
            console.log(value);
            await Car.updateOne({code:car},{carLocation:value});
            console.log(`location updated to latitude: ${value['lat']} longitude: ${value['lng']}`);
        } catch (error) {
            console.error(error.msg);
        }
        
    },
}

module.exports = publishControl;