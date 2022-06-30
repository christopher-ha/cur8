import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
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

    let { data } = await axios.post("/api/s3/uploadFile", {
      name: file.name,
      type: file.type,
    });

    console.log(data);

    const url = data.url;
    let { data: newData } = await axios.put(url, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

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

      <div className="container flex items-center p-4 mx-auto min-h-screen justify-center">
        <p>Please select a file to upload</p>
        <input type="file" onChange={(e) => selectFile(e)} />
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
