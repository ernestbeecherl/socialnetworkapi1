const { User, Thought } =  require ('../models');

module.exports = {

//get all thoughts
    async getAllThoughts(req, res){
      try{
        const thoughts = await Thought.find();
        res.json(thoughts)
      }catch (err) {
        res.status(500).json(err);
      }
    },
//get single thoughts
    async getSingleThought(req, res){
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
      
            if (!thought) {
              return res.status(404).json({ message: 'No thought with that ID' });
            }
      
            res.json(thought);
          } catch (err) {
            res.status(500).json(err);
          } 
    },
//create a thought
    async createThought(req, res){
        try{
            const thought = await Thought.create(req.body);
            const user = await User.findByIdAndUpdate(
                {_id: req.body.userId},
                { $push: { thoughts: thought._id } },
                { runValidators: true, new: true }
            );
      
            if (!user) {
              return res.status(404).json({
                message: 'Thought created, but found no user with that ID',
              }
              );
            }
            res.json(user)
            // res.json(thought, ' created a thougth 🎉');
          } catch (err) {
            res.status(500).json(err); 
        }
    },

//update a thought
async updateThought(req, res){ 
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId,
          { $set: req.body },
          { runValidators: true, new: true }
        );
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
  
        res.status(200).json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
},

//delete a thought
async deleteThought(req, res) {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId })

    if (!thought) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }

    // remove thought id from user's `thoughts` field
    const user = await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Thought deleted but no user with this id!' });
    }

    res.json({ message: 'Thought successfully deleted!' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
},

//add reaction
    async addReaction(req, res) {
        try{
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
              );
        
              if (!thought) {
                return res.status(404).json({ message: 'Sorry, no thought found' });
              }
        
              res.json(thought);
            } catch (err) {
              res.status(500).json(err); 
        }
    },

//remove reaction
    async removeReaction(req, res){
      // console.log(req.params.reactionId)
        try{
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'Sorry this thought does not exist' });
              }
              // console.log(thought)
              res.json({message: "success"});
            } catch (err) {
              res.status(500).json(err);
        }
    }
}