const model = require('../../models/user')
const movieModel = require('../../models/movie')
// const ErrorResponse = require('../../utils/errorResponse')
// const asyncHandler = require('../../middleware/async');
require('dotenv').config()


const generateToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    
    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE *24*60*60*1000 ),
        httpOnly: true,
        signed: true 
    }
    res
    .status(200)
    .cookie('token', token, options)
    .json({
        success: true,
        token,
        data : user
    })
}

exports.createUser = async (req,res, next) => {
        try {
            const data = req.body 
            const user = await model.create(data);
            if(!user) return next('Error create new user', 400);

            res
                .status(200)
                .json({
                    success: true,
                    data: user
                })
        } catch (error) {
            next(error)
        }
}

exports.userRated = async (req, res, next) => {
    try {
        // console.log(req.body.params);
        const {movie_name, user_email, rating} = req.body.params;
        let movie = await movieModel.findOne({Name : movie_name});
        if(!movie) return next("movie tidak ditemukan");
        movie.ratingVal = rating;

        let user =  await model.findOne({email: user_email});
        if(!user) return next("user tidak ditemukan")

        const query = {
            _id : user._id,
        }

        let userVector = user.updateVector(movie.getGenre(), rating, next);
        const update = {
            userVector : userVector,
            $push : {
                movieRated : {
                    Genre : movie.Genre,
                    Name : movie.Name,
                    vector : movie.getGenre(),
                    ratingVal : rating
                }
            }
        }
        model.updateOne(query, update, (err,docs) => {
            if(err) next(err);
        })

        const movies = await movieModel.find({}).select({ Genre: 1, Name: 1, _id: 1 })
        if(!movies) return next("movie tidak ditemukan")

        res.send("Update sukses " + user_email)
    } catch (error) {
        next(error)
    } 
}


exports.userRecommendation = async (req,res,next) => {
    try {
        let size = req.query.size
        let _id = req.params._id
        const user = await model.findById({_id});
        if(!user) next("user tidak ditemukan");
        
        const movie = await movieModel.find({}).select({ Genre: 1, Name: 1, _id: 1 })
        if(!movie) return next("movie tidak ditemukan")

        let recommendation = await movie.map(item => {
            let tmp = {}
            tmp.id = item._id
            tmp.score = item.countScore(user.userVector, next)
            tmp.name = item.Name
            tmp.genre = item.Genre
            return tmp
        })
        recommendation.sort((a,b) => b.score - a.score); //sorting desc by score
        if (!size) return size = 10;
        res.send(recommendation.slice(0,size))

    } catch (error) {
        next(error)
    }
}

// exports.getAllUsers = asyncHandler( async (req,res, next) => {
//         const users = await model.find()
//         res
//             .status(200)
//             .json({
//                 success: true,
//                 count : users.length,
//                 data : users
//         })
// });

exports.getOneUser = async (req,res, next) => {
    try {
        let _id = req.params._id
        const user = await model.findById({_id})
        if(!user) return next(`User not found with id :${req.params._id}`, 404);
        res.status(200)
            .json({
                success: true,
                data: user
            })
    } catch (error) {
        next(error)   
    }
}


// exports.editUser = asyncHandler( async (req,res, next) => {
//         const id = req.params.id
//         var conditions = {
//             _id : id
//         }
//         var update = req.body
//         const updateUser = await model.findOneAndUpdate(conditions, update)
//         if(!updateUser) return next(new ErrorResponse(`Error update user not found with id :${req.params.id}`, 404))

//         res 
//             .status(200)
//             .json({
//                 success: true,
//                 data: updateUser
//             })
// })

// exports.deleteUser = asyncHandler( async (req,res,next) => {

//         var id = req.params.id
//         var conditions = {
//             _id : id
//         }
//         const user = await model.deleteOne(conditions)
//         if(user.deletedCount === 0) return next( new ErrorResponse(`Error delete user with id :${req.params.id}`, 404))

//         res
//             .status(200)
//             .json({
//                 success: true,
//                 data: user
//             })
// })

exports.signIn =  async (req,res, next) => {
        const {email, password} = req.body

        const user = await model.findOne({email});
        if (!user) return next(`User not found with email :${email}`, 404);

        const isMatch = await user.comparePassword(password, next);   
        if(!isMatch) return next('Error password', 401);

        generateToken(user, 200, res);
}

// exports.signout = asyncHandler( async (req,res, next) => { 
//         res.cookie('token', 'none', {
//             expires: new Date(Date.now() + 10 * 1000),
//             httpOnly: true
//         })
    
//         res 
//             .status(200)
//             .json({
//                 success: true,
//                 data: {}
//             })
     
// })


