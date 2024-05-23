document.addEventListener("DOMContentLoaded", () => {
  const scrapeImagesButton = document.getElementById("scrape-images");
  const downloadAllButton = document.getElementById("download-all");
  const imageContainer = document.getElementById("image-container");

  scrapeImagesButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: scrapeImages,
        },
        (results) => {
          imageContainer.innerHTML = "";
          if (results && results[0].result) {
            results[0].result.forEach((src, index) => {
              const imgWrapper = document.createElement("div");
              imgWrapper.style.marginBottom = "10px";
              imgWrapper.classList.add("container-img");
              const img = document.createElement("img");
              img.src = src;
              img.style.width = "100px";
              img.style.height = "100px";

              const downloadButton = document.createElement("button");
              downloadButton.textContent = "Download";
              downloadButton.style.display = "block";
              downloadButton.style.marginTop = "5px";
              downloadButton.addEventListener("click", () => {
                downloadImage(src, `image_${index}.${getFileExtension(src)}`);
              });

              imgWrapper.appendChild(img);
              imgWrapper.appendChild(downloadButton);
              imageContainer.appendChild(imgWrapper);
            });
          }
        }
      );
    });
  });

  downloadAllButton.addEventListener("click", () => {
    const images = Array.from(imageContainer.getElementsByTagName("img"));
    images.forEach((img, index) => {
      downloadImage(img.src, `image_${index}.${getFileExtension(img.src)}`);
    });
  });
});

function scrapeImages() {
  const images = Array.from(document.getElementsByTagName("img"));
  return images.map((img) => img.src);
}

function downloadImage(url, filename) {
  chrome.runtime.sendMessage(
    {
      action: "download",
      url: url,
      filename: filename,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        console.log(`Download initiated`);
      }
    }
  );
}

function getFileExtension(url) {
  const splitUrl = url.split(".");
  return splitUrl[splitUrl.length - 1].split(/[#?]/)[0]; // Handle URLs with query parameters or fragments
}
