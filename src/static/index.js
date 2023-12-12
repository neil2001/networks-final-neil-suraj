var imagePath = "";
var caption = "";

function uploadImage() {
    const input = document.getElementById('file-input');
    const file = input.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('photo', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const responseMessage = document.getElementById('response-message');
            
            if (data.message === 'Upload successful!') {
                responseMessage.innerHTML = `<div class="alert alert-success" role="alert">${data.caption}</div>`;
                imagePath = data.image_link;
                caption = data.caption;
                // console.log(imagePath);

                const regenerateButton = document.getElementById('regenerate-button');
                const makeMemeButton = document.getElementById('make-meme-button');

                regenerateButton.style.display = 'block';
                makeMemeButton.style.display = 'block';
            } else {
                // Display error message
                responseMessage.innerHTML = `<div class="alert alert-danger" role="alert">${data.message}</div>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const responseMessage = document.getElementById('response-message');
            responseMessage.innerHTML = '<div class="alert alert-danger" role="alert">Upload failed. Please try again.</div>';
        });
    } else {
        const responseMessage = document.getElementById('response-message');
        responseMessage.innerHTML = '<div class="alert alert-warning" role="alert">No file selected. Please choose a file to upload.</div>';
    }
}

function regenerateImage() {
    // const formData = new FormData();
    // formData.append('filename', imagePath);

    const url = `/regenerate?filename=${encodeURIComponent(imagePath)}`;

    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        const responseMessage = document.getElementById('response-message');
        
        if (data.message === 'Upload successful!') {
            responseMessage.innerHTML = `<div class="alert alert-success" role="alert">${data.caption}</div>`;
        } else {
            responseMessage.innerHTML = `<div class="alert alert-danger" role="alert">${data.message}</div>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const responseMessage = document.getElementById('response-message');
        responseMessage.innerHTML = '<div class="alert alert-danger" role="alert">Upload failed. Please try again.</div>';
    });
}

function makeMemeImage() {
    const url = `/makeImage?filename=${encodeURIComponent(imagePath)}&caption=${encodeURIComponent(caption)}`;

    fetch(url, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Image not found');
        }
        return response.blob();
    })
    .then(data => {
        const imageUrl = URL.createObjectURL(data);
        const imageContainer = document.getElementById('imageContainer');
        const downloadButton = document.getElementById('download-button');

        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;
        downloadButton.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        const responseMessage = document.getElementById('response-message');
        responseMessage.innerHTML = '<div class="alert alert-danger" role="alert">Image generation failed. Please try again.</div>';
    });
}

function downloadImage() {
    // Get the image URL
    var imageUrl = document.querySelector('#imageContainer img').src;

    // Create a temporary anchor element
    var downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = 'downloaded_image.jpg';

    // Append the anchor element to the document and trigger a click event
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove the anchor element
    document.body.removeChild(downloadLink);
}

function chooseFile() {
    document.getElementById('file-input').click();
}

function displayImage() {
    const input = document.getElementById('file-input');
    const img = document.getElementById('preview-image');

    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

