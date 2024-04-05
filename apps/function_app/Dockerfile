### Build with node
FROM node:18.13.0-slim@sha256:4d3c393de4c2d05d461bcd6d304bccd1bac000cf0e5b293e13b520d2352d58c3 as node-builder

COPY . /home/node
RUN chmod o+w -R /home/node/openapi

WORKDIR /home/node

# Danger can requires git
# RUN apt-get update && apt-get install git -y

RUN yarn install --frozen-lockfile

RUN yarn predeploy

### Install dotnet extensions
# dotnet core sdk tag list:
# - https://hub.docker.com/_/microsoft-dotnet-sdk/
# - https://mcr.microsoft.com/v2/dotnet/sdk/tags/list
FROM mcr.microsoft.com/dotnet/sdk:6.0.404-alpine3.17@sha256:25f30fdf15dbde4c2671151944794d30948e378da8963f2e9c1dea4a6a694145 as dotnet-builder

COPY . /home/node

WORKDIR /home/node

RUN dotnet build -o bin

### Copy files from builders in the final image
# functions base full tag list:
# - https://hub.docker.com/_/microsoft-azure-functions-base
# - https://mcr.microsoft.com/v2/azure-functions/base/tags/list
# functions for node full tag list:
# - https://hub.docker.com/_/microsoft-azure-functions-node
# - https://mcr.microsoft.com/v2/azure-functions/node/tags/list
FROM mcr.microsoft.com/azure-functions/node:4.27.2.1-node18-slim@sha256:ae964a3404490704114aed0c30e731c3e61a741217caa034f33c46656545f980

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    COMPlus_EnableDiagnostics=0

COPY --from=node-builder /home/node /home/site/wwwroot

COPY --from=dotnet-builder /home/node/bin /home/site/wwwroot/bin

COPY --from=dotnet-builder /home/node/obj /home/site/wwwroot/obj

# RUN groupadd nonroot -g 2000 && \
#     useradd -r -M -s /sbin/nologin -g nonroot -c nonroot nonroot -u 1000 && \
#     chown -R nonroot:nonroot /azure-functions-host && \
#     chown -R nonroot:nonroot /home/site/wwwroot
# USER nonroot

# RUN addgroup --group app --gid 10001 && \
#     useradd --uid 10001 --gid 10001 "app" && \
#     chown -R app:app /azure-functions-host && \
#     chown -R app:app /home/site/wwwroot

# USER app:app
