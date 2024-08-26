export function imgToBase64(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    var outputFormat = src.substr(-3) === "png" ? "image/png" : "image/jpeg";
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      var canvas: any = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      var dataURL;
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
    
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
    resolve(img);
  });
}
