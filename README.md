# hooked-on-the-koots

This project documents a variety of locations that people who are outdoor enthusiasts can reference for finding new places to explore, camp, and fish! This was built using open data from a varitey of sources, and was collected and organized by the main GIS collaborator Hannah Murphy. This was built using vue and express, with data stored using google cloud services. These are mostly for data transparancy, however this could be any source you like. 

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).
[Neovim](https://neovim.io/) + [Mason](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#volar) + [ts_ls](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#ts_ls) + [Volar](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#volar).
```sh

```

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup
You will need to configure an .env file with the following variables:
```
GOOGLE_MAPS_API_KEY=
VITE_TEST_DATA_CSV=
```
### Note:
These environment variables are used to access the google maps api and the test data csv file.
If you would like to contribute to this project, please reach out to the main GIS collaborator Hannah Murphy or myself for access to the google cloud services and the test data csv file. We are happy to collaborate, but we want to make sure that the data is being used responsibly and that we are able to track the usage of the data.


```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
### Install Express backend deps

```sh
npm install
```
### Run Express backend

```sh
npm run dev
```

