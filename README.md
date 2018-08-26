# Visual regression

A simple visual regression tool using puppeteer and resemblejs.


## Getting Started

Clone the repo and install the node modules.

## Script Reference

#### Setup

```javascript
npm run setup
```
creates screenshot, baselines, results, and failures directories

#### Start
```javascript
npm start
```
creates baseline screenshots

#### Test

```javascript
npm test
```
takes new screenshot and compares it with the baselines

#### Deleting baseline folder

```javascript
npm run clean:baselines
```
deletes the baselines folder and everything in it.


#### Deleting failures folder

```javascript
npm run clean:failures
```
deletes the faiulres folder and everything in it.


#### Deleting results folder

```javascript
npm run clean:results
```
deletes the results folder and everything in it.


#### Deleting screenshots folder contents

```javascript
npm run clean:all
```
deletes everything inside the screenshot folder.


#### Deleting the screenshots folder

```javascript
npm run yolo
```
deletes the screenshots folder.
