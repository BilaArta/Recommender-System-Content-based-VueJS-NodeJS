const mongoose = require('mongoose');
const {Schema} = mongoose;
const paginate = require("mongoose-paginate-v2");

require('dotenv').config()

const movieSchema = new Schema({
    Genre : {
        type : [String],
        required : true
    },
    Overview : {
        type : String,
        required : true
    },
    Name : {
        type : String,
        required : true
    },
    'Release Date' : {
        type : String,
        required : true
    },
    vector : {
        type : [Number],
        default : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
}, {collection: 'Movies'})

movieSchema.methods.getGenre = function(cb){
    // console.log(this.Genre);
    if(this.genre == []) return cb('genre empty');
    return getVectorGenre(this.Genre);    
}

movieSchema.methods.countScore = function(vecUser, cb){
    if(!vecUser) return cb('user vector empty');
    var score = 0
    let movieVector = getVectorGenre(this.Genre);
    for (let index = 0; index < vecUser.length; index++) {
        score += (vecUser[index] * movieVector[index]);
    }
    return score;
}

function getVectorGenre(genre){
    var valVector = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (i = 0; i < genre.length; i++) {
        if (genre[i] == 'Comedy') {
            valVector[0] = 1
        } else if (genre[i] == 'Fantasy') {
            valVector[1] = 1
        } else if (genre[i] == 'Family') {
            valVector[2] = 1
        } else if (genre[i] == 'Romance') {
            valVector[3] = 1
        } else if (genre[i] == 'Thriller') {
            valVector[4] = 1
        } else if (genre[i] == 'Drama') {
            valVector[5] = 1
        } else if (genre[i] == 'Crime') {
            valVector[6] = 1
        } else if (genre[i] == 'Action') {
            valVector[7] = 1
        } else if (genre[i] == 'Horror') {
            valVector[8] = 1
        } else if (genre[i] == 'Adventure') {
            valVector[9] = 1
        } else if (genre[i] == 'History') {
            valVector[10] = 1
        } else if (genre[i] == 'Science Fiction') {
            valVector[11] = 1
        } else if (genre[i] == 'Mystery') {
            valVector[12] = 1
        } else if (genre[i] == 'Western') {
            valVector[13] = 1
        } else if (genre[i] == 'Animation') {
            valVector[14] = 1
        } else if (genre[i] == 'War') {
            valVector[15] = 1
        } else if (genre[i] == 'Foreign') {
            valVector[16] = 1
        } else if (genre[i] == 'Music') {
            valVector[17] = 1
        } else if (genre[i] == 'Documentary') {
            valVector[18] = 1
        }
    }
    return valVector;
}

movieSchema.plugin(paginate);
const modelMovie = mongoose.model('Movies', movieSchema)

module.exports = modelMovie;