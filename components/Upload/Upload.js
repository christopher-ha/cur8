import { useState, useEffect, useCallback } from "react";
import { useS3Upload } from "next-s3-upload";
import { useRouter } from "next/router";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import styles from "@/components/Upload/Upload.module.scss";

export default function UploadImages({ getURLs }) {
  const [urls, setUrls] = useState([]);
  const { uploadToS3 } = useS3Upload();
  const router = useRouter();
  // console.log(router.query);

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    const files = Array.from(acceptedFiles);

    for (const file of files) {
      console.log(file);
      const { url } = await uploadToS3(file);
      submitData(url);
      setUrls((current) => [...current, url]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  useEffect(() => {
    document.onpaste = async function (event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      const files = Array.from(clipboardData.files);

      for (const file of files) {
        // console.log(file);
        const { url } = await uploadToS3(file);
        submitData(url);
        setUrls((current) => [...current, url]);
      }
    };
  }, []);

  const handleFilesChange = async ({ target }) => {
    const files = Array.from(target.files);

    for (const file of files) {
      const { url } = await uploadToS3(file);
      // This submitData(url) is telling the function to post to DB via Prisma during the sequence
      submitData(url);
      setUrls((current) => [...current, url]);
    }
  };

  const submitData = async (url) => {
    let config = {
      method: "POST",
      url: `http://localhost:3000/api/moodboards/`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        url: url,
        moodboardId: router.query.moodboardId,
      },
    };
    try {
      const response = await axios(config);
      if (response.data.status == 200) {
        console.log("Success");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // This useEffect is how we pass data from the child to the parent via a prop function. Look inside of the [moodboardId]/index.js page and refer to the pull_data function: it takes the urls from the newly uploaded images and stores it in the newImages state for us to map over.
  useEffect(() => {
    getURLs(urls);
  });

  return (
    <>
      <div {...getRootProps({ className: styles.upload__dropzone })}>
        <input {...getInputProps()} />
      </div>
      <form className={styles.upload__buttons}>
        <label className="button" htmlFor="file">
          Upload Image
        </label>
        <input
          className={styles.upload__picker}
          type="file"
          name="file"
          multiple={true}
          onChange={handleFilesChange}
          id="file"
          accept="image/jpeg, image/jpg, image/png"
        />
      </form>
    </>
  );
}
