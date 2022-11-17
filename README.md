# P220771 UI

### Steps

1. Clone the repository: 
```bash
git clone https://github.com/aw1875/P220771.git
```
2. Install dependencies & Build Project:
```bash
cd P220771
yarn install
yarn build
```
3. Move build files. Either copy all the files from the `build` folder to the `static` folder inside of the Python `Server` directory or run:
```bash
cd build
cp -r * ../../Server/static
```
