const express = require('express');
const { validate } = require('express-validation');
const authController = require('../../controllers/auth.controller');
const { register } = require('../../validations/auth.validation');

const router = express.Router();

/*
    ====================
    REGISTER a new user.
    ====================
    Receive parameters:

    {String{2-128}}     - name               - User's name.
    {String}            - email              - User's email.
    {String{8-40}}      - password           - User's password.

    Return parameters:
    {token}:
    {String}            - tokenType          - Access token's type.
    {String}            - accessToken        - Authorization token.
    {String}            - refreshToken       - Token to get a new accessToken after expiration time.
    {String}            - expiresIn          - Access Token's expiration time in milliseconds.
    {Date}              - timezone           - The server's Timezone.

    {UserModel}:
    {String}            - id                 - User's id.
    {String}            - name               - User's name.
    {String}            - email              - User's email.
    {String}            - role               - User's role.
    {Date}              - createdAt          - Timestamp.

    Expected respones:
    200/201 - Created -    - Success         - User was created successfully.
    400     - Bad Request  - ValidationError - Some parameters may contain invalid values.
*/
router.route('/register').post(validate(register), authController.register);

module.exports = router;