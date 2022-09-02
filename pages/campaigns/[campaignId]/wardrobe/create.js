import { useRouter } from "next/router";
// import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop from "react-image-crop";
import axios from "axios";
import Head from "next/head";
import Modal from "react-modal";
import Link from "next/link";
import Header from "@/components/Header/Header";
import CreateWardrobeItem from "@/components/Forms/CreateWardrobeItem/CreateWardrobeItem";
import styles from "@/components/Upload/Upload.module.scss";

export default function WardrobeCreate() {
  // react-image-crop
  const imgRef = useRef();
  const previewCanvasRef = useRef();

  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState();
  const [crop, setCrop] = useState();
  const [croppedImageURL, setCroppedImageURL] = useState(null);
  const [aspect, setAspect] = useState(0);
  const [transparentImage, setTransparentImage] = useState();

  const [transparentImageURLs, setTransparentImageURLs] = useState([]);
  const [rembgIsLoading, setRembgIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // next.js router -> get campaignId from url
  const { asPath, basePath, pathname, query } = useRouter();
  console.log(query.campaignId);

  // react-dropzone
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
    },
  });

  // react-dropzone -> these are the files that were dropped or selected.
  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Convert file to arrayBuffer, then convert that to a blob.
      file.arrayBuffer().then((arrayBuffer) => {
        const blob = new Blob([new Uint8Array(arrayBuffer)], {
          type: file.type,
        });
        console.log(blob);
        // This image blob gets uploaded to S3.
        setImage(blob);
      });

      // We create an object URL to be able to display it on the site as an image src=
      setImageURL(URL.createObjectURL(file));
    }
  }, [acceptedFiles]);

  // This is a solution to the 6s processing time: we run the function after a period of inactivity to process the image while they are filling out the form. This allows us to have a final image url by the time they submit the form === visually we go from a 6s -> 0s delay, as if the image was instantly processed. In technical terms, this is called debouncing the function.
  useEffect(() => {
    // If there is no cropped area, but an image was uploaded and the user hasn't interacted in 7 seconds, run the POST function.
    if (image !== null) {
      const identifier = setTimeout(() => {
        console.log("POST");
        setRembgIsLoading(true);
        handleRembg();
      }, 7000);
      // If the user has uploaded an image AND cropped, but hasn't touched it in 3.5 seconds, run the POST function.
    } else if (image !== null && croppedImageURL !== null) {
      const identifier = setTimeout(() => {
        console.log("POST");
        setRembgIsLoading(true);
        handleRembg();
      }, 3500);
    }

    return () => {
      clearTimeout(identifier);
      setRembgIsLoading(false);
    };
  }, [croppedImageURL, image]);

  // react-image-crop
  // Sets dimensions of cropped area
  const onImageLoad = (event) => {
    if (aspect) {
      const { width, height } = event.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };
  // Once the area is selected, run the makeClientCrop using the cropped area as a paramter to get the image data from that selected area.
  const imageCropComplete = (crop) => {
    makeClientCrop(crop);
  };
  // Handles cropping, returns image url from getCroppedImg
  const makeClientCrop = async (crop) => {
    if ((image, crop.width && crop.height)) {
      const croppedImage = await getCroppedImg(
        imgRef.current,
        crop,
        "newFile.jpeg"
      );
      setCroppedImageURL(croppedImage);
    }
  };
  // Logic for getting the cropped area as an image url
  const getCroppedImg = (image, crop, fileName) => {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const canvas = document.createElement("canvas");

    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    // const canvas = document.createElement("canvas");
    // const scaleX = sourceImage.naturalWidth / sourceImage.width;
    // const scaleY = sourceImage.naturalHeight / sourceImage.height;
    // canvas.width = crop.width;
    // canvas.height = crop.height;
    // const ctx = canvas.getContext("2d");
    // ctx.drawImage(
    //   sourceImage,
    //   crop.x * scaleX,
    //   crop.y * scaleY,
    //   crop.width * scaleX,
    //   crop.height * scaleY,
    //   0,
    //   0,
    //   crop.width,
    //   crop.height
    // );

    try {
      return new Promise((resolve) => {
        canvas.toBlob((file) => {
          resolve(file);
        }, "image/jpeg");
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Upload to S3
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

  // rembg integration
  const handleRembg = async (event) => {
    // 1. Convert croppedImageURL to file
    // Define variable outside of the if / else so we can use it outside of the statement.
    let file;

    // if the user has a croppedImageURL, create a file with croppedImageURL
    if (croppedImageURL) {
      file = await new File([croppedImageURL], `image_${Date.now()}.jpeg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      // if the user only has an image ( no crop ) -> create a file with image state only.
    } else {
      file = await new File([image], `image_${Date.now()}.jpeg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    }

    // 2. Upload file to S3 (croppedImageURL to file)
    const imageS3 = await uploadS3(file);
    console.log("Original S3 Image URL:", imageS3);

    const response = await axios.post(
      "/api/rembg",
      {
        file: imageS3,
      },
      { responseType: "arraybuffer" }
    );
    console.log("Rembg Response:", response);

    // 4. Returns an ArrayBuffer containing the image data. convert to a base64 image string and file.
    // convert array buffer to base64 to display image
    let base64ImageString = Buffer.from(response.data, "binary").toString(
      "base64"
    );
    let srcValue = "data:image/png;base64," + base64ImageString;
    setTransparentImage(srcValue);

    // convert array buffer to file
    const fileToS3 = await new File(
      [response.data],
      `image_${Date.now()}.jpeg`,
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );

    // 5. Upload to S3.
    const imageURL = await uploadS3(fileToS3);
    // Store URL in Array
    setTransparentImageURLs((arr) => [...arr, imageURL]);
    console.log("Final S3 Image URL:", imageURL);

    // 6. Delete the original image from S3 bucket
    const responseAWS = await axios.delete("/api/s3", {
      data: { key: new URL(imageS3).pathname },
    });
    console.log("AWS Delete:", responseAWS);

    // 7. Set loading state to false
    setRembgIsLoading(false);
  };

  const checkSubmit = (event) => {
    setHasSubmitted(true);

    // Set the state back to false after 3 seconds so the user can re-submit.
    const reset = setTimeout(() => {
      setHasSubmitted(false);
    }, 3000);

    return () => {
      clearInterval(reset);
    };
  };

  // if user has submitted and rembginprogress is true, make the button click do nothing. and render a message on screen
  //

  return (
    <main>
      <Head>
        <title>Wardrobe — Add Item</title>
      </Head>
      <Header title={"Wardrobe"} />
      <div className={!image ? styles.hidden : styles.crop}>
        <ReactCrop
          crop={crop}
          onChange={(crop) => setCrop(crop)}
          onComplete={imageCropComplete}
        >
          <img
            className={styles.preview}
            alt="Crop Preview"
            src={imageURL}
            onLoad={onImageLoad}
            ref={imgRef}
          />
        </ReactCrop>
      </div>
      {/* {transparentImage ? <img src={transparentImage} /> : ""} */}
      {/* If rembg is processing, then render a processing indicator. */}
      {/* {rembgIsLoading ? <p>Processing...</p> : ""}
      {rembgIsLoading === false && transparentImage ? <p>Complete!</p> : ""} */}

      {hasSubmitted && rembgIsLoading ? (
        <p>Try again in a few seconds...</p>
      ) : (
        ""
      )}
      {/* //rembgisloading and submitted */}
      {/* If there is no image, render the add image dropzone */}
      {!image ? (
        <div {...getRootProps({ className: "dropzone" })}>
          <input type="file" name="file" {...getInputProps()} />
          <div className={styles.dropzone}>
            <h4>+ ADD IMAGE</h4>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* form component here */}
      <CreateWardrobeItem
        transparentImageURLs={transparentImageURLs}
        campaignId={query.campaignId}
        rembgIsLoading={rembgIsLoading}
        checkSubmit={checkSubmit}
      />
    </main>
  );
}

// export async function getServerSideProps(context) {
//   const { params, req, res } = context;
//   const { campaignId } = params;

//   return {
//     props: {
//       campaignId: JSON.parse(JSON.stringify(campaignId)),
//     },
//   };
// }
