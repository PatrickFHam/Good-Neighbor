const router = require('express').Router();
// const res = require('express/lib/response');
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req,res) => {
  try {
    const allUsers = await User.findAll(req.body)
    res.status(200).json(allUsers);
  } catch (err) {
  res.status(500).json(err);
  }
})

router.get('/profile', withAuth, (req, res) => {
    // Find the logged in user based on the session username
    const userData = req.session.username
    res.json(userData);
});

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.name;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log(userData)
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.name;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
