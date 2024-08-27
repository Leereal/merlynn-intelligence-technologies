# Merlynn Intelligence Technologies Coding Assessment

## Overview

This repository contains a set of applications designed to interact with various machine learning models through a web interface. The app supports multiple models and allows users to input data, retrieve decisions, and upload batch files for processing.

## Example Models Included

### Drink Choice

- **Description**: Determines the best-suited drink choice for a customer at a restaurant based on input factors like temperature, gender, age, etc.
- **Expert**: Best chef in town.
- **Demo**: Created for testing the API.

### Balance Scale

- **Description**: Utilizes the UCI Machine Learning Repository data to classify balance scale measurements.
- **Expert**: UCI Machine Learning Repository.

### Monks

- **Description**: Also from the UCI Machine Learning Repository, used for classification tasks.
- **Expert**: UCI Machine Learning Repository.

### Drink Choice Duplicate

- **Description**: A duplicate of the Drink Choice model, created for testing the API.

## Features

- Model Selection: Choose from various models such as Drink Choice, Balance Scale, Monks, and more.
- Form Submission: Input data and get recommendations based on selected models.
- Batch File Upload: Upload CSV files to process multiple entries at once.

## Getting Started

### Prerequisites

- Node.js: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- MongoDB: Ensure MongoDB is installed and running. [Download MongoDB](https://www.mongodb.com/try/download/community)

### Setup

1. Clone the Repository

   - git clone https://github.com/Leereal/merlynn-intelligence-technologies.git
   - cd merlynn-intelligence-technologies

2. Install Dependencies

   npm install

3. Environment Variables

   Create MongoDB database and name is merlynn

   Create a `.env` file in the root directory of the project and add the following:

   NEXT_PUBLIC_TOM_API_KEY=your_api_key

   MONGO_URI=your_mongo_uri

4. Start the Application

   npm run dev

   The application will be accessible at http://localhost:3000.

## Functions

### Form Handling

Users can submit forms to generate decisions based on the selected model.

### Batch File Upload

Upload CSV files to process multiple records in batch.

### Decision Creation

The application saves decisions to MongoDB and supports cache revalidation.

## Usage

1. Visit the Homepage: Navigate to the homepage to view and select models.
2. Submit Data: Use the forms to input data for decision-making.
3. Upload Batch Files: Use the batch file upload functionality to process multiple entries.

## Assumptions

- **Requirements Scope:** It is assumed that the requirements defined are the only functionalities needed. As such, features like view data, update values, and others not mentioned in the requirements were not implemented.
- **Authentication:** Since this is a public app assessment, no authentication system was created. If authentication were required, [NextAuth.js](https://next-auth.js.org/) would have been used, as it is a robust solution for authentication in Next.js applications.
- **Environment Variables:** Sensitive values are kept in environment variables to ensure security, following best practices for managing configuration.

## Contact and More Similar Projects

For any questions or further information, please reach out to Liberty at [leereal08@ymail.com](mailto:leereal08@ymail.com).

If you would like to see some of the best Next.js applications I have developed, please check out the following links:

- [Microfinex](https://github.com/Leereal/microfinex-frontend)
- [Microfinex Pro](https://github.com/Leereal/microfinex-pro)
- [Ronkedza](https://github.com/Leereal/official-ronkedza)
- [Tredique](https://github.com/Leereal/tredique-frontend)
- [Lynx](https://github.com/Leereal/lynx-official)
