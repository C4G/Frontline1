FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Homelessness.Api/Homelessness.Api.csproj", "Homelessness.Api/"]
COPY ["Homelessness.Core/Homelessness.Core.csproj", "Homelessness.Core/"]
COPY ["Homelessness.Domain/Homelessness.Domain.csproj", "Homelessness.Domain/"]
COPY ["Homelessness.Models/Homelessness.Models.csproj", "Homelessness.Models/"]
RUN dotnet restore "Homelessness.Api/Homelessness.Api.csproj"
COPY . .
WORKDIR "/src/Homelessness.Api"
RUN dotnet build "Homelessness.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash \
    && apt-get install nodejs -yq
RUN dotnet publish "Homelessness.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Homelessness.Api.dll"]
