// load Html templates

// document.addEventListener('DOMContentLoaded', function () {
    let placeholders = document.querySelectorAll('.content-placeholder');

    placeholders.forEach(function (placeholder) {
        let url = placeholder.getAttribute('data-url');
        loadFile(url, function (text) {
            placeholder.innerHTML = text;
        });
    });
// });

function loadFile(filename, callback) {
    fetch(filename)
        .then(response => response.text())
        .then(text => callback(text))
        .catch(error => console.error('Error loading file:', error));
}