document.getElementById("scrape-images").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: scrapeImages,
      },
      (results) => {
        const imageContainer = document.getElementById("image-container");
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
              console.log(`Downloading image from: ${src}`);
              chrome.downloads.download(
                {
                  url: src,
                  filename: `image_${index}.${getFileExtension(src)}`,
                  conflictAction: "uniquify",
                },
                (downloadId) => {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                  } else {
                    console.log(`Download initiated with ID: ${downloadId}`);
                  }
                }
              );
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

function scrapeImages() {
  const images = Array.from(document.getElementsByTagName("img"));
  return images.map((img) => img.src);
}

function getFileExtension(url) {
  const splitUrl = url.split(".");
  return splitUrl[splitUrl.length - 1].split(/[#?]/)[0]; // Handle URLs with query parameters or fragments
}
