const Listing = require("../models/listing");
const maptiler = require("@maptiler/client");

const mapToken = process.env.MAP_TOKEN;
maptiler.config.apiKey = mapToken;

module.exports.index = async (req, res) => {
    const allListings =await Listing.find({});
    return res.render("listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req, res) => {
    return res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
     if(!listing) {
        req.flash("error", "Listing you requested for does not exits!");
        return res.redirect("/listings");
     }
     console.log(listing);
        return res.render("listings/show.ejs", { listing });
    }

    // module.exports.createListing = async (req, res, next) => {
    
    //     let url = req.file.path;
    //     let filename = req.file.filename;
    //     console.log(url, "..",filename);
        
    //     const newListing = new Listing(req.body.listing);
    //     newListing.owner = req.user._id; 
    //     newListing.image = {url, filename};
    //     await newListing.save();
    //     req.flash("success", "New Listing Created!");
    //     return res.redirect("/listings");
    //   };

       
       
    // module.exports.createListing = async (req, res) => {
    //   try {
    //     // 📍 Step 1: Geocoding (location → coordinates)
    //     const geoData = await maptiler.geocoding.forward(
    //       req.body.listing.location,
    //       { limit: 1 }
    //     );
    
    //     // 📌 Step 2: Terminal madhe coordinates print
    //     // console.log("Coordinates:", geoData.features[0].geometry.coordinates);
    //     console.log("Coordinates:", geoData.features[0].geometry.coordinates);
    
    //     // 📸 Step 3: Image handle
    //     let url = req.file.path;
    //     let filename = req.file.filename;
    
    //     // 🏠 Step 4: New listing create
    //     const newListing = new Listing(req.body.listing);
    //     newListing.owner = req.user._id;
    //     newListing.image = { url, filename };
    
    //     // 🌍 Step 5: Geometry save (IMPORTANT)
    //     newListing.geometry = {
    //       type: "Point",
    //       coordinates: geoData.features[0].geometry.coordinates,
    //     };
    
        // 💾 Step 6: Save
        // let saveListing = await newListing.save();
        // console.log(saveListing);
    
    //     req.flash("success", "New Listing Created!");
    //     return res.redirect("/listings");
    
    //   } catch (err) {
    //     console.log(err);
    //     req.flash("error", "Something went wrong!");
    //     return res.redirect("/listings/new");
    //   }
    // };
    module.exports.createListing = async (req, res, next) => {
      try {
        const geoData = await maptiler.geocoding.forward(
          req.body.listing.location,
          { limit: 1 }
        );
    
        let url = req.file.path;
        let filename = req.file.filename;
    
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
    
        newListing.geometry = {
          type: "Point",
          coordinates: geoData.features[0].geometry.coordinates,
        };
    
        await newListing.save();
    
        req.flash("success", "New Listing Created!");
        return res.redirect("/listings");
    
      } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings/new");
      }
    };
    
    
      module.exports.renderEditForm = async(req, res) => {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing) {
            req.flash("error", "Listing you requested for does not exits!")
            return res.redirect("/listings");
         }
          
         let originalImageUrl = listing.image.url;
         originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
          return res.render("listings/edit.ejs", { listing, originalImageUrl });
        
    };

    module.exports.updateListing = async (req, res) => {
        let { id } = req.params;
         let listing = await Listing.findByIdAndUpdate(id,  { ...req.body.listing});
        
         if (typeof req.file !== "undefined") {
          let url = req.file.path;
          let filename = req.file.filename;
          listing.image = { url, filename}
          await listing.save();
        }
        req.flash("success", "Listing Updated!");
        return res.redirect(`/listings/${id}`);
    };

    module.exports.destroyListing = async (req, res) =>{
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing Deleted!");
        return res.redirect("/listings");
    };
