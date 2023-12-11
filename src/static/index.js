var imagePath = "";

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
                console.log(imagePath);
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
