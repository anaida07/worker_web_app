FROM amazonlinux:2

# Create app directory
WORKDIR /usr/src/app

RUN yum install git -y
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -
RUN yum install -y nodejs

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8081
CMD [ "npm", "start" ]