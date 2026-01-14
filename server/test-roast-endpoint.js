const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testRoast() {
    try {
        console.log("Creating dummy PDF...");
        fs.writeFileSync('dummy.pdf', 'This is a test resume content for debugging.');

        const formData = new FormData();
        formData.append('resume', fs.createReadStream('dummy.pdf'));

        console.log("Sending request to http://localhost:5000/api/roast...");
        const response = await axios.post('http://localhost:5000/api/roast', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        console.log("Success:", response.data);
    } catch (error) {
        console.error("Error Status:", error.response ? error.response.status : "No Response");
        console.error("Error Data:", error.response ? error.response.data : error.message);
    }
}

testRoast();
