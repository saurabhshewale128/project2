// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema ( {
//     title: {
//         type: String,
//         required: true,
//     },
//     description: String,
//     image: {
//         type: String,
//         default:
//             "https://img.freepik.com/free-vector/tropical-landscape-background-zoom_52683-42068.jpg",
//         set: (v) =>
//         v === ""
//          ? "https://img.freepik.com/free-vector/tropical-landscape-background-zoom_52683-42068.jpg"
//           : v,
//     },
//     price: Number,
//     location: String,
//     country: String,
//     });

//     const Listing = mongoose.model("Listing", listingSchema);
//     module.exports = Listing;


const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");
const { coordinates } = require("@maptiler/client");
const createApplication = require("express/lib/express.js");
const { type } = require("express/lib/response.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
        filename: String,
        url: String,
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
            type: String,
            enum:['Point'],
            required:true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({reviews : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;