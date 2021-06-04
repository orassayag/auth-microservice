const express = require('express');
const validate = require('express-validation');
const userController = require('../controllers/user.controller');
const { createUser } = require('../validations/user.validation');

const router = express.Router();

router
    .route('/')
    /*
        ==================
        CREATE a new user.
        ==================
        Receive parameters:

        {String}            - token    -  User's access token.
        {String}            - email    -  User's email.
        {String{8-40}}      - password -  User's password.
        {String{2-128}}     - name     -  User's name.
        {String=user,admin} - role     -  User's role.

        Return parameters:
        {UserModel}:
        {String}            - id        - User's id.
        {String}            - name      - User's name.
        {String}            - email     - User's email.
        {String}            - role      - User's role.
        {Date}              - createdAt - Timestamp.

        Expected respones:
        200/201 - Created -    - Success         - User was created successfully.
        400     - Bad Request  - ValidationError - Some parameters may contain invalid values.
        401     - Unauthorized - Unauthorized    - Only authenticated users can create the data.
        403     - Forbidden    - Forbidden       - Only admins can create the data.
    */
    // .post((), validate(createUser), userController.create);

module.exports = router;