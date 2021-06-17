# Releasing to production

We prepare at least one release every sprint. Sprints are two weeks long.

### Prepare a branch
* A code-freeze branch named `release/X.Y.Z` is created
* A commit that bumps the version in the `package.json` is made

### QA
* The QA team do regression testing on this branch
* If issues are found, bugfixes are merged into this branch
* Once the QA is done, we push the branch to `main`
* `Main` is automatically deployed to staging – some extra QA can be done there if needed

### Tag & release
* A version tag must be created and pushed.
```
git tag v3.7.0
git push --tags
```
* Devops are notified on Slack to deploy the tag to production
* A [GitHub release](https://github.com/gnosis/safe-react/releases) is created
* `Main` is back-merged into the `dev` branch
