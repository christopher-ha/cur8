import { useState, useEffect } from "react";
import { useS3Upload } from "next-s3-upload";
import { useRouter } from "next/router";
import axios from "axios";

export default function UploadImages({ getURLs }) {
  const [urls, setUrls] = useState([]);
  const { uploadToS3 } = useS3Upload();
  const router = useRouter();
  // console.log(router.query);

  useEffect(() => {
    document.onpaste = async function (event) {
      // use event.originalEvent.clipboard for newer chrome versions
      var items = (event.clipboardData || event.originalEvent.clipboardData)
        .items;
      // find pasted image among pasted items
      var blob = null;

      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === 0) {
          blob = items[i].getAsFile();
          console.log(blob);
          const { url } = await uploadToS3(blob);
          // console.log(url);
          submitData(url);
          setUrls((current) => [...current, url]);
        }
      }
      // // load image if there is a pasted image
      // if (blob !== null) {
      //   var reader = new FileReader();
      //   reader.onload = function (event) {
      //     console.log(event.target.result); // data url!
      //     // var file = new File([blob], "filename");
      //     // document.getElementById("pastedImage").src = event.target.result;
      //   };
      //   reader.readAsDataURL(blob);
      // }
    };
  }, []);

  const handleFilesChange = async ({ target }) => {
    const files = Array.from(target.files);
    // console.log(files);
    // console.log(target);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
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
    <div>
      <input
        type="file"
        name="file"
        multiple={true}
        onChange={handleFilesChange}
        id="document_attachment_doc"
      />
      <img id="pastedImage" />
    </div>
  );
}
