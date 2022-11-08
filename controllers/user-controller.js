const { User } = require('../models');

const userController = {

    // ALL USERS
    getAllUsers(req, res){
        User.find({})
            .populate({path:'friends', select:'-__v'})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    // USERS BY ID
    getUserById({params}, res) {
        User.findOne({_id: params.id})
            .then(dbUserData => {
                if(!dbUserData){
                    res.status(404).json({message: " No user found with this ID..."});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    // ADD USER
    createUser({body}, res){
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err)) 
    },

    // UPDATE USER
    updateUser({params, body}, res){
        User.findOneAndUpdate({_id: params.id}, body, {new: true})
            .then(dbUserData => {
                if(!dbUserData){
                    res.status(404).json({message: 'No user can be updated because ID not found'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err))
    },

    // delete a user
    deleteUser({params}, res){
        User.findOneAndDelete({_id: params.id})
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message: "No user can be deleted becasue cannot find id"});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },


    // ADD FRIENDS
    addFriend({params, body}, res){
        User.findByIdAndUpdate(
            {_id: params.userId},
            {$addToSet: {friends: {_id: params.friendId}}},
            {new: true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'Cannot add friend to user because we cannot find the user ID' });
                return;
            }
            res.json(dbUserData);          
        })
        .catch(err => res.json(err));
    },

    removeFriend (req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {new: true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'Cannot remove friend to user because we cannot find the user ID' });
                return;
            }
            console.log('made it this far')
            console.log(dbUserData)

            res.json(dbUserData);          
        })
        .catch(err => res.json(err));
    }

}

module.exports = userController;