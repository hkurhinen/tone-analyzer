# Tone analyzer demo

Project for analysing tone of different texts, uses IBM tone analyzer API.

## Usage

### Configure credentials
create file called .env to the root of the project with following contents:
```
REACT_APP_TONE_ANALYZER_URL=your tone analyzer api url
REACT_APP_TONE_ANALYZER_APIKEY=your api key
```

### Install dependencies
run command `npm install`

### Run app
run command `npm start` and open browser and navigate to localhost:3000

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
