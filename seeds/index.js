const mongoose = require("mongoose");

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  // const c = new Campground({title: 'purple field'});
  for (let i = 0; i < 300; i++) {
    const random100 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const campground = new Campground({
      location: `${cities[random100].city}, ${cities[random100].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      author: '64c41d4f3ba43b0dbba6e7fb',
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt pellentesque eleifend. Curabitur quis velit lorem. Vivamus urna nulla, maximus eget sem vel, mattis semper nunc. Sed sodales elementum euismod. Aenean non nisi eu felis iaculis ullamcorper ac non orci. Aenean a lobortis erat, eget imperdiet elit. Nullam vel lectus vestibulum, aliquet nisl a, pellentesque diam. Ut a cursus libero, in maximus metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi in massa in massa scelerisque rhoncus.",
      price,
      geometry: {
        type: 'Point',
        coordinates: [cities[random100].longitude, cities[random100].latitude]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dyoip2vva/image/upload/v1690657128/YelpCamp/mh77cvu2ul6yfacyk5el.png',
          filename: 'YelpCamp/mh77cvu2ul6yfacyk5el',
        },
        {
          url: 'https://res.cloudinary.com/dyoip2vva/image/upload/v1690657128/YelpCamp/bay1aybdihz8j3ndk9bh.png',
          filename: 'YelpCamp/bay1aybdihz8j3ndk9bh',
        },
        {
          url: 'https://res.cloudinary.com/dyoip2vva/image/upload/v1690657129/YelpCamp/s8d3cjgxvn8wywoctuhg.png',
          filename: 'YelpCamp/s8d3cjgxvn8wywoctuhg'
        }
      ]
    });
    await campground.save();
  }
};

seedDb().then(() => {
  db.close();
});
