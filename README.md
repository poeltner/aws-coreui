# CoreUI Free React Admin Template  + AWS Cognito+ i18next
The goal of the repository is to have a boilerplate to start a react project. 

## [CoreUI](https://github.com/coreui/coreui-free-react-admin-template)
CoreUI is an Open Source Bootstrap Admin Template. But CoreUI is not just another Admin Template. It goes way beyond hitherto admin templates thanks to transparent code and file structure. And if that's not enough, let’s just add that CoreUI consists bunch of unique features and over 1000 high quality icons.

CoreUI is based on Bootstrap 4 and offers 6 versions: [HTML5 AJAX](https://github.com/coreui/free-bootstrap-admin-template-ajax), [HTML5](https://github.com/coreui/free-angular-admin-template), [Angular 2+](https://github.com/coreui/free-angular-admin-template), [React.js](https://github.com/coreui/free-react-admin-template) & [Vue.js](https://github.com/coreui/free-vue-admin-template), [.NET Core 2](https://github.com/coreui/free-dotnet-admin-template).

CoreUI is meant to be the UX game changer. Pure & transparent code is devoid of redundant components, so the app is light enough to offer ultimate user experience. This means mobile devices also, where the navigation is just as easy and intuitive as on a desktop or laptop. The CoreUI Layout API lets you customize your project for almost any device – be it Mobile, Web or WebApp – CoreUI covers them all!

## [AWS Cognito](https://aws.amazon.com/cognito/)
Amazon Cognito lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily. Amazon Cognito scales to millions of users and supports sign-in with social identity providers, such as Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0. 

## [react-i18next](https://github.com/i18next/react-i18next)
react-i18next is a powerful internationalization framework for reactjs / reactnative which is based on i18next.


## Installation

``` bash
# clone the repo
$ git clone https://github.com/poeltner/aws-coreui.git my-project

# go into app's directory
$ cd my-project

# install app's dependencies
$ npm install
```

### Basic usage

``` bash
# dev server  with hot reload at http://localhost:3000
$ npm start
```

Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

### Build

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ npm run build
```

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
├── public/          #static files
│   ├── assets/      #assets
│   └── index.html   #html temlpate
│   └── locales      #locales translation files
│
├── src/             #project root
│   ├── containers/  #container source
│   ├── scss/        #user scss/css source
│   ├── views/       #views source
│   ├── App.js
│   ├── App.test.js  
│   ├── i18n.js      #i18n config
│   ├── index.js
│   ├── _nav.js      #sidebar config
│   └── routes.js    #routes config
│
└── package.json
```