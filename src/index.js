import State from './state/state.js';

// handle app state
const state = new State();
let { data } = state;

data = {
  canvas: {
    x: 0,
    y: 0
  },
  meta: {}
};

// query required elements
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const importImagesIcon = document.querySelector('#import-images-icon');
const importImages = document.querySelector('#import-images');
const exportSpritesheet = document.querySelector('#export-spritesheet');

// resize canvas on startup
document.addEventListener('DOMContentLoaded', () => {
  canvas.width = data.canvas.x;
  canvas.height = data.canvas.y;
});

// redirect click event to hidden file input element
importImagesIcon.addEventListener('click', () => {
  importImages.click();
});

// handle image input
importImages.addEventListener('change', () => {
  const files = [...importImages.files];
  
  files.map((file, index) => {
    // create image element
    const image = new Image();

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.addEventListener('load', () => {
      const fileBinary = fileReader.result;

      image.src = fileBinary;
    });

    const fileName = file.name.slice(0, file.name.indexOf('.'));

    if (!data.canvas.images) {
      data.canvas.images = {};
    }

    if (!data.canvas.images[fileName]) {
      data.canvas.images[fileName] = {};
    }

    if (!data.meta[fileName]) {
      data.meta[fileName] = {};
    }

    image.addEventListener('load', () => {
      // keep image data in data canvas
      data.canvas.images[fileName].fileName = fileName;
      data.canvas.images[fileName].file = image.src;
      data.canvas.images[fileName].width = image.width;
      data.canvas.images[fileName].height = image.height;
      data.canvas.images[fileName].x = 0;
      data.canvas.images[fileName].y = canvas.height + 5;
      
      data.canvas.x = image.width > data.canvas.x ? image.width : data.canvas.x;
      data.canvas.y += Math.ceil(image.height + 10);
      
      // keep necessary image data in data meta only
      data.meta[fileName].fileName = data.canvas.images[fileName].fileName;
      data.meta[fileName].x = data.canvas.images[fileName].x;
      data.meta[fileName].y = data.canvas.images[fileName].y;
      data.meta[fileName].width = data.canvas.images[fileName].width;
      data.meta[fileName].height = data.canvas.images[fileName].height;
      canvas.width = data.canvas.x;
      canvas.height = data.canvas.y;

      // rerender all cached sprites
      for (let currentImage in data.canvas.images) {
        const { file, x, y} = data.canvas.images[currentImage];

        const image = new Image();
        image.src = file;
    
        ctx.drawImage(
          image,
          x,
          y
        );
      }
    });
  });
});


// export spritesheet
exportSpritesheet.addEventListener('click', () => {
  // allow export only when canvas isn't empty
  if (data.canvas.images) {
    let link = document.createElement('a');
    link.download = 'spritesheet.png';
    link.href = canvas.toDataURL();
    link.click();
    const jsonFileData = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data.meta, 0, 2))}`;
    link.download = 'data.json';
    link.href = jsonFileData;
    link.click();
    const jsData = `const data = ${JSON.stringify(data.meta, 0, 2)};\n\nexport default data;`;
    const jsFileData = `data:text/javascript;charset=utf-8,${encodeURIComponent(jsData)}`;
    link.download = 'data.js';
    link.href = jsFileData;
    link.click();
    link = null;
  }
});
