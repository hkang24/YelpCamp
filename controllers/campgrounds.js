const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const mapBoxToken = process.env.MAPBOX_TOKEN;

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    console.log(req.isAuthenticated());
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
  }

module.exports.new = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  }

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await (
      await Campground.findById(id).populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
    ).populate("author");
    console.log(campground);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/show", { campground });
    }
  }

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  }

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  }

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
      req.flash("error", "you do not have permission to do that!");
      res.redirect(`/campgrounds/${id}`);
    }

    const { title, location } = req.body.campground;
    Campground.findByIdAndUpdate(id, { title: title, location: location });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
  }
  console.log(campground.images);
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);
  }