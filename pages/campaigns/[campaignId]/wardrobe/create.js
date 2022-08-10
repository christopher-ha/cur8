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
  const handleSubmit = (event) => {
    // 1 -> convert croppedImageURL to file
    console.log(croppedImageUrl);
    let testing = new File([croppedImageUrl], `image_${Date.now()}.jpeg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    setTest(URL.createObjectURL(testing));

    // 2 -> upload file to S3 (croppedImgUrl to file)
    // const imageS3 = await uploadS3(file);
    // console.log(imageS3);

    // 3 -> use AWS link in query params -> axios post
    // const imageRembg = await axios
    //   .post("/api/wardrobe", {
    //     file: croppedImageUrl,
    //   })
    //   // .get(`http://13.58.192.71:5000/?url=${croppedImageUrl}`)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // console.log(imageRembg);
    // 4 -> delete image from AWS after promise is resolved
    // 5 -> get returned transparent image, store in S3
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
      {/* <img src={croppedImageFileConverted} /> */}

      {test ? <img src={test} /> : ""}

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
