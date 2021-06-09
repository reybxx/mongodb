const express = require('express');
const router  = express.Router();
const app = express();
const Board = require('../models/Board');
const User = require('../models/User');
const mongoose = require('mongoose');

//add editor to board - works
router.put('/:boardId', async (req, res) => {
    try {
        const updatedEditor = await Board.updateOne(
            {_id: req.params.boardId},
            {$addToSet: {editors: req.body.editors}});
        await res.status(202).json(updatedEditor);
    } catch (err) {
        await res.status(500).json({message: err});
    }
});

//delete editor - works (with ID) {"editors": "60bcf3b3fa91c1c242966943"}
router.patch('/:boardId', async (req,res) => {
    try {
        const deletedEditor= await Board.updateOne(
        {_id: req.params.boardId},
        { $pull: {editors: req.body.editors } })
        await res.json(deletedEditor);
    } catch (err) {
        res.status(500).json({message: err});
    }
});

//submit a new Post- works
router.post('/:id', async (req,res) => {
    try {
        const Author=  await User.findById(req.body.author);
        var Text = req.body.text;
        var Position = req.body.position;
        var postedPost = {text: Text, author: Author, position: Position};
        var Id = req.params.id;

        await Board.findOne({_id: Id}).then(function(boards) {
            //modify and save the object received via callback
            boards.posts.push(postedPost);
            boards.save();
            res.status(202).json(postedPost);
        });
        } catch (err){
        res.status(500).json({message: err});
    }
})

//delete a Post- works
router.patch('/:boardId/:postId', async (req, res) => {
    try {
        const removedPost = await Board.updateOne(
            {_id: req.params.boardId},
            {$pull: {posts: {_id: req.params.postId}}}
        );
        await res.json({removedPost});
    } catch (err) {
        await res.json({message: err})
    }
});

/*router.delete('/:boardId/postId', async (req, res) => {
    try {
        const removedPost= await Board.posts.remove({_id: req.params.boardId.postId});
        res.json(removedPost);
    } catch (err) {
        res.json({message: err});
    }
});*/

//update a Post - works
router.put('/updated/:boardId/:postId', async (req, res) => {
    try {
        const updatedPost = await Board.findOneAndUpdate(
              {_id: req.params.boardId, "posts._id": req.params.postId},
            {$set: {"posts.$.text": req.body.text, "posts.$.position" : req.body.position}})
                    res.status(202).json(updatedPost);
    } catch (err){
        res.status(500).json({message: err});
    }
});
     /* try {
            var Text = req.body.text;
            var Position = req.body.position;

            const updatedPost = await Board.updateOne(
                { _id : req.params.boardId},
                { $set : {"posts.text": Text , "posts.position": Position}});
                res.json(updatedPost);
        }
        catch (err) {
            res.json({message: err});
        }; */


/*
//submit a new User- works
router.post('/', async (req,res) => {
    const user = await new User({
        name: req.body.name,
    });
    try {
        const savedUser= await user.save();
        res.status(202).json(savedUser);
    } catch (e) {
        res.status(500).json({message: err});
    }
});
*/

//show all Users -works
router.get('/Users', async (req, res) =>{
    try{
        const allUsers = await User.find();
        res.json(allUsers);
    }
    catch(err){
        res.json({message:err});
    }
});

//show specific User -works
router.get('/Users/:userId', async (req,res) => {
    try {
        const board = await User.findById(req.params.userId);
        res.json(board);
    } catch (err) {
        res.json({message: err});
    }
});

//delete User
router.delete('/Users/:userId', async (req, res) => {
    try {
        const removedUser = await User.remove({_id: req.params.userId});
        res.json(removedUser);
    } catch (err) {
        res.json({message: err});
    }
});

//submit a new Board - works
router.post('/', async (req,res) => {
   const userowner=  await User.findById(req.body.owner);
   const usereditor=  await User.findById(req.body.editors);
    const board = await new Board({
        owner: userowner,
        editors: [usereditor]
    });
    try {
        const savedBoard= await board.save();
        res.status(202).json(savedBoard);
    } catch (e) {
        res.status(500).json({message: err});
    }
});

//show all Boards -works
router.get('/', async (req, res) =>{
    try{
        const allBoards = await Board.find();
        res.json(allBoards);
    }
    catch(err){
        res.json({message:err});
    }
});

//show specific Board -works
router.get('/:boardId', async (req,res) => {
    try {
        const board = await Board.findById(req.params.boardId);
        res.json(board);
    } catch (err) {
        res.json({message: err});
    }
});

//delete Board- works
router.delete('/:boardId', async (req, res) => {
    try {
        const removedBoard = await Board.remove({_id: req.params.boardId});
        res.json(removedBoard);
    } catch (err) {
        res.json({message: err});
    }
});


module.exports = router;
