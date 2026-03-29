# Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute to this project. Contributing doesn't just mean submitting pull requests—there are many different ways for you to get involved, including answering questions, reporting issues, improving documentation, or suggesting new features.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists in the [GitHub Issues](https://github.com/orassayag/auth-microservice/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Error messages or logs (if applicable)
   - Your environment details (OS, Node version, MongoDB version)

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the code style guidelines below
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### Code Style Guidelines

This project uses:
- **JavaScript (ES6+)** with Node.js
- **ESLint** with Airbnb style guide for code quality
- **Express.js** best practices

Before submitting:
```bash
# Install dependencies
npm install

# Start the server to ensure it runs
npm start

# Check for linting errors
npm run lint
```

### Coding Standards

1. **Security First**: Never hardcode secrets, always use environment variables
2. **Input Validation**: Use Joi validation schemas for all incoming requests
3. **Error Handling**: Use proper HTTP status codes and error messages
4. **Authentication**: JWT tokens with refresh token support
5. **Password Security**: Always use bcrypt for password hashing
6. **Clean Code**: Keep functions focused and modular
7. **Documentation**: Comment complex logic and API endpoints

### Adding New Features

When adding new features:
1. Create models in `src/api/models/`
2. Add controllers in `src/api/controllers/`
3. Define routes in `src/api/routes/files/`
4. Add validation schemas in `src/api/validations/`
5. Update middleware if needed in `src/api/middlewares/`
6. Document API endpoints in route files
7. Test thoroughly with MongoDB running

### Security Guidelines

This project follows OWASP security standards:
- Never expose sensitive data in error messages
- Always validate and sanitize user input
- Use parameterized queries with Mongoose
- Implement proper authentication and authorization
- Set secure HTTP headers using Helmet
- Enable CORS with proper configuration

### API Documentation Format

When adding new endpoints, follow this format:
```javascript
/*
    ====================
    ENDPOINT NAME
    ====================
    Receive parameters:
    {Type}              - fieldName          - Description.
    
    Return parameters:
    {Type}              - fieldName          - Description.
    
    Expected responses:
    200     - OK           - Success         - Description.
    400     - Bad Request  - ValidationError - Description.
    401     - Unauthorized - Unauthorized    - Description.
*/
```

## Questions or Need Help?

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag

Thank you for contributing! 🙏
