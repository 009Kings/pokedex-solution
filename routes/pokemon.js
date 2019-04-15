var express = require('express');
var router = express.Router();
var db = require('../models')
var request = require('request')

// GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
  db.pokemon.findAll()
  .then(pokes=>{
    res.render('faves/index', { pokes })
  })
});

router.get('/:name', (req, res)=>{
  var pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/'
  request(pokemonUrl + req.params.name, (error, response, body)=>{
    var pokemon = JSON.parse(body)
    res.render('show', { pokemon })
  })
})

router.get('/fave/:id', (req, res)=>{
  db.pokemon.findByPk(req.params.id)
  .then(foundPoke=>{
    res.render('faves/show', { favePoke: foundPoke })
  })
  .catch(err=>{
    console.log("Yikes you're bad at stuff", err)
    res.send("Not good at things, eh?")
  })
})

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', function(req, res) {
  db.pokemon.findOrCreate({
    where: { name: req.body.name },
    defaults: req.body
  })
  .then(createdPoke=>{
    console.log("created", createdPoke.name)
    res.redirect('/pokemon')
  })
  .catch(err=>{
    console.log(err)
    res.send("You suck")
  })
});

router.put('/fave', (req, res)=>{
  // An example
  var newData = {
    name: req.body.name,
    nickname: req.body.nickname,
    level: req.body.level
  }
  db.pokemon.update(newData, { where: { id: req.body.id }})
  .then(updatedFave=>{
    console.log("updated", updatedFave.nickname)
    res.redirect('/pokemon/fave/'+req.body.id)
  })
})

router.delete('/', (req, res)=>{
  db.pokemon.destroy({
    // where: { name: req.body.name }
    where: req.body
  })
  .then(deletedPokemon=>{
    console.log(deletedPokemon.name, "has been released")
    res.redirect('/pokemon')
  })
  .catch(err=>{
    console.log(err)
    res.send("Can't even release a pokemon correctly")
  })
})

module.exports = router;
