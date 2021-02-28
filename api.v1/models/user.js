const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const JWT = require('jsonwebtoken')
require('dotenv').config()

const movieSchema = new Schema({
    Genre : {
        type : [String],
        required : true
    },
    Name : {
        type : String,
        required : true
    },
    vector : {
        type : [Number],
        default : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    ratingVal : {
        type: Number,
        default : 0
    }
}, {collection: 'Movies'})

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type: String,
        required: true
    },
    userVector : {
        type : [Number],
        default : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    token : String,
    movieRated : {
        type : [movieSchema],
        default: {}
    },
}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})

userSchema.pre('save', function(next) {
    var user = this
    // console.log(this);
    if(!user.isModified('password')) return next();
    
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if(err) return next(err);
        
        // console.log(user);
         bcrypt.hash(user.password, salt, (err, hash) => {
             if(err) return next(err);
             // Override user password with hased password 
             user.password = hash;
             next();
         })
    })
})

const transformVector = {
    0 : 'Comedy',
    1 : 'Fantasy',
    2 : 'Family',
    3 : 'Romance',
    4 : 'Thriller',
    5 : 'Drama',
    6 : 'Crime',
    7 : 'Action',
    8 : 'Horror',
    9 : 'Adventure',
    10 : 'History',
    11 : 'Science Fiction',
    12 : 'Mystery',
    13 : 'Western',
    14 : 'Animation',
    15 : 'War',
    16 : 'Foreign',
    17 : 'Music',
    18 : 'Documentary'
}

userSchema.methods.comparePassword =  function(candidatePassword, cb) {
    const isMatch = bcrypt.compare(candidatePassword, this.password)
    if(!isMatch) return cb('password dosen`t match');
    
    return isMatch
}

userSchema.methods.getSignedToken =  function(){
    return JWT.sign({id: this._id, name: this.name}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

userSchema.methods.updateVector = function(vecMovie, val, cb){
    if(!vecMovie) return cb('error rating');
    for (i = 0; i < this.userVector.length; i++) {
        this.userVector[i] += (vecMovie[i] * val)
    }
    return this.userVector
}

userSchema.methods.vectorToGenre = function(){
    const genre = []
    for (i = 0; i < this.userVector.length; i++) {
        if (this.userVector[i] != 0){
            genre.push(transformVector[i])
        }
    }
    return genre
}

function getVectorRecommendation(genre){
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
    return valVector
}

const modelUser = mongoose.model('Users', userSchema)

module.exports = modelUser;