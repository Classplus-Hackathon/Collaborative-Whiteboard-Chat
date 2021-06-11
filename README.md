# Intelligent Chat System With Collaborative-Whiteboard

this application let users to collaborate in real time on the whiteboard and help teachers to address the question based on the priority set by our system using Latent Dirichlet allocation (LDA) statistical model.
LDA is a machine learning algorithm that extracts topics and their related keywords from a collection of documents.

![Whiteboard](https://user-images.githubusercontent.com/72756462/121754132-74e60600-cb31-11eb-8e0e-5b9d3a849eba.jpeg)

# Process To Setup The Project
## 1) Clone the repository
### Using Https Method
```
git clone https://github.com/Classplus-Hackathon/Collaborative-Whiteboard-Chat.git
```
### Using SSH Method
```
git clone git@github.com:Classplus-Hackathon/Collaborative-Whiteboard-Chat.git
```
## 2) Install Packages
Navigate to project root directory and run
```
npm install
```
## 3) Start the server
```
node server
```
OR
```
nodemon server
```
## 4) Server will run on the Port 8000

<b>#NOTE: Query params room and name are required</b><br>
Navigate to localhost:8000?room={{your_room}}&name={{your_name}}
