const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');

router.get('/', async (req, res) => {
    try {
        const populatedListings = await Listing.find().populate('owner');
        res.render('../views/listings/index.ejs', {
            listings: populatedListings,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.get('/new', (req, res) => {
    res.render('../views/listings/new.ejs');
});

router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id;
        const listing = await Listing.create(req.body);
        res.redirect('/listings');
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.get('/:listingId', async (req, res) => {
    try {
        const populatedListing = await Listing.findById(req.params.listingId).populate('owner');
        const userHasFavorited = populatedListing.favoritedByUsers.some(user => user.equals(req.session.user._id));
        res.render('../views/listings/show.ejs', {
            listing: populatedListing,
            userHasFavorited: userHasFavorited,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.delete('/:listingId', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);
        if (listing.owner.equals(req.session.user._id)) {
            await listing.deleteOne();
            res.redirect('/listings');
        } else {
            console.log('You don\'t have permission to do that.');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.get('/:listingId/edit', async (req, res) => {
    try {
        const currentListing = await Listing.findById(req.params.listingId);
        if (currentListing.owner.equals(req.session.user._id)) {
            res.render('../views/listings/edit.ejs', {
                listing: currentListing,
            });
        } else {
            console.log('You don\'t have permission to do that.');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.put('/:listingId', async (req, res) => {
    try {
        const currentListing = await Listing.findById(req.params.listingId);
        if (currentListing.owner.equals(req.session.user._id)) {
            await currentListing.updateOne(req.body);
            res.redirect('/listings');

        } else {
            console.log('You don\'t have permission to do that.');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.post('/:listingId/favorited-by/:userId', async (req, res) => {
    try {
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $push: { favoritedByUsers: req.params.userId }
        });
        res.redirect(`/listings/${req.params.listingId}`)
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
    console.log('Listing Id:', req.params.listingId, 'User Id:', req.params.userId);
});

router.delete('/:listingId/favorited-by/:userId', async (req, res) => {
    try {
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: {favoritedByUsers: req.params.userId},
        });
        res.redirect(`/listings/${req.params.listingId}`);
    } catch (error) {
        
    }
})

module.exports = router;