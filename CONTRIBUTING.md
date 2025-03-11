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
#### TypeScript and JavaScript
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
- Use 2 spaces for indentation.
- Prefer const and let over var.
- Use single quotes for strings.
#### React
- Follow the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).
- Use functional components and React hooks.
- Follow the existing project file structure for organizing components.

#### CSS
- [Follow the CSS Guidelines](https://cssguidelin.es/).
- Use 2 spaces for indentation.
- Use BEM (Block Element Modifier) naming convention for classes.
#### HTML
- Follow the [W3C HTML Guidelines](https://www.w3.org/Style/).
- Use 2 spaces for indentation.
#### Dockerfile
- Follow the [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).
- Use multi-stage builds where applicable.

## Pull Request Guidelines
- ~~Ensure your code passes all tests and linter checks~~ (Tests and linter checks have not been implemented yet, so this step is currently not applicable).
- Provide a clear description of your changes in the pull request.
- Reference any related issues in your pull request description.
- Be responsive to feedback during the code review process.

## Reporting Issues
If you find any bugs or have feature requests, please open an issue in the [Issues](https://github.com/ainan-ahmed/EcommForAll/issues) section and provide as much detail as possible.

Thank you for your contributions!

---
