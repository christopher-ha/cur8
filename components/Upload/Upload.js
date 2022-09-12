import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import styles from "@/components/Upload/Upload.module.scss";

export default function UploadImages() {
  const router = useRouter();

  // Add images to Prisma DB via serverless API
  const submitData = async (url, text) => {
    try {
      const response = await axios.post("/api/moodboard", {
        url: url,
        text: text,
        moodboardId: router.query.moodboardId,
      });
      console.log(response);
      // (url to navigate to, url to display, options: no scroll)
      router.replace(router.asPath, router.asPath, { scroll: false });
    } catch (error) {
      console.log(error);
    }
  };

  // Upload to Amazon S3 Function
  const uploadS3 = async (file) => {
    // Generate a presigned URL
    let { data } = await axios.post("/api/s3/", {
      name: file.name,
      type: file.type,
    });
    // This is the presigned URL.
    const url = data.url;

    // Use presignedURL to upload directly to AWS using a PUT request.
    let newData = await axios.put(url, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });
    // Find the final image url by parsing the url inside of responseURL.
    const parseURL = new URL(newData.request.responseURL);
    // Construct the final image url.
    const imageURL = parseURL.origin + parseURL.pathname;
    return imageURL;
  };

  // Takes the files and upload to Amazon S3, submit data to database, and setContent in state.
  const uploadFiles = async (files) => {
    for (const file of files) {
      const imageURL = await uploadS3(file);
      submitData(imageURL);
    }
  };

  // Checks if URL is an image.
  const checkURL = (url) => {
    return /^https?:\/\/.+(jpg|jpeg|png|webp|avif|gif|svg)/.test(url);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle new files/text/urls via Paste on browser window
  if (typeof window === "object") {
    document.onpaste = async function (event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      // Gets text (image urls, text)
      const text = clipboardData.getData("Text");
      console.log("Text:", text);
      // Gets image files
      const files = Array.from(clipboardData.files);
      console.log("Files:", files);

      // image copy
      // files: [obj...]
      // url? false

      // text
      // files: []
      // url: false

      // image url
      // files: []
      // url? true

      // If the files array has an object, the user pasted a file: upload it normally.
      if (files.length > 0) {
        return uploadFiles(files);
      }
      // If the files array is empty and it's not an image url, add to db as "text" and setContent to render on page.
      else if (files.length === 0 && checkURL(text) === false) {
        submitData("", text);
      }
      // If the files array is empty and it's an image url, add to db as "url" and setContent to render on page
      else if (files.length === 0 && checkURL(text) === true) {
        submitData(text);
      }
    };
  }

  // Handle text/urls via the "Paste Text" button
  const pasteText = async (event) => {
    event.preventDefault();
    // Read the clipboard contents
    const clipboardContents = await navigator.clipboard.read().catch((e) => {
      return console.error(e);
    });

    if (clipboardContents) {
      // For each item in the clipboard,
      for (const item of clipboardContents) {
        // If the type of the item is plain text, check if its an image url or regular text.
        if (clipboardContents[0].types.includes("text/plain")) {
          // Grab the text, do something with it:
          navigator.clipboard.readText().then((text) => {
            // If the text is NOT an image url, upload it to DB as "text"
            if (checkURL(text) === false) {
              // else if (files.length === 0 && checkURL(text) === false) {
              submitData("", text);
            }
            // If the text is an image url, upload it to DB as "url"
            else if (checkURL(text) === true) {
              submitData(text);
            }
          });
        }
        // If the type of the item pasted is an image, convert the blob into a file and upload it.
        else if (
          clipboardContents[0].types.includes(
            "image/png" || "image.jpg" || "image/jpeg"
          )
        ) {
          // We put push it to an array because the uploadFiles() function only takes an array of files.
          let files = [];
          const blob = await item.getType(
            "image/png" || "image/jpg" || "image/jpeg"
          );
          console.log(blob);
          // Create a new file from the blob with the date attached to the name to keep it unique.
          const file = new File([blob], `image_${Date.now()}.jpeg`, {
            type: "image/jpeg",
          });
          // Push the file to the array that was declared earlier.
          files.push(file);
          // Run upload function with those files.
          uploadFiles(files);
        }
      }
    } else {
      console.error(
        "It looks like you’re trying to paste an image from your device. Due to security features, this isn't enabled for this button :( Use the upload image button or paste on the window instead!"
      );
      // here conditionally render a component that tells the user to paste using a different method.
    }
  };

  // Handle new files via Upload Picker
  const handleFilesChange = async ({ target }) => {
    const files = Array.from(target.files);
    uploadFiles(files);
  };

  return (
    <>
      <form className={styles.upload__buttons}>
        <button className={styles.upload__paste} onClick={pasteText}>
          Paste
        </button>
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
