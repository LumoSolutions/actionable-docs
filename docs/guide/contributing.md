# Contributing to Actionable

Thank you for considering contributing to Actionable! We welcome contributions from the community and appreciate your help in making this package better.

## Getting Started

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/actionable.git
   cd actionable
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/LumoSolutions/actionable.git
   ```

### Development Setup

1. **Install dependencies**:
   ```bash
   composer install
   ```

2. **Verify your setup** by running the test suite:
   ```bash
   composer run test
   ```

## Development Workflow

### Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

### Make Your Changes

1. **Write your code** following our coding standards
2. **Add tests** for any new functionality
3. **Update documentation** as needed
4. **Ensure your code is properly formatted** and analyzed

### Quality Assurance

Before submitting your changes, ensure they meet our quality standards:

#### Code Formatting

Run Laravel Pint to format your code:

```bash
composer run format
```

This will automatically format your code according to our style guidelines.

#### Static Analysis

Run Larastan (PHPStan for Laravel) to check for potential issues:

```bash
composer run analyse
```

Fix any issues reported by the static analyzer.

#### Testing

Run the full test suite to ensure nothing is broken:

```bash
composer run test
```

All tests must pass before submitting your PR.

#### Code Coverage

Ensure your changes maintain or improve code coverage:

```bash
composer run test-coverage
```

Code coverage must be **80% or higher** as specified in our CI pipeline.

### Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "Add feature: description of what you added"
```

Follow conventional commit format when possible:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Submitting a Pull Request

### Push Your Branch

```bash
git push origin feature/your-feature-name
```

### Create the Pull Request

1. Go to the [Actionable repository](https://github.com/LumoSolutions/actionable) on GitHub
2. Click "New pull request"
3. Select your branch as the source and `main` as the target
4. Fill out the pull request template with:
    - **Description** of what your PR does
    - **Testing** information
    - **Breaking changes** (if any)
    - **Related issues** (if applicable)

### Pull Request Guidelines

- **Target the `main` branch** for all pull requests
- **Include tests** for new functionality
- **Update documentation** if needed
- **Keep PRs focused** - one feature or fix per PR
- **Write clear descriptions** explaining what and why

## CI/CD Pipeline

Your pull request will automatically run through our CI pipeline:

### Automated Checks

1. **Code Formatting** - Laravel Pint check
2. **Static Analysis** - PHPStan/Larastan analysis
3. **Unit Tests** - Full test suite
4. **Test Coverage** - Minimum 80% coverage required

### Pipeline Requirements

All checks must pass before your PR can be merged:

- ✅ Code must be properly formatted with Pint
- ✅ Static analysis must pass without errors
- ✅ All tests must pass
- ✅ Code coverage must be ≥80%

You can run these checks locally to ensure they'll pass in CI:

```bash
# Format code
composer run format

# Run static analysis
composer run analyse

# Run tests with coverage
composer run test-coverage
```

## Contribution Guidelines

### Code Style

- Follow **PSR-12** coding standards
- Use **type hints** wherever possible
- Write **clear, descriptive variable and method names**
- Add **PHPDoc blocks** for public methods
- Keep **methods focused** and **classes cohesive**

### Testing

- **Write tests** for all new functionality
- **Use descriptive test names** that explain what's being tested
- **Follow AAA pattern**: Arrange, Act, Assert
- **Test edge cases** and error conditions
- **Mock external dependencies** appropriately

### Documentation

- **Update relevant documentation** for new features
- **Include code examples** where helpful
- **Keep documentation clear** and **beginner-friendly**
- **Update the changelog** for significant changes

## Types of Contributions

We welcome various types of contributions:

### Bug Fixes

- **Report bugs** with detailed reproduction steps
- **Fix reported bugs** with appropriate tests
- **Improve error handling** and edge cases

### New Features

- **Discuss large features** in an issue first
- **Add comprehensive tests** for new functionality
- **Update documentation** and examples
- **Consider backwards compatibility**

### Documentation

- **Improve existing documentation**
- **Add missing examples**
- **Fix typos and grammar**
- **Translate documentation** (if applicable)

### Testing

- **Add missing tests** for existing functionality
- **Improve test coverage**
- **Add integration tests**
- **Performance testing**

## Getting Help

If you need help with your contribution:

- **Open an issue** for discussion
- **Join our discussions** on GitHub
- **Ask questions** in your pull request
- **Review existing code** for patterns and examples

## Code of Conduct

Please note that this project follows a code of conduct. By participating, you agree to:

- **Be respectful** and inclusive
- **Provide constructive feedback**
- **Focus on what's best** for the community
- **Show empathy** towards other contributors

## Recognition

Contributors will be recognized in:

- **GitHub contributors list**
- **Changelog entries** for significant contributions
- **Documentation credits** where appropriate

## Questions?

If you have questions about contributing:

- **Check existing issues** and discussions
- **Open a new issue** for clarification
- **Review this guide** thoroughly
- **Look at recent pull requests** for examples

Thank you for contributing to Actionable! Your efforts help make this package better for everyone in the Laravel community.

---

**Happy coding!** 🚀