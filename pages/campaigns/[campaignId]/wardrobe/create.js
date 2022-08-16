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
import CreateWardrobeItem from "@/components/Forms/CreateWardrobeItem/CreateWardrobeItem";

export default function Looks() {
  // react-image-crop
  const [image, setImage] = useState(null);
  const imgRef = useRef();
  const previewCanvasRef = useRef();
  const [crop, setCrop] = useState();
  const [croppedImageURL, setCroppedImageURL] = useState(null);
  const [aspect, setAspect] = useState(0);
  // const [test, setTest] = useState();
  const [transparentImage, setTransparentImage] = useState();
  // const [transparentImageFile, setTransparentImageFile] = useState();
  // const [testFile, setTestFile] = useState();
  const [transparentImageURLs, setTransparentImageURLs] = useState([]);
  const [rembgIsLoading, setRembgIsLoading] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  // react-dropzone
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  // react-dropzone -> these are the files that were dropped or selected.
  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const imageURL = URL.createObjectURL(acceptedFiles[0]);
      setImage(imageURL);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    // Prevents useEffect from triggering on load -> if there is no cropped area, don't run the post function.
    if (image !== null) {
      const identifier = setTimeout(() => {
        console.log("POST");
        setRembgIsLoading(true);
        handleRembg();
      }, 4000);
    } else if ((image !== null) & (croppedImageURL !== null)) {
      const identifier = setTimeout(() => {
        console.log("POST");
        setRembgIsLoading(true);
        handleRembg();
      }, 4000);
    }

    return () => {
      clearTimeout(identifier);
      setRembgIsLoading(false);
    };
  }, [croppedImageURL, image]);

  useEffect(() => {}, []);

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
      const croppedImage = await getCroppedImg(
        imgRef.current,
        crop,
        "newFile.jpeg"
      );
      setCroppedImageURL(croppedImage);
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
    console.log(croppedImageURL);

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

    // setTest(URL.createObjectURL(file));

    // 2. Upload file to S3 (croppedImageURL to file)
    const imageS3 = await uploadS3(file);
    console.log("Original S3 Image URL:", imageS3);

    // 3. Use s3 image link inside rembg ?url= via axios POST
    const imageRembg = await axios
      .post(
        "/api/wardrobe",
        {
          file: imageS3,
        },
        { responseType: "arraybuffer" }
      )
      // 4. Returns an ArrayBuffer containing the image data. convert to a base64 image string and file.
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

        // 5. Upload to S3.
        const imageURL = uploadS3(fileToS3);
        // Store URL in Array
        setTransparentImageURLs((arr) => [...arr, imageURL]);
        return console.log("Final S3 Image URL:", imageURL);
      })
      // 6. Delete the original image from S3 bucket
      .then(() => {
        const responseAWS = axios.delete("/api/s3", {
          data: { key: new URL(imageS3).pathname },
        });
        return console.log("AWS Delete:", responseAWS);
      })
      .then(() => {
        return setRembgIsLoading(false);
      })
      .catch((error) => {
        return console.log(error);
      });
  };

  const handleSubmit = () => {
    if (!image) {
      console.log("Please add an image :)");
    } else if (rembgIsLoading) {
      console.log("Please wait until the image is done processing :)");
    } else {
      console.log("Redirect");
      // delete all old AWS images except last
      // submitData -> latest AWS link + form data
      // redirect to Wardrobe page.
    }
  };

  // if (rembgInProgress) {
  // render "Processing..." under image
  // } else {
  // render "Complete!" under image
  // handleSubmit()
  // }

  // If the user tries to submit and rembg is still in progress, give them an error.
  // if (rembgInProgress && didSubmit) {
  // render error if user tries to submit -> Please wait until image is done processing
  // }
  // If the user tries to submit and rembg is completed, let them run submit f(x).
  //else if (!rembgInProgress && didSubmit) {
  // handleSubmit()
  // }

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

      {transparentImage ? <img src={transparentImage} /> : ""}
      {transparentImage ? <p>Complete!</p> : ""}

      {/* If rembg is processing, then render a processing indicator. */}
      {rembgIsLoading ? <p>Processing...</p> : ""}

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
      <CreateWardrobeItem />

      <button onClick={handleSubmit}>Submit</button>
    </main>
  );
}

// check for current url -> find campaign id
// add item with transparnet image to wardrobe with rest of info (brand, description, size, etc.)
// store to db
