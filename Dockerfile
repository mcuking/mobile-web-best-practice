FROM node:10

LABEL "com.github.actions.name"="Deploy to GitHub Pages"
LABEL "com.github.actions.description"="This action will handle the building and deploying process of your project to GitHub Pages."
LABEL "com.github.actions.icon"="git-commit"
LABEL "com.github.actions.color"="orange"

LABEL "repository"="http://github.com/mcuking/mobile-web-best-practice"
LABEL "homepage"="http://github.com/mcuking/mobile-web-best-practice"
LABEL "maintainer"="mcuking <mcuking.tang@gmail.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh", "/entrypoint.sh"]
