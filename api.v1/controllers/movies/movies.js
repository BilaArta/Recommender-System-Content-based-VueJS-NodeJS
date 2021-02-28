const model = require('../../models/movie')
const mongoosePaginate = require('mongoose-paginate-v2');


const getPagination = (page, size) => {
    const limit = size;
    const pages = page;

    return { limit, pages };
};

const getVectorMovie = async () =>{
    await model.paginate({}, {offset, limit}).then( //should be using model.find() to check all data
        async item => {
            const data = await item.docs.map(item => {
                let tmp = {};
                tmp = item;
                tmp.vector = item.getGenre(next)
                return tmp;
            })
            return data
        }
    )
} 

module.exports = {
    getAllMovie : async(req,res,next) => {
        // console.log(req.query.page);
        const { page, size } = req.query;
        const {limit, pages} = getPagination(page, size);
        try {
            const data = await model.paginate({}, {page, limit});
            if(!data) return next("Movie data not found");
            res.send(data);
        } catch (error) {
            next(error)
        }
    },

}