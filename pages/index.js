import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

const BUCKET_URL = "https://cur8-images.s3.us-east-2.amazonaws.com/";

const Home = () => {
  const [file, setFile] = useState();
  const [uploadingStatus, setUploadingStatus] = useState();
  const [uploadedFile, setUploadedFile] = useState();

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    setUploadingStatus("Uploading the file to AWS S3");

    // After clicking upload, send the file data to the uploadFile API so we can generate the uploadURL
    let { data } = await axios.post("/api/s3/uploadFile", {
      name: file.name,
      type: file.type,
    });

    console.log(data);

    // Front-end makes a PUT request to the uploadURL to store the image in the bucket.
    const uploadURL = data.uploadURL;
    let { data: newData } = await axios.put(uploadURL, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    // Get the actual image URL by splitting the uploadURL by the ? and converting it to a string
    const imageURL = uploadURL.split("?")[0].toString();
    console.log(imageURL);

    setUploadedFile(BUCKET_URL + file.name);
    setFile(null);
  };

  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }
  return (
    <main>
      <div>
        <button onClick={() => signIn("EmailProvider", { redirect: false })}>
          Sign In
        </button>
      </div>

      <div className="container">
        <p>Please select a file to upload</p>
        <input type="file" onChange={(e) => selectFile(e)} accept="image/*" />
        {file && (
          <>
            <p>Selected file: {file.name}</p>
            <button
              onClick={uploadFile}
              className=" bg-purple-500 text-white p-2 rounded-sm shadow-md hover:bg-purple-700 transition-all"
            >
              Upload a File!
            </button>
          </>
        )}
        {uploadingStatus && <p>{uploadingStatus}</p>}
        {uploadedFile && <img src={uploadedFile} alt={uploadedFile} />}
      </div>
    </main>
  );
};

export default Home;
