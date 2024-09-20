# TNM093
This repository contains the material for the SciVis mini-project for the TNM093 course at [Linköping University](https://liu.se/). It requires a *WebGL 2.0* compliant browser (see [Can I use ... Support tables for HTML5, CSS3, etc](https://caniuse.com/#feat=webgl2)).
The material is very loosely based on [Creating 3D objects using WebGL - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL) and [WebGL2 Fundamentals](https://webgl2fundamentals.org).

The easiest (and recommended way) to work on the material is to start a local webserver using Python3. With this installed execute `python -m http.server` in the projects root folder (the folder where index.html is located) and visit `localhost:8000` in your browser of choice. The local hosting is required as the volume rendering example requires locally hosted files (for instance the volume data itself).
Alternatively, there is a `start_httpserver_tp5023.bat` script in the repository to start Python in the TP5023 lab room.
