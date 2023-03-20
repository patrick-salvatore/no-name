package main

import (
	"fmt"
	"os"
	"strings"
)

type File struct {
	name     string
	template string
}

type Dir struct {
	name  string
	root  bool
	files []File
	dirs  []Dir
}

func Folder(name string) Dir {
	return Dir{
		root: true,
		dirs: []Dir{
			{
				name: "components",
			},
		},
		files: []File{
			{
				name: "index.jsx",
				template: `import { render, signal } from "@lnl/framework";

export const Component = () => {
  return (
    <div class="card"></div>
  );
};

render(<Component />, document.getElementById("app"));`,
			},
			{
				name: "index.html",
				template: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[]</title>
</head>

<body>
  <div id="app"></div>
  <script src="./index.jsx" type="module"></script>
</body>

</html>`,
			},
			{
				name: "package.json",
				template: fmt.Sprintf(`{
  "name": "@lnl/playground-%v",
  "version": "0.0.0",
  "main": "index.js",
  "scripts": {
    "dev:vdom": "RUNTIME=vdom vite",
    "dev": "RUNTIME=reactive vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "repository": {
    "type": "git"
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@lnl/framework": "*",
    "@lnl/lib": "*",
    "@lnl/plugin": "*",
    "@rollup/plugin-alias": "^4.0.3",
    "vite": "^4.1.4"
  }
}`, name),
			},
			{
				name: "vite.config.js",
				template: `import { defineConfig } from "vite";
import plugin  from '@lnl/plugin'

export default defineConfig({
  resolve: {
    alias: {}
  },
  plugins: [plugin()]
});`,
			},
		},
	}
}

func createFile(f File, path string) {
	newFile, e := os.Create(fmt.Sprintf("%v/%v", path, f.name))
	defer newFile.Close()

	if e != nil {
		panic(e)
	}
	newFile.Write([]byte(f.template))
}

func createDir(path string) {
	e := os.Mkdir(path, os.ModePerm)
	if e != nil {
		if os.IsExist(e) {
			fmt.Printf("what are you doing %v already exists", path)
			os.Exit(0)
		} else {

			panic(e)
		}
	}
}

func recurFolder(d Dir, path string) {
	if d.root {
		createDir(path)
	}

	if len(d.dirs) > 0 {
		for _, nd := range d.dirs {
			next := fmt.Sprintf("%v/%v", path, nd.name)
			createDir(next)
			recurFolder(nd, next)
		}
	}

	for _, f := range d.files {
		createFile(f, path)
	}
}

func init() {
	root := "/Users/patrick/p/no-name"
	args := os.Args[1:]

	var name string
	for _, arg := range args {
		switch {
		case strings.HasPrefix(arg, "--name="):
			name = arg[len("--name="):]
		}
	}

	folder := Folder(name)
	path := fmt.Sprintf("%v/packages/playground/%v", root, name)

	recurFolder(folder, path)
}

func main() {
	fmt.Printf("done")
}
