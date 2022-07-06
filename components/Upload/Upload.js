import { useState, useEffect, useCallback, useRef } from "react";
import { useS3Upload } from "next-s3-upload";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import styles from "@/components/Upload/Upload.module.scss";

export default function UploadImages({ getURLs }) {
  const [urls, setUrls] = useState([]);
  const { uploadToS3 } = useS3Upload();
  const router = useRouter();
  // console.log(urls);

  // Replacement for react-dropzone (allows for drag & drop on window instead of a div, and allows for us to click elements that otherwise would exist underneath)
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const handleDrag = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  const handleDragIn = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);
  const handleDragOut = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current > 0) return;
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      dragCounter.current = 0;
      console.log(event.dataTransfer.files);
      const files = event.dataTransfer.files;
      // This is where we upload the files using our function.
      uploadFiles(files);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("dragenter", handleDragIn);
    window.addEventListener("dragleave", handleDragOut);
    window.addEventListener("dragover", handleDrag);
    window.addEventListener("drop", handleDrop);
    return function cleanUp() {
      window.removeEventListener("dragenter", handleDragIn);
      window.removeEventListener("dragleave", handleDragOut);
      window.removeEventListener("dragover", handleDrag);
      window.removeEventListener("drop", handleDrop);
    };
  });

  // refactor: Take the files and upload to Amazon S3, submit data to database, and setUrls in state.
  const uploadFiles = async (files) => {
    for (const file of files) {
      const { url } = await uploadToS3(file);
      submitData(url);
      setUrls((current) => [...current, url]);
    }
  };

  // // Handle new files via Drag & Drop on browser window
  // const onDrop = useCallback(async (acceptedFiles) => {
  //   console.log(acceptedFiles);
  //   const files = Array.from(acceptedFiles);
  //   uploadFiles(files);
  // }, []);

  // // Initialize react-dropzone
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   noClick: true,
  // });

  // Handle new files/urls via Paste on browser window
  useEffect(() => {
    document.onpaste = async function (event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedURL = clipboardData.getData("Text");
      console.log(pastedURL);
      const files = Array.from(clipboardData.files);
      console.log(files);

      // Checks if URL is an image.
      function checkURL(url) {
        return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
      }

      // If the user pastes a file, upload it normally.
      if (files) {
        uploadFiles(files);
      }

      if (pastedURL) {
        submitData(pastedURL);
        setUrls((current) => [...current, pastedURL]);
      }

      // If the user pastes an image url, check if it is an image. If so, add it to the database.
      if (checkURL(pastedURL) === true) {
        submitData(pastedURL);
        setUrls((current) => [...current, pastedURL]);
      } else {
        console.log("Sorry, this link isn't an image");
      }
    };
  }, []);

  // Handle new files via Upload Picker
  const handleFilesChange = async ({ target }) => {
    const files = Array.from(target.files);

    uploadFiles(files);
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

  // This passes the state containing all NEW image urls from child to parent component via a function prop. Refer to [moodboardId]/index.js -> getURLs function. It takes the urls from the new images and stores it in the newImages state.
  // We map over this data to display the new images underneath. On refresh, this data is gone but by then it will already be in the DB. This skips the step for needing a page refresh.
  useEffect(() => {
    getURLs(urls);
  });

  return (
    <>
      {/* <div {...getRootProps({ className: styles.upload__dropzone })}>
        <input {...getInputProps()} />
      </div> */}
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
