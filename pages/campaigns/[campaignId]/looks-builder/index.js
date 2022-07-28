import { useRouter } from "next/router";
// import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import { useState, useCallback, useRef } from "react";
import Header from "@/components/Header/Header";
import Modal from "react-modal";
import Link from "next/link";
import Head from "next/head";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
// import styles from "@/components/Models/Models.module.scss";

export default function Looks() {
  const [image, setImage] = useState(null);
  const imgRef = useRef();
  const previewCanvasRef = useRef();
  const [crop, setCrop] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const [aspect, setAspect] = useState(0);

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImage(reader.result));
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  function onImageLoad(event) {
    if (aspect) {
      const { width, height } = event.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function imageCropComplete(crop) {
    makeClientCrop(crop);
  }

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
  console.log(croppedImageUrl);

  const handleSubmit = () => {
    // convert blob to File
    // upload
  };

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

  return (
    <main>
      <Head>
        <title>Looks Builder</title>
      </Head>
      <Header title={"Looks Builder"} />
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={imageCropComplete}
        >
          <img src={image} onLoad={onImageLoad} ref={imgRef} />
        </ReactCrop>
      </div>
      <img src={croppedImageUrl} />
      {/* <div>
        {Boolean(crop) && (
          <canvas
            ref={previewCanvasRef}
            style={{
              border: "1px solid black",
              objectFit: "contain",
              width: crop.width,
              height: crop.height,
            }}
          />
        )}
      </div> */}
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
