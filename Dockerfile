# Dockerfile

# use node:16-alpine as the base image
FROM node:16-alpine

# download the wait-for-it.sh script and copy to /wait path in the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

# make /wait script executable by changing its permission
RUN chmod +x /wait

# set the working directory to /app
WORKDIR /app

# copy the package.json and package-lock.json files
COPY package*.json ./

# install the dependencies
RUN npm install

# copy the rest of the application files
COPY . .

# build the application
RUN npm run build

# expose port 3000
EXPOSE 3000

CMD ["npm", "start"]
