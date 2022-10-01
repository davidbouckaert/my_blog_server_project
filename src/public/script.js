// TODO create TS file from this and compile it to the dist folder, then in the app; serve the dist folder
document.addEventListener('DOMContentLoaded', () => {
    const trashcan = document.querySelector('a.delete'); // storing the bin icon element to var trashcanø
    // listen for a click event on the trashcan element
    trashcan.addEventListener('click', (e) => {
        // define the endpoint location
        const endpoint = `/blogs/${trashcan.dataset.doc}`; // using the data attribute created on line 16, get the id from the current blog
        // use the fetch API to make a DELETE request to the endpoint
        fetch(endpoint, {
            method: 'DELETE'
        }).then(response => {
            // takes the json from the response and returns a javascript object as a promise
            return response.json()
        })
        .then((data) => {
            // accessing the javascript object & using the window object to set the location to the value of the redirect property
            window.location.href = data.redirect
        }).catch((err) => {
            console.log('event listener error')
            console.log(err)
        })
    })
})

