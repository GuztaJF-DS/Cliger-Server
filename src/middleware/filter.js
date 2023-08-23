const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        const result = await User.findOne({
            where: {
                Email: req.body.Email,
            },
        });
        if (result != null) {
            res.json({ Error: 'Este Email já foi cadastrado' });
        } else {
            return next();
        }
    } catch (err) {
        // console.error(err)
        res.json({ Error: 'Um Error ocorreu na verificação do Email' });
    }
};
