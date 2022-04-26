# Environments

We have several environments where the app can be deployed:


|Env|URL|Purpose|How it's deployed|Backend env|
|---|---|---|---|---|
|local|http://localhost:3000/app|local development|`yarn start`|staging|
|PRs   |`https://pr<PR_NUMBER>--safereact.review-safe.gnosisdev.com/app`|peer review & feature QA|for all PRs on push|staging|
|release PRs|`https://pr<PR_NUMBER>--safereact.review-safe.gnosisdev.com/app`|pre-release regression testing|in PRs to `main`|**production** (sic!)|
|dev  |https://safe-team.dev.gnosisdev.com/app/|preview of all WIP features|on push to the `dev` branch|staging|
|staging|https://safe-team.staging.gnosisdev.com/app/|preview of features before a release|on push to `main`|staging|
|production|https://gnosis-safe.io/app/|live app|deployed by DevOps (see the [Release Procedure](https://github.com/safe-global/safe-react/blob/ee39ef932d58e67db96756577814c1bfaf396d75/docs/release-procedure.md))|**production**|

## Lifecycle of a feature

After a feature enters the development cycle (i.e. is in a sprint), it goes through the following steps:

### Development & QA
1. Developer starts working on the feature
2. Developer creates a Pull Request and assigns a reviewer
3. Reviewer leaves feedback until the PR is approved
4. QA engineer starts testing the branch on a deployed site (each PR has one, see the table above)
5. Once QA gives a green light, the branch is merged to the `dev` branch

### Release
1. All merged branches sit on `dev`, which is occasionally reviewed on the [dev site](https://safe-team.dev.gnosisdev.com/app/).
2. In case some regression is noticed, it's fixed on dev.
3. Once a sufficient amount of features are ready for a release (at least once in a sprint), a release branch is made (normally from the HEAD of `dev`) and a PR to `main` is created.
4. QA does regression testing on the release branch. The backend APIs are pointing to production on this branch so that all chains can be tested.
5. Once QA passes, the branch is merged to `main` and is automatically deployed to the [staging site](https://safe-team.staging.gnosisdev.com/app/).
6. It sits on staging for a short while where QA and the release manager briefly do a final check before going live.
7. DevOps are requested to deploy the code from `main` to the production env.
8. Once it's done, brief sanity checks are done on the [production site](https://gnosis-safe.io/app/).
