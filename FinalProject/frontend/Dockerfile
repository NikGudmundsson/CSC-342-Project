FROM node:lts

# Set working directory
WORKDIR /frontend

# Copy all files from current directory to working dir in image
COPY ./ ./

# install node modules
RUN npm install

ENV PORT 80

ENTRYPOINT [ "npm", "start"]
