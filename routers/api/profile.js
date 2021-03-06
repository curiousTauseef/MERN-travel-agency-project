const express = require("express");
const router = express.Router();
const auth  = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/Users');

// @route   GET api/profile/me
// @dosc    Get current users profile
// @access  private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate(
            'user',
            ['name', 'avatar']
        );

        if (!profile) {
            return res.status(400).json({msg: "There is no Profile for this user"})
        };

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/profile
// @dosc    current or update users profile
// @access  private
router.post('/', [auth, [
     check('status', 'Status is required').not().isEmpty(),
     check('skills', 'skills is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    };

    const {
        company, website, location, status, bio, skills, githubusername,
        youtube, facebook, twitter, instagram, linkedin
    } = req.body;

    // build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    // if (req.body.handle) profileFields.handle = req.body.handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // Skills - Spilt into array
    if (skills) {
      profileFields.skills = skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram =  instagram;

    try {
        let profile = await Profile.findOne({user: req.user.id});
        
        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );

            return res.json(profile);
        } else {
            // Create
            // Save Profile
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile)
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', auth, async (req, res) => {
    try {
        let profiles = await Profile.find().populate('user', ['name', 'avatar', '_id']);

        console.log(profiles);
        
        if (!profiles) {
           return res.status(404).json({ profile: 'There are no profiles' })
        }

        res.json(profiles);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "server error"});
    }
  });

  
// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', async (req, res) => {

    try {
        let profile = await Profile.findOne({user: req.params.user_id});

        if (!profile) {
            return res.status(404).json({ profile: 'Profile not find' })
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "server error"});
    }
});

module.exports = router;