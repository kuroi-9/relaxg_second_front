# RelaxG : The Second - Front

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Objectives

The first iteration of RelaxG accomplished its objectives of manga images restoration, with an access over the internet. Thought, it was not enough to meet my reliability needs. Therefore, the second iteration of RelaxG is currently being developed to address these issues.
The issues addressed in the second iteration of RelaxG include:
- Adapted architecture to improve scalability and performance
- Enhanced error handling and logging mechanisms
- Implemented automated testing and (WIP) continuous integration pipelines

## Getting Started

### Prerequisites

- Node.js (version 22 or higher)
- pnpm (```npm install --global corepack@latest```)

### Installation

1. Clone the repository:
   ```bash
   https://github.com/kuroi-9/relaxg_second_front
   ```

2. Navigate to the project directory:
   ```bash
   cd relaxg-second-front
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and visit `http://localhost:5173` to see the application in action.
6. Setup the [backend server](https://github.com/kuroi-9/relaxg_second_server), create a *.env* and fill the environment variables listed in *.env.example*
