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

  // react-dropzone
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  // react-dropzone -> these are the files that were dropped or selected.
  useEffect(() => {
    console.log("Default:", acceptedFiles);
    if (acceptedFiles && acceptedFiles.length > 0) {
      const imageURL = URL.createObjectURL(acceptedFiles[0]);
      setImage(imageURL);
      console.log(imageURL);
    }
  }, [acceptedFiles]);

  // react-image-crop:
  // File reader
  // const onSelectFile = (event) => {
  //   console.log(event.target.files);
  //   if (event.target.files && event.target.files.length > 0) {
  //     const reader = new FileReader();
  //     reader.addEventListener("load", () => setImage(reader.result));
  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  // };

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
          resolve(URL.createObjectURL(file));
        }, "image/jpeg");
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleSubmit = () => {
    // convert blob to File
    // upload
  };

  return (
    <main>
      <Head>
        <title>Looks Builder</title>
      </Head>
      <Header title={"Looks Builder"} />
      <div>
        {/* <input type="file" accept="image/*" onChange={onSelectFile} /> */}
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={imageCropComplete}
        >
          <img src={image} onLoad={onImageLoad} ref={imgRef} />
        </ReactCrop>
      </div>
      {/* <img src={croppedImageUrl} /> */}
      {/* <p>Files: {files}</p> */}

      {!image ? (
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className={styles.dropzone}>
            <h4>+ ADD IMAGE</h4>
          </div>
        </div>
      ) : (
        ""
      )}
    </main>
  );
}

// export async function getServerSideProps(context) {
//   const { params, req, res } = context;

//   // Get the campaignId from url params
//   const campaignId = params.campaignId;

//   // Find all the models that match the campaignId
//   const models = await prisma.models.findMany({
//     where: {
//       campaignId: campaignId,
//     },
//   });

//   // Find all the items that match the campaignId
//   const wardrobe = await prisma.wardrobe.findMany({
//     where: {
//       campaignId: campaignId,
//     },
//   });

//   // get all Saved Looks (img img img img img), input this later.

//   return {
//     props: {
//       models: JSON.parse(JSON.stringify(models)),
//       wardrobe: JSON.parse(JSON.stringify(wardrobe)),
//     },
//   };
// }
