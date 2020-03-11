const express = require('express')
const router = express.Router()

const Note = require('../models/note')
const withAuth = require('../middlewares/auth')

router.get('/', withAuth, async (req, res) => {
  try {
    let notes = await Note.find({ author: req.user._id })
    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: 'Error ao buscar a notas', message: error })
  }
})

router.get('/search', withAuth, async (req, res) => {
  const { query } = req.query

  try {
    let notes = await Note
      .find({ author: req.user._id })
      .find({ $text: { $search: query } })
    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: 'Error ao pesquisar notas', message: error })
  }
})

router.get('/:id', withAuth, async (req, res) => {
  const { id } = req.params

  try {
    let note = await Note.findById(id)
    if (isOwner(req.user, note))
      res.json(note)
    else
      res.status(403).json({ error: 'Permissão negada para acesso a nota.', message: {} })
  } catch (error) {
    res.status(500).json({ error: 'Error ao buscar a nota', message: error })
  }
})

router.post('/', withAuth, async (req, res) => {
  const { title, body } = req.body

  try {
    let note = new Note({ title, body, author: req.user._id })
    await note.save()
    res.json(note)
  } catch (error) {
    res.status(500).json({ error: 'Error ao criar uma nova nota', message: { error } })
  }
})

router.put('/:id', withAuth, async (req, res) => {
  const { title, body } = req.body
  const { id } = req.params

  try {
    let note = await Note.findById(id)
    if (isOwner(req.user, note)) {
      let note = await Note.findByIdAndUpdate(id,
        { $set: { title, body } },
        { upsert: true, 'new': true } /* return a nova nota */
      )
      res.json(note)
    }
    else
      res.status(403).json({ error: 'Permissão negada para atualizar a nota.', message: {} })
  } catch (error) {
    res.status(500).json({ error: 'Error ao atualizar a nota', message: { error } })
  }
})

router.delete('/:id', withAuth, async (req, res) => {
  const { id } = req.params
  try {
    let note = await Note.findById(id)
    if (isOwner(req.user, note)) {
      await note.delete()
      res.json({ message: 'Nota excluída com sucesso!' }).status(204)
    } else {
      res.status(403).json({ error: 'Permissão negada para excluir a nota.', message: {} })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error ao excluir a nota', message: { error } })
  }
})

const isOwner = (user, note) => {
  if (JSON.stringify(user._id) == JSON.stringify(note.author._id))
    return true
  else
    return false
}

module.exports = router