const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const API_URL = "http://localhost:3000";
const IMAGE_PATH = "./src/Pictures/test-image.png";

async function testAPI() {
  try {
    console.log("1. Testing health...");
    const health = await axios.get(`${API_URL}/health`);
    console.log(health.data);

    console.log("\n2. Testing single upload...");

    const form = new FormData();
    form.append("image", fs.createReadStream(IMAGE_PATH));

    const upload = await axios.post(`${API_URL}/api/upload/single`, form, {
      headers: form.getHeaders(),
    });

    console.log(upload.data);

    const filename = upload.data.file.filename;

    console.log("\n3. Testing image processing...");

    const process = await axios.post(`${API_URL}/api/process/${filename}`, {
      width: 800,
      height: 600,
      format: "webp",
      quality: 85,
      sharpen: true,
    });

    console.log(process.data);

    console.log("\n4. Testing metadata...");

    const metadata = await axios.get(
      `${API_URL}/api/process/${filename}/metadata`,
    );

    console.log(metadata.data);

    console.log("\n5. Testing thumbnail...");

    const thumbnail = await axios.post(
      `${API_URL}/api/process/${filename}/thumbnail`,
      {
        width: 300,
        height: 300,
      },
    );

    console.log(thumbnail.data);

    console.log("\n6. Testing watermark...");

    const watermark = await axios.post(
      `${API_URL}/api/process/${filename}/watermark`,
      {
        text: "My Watermark",
      },
    );

    console.log(watermark.data);

    console.log("\n7. Testing responsive images...");

    const responsiveForm = new FormData();
    responsiveForm.append("image", fs.createReadStream(IMAGE_PATH));

    const responsive = await axios.post(
      `${API_URL}/api/upload/responsive`,
      responsiveForm,
      {
        headers: responsiveForm.getHeaders(),
      },
    );

    console.log(responsive.data);

    console.log("\n✅ All API tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.response?.data || error.message);
  }
}

testAPI();
