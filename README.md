# Blockchain-Parking-System
A parking system that uses blockchain for slot reservation and real time slot checking

This repository provides a comprehensive guide to setting up a blockchain system using React, Ganache, XAMPP, and Python's Brownie framework. Follow the steps below to configure your environment and deploy your blockchain application.

---

## Prerequisites

- [Ganache](https://trufflesuite.com/ganache/)
- [Node.js](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/)
- [Composer](https://getcomposer.org/)
- [Python 3.12+](https://www.python.org/)
- [Visual Studio Code](https://code.visualstudio.com/)

---

## Setup Guide

### Step 1: VS Code Environment Setup
1. **Install Extensions**:
   - Install `Python` and `Solidity` extensions from the VS Code Marketplace.
2. **Download Ganache GUI**:
   - [Download from Ganache Archive](https://archive.trufflesuite.com/ganache/).
   - Create a new workspace in Ganache (e.g., `blockchain`).

---

### Step 2: Python Environment Setup
1. **Create Python Virtual Environment**:
   - Open the VS Code terminal and run:
     ```bash
     python -m venv .venv
     ```
   - Activate the virtual environment:
     ```bash
     .venv\Scripts\activate
     ```
2. **Install Required Packages**:
   ```bash
   pip install eth-brownie pytz
   ```
3. Initialize Brownie Project:
Create a folder (e.g., SmartCarPark) and navigate into it:
```bash
mkdir SmartCarPark
cd SmartCarPark
brownie init
```
4. Organize Files:
Place Python scripts in the scripts folder.
Place Solidity (.sol) files in the contracts folder.
5. Add Ganache Network:
```bash
brownie networks add Ethereum ganache-local host=http://127.0.0.1:7545 chainid=5777
```
6. Verify network addition:
```bash
brownie networks list
```
7. Compile Contracts:
```bash
brownie compile
```
8. Deploy Contracts:
```bash
brownie run scripts/deploy.py --network ganache-local
```

---

### Step 3: setting up backend server:
1. Install and set up XAMPP:
Download and install XAMPP from [here](https://www.apachefriends.org/).
2. Edit httpd.conf:
Navigate to \xampp\apache\conf and open httpd.conf.
Update the following lines:
```apache
DocumentRoot "filepath/blockchain/src"
<Directory "filepath/blockchain">
```
2. Start Apache:
Start the Apache server from the XAMPP control panel. (May require restart after all the configurations are done)

---

### Step 4: Setting up Node.js
1. Install Composer:
Download Composer from [here](https://getcomposer.org/).
Enable PHP Extensions:
Open php.ini (typically in C:\xampp\php\php.ini).
Enable the following extensions:
```ini
extension=zip
extension=gmp
```
Initialize Composer:
Navigate to the blockchain directory and run:
```bash
composer init
```
Fill in the following details:
```
Package name (<vendor>/<name>) [admin/blockchain]: 
Description []: 
Author [n to skip]: n
Minimum Stability []: dev
Package Type []: project
License []: proprietary
Define dependencies:
Would you like to define your dependencies (require) interactively [yes]? yes
Search for a package: digitaldonkey/ethereum-php
```
2. Install Node.js at [here](https://nodejs.org/).
3. Install React Router DOM:
```bash
npm install react-router-dom
```
4. Create a React App: 
```bash
npx create-react-app blockchain
```
5. Navigate to the App Directory:
```bash
cd blockchain
```
6. Add Proxy in package.json: Add the following line:
```json
"proxy": "http://localhost:80"
```
7. Run the App:
```bash
npm start
```



