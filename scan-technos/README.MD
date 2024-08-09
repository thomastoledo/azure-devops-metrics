# Create a pull request

## Introduction

The objective of this script is to be able to scan technos by using the Azure devops nodeApi. This script scan all repositories of all accessible projects of your organization and gives for each repository the frontend stack and backend stack, as well as the testing stack and if Sonarqube is set up or not.


## Configuration

We should pass some data through envrionment variables to handle this script:

- ORGANIZATION_URL:  the url of the organisation, for example `https://dev.azure.com/MyTeam`
- TOKEN_PAT: The user token, See [how generate a token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page)
