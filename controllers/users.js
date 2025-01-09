const express = require('express');
const router = express.Router();;
const Listing = require('../models/listing.js');
const User = require('../models/user.js');

router.get('/profile', async (req, res) => {
    try {
        const myListings = await Listing
            .find({ owner: req.session.user._id })
            .populate('owner');

        const myFavoriteListings = await Listing
            .find({ favoritedByUsers: req.session.user._id })
            .populate('owner');

        res.render('../views/users/show.ejs', {
            myListings,
            myFavoriteListings
        });

    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
})

module.exports = router;