# Releasing to production

We prepare at least one release every sprint. Sprints are two weeks long.

### Prepare a branch
* Create a code-freeze branch named `release/X.Y.Z`
* Bump the version in the `package.json`
* Create a PR with the list of changes

💡 To generate a quick changelog:
```
git log origin/main..origin/dev --pretty=format:'* %s'
```

### QA
* The QA team do regression testing on this branch
* If issues are found, bugfixes are merged into this branch
* Once the QA is done, we push the branch to `main`
* `main` is automatically deployed to staging – some extra QA can be done there if needed

### Tag & release
* Create and push a new version tag :
```
git tag v3.15.0
git push --tags
```

* Create a [GitHub release](https://github.com/gnosis/safe-react/releases) for this tag
* Notify devops on Slack and send them the release link to deploy to production
* Back-merge `main` into the `dev` branch to keep them in sync
