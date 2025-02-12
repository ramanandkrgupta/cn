
# Welcome to NotesMates 📚 Website 

![App Screenshot](https://i.postimg.cc/Hxb7NbgW/Screenshot-2024-12-09-at-9-51-05-PM.png)


 ### [notesmates.in](https://notesmates.in): A Centralized Hub for All Your Educational Resources

 # 🌟 Where Learning Meets Simplicity 🌟


 NotesMates.in is a completely free and ad-free platform designed to revolutionize the way students and teachers interact with study materials. Whether you're a student from any college, course, branch, semester, or subject, or a teacher managing academic content, NotesMates makes it seamless and stress-free!

 ## What Makes NotesMates Special?

 #### ✅ Centralized Resources by University:
Say goodbye to scattered notes! All study materials are meticulously organized based on universities, ensuring effortless access tailored to your academic curriculum.

#### ✅ Lightweight and Minimalistic UI Design:
Crafted for speed and simplicity, NotesMates offers a lightweight platform with an intuitive interface.

#### ✅ PWA Ready:
Install NotesMates as a Progressive Web App for quick and convenient access on any device.

#### ✅ Easy Navigation:
Students can easily find study materials sorted by subjects, courses, and categories—a smarter way to study.

#### ✅ Advanced Search Functionality:
Locate specific study materials in seconds with our powerful search features.

#### ✅ Document Management for Teachers:
Teachers can upload, organize, and manage educational resources effortlessly.

#### ✅ Comprehensive Admin Dashboard:
Admins can control and manage users, roles, and platform features conveniently.

#### ✅ Secure File Upload & Storage:
Robust security measures protect your files and ensure safe uploads.

#### ✅ User Authentication:
Secure login for students, teachers, and admins, ensuring data privacy and access control.

#### ✅ Responsive Design:
A seamless, user-friendly experience across devices, whether you're on mobile, tablet, or desktop.
 


## Why Choose NotesMates?

#### 🚀 Simplified Learning: 
Makes studying less stressful by offering easy-to-access, university-specific resources.
#### 🎓 All-in-One Hub: 
A single destination for all your educational needs.
#### 🤝 Collaboration Made Easy: 
Encourages the sharing of knowledge and resources within the academic community.
#### 📱 Accessible Anytime, Anywhere: 
Install the PWA and access NotesMates offline or on the go.


## Tech Stack 🛠️: Powering a Seamless Experience

#### 🚀 NEXT.js
A cutting-edge, React-based framework for building modern, high-performance web applications with server-side rendering and static site generation.

#### 🎨 Tailwind CSS
A utility-first CSS framework enabling rapid UI development with a sleek and fully customizable design.

#### 💾 MongoDB
A flexible and scalable NoSQL database, perfect for managing user data and dynamic content efficiently.

#### 🔐 NextAuth
A robust authentication solution for Next.js, supporting secure login methods, including social logins.

#### 🛠️ Prisma
A modern database toolkit offering intuitive and simplified access to MongoDB, ensuring seamless data handling.

#### ⚡ Zustand
A lightweight state management library for React, delivering fast and scalable solutions for managing application states.

This thoughtfully chosen stack ensures a lightweight, scalable, and responsive platform that delivers an exceptional user experience for students, teachers, and admins alike. 🚀


## Getting Started 🚦

### Prerequisites 🚧

- [Node.js](https://nodejs.org/) installed on your machine.
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/)
- [Edgestore](https://edgestore.dev/) for managing all the uploaded douments
- [MongoDB](https://www.mongodb.com/) for persisting data.

### Environment Variables ⚙️

To run this project, you will need to add the following environment variables to your .env file:

- `NEXTAUTH_URL `:The public URL of your NextAuth authentication service.
- `NEXTAUTH_URL_INTERNAL` :The internal URL used for authentication within the project.
- `NEXTAUTH_SECRET `:A secret key for securing sessions and tokens in NextAuth.
- `NEXT_SHARP_PATH`:Path for Next.js image processing with Sharp.
- `NEXT_DEFAULT_PASSWORD`:Default password used during project setup or user creation.
- `NEXT_PUBLIC_APP_URL`:The public URL of your application.
- `DATABASE_URL `:Your MongoDB connection URL.
- `EDGE_STORE_ACCESS_KEY`:Access key for Edge Store,
- `EDGE_STORE_SECRET_KEY`:Secret key for Edge Store

### How To Use 🚀

From your command line:

```bash
# Clone this repository
  $git clone https://github.com/ramanandkrgupta/cn.git

# Go into the repository
  $cd cn

# Install dependencies
  $npm install
  # <Create .env appropriately>

# This is needed if you are planning to run Notes Mates locally
  $npx prisma generate
  $npx prisma db push

# Start the app in development mode with hot-code reloading by running:
  $npm run dev
```

## Contributing 🤝

We welcome contributions from the community. Please fork the repository and submit pull requests.
**Make sure to see [contributing.md](https://github.com/ramanandkrgupta/cn/blob/main/CONTRIBUTING.md) for instructions on contributing to the project!**

Report Bugs, Give Feature Requests There..

## Licence 📝

[Notes Mates](https://github.com/ramanandkrgupta/cn) is Free Software: You can use, study share and improve it at your
will. Specifically you can redistribute and/or modify it under the terms of the
[MIT License](https://opensource.org/license/mit/l) as
published by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

##

**⭐️ Star this Repo if you Liked it! ⭐️**

