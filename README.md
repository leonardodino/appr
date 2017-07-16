# appr
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![License][license-badge]][license-url]

#### Automatically Deploy Commits for `create-react-native-app` and `Expo`

***

**appr builds and deploys pull requests** in your [create-react-native-app](https://github.com/react-community/create-react-native-app) (and other [Expo](https://expo.io/)-based) projects, and replies with a link you can open directly on your device or emulator.

## Etymology /ɛtɪˈmɒlədʒi/

### appr /ˈapə/
*noun*
- **appr** - Pull Request Review Apps for React Native
- **appr** - Portmanteaux of *app* and *PR*.
- **appr** - Throwback to Web 2.0, when everything was bettr

## What are "Review Apps"?

Mature technical organizations peer-review their code. Reviewing code on GitHub is simple enough: for most well-crafted pull requests, you can review the code diff in your browser, and either approve the changes, or request further improvements.

Testing another developer's changes isn't quite as easy. Typically, you will have to stash any work in progress in your own workspace, pull down the remote branch, install dependencies, compile and start the application before you can verify that the changes work as intended.

Since it was launched, I've loved Heroku's GitHub-integrated [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps). As part of your branch build, Heroku will spin up a new review instance of your application, which you can then access with a direct link from your GitHub pull request. [Netlify](https://www.netlify.com/) offers the same functionality for deploying static websites.

Unfortunately, a one-click workflow like this doesn't exist for mobile development. To add insult to injury, the ramp-up time to test mobile app changes on your local device can be much longer than for web applications.

Enter **appr**. Built on [Expo](https://expo.io) and inspired by [Expo Sketch](https://sketch.expo.io), **appr** aims to make peer-reviewing React Native app code as easy as static websites

## Getting started

Add appr to your project:
```sh
  yarn add -D @leonardodino/appr
```

Or, using npm:
```sh
  npm install --save-dev @leonardodino/appr
```

Add the `appr` task to the `scripts` section of your package.json:
```diff
  scripts: {
+   "appr": "node node_modules/appr/bin/appr",
	...
  }
```

Next, configure one of the currently supported CI environments:
- [Configuring Travis](#configuring-travis)

[Contributions](https://github.com/leonardodino/appr/pulls) for other CI platforms welcome.

## Limitations

There are a few limitations you should be aware of. **appr** is currently not able to deploy:

1. React Native apps started with something other than create-react-native-app or Expo.
2. Ejected React Native apps containing custom native module dependencies.
3. Pull Requests from forked repositories. This is due to Travis security policies (wisely) not exposing secure environment variables to forked builds.


## Configuring Travis

[Travis CI](https://travis-ci.org) is free for open source projects, and offers paid plans for private repositories. To get started, create an account on Travis using your GitHub login.

#### Add .travis.yml to your project
Add the following to your `.travis.yml`: (replacing YOUR-APP-NAME-HERE)
```
language: node_js
cache: yarn
env:
  - APPR_ENV=travis
  - APPR_NOTIFY_SERVICE=github
  - APPR_APP_SLUG=YOUR-APP-NAME-HERE
script:
  - 'yarn test'
after_success:
  - 'APPR_EVENT="$TRAVIS_EVENT_TYPE" yarn appr'
deploy:
  provider: script
  script: 'APPR_EVENT=release yarn appr'
  skip_cleanup: true
  on:
    branch: master
```
This will configure your Travis build to use the latest Node.js and Yarn, and ensure that the **appr** build only runs on Pull Request builds.

#### (Optional) Running tests

If you're not already using Travis, it's advisable to run your unit tests before deploying review apps. You can do this by adding other steps in the `script` section, and always leaving the **appr** step last:
script:
```diff
+ - yarn ci-test-command
  - 'if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then yarn appr; fi'
```

Note that the default `test` command in `create-react-native-app` runs Jest in `--watch` mode, which will hang forever. You can either change the `test` script in your package.json, or, or override the test command as above.

#### Enable Travis

The final step is to enable [Travis CI](https://travis-ci.org) on your repository. Log into your Travis account, and turn on the build for your project in your Profile.

After enabled, you'll be taken to your project build page. Before triggering the first build, you'll need to add a few secure environment variables to your build under `More options > Settings`:
 - `EXP_USERNAME` - Exponent username, under which to publish the review apps. Use your main account, or create a new one for review apps. All review apps will be unlisted, so only you can see them in your app listings.
 - `EXP_PASSWORD` - Exponent password for the publish user.
 - `GITHUB_USERNAME` - A user account you want to use for posting the review app links. Use your own, or create a new "bot" account and grant them access to your repo.
 - `GITHUB_TOKEN` - A [Personal API Token](https://github.com/blog/1509-personal-api-tokens) of the user with access to the repository. If the repository is private, the token needs to be granted the full `repo` scope. For public repositories, the `public_repo` scope is enough.

#### Test it

You should now be able to create a new branch, make changes, and open a pull request. If the stars are aligned, the Travis build should publish the app to Expo!


[npm-badge]: https://img.shields.io/npm/v/@leonardodino/appr.svg
[npm-url]: https://www.npmjs.com/package/@leonardodino/appr
[travis-badge]: https://api.travis-ci.org/leonardodino/appr.svg
[travis-url]: https://travis-ci.org/leonardodino/appr
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/leonardodino/appr/master/LICENSE
