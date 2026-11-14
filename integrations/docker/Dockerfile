FROM node:22-alpine
LABEL org.opencontainers.image.title="Free AI Video Offline Prompt Kit" org.opencontainers.image.source="https://github.com/cydiz/freeaivideo-prompt-kit" org.opencontainers.image.url="https://freeaivideo.art" org.opencontainers.image.licenses="MIT"
WORKDIR /tool
COPY package.json LICENSE ./
COPY src/ ./src/
COPY bin/ ./bin/
USER node
ENTRYPOINT ["node","/tool/bin/cli.js"]
CMD ["--help"]
