# Introduction 
This tool's purpose is to help you get metrics about your repositories on Azure DevOps. It will scan your repositories package-.json files and retrieve metrics about the frameworks/libraries used and their versions.

# Getting Started
In the `scan-technos` folder, set your organization URL in the `src > constants > organization-url.ts` file and set your token in the `src > constants > token.ts` file.

Then, launch the app in "scan-technos" to retrieve metrics. You should get a folder named "reporting" with six files for each scanning:
- two files (CSV and JSON) for the "main" frameworks (e.g: Angular, React, Glimmer, NodeJS...);
- two files (CSV and JSON) for the "test" frameworks (e.g: Jest, Cypress...);
- two files (CSV and JSON) to know if there is a SonarQube file existing for the repository.

To do so, use `npm run start`.

To see the dashboard, launch the `dashboard` app with `npm run dev`. **Make sure to put the JSON files in the `dashboard > src > data` folder and to name them `mainFrameworks.json`, `testFrameworks.json` and `sonarqube.json`**. Once it is done, you can see the dashboard in your browser.


# Contribute
You can contribute to this project very simply:
- clone the repository;
- create a new branch from `main`;
- work on your branch;
- add, commit and push;
- create a pull request.

Please make sure to use the following taxonomy for branches names: `feat/<feature-name>` and `fix/<fix-name>`.
