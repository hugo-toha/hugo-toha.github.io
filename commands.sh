# Check Hugo version
➜ hugo version
hugo v0.118.2+extended linux/amd64 BuildDate=unknown

# Check Go version
➜ go version
go version go1.19.4 linux/amd64

# Check Node version
➜ node -v
v18.12.1

# Check NPM version
➜ npm -v
8.19.2

git clone git@github.com:<your username>/<forked repo name>

module github.com/<your username>/<forked repo name>

baseURL: https://<your username>.github.io

gitRepo: https://github.com/<your username>/<your forked repo name>

analytics:
  enabled: false

newsletter:
  enable: false
------------------------------------------------------
a.Load Hugo modules
hugo mod tidy

b. Install node modules

hugo mod npm pack
npm install
c. Run the site

hugo server -w
