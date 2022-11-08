const { Thought, User } = require('../models');

const thoughtController = {
    
    // GET ALL THOUGHTS
    getAllThoughts(req, res){
        Thought.find({})
            .then(dbThoughtsData => res.json(dbThoughtsData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    // GET THOUGHT BY ID
    getThoughtById({params}, res) {
        Thought.findOne({_id: params.id})
            .then(dbThoughtsData => {
                if(!dbThoughtsData){
                    res.status(404).json({message: 'No thought found with this ID'});
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    // ADD THOUGHT
    createThought({body}, res){
        Thought.create(body)
            .then(dbThoughtsData => {
                return User.findOneAndUpdate(
                    {_id: body.userId},
                    {$push: {thoughts: dbThoughtsData._id}},
                    {new: true}

                )
            })
            .then(dbThoughtsData => {

                res.json(dbThoughtsData)})
            .catch(err => res.status(400).json(err))
    },

    // DELETE THOUGHT
    deleteThought({params}, res){
        Thought.findOneAndDelete({_id: params.id})
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({message: ' Cannon find thought with that ID'});
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    },

    // UPDATE THOUGHT
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.id}, body, {new: true})
            .then(dbThoughtsData => {
                if (!dbThoughtsData){
                    res.status(404).json({message: 'Cannot find thought with that ID'});
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
   },
   
   // CREATE REACTION
   addReaction({params, body}, res){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {reactions: body}}, 
            {new: true}
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No user with that ID'});
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => res.json(err));
   },

   // DELETE REACTION
   removeReaction({params, body}, res) {
       Thought.findOneAndUpdate(
           {_id: params.thoughtId}, 
           {$pull: {reactions: {reactionId: params.reactionId}}},
           {new: true}
       )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
   }

}



module.exports = thoughtController;