import { useRouter } from "next/router";
// import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import axios from "axios";
import Header from "@/components/Header/Header";
import Modal from "react-modal";
import Link from "next/link";
import Head from "next/head";
// import styles from "@/components/Models/Models.module.scss";
import styles from "@/components/Upload/Upload.module.scss";

export default function Looks() {
  // react-image-crop
  const [image, setImage] = useState(null);
  const imgRef = useRef();
  const previewCanvasRef = useRef();
  const [crop, setCrop] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const [aspect, setAspect] = useState(0);
  const [test, setTest] = useState();
  const [transparentImage, setTransparentImage] = useState();
  const [transparentImageFile, setTransparentImageFile] = useState();
  const [testFile, setTestFile] = useState();

  // react-dropzone
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  // react-dropzone -> these are the files that were dropped or selected.
  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const imageURL = URL.createObjectURL(acceptedFiles[0]);
      setImage(imageURL);
    }
  }, [acceptedFiles]);

  // react-image-crop
  // Sets dimensions of cropped area
  function onImageLoad(event) {
    if (aspect) {
      const { width, height } = event.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }
  // Once the area is selected, run the makeClientCrop using the cropped area as a paramter to get the image data from that selected area.
  function imageCropComplete(crop) {
    makeClientCrop(crop);
  }
  // Handles cropping, returns image url from getCroppedImg
  const makeClientCrop = async (crop) => {
    if ((image, crop.width && crop.height)) {
      const croppedImg = await getCroppedImg(
        imgRef.current,
        crop,
        "newFile.jpeg"
      );
      setCroppedImageUrl(croppedImg);
    }
  };
  // Logic for getting the cropped area as an image url
  const getCroppedImg = (sourceImage, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      sourceImage,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    try {
      return new Promise((resolve) => {
        canvas.toBlob((file) => {
          // resolve(URL.createObjectURL(file));
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
  const handleSubmit = async (event) => {
    // 1 -> convert croppedImageURL to file
    console.log(croppedImageUrl);
    let file = await new File([croppedImageUrl], `image_${Date.now()}.jpeg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    setTest(URL.createObjectURL(file));

    // 2 -> upload file to S3 (croppedImgUrl to file)
    const imageS3 = await uploadS3(file);
    console.log("S3 Image URL:", imageS3);

    // 3 -> use s3 image link inside rembg ?url= via axios POST
    const imageRembg = await axios
      .post(
        "/api/wardrobe",
        {
          file: imageS3,
        },
        { responseType: "arraybuffer" }
      )
      // 4 -> returns an ArrayBuffer containing the image data. convert to a base64 image string.
      .then((response) => {
        console.log(response);
        // convert array buffer to base64 to display image
        let base64ImageString = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        let srcValue = "data:image/png;base64," + base64ImageString;
        setTransparentImage(srcValue);

        // convert array buffer to file
        const fileToS3 = new File([response.data], `image_${Date.now()}.jpeg`, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        setTransparentImageFile(fileToS3);
        console.log("fileToS3:", fileToS3);
        // test file if it actually works lol
        const testFile = URL.createObjectURL(fileToS3);
        setTestFile(testFile);
        console.log("file url:", testFile);
      })
      // 5 -> delete the original image from S3 bucket
      .then(() => {
        const responseAWS = axios.delete("/api/s3", {
          data: { key: new URL(imageS3).pathname },
        });
        console.log("AWS Delete:", responseAWS);
      })
      // convert base64 image => blob => file that can be uploaded to s3 bucket.
      .then(() => {
        // // convert base64 image to blob
        // const blob = fetch(transparentImage).then((res) => res.blob());
        // console.log("blob:", blob);
        // // convert blob to file
        // let file = new File([blob], `image_${Date.now()}.jpeg`, {
        //   type: "image/jpeg",
        //   lastModified: Date.now(),
        // });
        // setTransparentImageFile(file);
        // console.log("file:", file);
        // const testFile = URL.createObjectURL(file);
        // setTestFile(testFile);
        // console.log("file url:", testFile);
      })
      .catch((error) => {
        console.log(error);
      });

    // 6 -> get returned transparent image, store in S3
    // convert base64ImageString to javascript file -> send to s3 to get transparent image url
  };

  return (
    <main>
      <Head>
        <title>Looks Builder</title>
      </Head>
      <Header title={"Looks Builder"} />
      <div>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={imageCropComplete}
        >
          <img src={image} onLoad={onImageLoad} ref={imgRef} />
        </ReactCrop>
      </div>

      {test ? <img src={test} /> : ""}
      {transparentImage ? <img src={transparentImage} /> : ""}
      {testFile ? <img src={testFile} /> : ""}

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

      <button onClick={handleSubmit}>Submit</button>
    </main>
  );
}

// check for current url -> find campaign id
// add item with transparnet image to wardrobe with rest of info (brand, description, size, etc.)
// store to db
