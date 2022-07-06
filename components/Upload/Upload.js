import { useState, useEffect, useCallback, useRef } from "react";
import { useS3Upload } from "next-s3-upload";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import styles from "@/components/Upload/Upload.module.scss";

export default function UploadImages({ getContent }) {
  const [content, setContent] = useState([]);
  const { uploadToS3 } = useS3Upload();
  const router = useRouter();
  // console.log(urls);

  // refactor: Take the files and upload to Amazon S3, submit data to database, and setUrls in state.
  const uploadFiles = async (files) => {
    for (const file of files) {
      const { url } = await uploadToS3(file);
      submitData(url);
      setContent((current) => [...current, url]);
    }
  };

  // Handle drag & drop on browser window (instead of a div)
  // Replacement for react-dropzone and allows users to click on items that would otherwise be blocked by the react-dropzone.
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

  // Handle new files/urls via Paste on browser window
  useEffect(() => {
    document.onpaste = async function (event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      const itemPasted = clipboardData.getData("Text");
      console.log(itemPasted);
      const files = Array.from(clipboardData.files);
      console.log(files);

      // Checks if URL is an image.
      function checkURL(url) {
        return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
      }

      // console.log(checkURL(itemPasted));

      // If the user pastes a file, upload it normally.
      if (files) {
        uploadFiles(files);
      }

      // If the user pastes an image url, check if it is an image then add it to the database and set state.
      if (checkURL(itemPasted) === true) {
        submitData(itemPasted);
        setContent((current) => [...current, itemPasted]);
        // Else, it must be a block of text. Add it to database as "text" and set state.
      } else {
        setContent((current) => [...current, itemPasted]);
        submitData("", itemPasted);
      }

      // console.log("Sorry, this link isn't an image");
    };
  }, []);

  // Handle new files via Upload Picker
  const handleFilesChange = async ({ target }) => {
    const files = Array.from(target.files);

    uploadFiles(files);
  };

  // Add images to Prisma DB via serverless API
  const submitData = async (url, text) => {
    let config = {
      method: "POST",
      url: `/api/moodboards/`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        url: url,
        text: text,
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
    getContent(content);
  });

  return (
    <>
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
