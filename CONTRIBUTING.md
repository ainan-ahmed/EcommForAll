# Contribution Guidelines for EcommForAll
Thank you for considering contributing to EcommForAll! I welcome contributions from everyone. Here are some guidelines to help you get started.

## Code of Conduct
Please read and adhere to the [Code of Conduct](CODE_OF_CONDUCT.md)(not added yet) to ensure a welcoming and respectful environment for all contributors.

## How to Contribute
1. **Fork the Repository**: Click the "Fork" button at the top of this repository to create your own copy.

2. **Clone the Repository**: Clone your forked repository to your local machine.
    ```shell
    git clone https://github.com/your-username/EcommForAll.git
    ```
3. Create a Branch: Create a new branch for your feature or bug fix.
    ```shell
    git checkout -b feature/your-feature-name
    ```
4. **Make Changes**: Make your changes in the new branch.

5. **Commit Changes**: Commit your changes with a clear and descriptive commit message following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
    ```shell
    git commit -m "feat: description of your feature"
    ```
6. **Push Changes**: Push your changes to your forked repository.
    ```shell
    git push origin feature/your-feature-name
    ```
7. **Create a Pull Request**: Open a pull request from your forked repository to the dev branch of the main repository. Include a detailed description of your changes.

## Development Branch
All development is done in the ```dev``` branch. Please make sure to open your pull requests against the ```dev``` branch instead of the ```main``` branch. This helps in maintaining a stable ```main``` branch while allowing continuous development and testing in the dev branch.

## Code Style
To maintain a consistent codebase, please adhere to the following coding styles:

#### Java
- Follow the [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html).
- Use 4 spaces for indentation.
- No automated formatter configured; match the style of surrounding code.

#### TypeScript and JavaScript
- **Prettier** is configured for automatic code formatting
- Use 4 spaces for indentation (configured in `.prettierrc`)
- Use double quotes for strings
- Prefer `const` and `let` over `var`
- Run `npm run format` before committing to auto-fix formatting
- Run `npm run format:check` to verify formatting without changes

#### React
- Follow the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).
- Use functional components and React hooks.
- Follow the existing project file structure for organizing components.

#### CSS
- Follow the [CSS Guidelines](https://cssguidelin.es/).
- Use 4 spaces for indentation (matching TypeScript/React).
- Prettier handles CSS formatting automatically.

#### HTML
- Follow the [W3C HTML Guidelines](https://www.w3.org/Style/).
- Use 4 spaces for indentation.

#### Dockerfile
- Follow the [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).
- Use multi-stage builds where applicable.

## Automated Code Checks

The project uses automated workflows to maintain code quality:

### Before Committing

Run these commands locally to catch issues early:

```bash
# Frontend - check formatting and linting
cd frontend
npm run format:check  # Check if code is formatted correctly
npm run format        # Auto-fix formatting issues
npm run lint          # Check for linting errors

# Backend - verify build
./backend/mvnw -B package -DskipTests --file backend/pom.xml
```

### Pull Request Workflows

When you open a PR, automated workflows will:

1. **Frontend Format & Lint Check:**
   - Validates Prettier formatting
   - Runs ESLint for code quality
   - Posts inline comments on formatting/linting issues
   - ⚠️ Shows warnings but doesn't block merging

2. **Backend Build Check:**
   - Builds the Java backend with Maven
   - Posts inline comments on compilation errors
   - ❌ Fails if build errors are detected

See [CI/CD Documentation](docs/CI-CD.md) for detailed workflow information.

## Pull Request Guidelines
- Ensure your code passes formatting checks: `npm run format:check` (frontend) and build succeeds (backend)
- Automated workflows will check formatting and post inline comments on issues
- Provide a clear description of your changes in the pull request.
- Reference any related issues in your pull request description.
- Be responsive to feedback during the code review process.

## Reporting Issues
If you find any bugs or have feature requests, please open an issue in the [Issues](https://github.com/ainan-ahmed/EcommForAll/issues) section and provide as much detail as possible.

Thank you for your contributions!

---
